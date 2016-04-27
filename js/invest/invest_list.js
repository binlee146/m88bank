//初始化参数
var tbMap, tbTemplate = null, tbPageNo = 0, tbNextPage = 0, tbTotalPages = 0;
var zqMap, zqTemplate = null, zqPageNo = 0, zqNextPage = 0, zqTotalPages = 0;
var type = 0;
/**
 * 页面初始化执行函数
 */
$(function(){
	if (tbTemplate == null || zqTemplate == null) {
		// 获取html模板
		tbTemplate = $("#tbTemplate");
		zqTemplate = $("#zqTemplate");
		// 设置map参数
		tbMap = {
			url : basePath + "/invest/loanpages",
			pageSize : 5,
			isAll : '0',
			dataType : "JSON",
			type : "POST"
		};
		zqMap = {
			url : basePath + "/invest/transferpages",
			pageSize : 5,
			dataType : "JSON",
			type : "POST"
		};
	}
	$("#lodingDiv").show();
	type = Number($.trim($("#type").val()));
	init(type);
	$('#next_list').click(function() {
		$("#lodingDiv").show();
		$("#next_list").hide();
		if(type==0){
			tbMap.pageNo = tbNextPage;
		}else{
			zqMap.pageNo = zqNextPage;
		}
		init(type);
	});
});
/**
 * 初始化数据
 */
function init(type){
	$("#tbPage,#zqPage").hide();
	if(type==0){
		// 获取放置模板的div
		var tbTemplateList = $("#tbTemplateList");
		$.ajax({
			url : tbMap.url,
			type : tbMap.type,
			dataType : tbMap.dataType,
			data : tbMap,
			cache : false,
			success : function(data) {
				var result = eval("("+data+")");
				if (result.success!=undefined&&!result.success) {
					Jalert(result.msg);
				} else {
					var list = result.result;
						for (var i in list) {
							// 克隆模板
							var a = tbTemplate.clone(true);
							//加入闭包事件
							(function(){	
								var x = list[i];
								if(x.actLoanAwardDtlVo!=null&&x.actLoanAwardDtlVo!=''){
									a.find("#txtPlatRate").html(parseFloat(x.platRate)+"+"+parseFloat(x.actLoanAwardDtlVo.awardRate));
									if (x.actLoanAwardDtlVo.logoName.indexOf("加息") >= 0){
										a.find("#txtAwardImg").attr("src",basePath+"/images/bid/label_jiaxi.png").show();
									} else if (x.actLoanAwardDtlVo.logoName.indexOf("新手") >= 0){
										a.find("#txtAwardImg").attr("src",basePath+"/images/bid/label_newer.png").show();
									}else if (x.actLoanAwardDtlVo.logoName.indexOf("专享") >= 0){
										a.find("#txtAwardImg").attr("src",basePath+"/images/bid/label_zhuanxiang.png").show();
									}else{
										a.find("#txtAwardImg").attr("src",basePath+"/images/bid/label_jiaxi.png").show();
									}
								}else{
									a.find("#txtPlatRate").html(parseFloat(x.platRate));
								}
								a.find("#txtProductName").text(x.productName);
								a.find("#txtLoanNo").text(x.loanNo);
								a.find("#txtLoanPeriod").text(x.loanPeriod);
								a.find("#txtLoanPeriodUnit").text(x.loanPeriodUnitStr);
								a.find("#txtOrgName").attr("title",x.abbreviation).text(x.abbreviation||'');
								a.find("#txtOrgImg").attr("src",x.orgMinLogo||'');
								if (x.loanStatus == "2") {
									a.find("#txtInvestAmt").text(formatCurrency(parseFloat(x.loanAmt-x.investAmt)));
								}else{
									if(x.loanStatus != "1"){
										a.find("#txtInvestAmtDiv1,#txtInvestAmtDiv2").html('');
									}
								} 
								if (x.loanStatus == "1") {
									a.find("#txtInvestAmt").html("<i class='iconfont'>&#xe62f;</i>"+formartDate(x.releaseTime,"MM月dd日 hh:mm")+"开抢");
									a.find("#txtInvestAmtDiv1").html("<div class='clockinfo'>"+a.find("#txtInvestAmt").html()+"</div>");
									a.find("#txtInvestAmtDiv2").remove();
								} else if (x.loanStatus == "3") {
									a.find("#txtLoanStatusImg").html('<i class="status3"></i>');
								} else if (x.loanStatus == "9") {
									a.find("#txtLoanStatusImg").html('<i class="status2"></i>');
								} else if (x.loanStatus == "5") {
									a.find("#txtLoanStatusImg").html('<i class="status4"></i>');
								} else if (x.loanStatus == "6" || x.loanStatus == "7") {
									a.find("#txtLoanStatusImg").html('<i class="status5"></i>');
								}else if(x.loanStatus == "3.5"){
									a.find("#txtLoanStatusImg").html('<i class="status6"></i>');
								}
								a.find("#txtLink").attr({"href":basePath+"/invest/loan/"+x.loanId});
							})();
							a.show();
							tbTemplateList.append(a);
						}
						tbPageNo = result.pageNo;
						tbNextPage = result.nextPage;
						tbTotalPages = result.totalPages;
						if (tbPageNo == tbTotalPages) {
							$("#next_none_list").show();
							$("#next_list").hide();
						}
						if (tbPageNo < tbTotalPages) {
							$("#next_list").show();
							$("#next_none_list").hide();
						}
						$("#lodingDiv").hide();
						$("#currentDiv").show();
				}
			},error:function(XMLHttpRequest, textStatus, errorThrown){
				
			}
		});
	}else{
		var zqTemplateList = $("#zqTemplateList");
		$.ajax({
			url:zqMap.url,
			type:zqMap.type,
			dataType : zqMap.dataType,
			data : zqMap,
			//async:false,
			cache : false,
			success:function(data){
				var result = $.parseJSON(data);
				$.each(result.result,function(i,obj){
					var template=zqTemplate.clone(true);
					template.find("#txtProductName").text(obj.productName);
					template.find("#txtLoanNo").text(obj.loanNo);
					template.find("#txtLoanPeriod").text(obj.remainPeriod);
					template.find("#txtLoanPeriodUnit").text(obj.loanPeriodUnitStr);
					template.find("#txtPlatRate").html(parseFloat(obj.loanRate));
					if(obj.discountScale>0){
						template.find('#txtDiscountScale').text(obj.discountScale*100||'0');
					}else{
						template.find('#txtDiscountScaleDiv').hide();
					}
					template.find('#txtTransferPrice').text(formatCurrency(obj.transferPrice)||'0.00');
					template.find('#txtLink').attr({"href":basePath+"/invest/transfer/"+obj.transferApplyId});
					if(obj.applyStatus=="3"){
						template.find('#txtApplyStatusImg').html('<i class="status7"></i>');
						template.find("#txtInvestAmtDiv1,#txtInvestAmtDiv2").html('');
					}
					template.show();
					zqTemplateList.append(template);
				});
				zqPageNo = result.pageNo;
				zqNextPage = result.nextPage;
				zqTotalPages = result.totalPages;
				if (zqPageNo == zqTotalPages) {
					$("#next_none_list").show();
					$("#next_list").hide();
				}
				if (zqPageNo < zqTotalPages) {
					$("#next_list").show();
					$("#next_none_list").hide();
				}
				$("#lodingDiv").hide();
			}
		});
	} 
	
}


