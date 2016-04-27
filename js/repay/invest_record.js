//初始化参数
var hkzMap, hkzTemplate = null, hkzPageNo = 0, hkzNextPage = 0, hkzTotalPages = 0;
var tbzMap, tbzTemplate = null, tbzPageNo = 0, tbzNextPage = 0, tbzTotalPages = 0;
var yjqMap, yjqTemplate = null, yjqPageNo = 0, yjqNextPage = 0, yjqTotalPages = 0;
/**
 * 页面初始化执行函数
 */
$(function(){
	if (hkzTemplate == null || tbzTemplate == null || yjqTemplate == null) {
		// 获取html模板
		hkzTemplate = $("#hkzTemplate");
		tbzTemplate = $("#tbzTemplate");
		yjqTemplate = $("#yjqTemplate");
		// 设置map参数
		hkzMap = {
			url : basePath + "/assets/repaying",
			pageSize : 10,
			isAll : '0',
			dataType : "JSON",
			type : "POST"
		};
		tbzMap = {
			url : basePath + "/assets/invest",
			pageSize : 10,
			dataType : "JSON",
			type : "POST"
		};
		yjqMap = {
				url : basePath + "/assets/repayed",
				pageSize : 10,
				dataType : "JSON",
				type : "POST"
		};
	}
	$("#lodingDiv1,#lodingDiv2,#lodingDiv3").show();
	initHkz();
	initTbz();
	initYjq();
	$('#next_list1').click(function() {
		$("#lodingDiv1").show();
		$("#next_list1").hide();
		hkzMap.pageNo = hkzNextPage;
		initHkz();
	});
	$('#next_list2').click(function() {
		$("#lodingDiv2").show();
		$("#next_list2").hide();
		tbzMap.pageNo = tbzNextPage;
		initTbz();
	});
	$('#next_list3').click(function() {
		$("#lodingDiv3").show();
		$("#next_list3").hide();
		yjqMap.pageNo = yjqNextPage;
		initYjq();
	});
});
function initHkz(){
	// 获取放置模板的div
	var hkzTemplateList = $("#hkzTemplateList");
	$.ajax({
		url : hkzMap.url,
		type : hkzMap.type,
		dataType : hkzMap.dataType,
		data : hkzMap,
		cache : false,
		success : function(data) {
			var result = eval("("+data+")");
			if (result.success!=undefined&&!result.success) {
				Jalert(result.msg);
			} else {
				var list = result.result;
				if(list.length>0){
					for (var i in list) {
						// 克隆模板
						var a = hkzTemplate.clone(true);
						//加入闭包事件
						(function(){	
							var x = list[i];
							a.find("#txtDebtCode").text(x.debtCode);
							a.find("#txtPlatRate").html(parseFloat(parseFloat(x.loanRate+x.awardRate).toFixed(2)));
							a.find("#txtRemainPeriod").text(x.remainPeriod);
							a.find("#txtPlanPeriod").text(x.planPeriod);
							a.find("#txtReceivableMoeny").text(formatCurrency(x.receivableMoeny));
							a.find("#txtLink").attr({"href" : basePath + "/assets/plan?debtId=" + x.debtId + "&debtCode=" + x.debtCode});
						})();
						a.show();
						hkzTemplateList.append(a);
					}
					hkzPageNo = result.pageNo;
					hkzNextPage = result.nextPage;
					hkzTotalPages = result.totalPages;
					if(hkzTotalPages>1){
						if (hkzPageNo == hkzTotalPages) {
							$("#next_none_list1").show();
							$("#next_list1").hide();
						}
					}
					if (hkzPageNo < hkzTotalPages) {
						$("#next_list1").show();
						$("#next_none_list1").hide();
					}
				}else{
					$("#investDiv1").hide();
					$("#investNullDiv1").show();
				}
				$("#lodingDiv1").hide();
			}
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			
		}
	});
}
function initTbz(){
	// 获取放置模板的div
	var tbzTemplateList = $("#tbzTemplateList");
	$.ajax({
		url : tbzMap.url,
		type : tbzMap.type,
		dataType : tbzMap.dataType,
		data : tbzMap,
		cache : false,
		success : function(data) {
			var result = eval("("+data+")");
			if (result.success!=undefined&&!result.success) {
				Jalert(result.msg);
			} else {
				var list = result.result;
				if(list.length>0){
					for (var i in list) {
						// 克隆模板
						var a = tbzTemplate.clone(true);
						//加入闭包事件
						(function(){	
							var x = list[i];
							a.find("#txtLoanNo").text(x.loanNo);
							a.find("#txtPlatRate").html(parseFloat(parseFloat(x.platRate+x.awardRate).toFixed(2)));
							a.find("#txtPercent").text(x.percent);
							a.find("#txtLink").attr({"href" : basePath + "/invest/loan/" + x.loanId});
						})();
						a.show();
						tbzTemplateList.append(a);
					}
					tbzPageNo = result.pageNo;
					tbzNextPage = result.nextPage;
					tbzTotalPages = result.totalPages;
					if(tbzTotalPages>1){
						if (tbzPageNo == tbzTotalPages) {
							$("#next_none_list2").show();
							$("#next_list2").hide();
						}
					}
					if (tbzPageNo < tbzTotalPages) {
						$("#next_list2").show();
						$("#next_none_list2").hide();
					}
					
				}else{
					$("#investDiv2").hide();
					$("#investNullDiv2").show();
				}
				$("#lodingDiv2").hide();
			}
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			
		}
	});

}
function initYjq(){
	// 获取放置模板的div
	var yjqTemplateList = $("#yjqTemplateList");
	$.ajax({
		url : yjqMap.url,
		type : yjqMap.type,
		dataType : yjqMap.dataType,
		data : yjqMap,
		cache : false,
		success : function(data) {
			var result = eval("("+data+")");
			if (result.success!=undefined&&!result.success) {
				Jalert(result.msg);
			} else {
				var list = result.result;
				if(list.length>0){
					for (var i in list) {
						// 克隆模板
						var a = yjqTemplate.clone(true);
						//加入闭包事件
						(function(){	
							var x = list[i];
							a.find("#txtDebtCode").text(x.debtCode);
							a.find("#txtPlatRate").html(parseFloat(parseFloat(x.loanRate+x.awardRate).toFixed(2)));
							a.find("#txtActualIncome").text(formatCurrency(x.actualIncome));
							a.find("#txtInvestAmt").text(formatCurrency(x.buyPrice));
							a.find("#txtLink").attr({"href" : basePath + "/invest/loan/" + x.loanId});
						})();
						a.show();
						yjqTemplateList.append(a);
					}
					yjqPageNo = result.pageNo;
					yjqNextPage = result.nextPage;
					yjqTotalPages = result.totalPages;
					if(yjqTotalPages>1){
						if (yjqPageNo == yjqTotalPages) {
							$("#next_none_list3").show();
							$("#next_list3").hide();
						}
					}
					if (yjqPageNo < yjqTotalPages) {
						$("#next_list3").show();
						$("#next_none_list3").hide();
					}
				}else{
					$("#investDiv3").hide();
					$("#investNullDiv3").show();
				}
				$("#lodingDiv3").hide();
			}
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			
		}
	});
}