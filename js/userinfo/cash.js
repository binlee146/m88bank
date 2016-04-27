var authName = false,authPassword = false;
$(function(){
	//默认选择第一个个银行卡
    $(".ac_otherbg[bankStatus='2']").eq(0).trigger("click");
    resetHeight();
    initEvent();
	checkSecurity();
});
function initEvent(){
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
/**
 * 选中列表中的某一个银行
 * @param bankNo
 * @param bankName
 * @param cardNo
 * @param cardId
 * @param province
 * @param city
 * @param branch
 */
function choooseBank(bankNo, bankName, cardNo, cardId, province, city, branch,bankStatus) {
	if(bankStatus!='2'){
		Jconfirm('该卡未验证,请先绑卡!',function(index){
            window.location.href=basePath+"/secure/bank-card/check?bankId="+_this.attr("bankId");
            return;
        });    
        return;
    }
	$("#banks,.ac_zgcdivbig").hide();
	$("#bankCardId").val(cardId);
	$("#yhka").attr("data-code",bankNo);
	$("#yhka").html('<img src="' + basePath + '/images/bankcard/' + bankNo + '.png" /><span class="s2"><i class="i1">' + bankName+ '</i><i class="i2" >' + cardNo + '</i></span>');
	
	if (province != '' && province != 'null') {
		$("#bankProv").val(province);
		$('#bankProv').change();
	} else {
		$("#bankProv option[value='']").attr("selected", "selected");
		$("#bankCity option[value='']").attr("selected", "selected");
		$("#bindBranch").show();
	}
	if (city != '' && city != 'null') {
		$("#bankCity").val(city);
	} else {
		$("#bankProv option[value='']").attr("selected", "selected");
		$("#bankCity option[value='']").attr("selected", "selected");
		$("#bindBranch").show();
	}
	if (branch != '' && branch != 'null') {
		$("#branchName").val(branch);
	} else {
		$("#branchName").val('');
		$("#bindBranch").show();
	}
	if((province != '' && province != 'null') && (city != '' && city != 'null') && (branch != '' && branch != 'null')){
		$("#bindBranch").hide();
	}
	$("#bankId").val(cardId);
}


//1.6.2 初始化省市区
$('#bankProv').change(function(){
    var value=$('#bankProv').val();
    var _city=$('#bankCity');
    var bankCity = $("a.mu-bank2.on").attr("city");
    var html=['<option value="">请选择</option>'];
    _city.empty();
    if(value){
        $.ajax({
            url:basePath+'/secure/bank-card/city-list',
            type:'post',
            dataType:'json',
            data:{areaCode:value},
            cache:false,
            async:false,
            success:function(data){
                var result = $.parseJSON(data);
                $.each(result.data,function(i,obj){
                    if(obj.areaCode==bankCity){
                        html.push('<option value="',obj.areaCode,'" selected="selected" >',obj.areaName,'</option>');
                    }else{
                        html.push('<option value="',obj.areaCode,'">',obj.areaName,'</option>');
                    }
                });
                _city.append(html.join(''));
                $("#bankCity").trigger("change");
            }
        });
    }else{
        _city.append(html.join(''));
    }
});

function getBranchs(){
	$("#add_e5").hide();
    if ($("#branchs").css("display") == "none") {  
        searchBranchs();      
    } else {
        $("#branchs").hide();
        $(".ac_zgcdivbig").hide();
    }
}
function searchBranchs(){
	
	var keyWord = $("#branchName").val();
    var cityCode = $("#bankCity").val();
    var bankCode = $("#yhka").attr("data-code");;
    if(bankCode==""||typeof(bankCode)=="undefined"){
        $("#branchs ul").html('<li >请选择银行</li>');
        return;
    }
    if(cityCode==""||typeof(cityCode)=="undefined"){
        $("#branchs ul").html('<li >请选择城市</li>');
        return;
    }    
    var _url=basePath+'/secure/bank-card/branch-list';
   
    keyWord = "";
     $.ajax({
        url:_url,
        type:'post',
        dataType:'json',
        data:{"bankCode":bankCode,"keyWord":keyWord,"cityCode":cityCode},
        async: false,//避免被浏览器拦截
        success:function(data){
        	var obj = data;
            if(obj==null||obj.length==0){
          	 $("#add_e5").html('没找到相关支行').show();
          	  return false;
            }
            var htmlstr = '';
            for (var i = 0; i < obj.length; i++) { 	              	
            	var  temp='';
                if (i % 2 == 0) 
                	temp=' class="ac_otherbg" ';                            
                htmlstr+= '<li  '+temp+'  onClick="chooseBranch(\'' + obj[i].value + '\')" >' + obj[i].value + '</li>';
               
            }
          $("#branchs ul").html(htmlstr);
          $("#branchs").show();
          $(".ac_zgcdivbig").show();
          return; 
        }
    });
}

function chooseBranch(val){
	$("#branchName").val(val);
	$(".ac_zgcdivbig").hide();
	$("#branchs").hide();
}

//验证提现金额
function checkAmount(){
    var availableAmt=$("input[name=availableAmt]").val();
    var _input=$("input[name=amount]");
    var _val=_input.val();
    var _tips=$("#amountTips");
    _tips.html('').show();
    siCashAmt = siCashAmt*10000;
    if(_val==""){
        _tips.html('<span class="errortip">请输入提现金额</span>');
        return false;
    }else if(Number(_val) > Number(siCashAmt)){
        _tips.html('<span class="errortip">单笔提现金额最高金额为'+singCashAmt+'万元</span>');
        return false;        
    }else if(Number(_val) < Number(minCashAmt)){
        _tips.html('<span class="errortip">单笔提现金额最低为'+minCashAmt+'元</span>');
        return false;        
    }
    if(Number(_val) > Number(availableAmt)){
        _tips.html('<span class="errortip">提现金额不能大于可用余额</span>');
        return false;    
    }
    //计算提现手续费
    calateAmt();

    return true;
}



//验证交易密码
function checkPassword(){
    var _input=$("#withdrawPsd");
    var _val=_input.val();
    var _tips=$("#withdrawPsdTips");
    _tips.html("").show();
    if(_val==""){
        _tips.html('<span class="errortip">请输入平台交易密码</span>');
        return false;
    }
    return true;
}


//计算提现手续费
function calateAmt(){
    var amount = Number($("#amount").val());
    var freeAmt = Number($("#freeAmt").val());
    //免费额度大于取现额度 免费
    if(freeAmt >= amount){
        if(hasCashCount >= withdrawlCount){
        	$("#sxf").html(singleCashFee+"");
        	$("#sjdzje").html((amount-singleCashFee));
        }else{
        	$("#sxf").html("0.00");
        	$("#sjdzje").html(amount);
        }
    }else{
        //取现手续费
        var feeAmt = Number((amount-freeAmt)*(feeRate/100));
        if(feeAmt < 3){
            feeAmt = 3;
        }
        $("#sxf").html(feeAmt.toFixed(2));
    	$("#sjdzje").html((amount-feeAmt.toFixed(2)).toFixed(2));
    }

    if(amount >= Number(sms_verifycode_amt)){
        $("#dxyz").show();
    }else{
        $("#dxyz").hide();        
    }
}

//检查验证码
function checkVerifyCode() {
  var _input = $("#verifyCode");
  var _val = _input.val();
  var _tips = $("#verifyCodeTips");
  _tips.html('').show();
  var verfycodAmt = $("#verfycodAmt").val();
  var amountAmt = $("#amount").val();
  if (_val == "" && (Number(amountAmt) >= Number(verfycodAmt))) {
      _tips.html('<span class="errortip">验证码不能为空</span>');
      return false;
  }
  return true;
}


//验证开户地区
function checkArea(){
  var _val1=$("#bankProv").val();
  var _val2=$("#bankCity").val();
  var _tips=$("#add_e5");
  _tips.html("").show();
  if(_val1==""){
      _tips.html('<span class="errortip">请选择省</span>');
      return false;
  }
  if(_val2==""){
      _tips.html('<span class="errortip">请选择市</span>');
      return false;
  }
  return true;
}

//验证开户支行
function checkSubbank(){
  var _input=$("#branchName");
  var _val=_input.val();
  var _tips=$("#add_e5");
  _tips.html("").show();
  if(_val==""){
      _tips.html('<span class="errortip">请选择开户支行</span>');
      return false;
  }
  return true;
}

/**
 * 密码可见
 */
function showpwd() {
    if ($(".hida").css("display") == "none") {
        $(".hida").show();
        $("#showa").hide();
        $(".lab1").html('<input type="text" class="ipt1" style="font-size:1rem" placeholder="请输入平台交易密码" id="withdrawPsd" name="withdrawPsd" value="' + $("#withdrawPsd").val() + '" />');
    } else {
        $(".hida").hide();
        $("#showa").show();
        $(".lab1").html('<input type="password" class="ipt1" style="font-size:1rem" placeholder="请输入平台交易密码" id="withdrawPsd" name="withdrawPsd" value="' + $("#withdrawPsd").val() + '" />');
    }
}


//1.6 发送短信验证 
$('#getVerifyCode').on('click',function(){
	var userMobile = $.trim($("#userMobile").val());
	getVerifyCode(userMobile);
});
function getVerifyCode(userMobile){
	var _tips = $("#info1");
	// 按钮不可用
	$("#getVerifyCode").addClass("disabled").attr("disabled", true);
	$.ajax({
		type : "post",
		dataType : "json",
		url : basePath + "/verify-code/obtain-code",
		data : {	type:'1',
					code:'tx_code',
					mobile : userMobile
				},
		success : function(data) {
			var result = data;
			if(result.success != undefined && result.success){
				disableButtonByClock(60);
				var mobl = userMobile.substr(0,3)+" **** **"+userMobile.substr(9);
				_tips.html('<span class="warningtip">验证码已发送至' + mobl + '，请查收。</span>');
			}else{
				$("#getVerifyCode").removeClass("disabled").attr("disabled", false).html("获取验证码");
				_tips.html('<span class="errortip">'+ result.msg + '</span>');
				if(result.msg.indexOf("频繁") >= 0){
					disableButtonByClock(60);
				}
			}
		}
	});
}
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

//检测表单
function chkRegform(){
	var c_amt = checkAmount();
    var c_wwd =checkPassword();
    var c_code = checkVerifyCode();
    var c_branch = checkSubbank();
    var c_area = checkArea();
    return (c_wwd&&c_code&&c_amt&&c_branch&&c_area);
}
$('#bt_submit').click(function() {
    var amountAmt = $("#amount").val();
    var bankId = $("#bankId").val();
    if(bankId==''){
        alert("请选择银行卡");
        return ;
    }
     if(chkRegform()){
    	 Jconfirm('确定提现'+amountAmt+'元吗?',function(index){
            //按钮不可用
            $("#bt_submit").addClass("disabled").attr("disabled", true);
            //加载层
            Jload();
            setTimeout(function(){
                $.ajax({
                    cache: true,
                       type: "POST",
                       url:basePath+'/secure/encash-confirm',
                       data:$('#form2').serialize(),
                       success: function(data) {
                    	layer.close(loadIndex);
                        $("#bt_submit").removeClass("disabled").attr("disabled", false);
                        var result = eval("("+data+")");
                        if (result.success!=undefined && result.success) {
                        	window.location.href=basePath+"/encash/success#"+amountAmt;
                        }else{
                            Jalert(result.msg);
                        }
                       }
                   }); 
            }, 10);
        });
    }
});