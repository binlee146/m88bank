var code='',mobile='',btnNo='1',nClock,vClock;
function getVerifyCode(codeType,sendMobile,bNo){
	code=codeType;
	mobile=sendMobile;
	btnNo=bNo;
	var _tips = $("#error"+btnNo);
	//清除原来的定时任务
	clearTimeClock();
	// 按钮不可用
	disableButtonByClock(60,btnNo);
	$.ajax({
		type : "post",
		dataType : "json",
		url : basePath+"/verify-code/obtain-code",
		data : {"type" : "1","code" :code,'mobile':mobile},
		success : function(data) {
			if(data.success){
				_tips.html('<span class="warningtip">'+data.msg+'</span>');
			}else{
				_tips.html('<span class="errortip">'+ data.msg + '</span>');
			}
		}
	});
}
function getVoiceCode(){
	var _tips = $("#error"+btnNo);
	//清除原来的定时任务
	clearTimeClock();
	// 按钮不可用
	disableButtonByClockVoice(60,btnNo);
	$.ajax({
		type : "post",
		dataType : "json",
		url : basePath+"/verify-code/obtain-code",
		data : {"type" : "2","code" : code,'mobile':mobile},
		success : function(data) {
			if (!data.success) {
				_tips.html('<span class="errortip">' + data.msg + '</span>');
			} 
		}
	});
}
//3.2.1 禁用发送手机验证码按钮
function disableButtonByClock(seconds,bNo) {
	if(!vClock){
	    $("#getVerifyCode"+bNo).addClass("disabled").attr("disabled", true).html(seconds + "s重发");
	    $("#info"+bNo).html('收不到短信验证码？<a  class="btn-voice" id="getVoiceCode" href="javascript:getVoiceCode();">语音获取</a>');
	    var time = parseInt(seconds);
	    if (time === 0) {
	        $("#getVerifyCode"+btnNo).removeClass("disabled").attr("disabled", false).html("获取验证码");
	    } else {
	    	nClock=setTimeout("disableButtonByClock(" + (time - 1) + ","+bNo+")", 1000);  //1秒以后 再次调用本身这个方法
	    }
	}
}

//3.2.1 禁用发送语音验证码按钮
function disableButtonByClockVoice(seconds,bNo) {
    $("#getVerifyCode"+bNo).addClass("disabled").attr("disabled", true).html(seconds + 's后重发');
    $("#info"+bNo).html('<span class="c-orange">请您注意接听1259-0988-8601的来电</span>');
    var time = parseInt(seconds);
    if (time == 0) {     //如果时间为0，则启用该控件
        $("#getVerifyCode"+bNo).removeClass("disabled").attr("disabled", false).html('获取验证码');
        $("#info"+bNo).html('收不到短信验证码？<a  class="btn-voice" id="getVoiceCode" href="javascript:getVoiceCode();">语音获取</a>');
    } else {
    	vClock=setTimeout("disableButtonByClockVoice(" + (time - 1)  + ","+bNo+")", 1000);  //1秒以后 再次调用本身这个方法
    }
}
function clearTimeClock(){
	if(nClock){
		nClock=null;
		clearTimeout(nClock);
	}
	if(vClock){
		vClock=null;
		clearTimeout(vClock);
	}
}
