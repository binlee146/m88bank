$(function(){
	$('#nav_tz').addClass('on');
	resetHeight();//页面高度调整
});
function buy(){
	var id=$('input[name="transferApplyId"]').val();
	var amt=$('input[name="availableAmt"]').val();
	var price=$('input[name="transferPrice"]').val();
	if(Number(price)>Number(amt)){
		Jalert('账户余额不足');
		return false;
	}
	openlayer("#layer1");
	$("#btnInvest").click(function(){
		$.ajax({
	       	url:basePath+'/invest/debt-trade',
	       	type: "POST",
	       	data:{transferApplyId:id},
	       	async: false,
	       	success: function(data) {
				var result =$.parseJSON(data);
	        	if (result.successed) {
					//获得红包
					if (result.getCoupon != undefined && result.getCoupon!="") {
						if(Number(result.getCoupon)>0){
							$("#getCouponAmt").html(result.getCoupon);
							$("#getCouponDiv").show();
						}
					}
					successTip();
	        	}else{
	        		return Jalert(result.message);
	        	}
	       	}
	   	});
	});
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
