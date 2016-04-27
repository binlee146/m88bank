var mobileReg = /^(13|14|15|18|17)[0-9]{9}$/;
var isNullReg = /^[\s]{0,}$/;
var codeReg = /^[A-Za-z0-9]{3,10}$/;
var verifyCodeReg = /^[A-Za-z0-9]{4}$/;
var authName = false,authPassword = false,bindBank = false;
$(function(){
	resetHeight();//页面高度调整
	initEvent();
	checkSecurity(); //安全检查
});
//初始化事件1.0
function initEvent(){
	$('#nav_user').addClass('on');
	$('#user_fund').addClass('on');
	$('#usermenu dd').show();
	$(".mu-bank").click(function(){
		$(".mu-bank").removeClass("on");
		$(this).addClass("on");
	    $("#bankId").val($(this).attr("bankId"));
	});
	$("#getVerifyCode").removeClass("disabled").attr("disabled", false);
	authName = $.trim($("#authName").val());
	authPassword = $.trim($("#authPassword").val());
}
//1.2 安全检查
function checkSecurity(){
	if (authName == "false") {
		layer.open({
			shadeClose: false,
			shade: 0.8,
		    content: '您还没有实名认证,是否去进行认证？',
		    btn: ['去认证', '算了'],
		    yes: function(index){
		        window.location=basePath+"/accountmgr/authenticate";
		    },
		    no: function(index){
				window.location=basePath+"/account/overview";
		    }
		    
		});
	}else if(authPassword == "false"){
		layer.open({
			shadeClose: false,
			shade: 0.8,
		    content: '您还没有设置交易密码,是否去进行设置？',
		    btn: ['去设置', '算了'],
		    yes: function(index){
		        window.location=basePath+"/accountmgr/trapwd/set";
		    },
		    no: function(index){
				window.location=basePath+"/account/overview";
		    }
		    
		});
	}
}
//1.3 确认表单
$('#bt_submit').click(function () {
	var bankNo = $("#bankNo").val();
	if (chkRegform()) {
		conformRecharge();
	}
});
//1.4 确定充值
function conformRecharge() {
	closeLayer();
	$("#bt_submit").addClass("disabled").attr("disabled", true);//禁用按钮
	Jload();
	$("#bank,#bankNo,#userMobile").removeClass("disabled").attr("disabled", false);
	setTimeout(function () {
		$.ajax({
			cache: true,
			type: "POST",
			async: false,//避免被浏览器拦截
			url: basePath+'/secure/recharge-bind-card',
			data: $('#form1').serialize(),
			success: function (data) {
				var result = eval("(" + data + ")");
				layer.close(loadIndex);
				$("#bt_submit").removeClass("disabled").attr("disabled", false);
				if (result.success != undefined && result.success) {
					Jalert('恭喜您，银行卡认证成功',function(index){
						if(bindBank){
							window.location.href = basePath + "/secure/bank-card/list";
						}else{
							closeLayer('yes');
						}
					});
				} else {
					Jalert(result.msg);
					$("#bank,#bankNo,#userMobile").addClass("disabled").attr("disabled", true);
					$("#bt_submit").removeClass("disabled").attr("disabled", false);//解禁按钮
				}
			}
		});
	}, 10);
}

//1.5 检测表单
function chkRegform(){
	return (checkBank() && checkcardNo() && checkMobile() && checkVerifyCode());
}
//1.6 发送短信验证 
$('#getVerifyCode').on('click',function(){
	if (checkBank() && checkcardNo() && checkMobile()) {
		cardNoKeyup();
		$("#bankNo").blur();
		$("#txtConfirmBankName").html($("#bank").val());
		$("#txtConfirmBankNo").html($("#bankNo").val());
		$("#txtConfirmBankLimit").html($("li[name='choosebank'][cnname='"+$("#bank").val()+"']").attr("limit"));
		openlayer("#confirmBankinfo");
	}
});
function confirmSubmitBankInfo(){
	var bankcode = $.trim($("#bankcode").val());
	var bankNo = $.trim($("#bankNo").val());
	var userMobile = $.trim($("#userMobile").val());
	var bankId = $.trim($("#bankId").val());
	closelayer();
	getVerifyCode(bankcode, bankNo, userMobile,bankId);
}
function getVerifyCode(bankcode, bankNo, userMobile,bankId){
	var _tips = $("#error1");
	// 按钮不可用
	$("#getVerifyCode,#bank,#bankNo,#userMobile").addClass("disabled").attr("disabled", true);
	$.ajax({
		type : "post",
		dataType : "json",
		url : basePath + "/secure/recharge-verify-card",
		data : {
					bankcode : bankcode,
					bankNo : bankNo,
					userMobile : userMobile,
					bankId : bankId
				},
		success : function(data) {
			var result = eval("(" + data + ")");
			if(result.success != undefined && result.success){
				disableButtonByClock(60);
				_tips.html('<span class="warningtip">验证码已发送至' + userMobile + '，请查收。</span>');
			}else{
				if(result.jsonData != undefined&&result.jsonData == "clock"){
					disableButtonByClock(60);
					$("#bank,#bankNo,#userMobile").removeClass("disabled").attr("disabled", false);
				}
				
				if (result.msg.indexOf("未开通银联在线支付") >= 0) {
					_tips.html('<span class="errortip">'+ result.msg + '</span>');
				}else{
					$("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
					$("#bank,#bankNo,#userMobile").removeClass("disabled").attr("disabled", false);
					_tips.html('<span class="errortip">'+ result.msg + '</span>');
					if(result.msg.indexOf("频繁") >= 0){
						disableButtonByClock(parseInt(60));
					}
				}
			}
		}
	});
}
// 禁用发送手机验证码按钮
function disableButtonByClock(seconds) {
    $("#getVerifyCode").addClass("disabled").attr("disabled", true).html(seconds + "s重发");
    $("#bank,#bankNo,#userMobile").addClass("disabled").attr("disabled", true);
    var time = parseInt(seconds);                   //将传入的参数转为整型数字
    if (time === 0) {
        $("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("重新获取");
        $("#bank,#bankNo,#userMobile").removeClass("disabled").attr("disabled", false);
    } else {
        setTimeout("disableButtonByClock(" + (time - 1) + ")", 1000);  //1秒以后 再次调用本身这个方法
    }
}

function mobileKeyup() {
    var _input = $("input[name='userMobile']");
    var _val = _input.val();
    _val = _val.replace(/[^\d]/g, '');
    _input.val(_val);
    if(_val.length==11){
    	checkMobile();
    }
}


//3.1 打开银行卡列表
function openBanklist() {
	$("#banks").show();
	var wht = $(window).height() * 0.9;
	var vht = $("#banklist").height();
	var _mt = vht > wht ? wht / 2 : vht / 2;
	$("#bankbox").attr("style", "margin-top:-" + _mt + "px");
	$("#banklist").attr("style", "max-height:" + wht + "px;");
	$("body").css("overflow", "hidden");
}

//3.2 确认银行卡
var _this_bank = null;
function confirmBank(_this) {
	_this_bank = _this;
	var _bank = $(_this_bank);
	var limitWarn = _bank.attr("limitWarn");
	var cnName = _bank.attr("cnName");
	var limit = _bank.attr("limit");
	//if (limitWarn == "1") {
		//$("#txtWarnBankName").text(cnName);
		//$("#txtWarnLimit").text(limit);
		//return limitTip(cnName);
	//}
	this.confirmFun = function() {
		$("#bankcode").val(_bank.val());
		$('#bank').val(cnName).blur();
		closeLayer();
	};
	confirmFun();
};

//提示换卡后，不换卡
function confirmBank2(){
	var _bank = $(_this_bank);
	var cnName = _bank.attr("cnName");
	$("#bankcode").val(_bank.val());
	$('#bank').val(cnName).blur();
	closeLayer();
}

//3.5 银行限额提示
function limitTip(_title){
	$("#limitTitle").html(_title + "限额提示");
		layer.open({
		type: 1,
		content: $("#limitTip").html(),
		style:'width:60%;'
	});
}
//3.6 升级提示
function upgradeTip(){
	var _title='认证支付充值升级提示';
	layer.open({
	    type: 1,
	    title: _title,
	    shadeClose: false,
	    shade: 0.8,
	    area: ['520px', 'auto'],
	    content: $("#upgradeTip")
	});
}
/**
 * 银行卡验证相关操作
 */
function cardNoKeyup(){
	var _input=$("input[name='bankNo']");
	var _info=$("#bankNoinfo");
	var _info2=$("#bankNoinfo2");
	var _val=_input.val();
	_val=_val.replace(/[^\d]/g,'');
	_input.val(_val);
	var newval=_val.replace(/\D/g, '').replace(/....(?!$)/g, '$& '); 
	_info2.html(newval).hide();
	if(_val.length>0){
		_info.html(newval+"<em></em>").show();
	}else{
		_info.html("").hide();
	}
	_input.on("focusout",function(){
		_info.hide();
	}).on("focusin",function(){
		if(_val.length>0){
			_info.show();
			_info2.hide();
		}
	});
}
// 验证银行卡号
function checkcardNo(){
	var _input=$("input[name=bankNo]");
	var _val=_input.val();
	var _tips=$("#error1");
	_tips.html("");
	_val.length>0?$("#bankNoinfo2").show():$("#bankNoinfo2").hide();
	if(_val==""){
		_tips.html('<span class="errortip">银行卡卡号不能为空</span>');
		return false;
	}
	if(_val.length < 12) {
		_tips.html('<span class="errortip">银行卡卡号必须大于等于12位</span>');
		return false;
	}
	var num = /^\d*$/;  //全数字
	if (!num.exec(_val)) {
		_tips.html('<span class="errortip">银行卡号必须全为数字</span>');
		return false;
	}
	var flag = true;
	$.ajax({
		url: basePath+'/secure/bank-card/verify-card',
		data: {bankId:$("#bankcode").val(),card:$("#bankNo").val()},
		dataType:'JSON',
		type: "POST",
		cache: false,
		async: false,//避免被浏览器拦截
		success: function (data) {
			var json = eval(data);
			if(json.isShow){
				_tips.html('<span class="errortip">'+ json.msg+'</span>');
				flag = false;
			}
		}
	});
	return flag;
}

// 验证选择银行
function checkBank(){
	var _input=$("input[name=bankName]");
	var _val=_input.val();
	var _tips=$("#error1");
	_tips.html("");
	if (_val == "") {
		_tips.html('<span class="errortip">请选择银行</span>');
		return false;
	}
	//_tips.html('<span class="successicon">&nbsp;</span>');//成功标识
	return true;
}
// 短信验证码
function checkVerifyCode() {
    var _input = $("#verifyCode");
    var _val = _input.val();
    var _tips = $("#error1");
    var verifyCodeReg = /^[0-9]{6}$/;
    _tips.html('');
    if (_val == "") {
    	_input.addClass("Validform_error");
        _tips.html('<span class="errortip">短信验证码不能为空</span>');
        return false;
    } else if (!verifyCodeReg.test(_val)) {
    	_input.addClass("Validform_error");
        _tips.html('<span class="errortip">您输入6位有效验证码</span>');
        return false;
    }
    //_tips.html('<span class="successicon"></span>');
    return true;
}

// 验证手机的有效性
function checkMobile() {
    var th = $("input[name='userMobile']");
    var p = $("#error1");
    var v = $.trim(th.val());
    p.html('');
    if (v.length == 11) {
        if (!mobileReg.test(v)) {
        	th.addClass("Validform_error");
            p.html('<span class="errortip">请填写正确的手机号</span>');
            return false;
        }
       return true;
    } else {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">请填写正确的手机号</span>');
        return false;
    }
}

//2.5 关闭所有弹窗
function closeLayer(reload){
    $("body").css("overflow","auto");
    $("#banks,#limitTip").hide();
    layer.closeAll();
	if (reload == 'yes') {
		window.location.reload();
	}
}
//更换银行卡
function changeBank(){
	layer.closeAll();
	openBanklist();
}
//预留手机提示
function moblieTip(){
  layer.open({
    type: 1,
    content: $("#moblieTip").html(),
    style:'width:60%;border-radius:0.4rem;'
  });
}