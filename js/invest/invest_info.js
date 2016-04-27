// 选择类型
var map, totalCount = 0, trTemplate = null;
var availableAmt = 0, isVote = 0, maxInvestAmt = 0, isAct = 0,repayMode = 0;
var currentLoanPeriodUnit = 0, currentLoanPeriod = 0, currentRate = 0, voteInvestAmt = 0;
var tasteLoanPeriodUnit = 0, tasteLoanPeriod = 0, tasteRate = 0, tasteInvestAmt = 0;
// 初始化分页
$(function() {
	initEvent();
});
function initEvent(){
	//给立即投标按钮绑定点击事件
	$("#btnJoin").bind("click",function(){doBid();});
	availableAmt = $.trim($("#availableAmtId").val());
}

/**
 * 投标操作
 */
function doBid() {
//	disableBidbtn();//禁用按钮
	var investAmt = $("#investAmt").val();
	var mayInvestAmt = $("#mayInvestAmtId").val();
	var availableAmt = $("#availableAmtId").val();
	var actBalance = $("#actBalance").val();//专享标额度
	var _tips=$("#error1");
	//投资金额必须大于0
	if (Number(investAmt) <= 0) {
		_tips.html('<span class="errortip">投标金额必须大于0</span>');
//		enableBidbtn();
		return false;
	}
	//投资金额不能大于帐户金额+红包金额
	if (Number(investAmt) > (Number(availableAmt)+Number(voucher_amount))) {
		_tips.html('<span class="errortip">投资金额不能大于账户余额</span>');
//		enableBidbtn();
		return false;
	}
	//如果投资金额比可投资金额大，那么投资金额自动转为可投资金额
	if (Number(investAmt) > Number(mayInvestAmt)) {
		investAmt = mayInvestAmt;
		$("#investAmt").val(mayInvestAmt);
//		enableBidbtn();
		return false;
	}
	if(typeof(actBalance) != "undefined" && actBalance!=""){
		if (Number(investAmt) > Number(actBalance)) {
//			enableBidbtn();
			layer.open({
			    content: '剩余专享额度不足，您的专享可投额度是'+actBalance+'元！',
			    btn: ['确定'],
			    shadeClose: true,
			    yes: function(){
			    	window.location.href=window.location.href;
			    }
			});
			return false;
		}		
	}
	//判断是否使用红包
	if(voucher_amount > 0){
		text = formatCurrency(investAmt) + '(含红包金额<span class="c-orange">'+formatCurrency(voucher_amount)+'</span>元)';
	}
	$("#txtInvestAmt").html(formatCurrency(investAmt));
	openlayer("#layer1");
}

var processing = false;
function doInvest(){
	//获取使用的红包
	var couponIds =  new Array();
	$("input[name='voucher'][input-checked='true']").each(function(index,obj){
		couponIds.push($(obj).val());
	});
	var investAmt = $("#investAmt").val();
	var data =  {
			loanId : $("#loanId").val(),
			couponIds : couponIds,
			investAmt : investAmt
		};
	closelayer();
	if(processing){
		return;
	}
	processing=true;
	$.ajax({
		cache : true,
		type : "POST",
		url : basePath + '/invest/loan-trade',
		data :data,
		
		async : false,
		success : function(data) {
			var result = eval("(" + data + ")");
			if (result.successed != undefined && result.successed) {
				if (result.getCoupon != undefined && result.getCoupon!="") {
					if(Number(result.getCoupon)>0){
						$("#getCouponAmt").html(result.getCoupon);
						$("#getCouponDiv").show();
					}
					//useQuota是否投资专享标 ,balQuota剩余额度 
				}else if (result.useQuota != undefined && result.useQuota!="") {
					if (result.balQuota != undefined && result.balQuota) {
						$("#getUserPrivileAmt").html(result.balQuota);
						$("#getUserPrivileDiv").show();
					}else{
						$("#getPrivileAmt").html(result.balQuota);
						$("#getPrivileDiv").show();
					}
				}
				$("#successje").html(formatCurrency(investAmt));
				successTip();
			} else {
				processing=false;
				$("#layer1").hide();
				Jalert(result.message.replace("no_invest",""));
			}
		}
	});
}

//投资成功提示
function successTip(){
	var _html=$("#successTip").html();
	layer.open({
	    type: 1,
	    content:_html,
	    style: 'position:fixed; left:0; top:0; width:100%; height:100%;border:none;'
	});
}
var voucher_amount=0;//已选择红包总额
var voucher_num=0;//已选择红包个数
var voucher_min=0;//最低使用限制

function voucherClick(obj){
	var voucher_click=$(obj).find(".icheck_flat2");
	var _amt=voucher_click.attr("data-amt");
	var _min_amt=voucher_click.attr("data-min");
	var _checked=voucher_click.attr("input-checked");
	if(_checked=="true"){
		voucher_amount-=parseInt(_amt);
		voucher_num-=parseInt(1);
		voucher_min-=parseInt(_min_amt);
		voucher_click.attr("input-checked","false").attr("checked",false).parent(".u-checkbox-orange2").removeClass("checked");
	}else{
		voucher_amount+=parseInt(_amt);
		voucher_num+=parseInt(1);
		voucher_min+=parseInt(_min_amt);
		voucher_click.attr("input-checked","true").attr("checked",true).parent(".u-checkbox-orange2").addClass("checked");
	}
	if(voucher_amount==0){
		$("#btnVoucher").html("选择");
		$("#txtVoucherTotal").html("可用红包&nbsp;<em>"+$("#couponTotalNumber").val()+"张</em>");
	}else{
		$("#btnVoucher").html("修改");
		$("#txtVoucherTotal").html("已使用<span class='c-orange'>"+voucher_amount+"</span>元，满<span class='c-orange'>"+voucher_min+"</span>可用");
	}
}

function openVoucher(){
	var voucherSum = 0;
	$("input[name='voucher']").each(function(index,obj){
		voucherSum++;
	});
	if(voucherSum==0){
		return Jalert("您暂无红包可用");
	}
	$("body").css("overflow","hidden");
	$("#vouchercontent").show();
	var  wht=document.documentElement.clientHeight*0.9;
	var  vht=$("#voucher_list").height();
	var _mt=vht>wht?wht/2:vht/2;
	$("#voucherbox").attr("style","margin-top:-"+_mt+"px");
	$("#voucher_list").attr("style","max-height:"+wht+"px;");
}
