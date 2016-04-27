var mobileReg = /^(13|14|15|18|17)[0-9]{9}$/;
var isNullReg = /^[\s]{0,}$/;
var codeReg = /^[A-Za-z0-9]{3,10}$/;
var verifyCodeReg = /^[A-Za-z0-9]{4}$/;
var authName = false,authPassword = false;
$(function(){
	resetHeight();//页面高度调整
	initEvent();
	checkSecurity();
});

function initEvent(){
	$('#nav_user').addClass('on');
	$('#user_fund').addClass('on');
	$('#usermenu dd').show();
	$("#getVerifyCode").removeClass("disabled").attr("disabled", false);
	authName = $.trim($("#authName").val());
	authPassword = $.trim($("#authPassword").val());
}
// 安全检查
function checkSecurity(){
	if (authName == "false") {
		layer.open({
		    type: 2,
		    title: '实名认证',
		    shadeClose: false,
		    shade: 0.8,
		    area: ['800px', '520px'],
		    content: basePath+'/secure/check-name',
		    cancel: function(index){
				window.location=basePath+"/account/overview";
		    }
		});
	}else if(authPassword == "false"){
		layer.open({
		    type: 2,
		    title: '设置交易密码',
		    shadeClose: false,
		    shade: 0.8,
		    area: ['800px', '520px'],
		    content: basePath+'/secure/tra-pwd',
		    cancel: function(index){
				window.location=basePath+"/account/overview";
		    }
		});
	}
}

//1.6 发送短信验证 
$('#getVerifyCode').on('click',function(){
	if (checkMobile()) {
		var userMobile = $.trim($("#userMobile").val());
		var bankId = $.trim($("#bankId").val());
		getVerifyCode(userMobile,bankId);
	}
});

function conformRecharge() {
	if (checkMobile() && checkVerifyCode()) {
		$("#bt_submit").addClass("disabled").attr("disabled", true);//禁用按钮
		Jload();
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
						Jalert(result.msg,function(index){
							closelayer('yes');
						});
					} else {
						Jalert(result.msg);
						$("#bt_submit").removeClass("disabled").attr("disabled", false);//解禁按钮
					}
				}
			});
		}, 10);
	}
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
function mobileKeyup() {
    var _input = $("input[name='userMobile']");
    var _val = _input.val();
    _val = _val.replace(/[^\d]/g, '');
    _input.val(_val);
    if(_val.length==11){
    	checkMobile();
    }
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
    _tips.html('<span class="successicon"></span>');
    return true;
}

function getVerifyCode(userMobile,bankId){
	var _tips = $("#error1");
	// 按钮不可用
	$("#getVerifyCode").addClass("disabled").attr("disabled", true);
	$("#userMobile").addClass("disabled").attr("readonly", true);
	
	$.ajax({
		type : "post",
		dataType : "json",
		url : basePath + "/secure/recharge-verify-card",
		data : {
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
				$("#getVerifyCode,#userMobile").removeClass("disabled").attr("disabled", false).html("获取验证码");
				_tips.html('<span class="errortip">'+ result.msg + '</span>');
			}
		}
	});
}
// 禁用发送手机验证码按钮
function disableButtonByClock(seconds) {
    $("#getVerifyCode").addClass("disabled").attr("disabled", true).html(seconds + "s重发");
    $("#userMobile").addClass("disabled").attr("readonly", true).html(seconds + "s重发");
    var time = parseInt(seconds);                   //将传入的参数转为整型数字
    if (time === 0) {
        $("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
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

function closelayer(reload){
	layer.closeAll();
	if(reload=='yes'){
		window.location.reload();
	}
}