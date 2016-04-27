var chkMobile = false;
var chkPassword = false;
var chkRandCode = false;
var chkRegCode = true;
var mobileReg = /^(13|14|15|18|17)[0-9]{9}$/;
var isNullReg = /^[\s]{0,}$/;
var codeReg = /^[A-Za-z0-9]{3,10}$/;
var verifyCodeReg = /^[A-Za-z0-9]{5}$/;
$(function () {
	$("#getVerifyCode").removeClass("disabled").attr("disabled", false);
    var v = $.trim($("input[name='mobile']").val());
    if (!isNullReg.test(v)) {
        checkMobile();
    }
});
////美化单复选框
//$('input.icheck_flat').iCheck({
//    checkboxClass: 'u-checkbox-orange',
//    radioClass: 'u-iradio-orange'
//});
//3. 点击眼睛改变密码可见状态
function changePwdType() {
    var _this = $("#password");
    var _type = _this.attr("type");
    var _change = (_type == "password") ? "text" : "password";
    _this.attr("type", _change);
}

$('input[name="tjcheck"]').on('ifChecked', function (event) {
    if ($(this).val() == '2') {
        $("#code").show();
    } else {
        $("#code").val("").hide();
    }
})
function mobileKeyup() {
//    var _input = $("input[name='mobile']");
//    var _info = $("#error1");
//    var _val = _input.val();
//    _val = _val.replace(/[^\d]/g, '');
//    _input.val(_val);
//    if (_val.length > 7) {
//        _info.html(_val.substring(0, 3) + "&nbsp;" + _val.substring(3, 7) + "&nbsp;" + _val.substring(7, _val.length) + "<em></em>").show();
//    } else if (_val.length > 3) {
//        _info.html(_val.substring(0, 3) + "&nbsp;" + _val.substring(3, _val.length) + "<em></em>").show();
//    } else if (_val.length > 0) {
//        _info.html(_val + "<em></em>").show();
//    } else {
//        _info.html("").hide();
//    }
//    _input.on("focusout", function () {
//        _info.hide();
//    }).on("focusin", function () {
//        if (_val.length > 0) {
//            _info.show();
//        }
//    });
}

//验证手机的有效性
function checkMobile() {
    chkMobile = false;
    var th = $("input[name='mobile']");
    var p = $("#error1");
    var v = $.trim(th.val());
    p.html('');
    if (v.length == 11) {
        if (!mobileReg.test(v)) {
        	th.addClass("Validform_error");
            p.html('<span class="errortip">请填写正确的手机号</span>');
            return false;
        }
        $.ajax({
            type: "post",
            dataType: "html",
            url: basePath + '/secure/register/check-account',
            data: {"account": v},
            success: function (data) {
                if (data == "1") {
                	th.addClass("Validform_error");
                    p.html('<span class="errortip">该手机号已存在，请输入其他手机号</span>');
                } else {
                    chkMobile = true;
                    $("#getVerifyCode").removeClass("disabled").attr("disabled", false);
                    p.html('<span class="successicon"></span>');
                    return true;
                }
            }
        });
    } else {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">请填写正确的手机号</span>');
        return false;
    }
}
//密码
function checkPassword() {
	chkPassword=false;
    var th = $("input[name='password']");
    var p = $("#error1");
    var v = $.trim(th.val());
    p.html('');
    if (isNullReg.test(v)) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">密码不能为空</span>');
        return false;
    } else if (v.length < 6 || v.length > 20) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">6~20个字符，区分大小写</span>');
        return false;
    }
    chkPassword=true;
    p.html('<span class="successicon"></span>');
    return true;
}
//确认密码
function checkRePassword() {
    var pwd = $("input[name='password']");
    var th = $("input[name='repassword']");
    var p = $("p[for='repassword']");
    var v = $.trim(th.val());
    p.html('');
    if (!checkPassword()) {
        pwd.focus();
        th.val('');
        return false;
    } else if (isNullReg.test(v)) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">确认密码不能为空</span>');
        return false;
    } else if (pwd.val() != v) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">您两次输入的密码不一致</span>');
        return false;
    }
    return true;
}
//图形验证码
function checkRandCode() {
    chkRandCode = false;
    var th = $("input[name='randcode']");
    var p = $("p[for='randcode']");
    var v = $.trim(th.val());
    p.html('');
    if (v == null || v == "") {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">图形验证码不能为空</span>');
        return false;
    } else if (!verifyCodeReg.test(v)) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">请填写正确的验证码</span>');
        return false;
    } else {
        chkRandCode = true;
        return true;
    }
}
//短信验证码
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
    return true;
}
//邀请码
function checkInviteCode() {
    chkRegCode = false;
    var th = $("input[name='inviteCode']");
    var p = $("#error1");
    var v = $.trim(th.val());
    p.html('');
    if (v == null || v == "") {
        chkRegCode = true;
        return true;
    } else if (!codeReg.test(v) && !mobileReg.test(v)) {
    	th.addClass("Validform_error");
        p.html('<span class="errortip">您输入的邀请码格式不正确</span>');
        return false;
    } else {
        $.ajax({
            type: "post",
            dataType: "json",
            url: basePath + '/secure/register/check-code',
            data: {"code": v},
            success: function (data) {
                if (data == "1") {
                	th.addClass("Validform_error");
                    p.html('<span class="errortip">邀请码不存在，请核对或暂不填写邀请码。</span>');
                } else {
                    chkRegCode = true;
                }
            }
        });
    }
}


//检测表单
function chkRegform() {

    if (!chkMobile) {
        checkMobile();
        return false;
    }
//    if (!chkRandCode) {
//        checkRandCode();
//        return false;
//    }
    if (!chkRegCode) {
        checkInviteCode();
        return false;
    }
    var c_wwd = checkPassword();
    if(!c_wwd){
    	return c_wwd;
    }
    c_wwd = checkVerifyCode();	
    
    return c_wwd;
}
//写入cookies（时间为1天）
function setCookie(name, value) {
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else {
        return null;
    }
}
//显示邀请码
function changeInvite() {
	var _hidden=$("#invitediv").is(":hidden");
	if(_hidden){
		$("#invitediv").slideDown();
		$("#inviteDesc").html('<i class="iconfont">&#xe632;</i>推荐人(选填)');
	}else{
		$("#invitediv").slideUp();
		$("#inviteCode").val("");
		$("p[for='inviteCode']").html('');
		$("#inviteDesc").html('<i class="iconfont">&#xe630;</i>推荐人(选填)');
	}
}
function getISODate(d) {
    var s = function (a, b) {
        return (1e15 + a + "").slice(-b);
    };

    if (typeof d === 'undefined') {
        d = new Date();
    }
    ;
    return d.getFullYear() + s(d.getMonth() + 1, 2) + s(d.getDate(), 2);
}
$("#getVerifyCode").on("click", function () {
	var flag=(chkMobile||checkMobile())&&(chkPassword||checkPassword());
    if (flag) {
    	var th = $("input[name='verifyCode']");
        var _tips = $("#error1");
        _tips.html('');
        var val = $("input[name='mobile']").val();
        var today = getISODate(new Date());
        var sendVoiceTimes = getCookie(val + today + "_voice");
        var sendTimes = getCookie(val + today);
        if (sendTimes >= 3 && sendVoiceTimes < 3) {
            $("#getVerifyCode").addClass("disabled").attr("disabled", true);
            $("#info1").html('若收不到短信，<span id="yyyzm"><a class="btn-voice" href="javascript:sendVoiceCode();">语音获取</a></span>').show();
            $("#error1").html('<span class="infotip">短信获取次数超过限制，请使用语音获取</span>');
            return;
        } else if (sendVoiceTimes >= 3 && sendTimes >= 3) {
            $("#getVerifyCode").addClass("disabled").attr("disabled", true);
            $("#info1").html('收不到短信验证码？<span class="btn-voice disabled">语音获取</span>');
            _tips.html('<span class="warningtip">今天该手机号码已超过接收验证码上限，发送失败！</span>');
            return;
        }

        $.ajax({
            type: "post",
            url: basePath + '/secure/register/verify-code',
            data: {"type": "1", phone : val, codetype: $("#codetype").val(), randCode : $("input[name=randcode]").val()},
            success: function (data) {
                if (data.success == 0) {
                	th.addClass("Validform_error");
                    _tips.html('<span class="errortip">' + data.msg + '</span>');
                    //disableButtonByClock(data.time);
                } else if (data.success == 1) {

                    //_tips.html('<span class="warningtip">验证码已发送，如无法接收可选择语音获取</span>');
                    //设置cookies
                    var sendTimes = getCookie(val + today);
                    if (sendTimes == null || sendTimes == "") {
                        setCookie(val + today, 1);
                    } else {
                        setCookie(val + today, parseInt(sendTimes) + 1);
                    }
                    setCookie('clickTime', new Date().getTime());
                    disableButtonByClock(60);
                }else if (data.success == -2) {
                    //$("input[name='randcode']").addClass("Validform_error");
                	_tips.html('<span class="errortip">' + data.msg + '</span>');
                    $("#randImg").click();
                    //disableButtonByClock(data.time);
                }  else {
                	if (data.success == -5) {//验证码错误,刷新验证码
                		$("#randImg").click();	
                	}
                	th.addClass("Validform_error");
                    _tips.html('<span class="errortip">' + data.msg + '</span>');
                    $("#randImg").click();
                }
            }
        });
    }
});

function sendVoiceCode() {
	var flag=(chkMobile||checkMobile())&&(chkPassword||checkPassword()&&(chkRandCode||checkRandCode()));
    if (flag){
        var _tips = $("#error1");
        _tips.html('');
        var val = $("input[name='mobile']").val();
        var today = getISODate(new Date());
        //获取该手机号的当天的发送次数
        var sendVoiceTimes = getCookie(val + today + "_voice");
        var sendTimes = getCookie(val + today);
        if ( sendVoiceTimes >= 3 && sendTimes < 3) {
        	$("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
            $("#info1").html('收不到短信验证码？<span class="btn-voice disabled">语音获取</span>');
            _tips.html('<span class="warningtip">获取次数超限，请尝试使用短信获取</span>');
            $("#voicetip").show();
            return;
        } else if (sendVoiceTimes >= 3 && sendTimes >= 3) {
            $("#info1").html('收不到短信验证码？<span class="btn-voice disabled">语音获取</span>');
            $("#getVerifyCode").addClass("disabled").attr("disabled", true);
            _tips.html('<span class="warningtip">今天该手机号码已超过接收验证码上限，发送失败！</span>');
            return;
        }

        $.ajax({
            type: "post",
            url: basePath + '/secure/register/verify-code',
            data: {"type": "2",phone:val, codetype: $("#codetype").val(), randCode : $("input[name=randcode]").val()},
            success: function (data) {
                if (data.success == 0) {
                    _tips.html('<span class="errortip">' + data.msg + '</span>');
                    //disableButtonByClockVoice(data.time);
                } else if (data.success == 1) {
                    //设置cookies
                    var sendTimes = getCookie(val + today + "_voice");
                    if (sendTimes == null || sendTimes == "") {
                        setCookie(val + today + "_voice", 1);
                    } else {
                        setCookie(val + today + "_voice", parseInt(sendTimes) + 1);
                    }
                    setCookie('clickTime', new Date().getTime());
                    disableButtonByClockVoice(60);
                }else if (data.success == -2) {
                    //$("input[name='randcode']").addClass("Validform_error");
                	_tips.html('<span class="errortip">' + data.msg + '</span>');
                    $("#randImg").click();
                    //disableButtonByClock(data.time);
                } else {
                    _tips.html('<span class="errortip">' + data.msg + '</span>');
                    $("#randImg").click();
                }
            }
        });
    }
}
var voicetype=false;
//3.2.1 禁用发送手机验证码按钮
function disableButtonByClock(seconds) {
	if(!voicetype){
	    $("#getVerifyCode").addClass("disabled").attr("disabled", true).html(seconds + "s重发");
	    $("#info1").html('收不到短信验证码？<a  class="btn-voice" onclick="sendVoiceCode()" href="javascript:;">语音获取</a>');
	    var time = parseInt(seconds);                   //将传入的参数转为整型数字
	    if (time === 0) {
	        $("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
	    } else {
	        setTimeout("disableButtonByClock(" + (time - 1) + ")", 1000);  //1秒以后 再次调用本身这个方法
	    }
	}
}

//3.2.1 禁用发送语音验证码按钮
function disableButtonByClockVoice(seconds) {
	voicetype=true;
    $("#getVerifyCode").addClass("disabled").attr("disabled", true).html(seconds + 's后重发');
    $("#info1").html('<span class="c-orange">请您注意接听1259-0988-8601的来电</span>');
    var time = parseInt(seconds);
    if (time == 0) {     //如果时间为0，则启用该控件
    	voicetype=false;
        $("#getVerifyCode").removeClass("disabled").attr("disabled", false).html('获取验证码');
        $("#info1").html('收不到短信验证码？<a  class="btn-voice" onclick="sendVoiceCode()" href="javascript:;">语音获取</a>');
    } else {
        setTimeout("disableButtonByClockVoice(" + (time - 1) + ")", 1000);  //1秒以后 再次调用本身这个方法
    }
}

function onSubmit() {
    if (chkRegform()) {
        $.ajax({
            url: basePath + "/secure/register/confirm",
            type: 'POST',
            data: $("#form1").serialize(),
            dataType: 'json',
            cache: false,
            async: true,
            success: function (data) {
                var result = $.parseJSON(data);
                if (result.success) {
                    window.location = basePath + result.msg;
                } else {
                    $("input[name='mobile']").val(result.data.phone);
                    $("#randImg").click();
                    $("#error1").html('<span class="errortip">' + result.data.msg +'</span>');
                }
            }
        });
    }
}
