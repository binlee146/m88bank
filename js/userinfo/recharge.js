var mobileReg = /^(13|14|15|18|17)[0-9]{9}$/;
var isNullReg = /^[\s]{0,}$/;
var codeReg = /^[A-Za-z0-9]{3,10}$/;
var verifyCodeReg = /^[A-Za-z0-9]{4}$/;
var authName = false,authPassword = false;
var verfycodAmt = 0,minRechargeAmt = 0;
$(function(){
	resetHeight();//页面高度调整
	initEvent();
	checkSecurity(); //安全检查
});
//初始化事件1.0
function initEvent(){
	$('#nav_user').addClass('on');
	$(".mu-bank2.bankflag").click(function(){
		var _this = $(this);
		$(".mu-bank2").removeClass("on");
		_this.addClass("on");
		$("#bankname").html(_this.attr("name"));
		$("#bankinfo").html(_this.attr("limit"));
		$("#bankId").val(_this.attr("bankId"));
		$("#payChannel").val(_this.attr("payChannel"));
	});
	$(".mu-bank2").eq(0).click();
	authName = $.trim($("#authName").val());
	authPassword = $.trim($("#authPassword").val());
	verfycodAmt = $.trim($("#verfycodAmt").val());
	minRechargeAmt = $.trim($("#minRechargeAmt").val());
}

//1.6 发送短信验证 
$('#getVerifyCode').on('click',function(){
	var _tips = $("#error1");
	//加载层
	if (!checkamount()) {
		return;
	}
	// 按钮不可用
	$("#getVerifyCode").addClass("disabled").attr("disabled", true);

	$.ajax({
		url : basePath + '/secure/recharge-bill-code',
		type : 'POST',
		data : {"bankId":$("#bankId").val(),"amount":$("#amount").val() },
		async : false,
		cache : false,
		success : function(data) {

			data = eval("("+data+")");
			if(data.successed!=undefined && data.successed){
        		//倒计时
				disableButtonByClock(60);
				_tips.html('<span class="warningtip">验证码已发送至'+data.message+'，请查收。</span>');
			}else{
				$("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
				_tips.html('<span class="errortip">'+ result.msg + '</span>');
				return;
			}
		}
	});

});

// 禁用发送手机验证码按钮
function disableButtonByClock(seconds) {
    $("#getVerifyCode,#userMobile").addClass("disabled").attr("disabled", true).html(seconds + "s重发");
    var time = parseInt(seconds);                   //将传入的参数转为整型数字
    if (time === 0) {
        $("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
    } else {
        setTimeout("disableButtonByClock(" + (time - 1) + ")", 1000);  //1秒以后 再次调用本身这个方法
    }
}

$('#amount').keypress(function(event){
		var key=String.fromCharCode(event.keyCode||event.charCode);
		if(/[\d.]/.test(key)){
			return true;
		}else{
			return false;
		}
	});

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




// 关闭弹窗
function closelayer(reload){
	layer.closeAll();
	if (reload == 'yes') {
		window.location.reload();
	}
}





function onRecharge(){
	var bankId = $.trim($("#bankId").val());
	if (bankId == "" || bankId.length < 1 || typeof(bankId) == "undefined") {
		Jalert("请选择银行卡");
		return ;
	}
	var amountAmt = $("#amount").val();
	//加载层
	if (checkamount() && checkPassword() && checkVerifyCode()) {
		Jconfirm('确定充值'+amountAmt+'元吗?',function(index){
			//按钮不可用
			$("#bt_submit").addClass("disabled").attr("disabled", true);
			//加载层
			Jload();
			setTimeout(function(){
				$.ajax({
					url : basePath + '/secure/recharge-confirm',
					type : 'POST',
					data : $('#form1').serialize(),
					async : false,
					cache : false,
					success : function(data) {
						layer.closeAll();
						data = eval("("+data+")");
						if(data.successed!=undefined && data.successed){
			        		if(data.form){//认证支付返回的form表单
			    				var html = "";
			    				$("#submit_form").attr("action",data.postUrl);
			    				$.each(data.postMap,function(name,value) {
		    						html=html+'<input type="hidden" name=\''+name+'\' value=\''+value+'\' />';
			    				});
			    				$("#submit_form").html(html);
			    				layer.open({
			    					content:'<div>请您在新打开的网上银行页面进行支付，支付完成前请不要关闭窗口</div>',
			    					btn:['充值成功','遇到问题'],
			    					yes: function(){
		    					        window.location.href=basePath+"/secure/trade";
		    					    }, no: function(){
		    					    	window.location.href=basePath+"/faq/recharge";
		    					    }
			    				});
			    				$("#submit_form").submit();
			        		}else{//快捷支付返回的结果
			        			var callbackUrl = data.callbackUrl;
			        			if(callbackUrl!=null &&callbackUrl !='' &&callbackUrl!=undefined){
			        				window.location = basePath + callbackUrl;
			        			}else{
			        				$("#successje").html($("#amount").val());
			        				successTip();
			        			}
							}
						}else{
							$("#bt_submit").removeClass("disabled").attr("disabled", false);
							if(data.message.indexOf('密码错误')>=0){
								var _tips=$("#error1");
								_tips.html('<span class="errortip">'+data.message+'</span>');
							}else{
								Jalert(data.message);
							}
						}
					}
				});
			}, 10);
		 });
	}
}

//投资成功提示
function successTip(){
	var _html=$("#successTip").html();
	var pageii = layer.open({
	    type: 1,
	    content:_html,
	    style: 'position:fixed; left:0; top:0; width:100%; height:100%;border:none;'
	});
}

//取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
 }


// 验证充值金额
function checkamount() {
	var amountAmt = $.trim($("#amount").val());
	var bankId = $.trim($("#bankId").val());
	var _tips = $("#error1");
	if (bankId == "" || bankId.length < 1 || typeof(bankId) == "undefined") {
		_tips.html('<span class="errortip">请选择充值银行</span>');
		return false;
	}
	if (amountAmt == "" || amountAmt.length < 1 || typeof(amountAmt) == "undefined") {
		_tips.html('<span class="errortip">请输入充值金额</span>');
		return false;
	}
	if (parseInt(amountAmt) != amountAmt) {
		_tips.html('<span class="errortip">充值金额必须是整数</span>');
		return false;
	}
	if (Number(amountAmt) < minRechargeAmt) {
		_tips.html('<span class="errortip">充值金额不能低于'+minRechargeAmt+'元</span>');
		return false;
	}
	if(Number(amountAmt) >= Number(verfycodAmt)){
		$("#verifyCodediv").show();
	}else{
		$("#verifyCodediv").hide();
	}
	_tips.html('');
	return true;
}
// 验证交易密码
function checkPassword(){
	var bankId = $.trim($("#bankId").val());
	var rechargePsd = $.trim($("#rechargePsd").val());
	var _tips=$("#error1");
	if (bankId == "" || bankId.length < 1 || typeof(bankId) == "undefined") {
		_tips.html('<span class="errortip">请选择充值银行</span>');
		return false;
	}
	if (rechargePsd == "" || rechargePsd.length < 1 || typeof(rechargePsd) == "undefined") {
		_tips.html('<span class="errortip">请输入平台交易密码</span>');
		return false;
	}
	_tips.html('');
	return true;
}

// 短信验证码
function checkVerifyCode() {
	var _input = $("#verifyCode");
	var _val = _input.val();
	var _tips = $("#error1");
	var amountAmt = $("#amount").val();
	if (_val == "" && (Number(amountAmt) >= Number(verfycodAmt))) {
		_tips.html('<span class="errortip">验证码不能为空</span>');
		return false;
	}
	return true;
}