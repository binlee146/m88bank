var map, trTemplate = null, trPageNo = 0, trNextPage = 0, trTotalPages = 0;
//初始化分页
$(function() {
	if (trTemplate == null) {
		// 获取html模板
		trTemplate = $("#trTemplate");
		// 设置map参数
		map = {
			url : basePath + "/invest/recoreds",
			pageSize : 10,
			loanId : $("#loanId").val(),
			dataType : "JSON",
			type : "POST"
		};
	}
	initEvent();
});
function initEvent(){
	$("#mainer").slide({titCell:".m-navtab li",mainCell:".projectdesc",effect:"left",trigger:"click"});// 选项卡切换
	init();
}
function initNextData(){
	map.pageNo = trNextPage;
	init();
}
//加载分页数据
function init() {
	// 获取放置模板的div
	var templateList = $("#templateList");
	// 清空div中的内容
	$.ajax({
		url : map.url,
		type : map.type,
		dataType : map.dataType,
		data : map,
		async : false,
		cache : false,
		data : map,
		success : function(data) {
			var result = eval("(" + data + ")");
			if (result.success != undefined && !result.success) {
				layer.alert(data.msg, 8);
			} else {
				var list = result.result;
				for ( var i in list) {
					// 克隆模板
					var a = trTemplate.clone(true);
					// 加入闭包事件
					(function() {
						var x = list[i];
						a.find("#txtUserName").text(x.userLoginName);
						a.find("#txtInvestAmt").text(formatCurrency(x.investAmt));
						a.find("#txtInvestTime").text(formartDate(x.investTime, "yyyy-MM-dd hh:mm"));
					})();
					a.show();
					templateList.append(a);
				}
				// 得到总条数
				totalCount = result.count;
			}
			trPageNo = result.pageNo;
			trNextPage = result.nextPage;
			trTotalPages = result.totalPages;
			if (trPageNo == trTotalPages) {
				$("#next_list").hide();
			}
			if (trPageNo < trTotalPages) {
				$("#next_list").show();
			}
		}
	});
}