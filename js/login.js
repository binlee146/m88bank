var isNull = /^[\s]{0,}$/;
//1.1 点击眼睛改变密码可见状态
function changePwdType2() {
    var _this = $("#userpwd");
    var _type = _this.attr("type");
    var _change = (_type == "password") ? "text" : "password";
    if (_type == "password") {
        $(".pwdeye").addClass("c-orange").removeClass("c-999");
    } else {
        $(".pwdeye").removeClass("c-orange").addClass("c-999");
    }
    _this.attr("type", _change);
}
//1.2 验证账号
function accountCheck() {
  var _input=$("input[name='userMobile']");
  var _tips=$("#loginerror");
  var name=$.trim(_input.val());
  _tips.html('');  
  
  if(name==""){
    _tips.html('<span class="errortip">用户名不能为空</span>');
    return false;
  }
  return true;
}
//1.3 验证密码
function passwordCheck() {
  var _input=$("input[name='userpwd']");
  var _tips=$("#loginerror");
  var name=$.trim(_input.val());    
  _tips.html(''); 
  if(name==""){
    _tips.html('<span class="errortip">密码不能为空</span>');
    return false;
  }
  return true;
}
//1.4 验证图形码
function captchaCheck() {
  var _input=$("input[name='captcha']");
  var _tips=$("#loginerror");
  var name=$.trim(_input.val());
  var verifyCodeRex=/^[a-z0-9]{5}$/;
  _tips.html('');
  if(name==""){
	      _tips.html('<span class="errortip">验证码不能为空</span>');
	      return false;
  }else if (!verifyCodeRex.test(name)) {
  		_tips.html('<span class="errortip">请填写正确的验证码</span>');
		return false;
	}	
  return true;
}
function login(){
	if(accountCheck()&&passwordCheck()){
		var userMobileVal = $("#userMobile").val();
		var userpwdVal =$("#userpwd").val();
		var captchaVal =$("#captcha").val();
		if($("#captchadiv").is(":visible")){
        	jsonstr='{"verCode":"'+captchaVal+'","accountName":"'+userMobileVal+'","password":"'+userpwdVal+'","flag":"'+true+'"}';
        }else{
        	jsonstr='{"verCode":"'+captchaVal+'","accountName":"'+userMobileVal+'","password":"'+userpwdVal+'","flag":"'+false+'"}';
        }
		$.call("/login",jsonstr,function(json){
            if(json.code=="000000"){
                var _url=GetQueryString("_z");
                if(_url!=null&&_url!=""){
                	location.href=""+_url;
                }else{
                	location.href="userinfo/info.html";
                }
              } else{
           		if(json.data!=null&&json.data.securityCaptchaneed!=null&&json.data.securityCaptchaneed==true){
             		  $("#captchaimg").attr("src","/app/verifyCode/capcha");
             		  $("#captchadiv").show();
           	    }else{
           	       $("#captchaimg").attr("src","");
           		   $("#captchadiv").hide();
           	    }
           		$('#captchaimg'). attr("src", '/app/verifyCode/capcha?'+Math.random());	 
           		$("#captcha").val('');
           		$("#loginerror").html('<span class="errortip">'+json.desc+'</span>');
           }
          });
	}
}