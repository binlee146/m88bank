var dudstr = 'uG1ot9iKd6sF0Jkl5';
var jsonurl= "/app";
var voicePhone='400-52278080';
$(function(){
	$(window).resize(function(){
	    resetHeight();
	});
	resetHeight();
})
/**1.* 样式操作*/
/*1.1 顶部菜单栏*/
function changeTopMenu(){
	  var _hidden=$("#topsubmenu").is(":hidden");
	  _hidden?$("#topsubmenu").show():$("#topsubmenu").hide();
}
/*1.2 初始化高度*/
/**主体最小高度=整体高度-头部-底部-额外*/
function resetHeight(){
  var wh=$(window).height();
  var fh=$(".g-footer").height();
  var th=$(".g-header").height();
  var eh=$(".g-extra").height();
  $(".g-mainer").css("min-height",(wh-th-fh-eh)+"px");
}
/*1.3 表单得到失去焦点*/
jQuery.Huifocusblur = function(obj) {
    $(obj).focus(function() {
        $(this).addClass("focus").removeClass("inputError");    
    });
    $(obj).blur(function() {
        $(this).removeClass("focus"); 
    });
};
$.Huifocusblur(".input-text,.textarea");
//1.3 formline2输入框聚焦事件
$(".formline2").each(function(){
  var _this=$(this);
  var _input=_this.find(".input-text");
  _input.focus(function() {
    _this.addClass("focus");    
  }).blur(function() {
    _this.removeClass("focus"); 
  });
})
//1.4 打开自定义弹窗
function openlayer(obj){
  $(".m-layer").hide();
  $(".md-layer").hide();
  $("body").css("overflow","hidden");
  $(obj).show();
  var wht=document.documentElement.clientHeight;
  var mt=(wht-$(obj).find(".bd").height())/2;
  $(obj).find(".bd").css("margin-top",mt);
}
//1.5 关闭自定义弹窗
function closelayer(){
	$("body").css("overflow","auto");
	$(".m-layer").hide();
	$(".md-layer").hide();
}
/**2.* 字节操作*/
//base64转换
//2.1 下面是64个基本的编码
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,  
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

//2.2 编码的方法
function base64encode(str){
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i == len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
//2.3 解码的方法
function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == -1);
        if (c1 == -1)
            break;
        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == -1);
        if (c2 == -1)
            break;
        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61)
                return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == -1);
        if (c3 == -1)
            break;
        out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61)
                return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == -1);
        if (c4 == -1)
            break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
//2.4 utf16to8
function utf16to8(str) {

    var out, i, len, c;
    out = "";
    len = str.length;

    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }

    return out;
}
//2.5 utf8to16
function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = str.length;
    i = 0;
    while (i < len) {
        c = str.charCodeAt(i++);
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += str.charAt(i - 1);
                break;
            case 12:
            case 13:
                // 110x xxxx　 10xx xxxx
                char2 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx　10xx xxxx　10xx xxxx
                char2 = str.charCodeAt(i++);
                char3 = str.charCodeAt(i++);
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}
//倒计时
var interval = 1000;
function ShowCountDown(daydtr, divname) {
    var now = new Date();
    var endDate = new Date(GetTimeByTimeStr(daydtr));
    var leftTime = endDate.getTime() - now.getTime();
    var leftsecond = parseInt(leftTime / 1000);
//var day1=parseInt(leftsecond/(24*60*60*6)); 
    var day1 = Math.floor(leftsecond / (60 * 60 * 24));
    var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
    var cc = document.getElementById(divname);
    if (day1 > 0)
        cc.innerHTML = "剩余时间:" + day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
    else
        cc.innerHTML = "剩余时间:0天"+ hour + "小时" + minute + "分" + second + "秒";
}
function ShowYFBtime(daydtr,divname)
{
    var now = new Date();
    var endDate = new Date(GetTimeByTimeStr(daydtr));
    var leftTime = endDate.getTime() - now.getTime();
    var leftsecond = parseInt(leftTime / 1000);
//var day1=parseInt(leftsecond/(24*60*60*6)); 
    var day1 = Math.floor(leftsecond / (60 * 60 * 24));
    var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
    var cc = document.getElementById(divname);
    if (leftsecond > 0)
        cc.innerHTML="<a>"+day1+"</a><font>天</font> <a>"+hour+"</a><font>时</font><a>"+minute+"</a><font>分</font><a>"+second+"</a><font>秒</font>"
        //cc.innerHTML = "剩余时间:" + day1 + "天" + hour + "小时" + minute + "分" + second + "秒";
    else
        cc.innerHTML = "<a>0</a><font>天</font> <a>0</a><font>时</font><a>0</a><font>分</font><a>0</a><font>秒</font>";

}
//2.6 反转字节
function fanzhuanzijie(str) {
	return str.split("").reverse().join("")
}
/**3.* 数字日期操作*/
//3.1 数字转换千分位
function format(num) {
    return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}
//3.2 字符转时间格式
function GetTimeByTimeStr(dateString) {
    var timeArr = dateString.split(" ");
    var d = timeArr[0].split("-");
    var t = timeArr[1].split(":");
    var newdate = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
    return newdate;
}
//3.3
function getISODate(d) {
    // padding function
    var s = function (a, b) {
        return (1e15 + a + "").slice(-b)
    };
    // default date parameter
    if (typeof d === 'undefined') {
        d = new Date();
    }
    ;
    // return ISO datetime
    return d.getFullYear() + s(d.getMonth() + 1, 2) + s(d.getDate(), 2);
}
/*3.4 将数值四舍五入(保留2位小数)后格式化成金额形式*/
function formatCurrency(num,flag) {
    var argNum = arguments.length;
    flag = argNum >= 2 ? flag : true;
    if (num == null) {
        return flag?"0.00元":"0元";
    }
    if (num == "--") {
        return flag?"0.00元":"0元";
    }
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ','
                + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num+(flag?( '.' + cents):''));
}
/*3.5 格式化日期*/
var formatDate = function(time, format){
    var t = new Date(time);
    var tf = function(i){return (i < 10 ? '0' : '') + i};
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
        switch(a){
            case 'yyyy':
                return tf(t.getFullYear());
                break;
            case 'MM':
                return tf(t.getMonth() + 1);
                break;
            case 'mm':
                return tf(t.getMinutes());
                break;
            case 'dd':
                return tf(t.getDate());
                break;
            case 'HH':
                return tf(t.getHours());
                break;
            case 'ss':
                return tf(t.getSeconds());
                break;
        }
    })
};
/**4.* str加解密*/
//4.1 str加密
function str_to_num(str) {
    num_out = "";
    str_in = escape(str);
    for (i = 0; i < str_in.length; i++) {
        num_out += str_in.charCodeAt(i) - 23;
    }
    return num_out;
}
//4.2 str解密
function num_to_str(str) {
    var str_out = "";
    var num_in = "";
    var num_out = str;
    for (i = 0; i < num_out.length; i += 2) {
        num_in = parseInt(num_out.substr(i, [2])) + 23;
        num_in = unescape('%' + num_in.toString(16));
        str_out += num_in;
    }
    return unescape(str_out);
}
/**5.* cookies*/
//5.1 读取cookies
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
  } else {
      return null;
  }
}
//5.2 写入cookies（默认时间为1天）
function setCookie(name, value) {
  var exp = new Date();
  var Days=arguments[2]==undefined?1:arguments[2];
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//5.3 清除cookie  
function clearCookie(name) {  
  var exp = new Date();
  exp.setTime(exp.getTime() - 10000);
  document.cookie = name + "=" + escape("") + ";expires=" + exp.toGMTString();
}
/**6.* 函数封装*/
/*6.1 ajax封装*/
jQuery.call=function(url, jsonstr, successfn) {			
	var data =null;
	if(jsonstr==null|| jsonstr=="" || typeof(jsonstr)=="undefined"){
		data=null;	
	}else if(typeof(jsonstr)=="string"){
		data={"sign": fanzhuanzijie(base64encode(utf16to8(jsonstr)) + dudstr)};
	}else if(typeof(jsonstr)=="object"){//json对象
		data={"sign": fanzhuanzijie(base64encode(utf16to8(JSON.stringify(jsonstr))) + dudstr)};
	}
	$.ajax({
            type: "post",
            url: jsonurl+url,
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "callback",
            success: function (json) { 
            	
            if (json.code == "000002")
              location.href =basePath+"/secure/login";
             else
              successfn(json);
              
            }
     });
};
//6.2 取url参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
 }
//6.3 获取滚动条当前的位置
function getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
    }
    else if (document.body) {
        scrollTop = document.body.scrollTop;
    }
    return scrollTop;
}
//屏幕zoom
function zoom_view(w) {

    if (w == undefined) w = 640;
    var _w, _zoom, _hd, _orientationChange, _doc = document,
        __style = _doc.getElementById("_zoom");
    __style || (_hd = _doc.getElementsByTagName("head")[0], __style = _doc.createElement("style"), _hd.appendCHild(_style)),
        _orientationChange = function () {
            _w = _doc.documentElement.clientWidth || _doc.body.clientWidth,
                _zoom = _w / w,
                __style.innerHTML = ".zoom {zoom:" + _zoom + ";"
                    + "-moz-transform:scale(" + _zoom + ");"
                    + "-moz-transform-origin:top left; margin-left:0;"
                    + "-webkit-text-size-adjust:auto!important; text-size-adjust:auto!important;}"
        },
        _orientationChange(),
        window.addEventListener("resize", _orientationChange, !1);
    //alert(_orientationChange);
}

//6.4 获取当前可是范围的高度
function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
    }
    else {
        clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
    }
    return clientHeight;
}
//显隐栏目 - 1.触发选择器 2.对应的要显隐的选择器 3.触发事件（1为点击，2为鼠标滑过，3为无事件）
function SHfrm(tri, ope, func) {
    var tri = $(tri);
    var ope = $(ope);
    var func = func;
    if (tri[0] && ope[0]) {
        var tri_label = tri[0].tagName;
        var ope_label = ope[0].tagName;

        function action() {
            tri.addClass('cur');
            tri.siblings(tri_label).removeClass('cur');
            ope.css('display', 'block');
            ope.siblings(ope_label).css('display', 'none');
            tri.parent(ope_label).css('display', 'block');
        }

        if (func == 1) {
            tri.click(function () {
                action();
            })
        } else if (func == 2) {
            tri.hover(function () {
                action();
            })
        } else {
            return false;
        }
    }
}

//6.5 获取文档完整的高度
function getScrollHeight() {
    return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}
//7.1 设置秒数跳转count:秒数,id秒数的id,需要跳转的链接
function jumps(count, id, link) {
    window.setTimeout(function () {
        count--;
        if (count > 0) {
            $(id).html(count);
            jumps(count, id, link);
        } else {
            location.href = link;
        }
    }, 1000);
}
/**8 校验*/
//8.1 正则验证银行卡方法
function jyyhk(content) {
    var regex = /^\d{16}|\d{19}$/;
    if (regex.test(content)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 日期转换成字符串
 *
 * @param {}
 *            x
 * @param {}
 *            y
 * @return {}
 */
function dateStr(x, y) {
    var z = {
        M : x.getMonth() + 1,
        d : x.getDate(),
        h : x.getHours(),
        m : x.getMinutes(),
        s : x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
                return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
                        .slice(-2);
            });
    return y.replace(/(y+)/g, function(v) {
                return x.getFullYear().toString().slice(-v.length);
            });
}

/**
 * 格式化日期
 *
 * @param {}
 *            date
 * @param {}
 *            mart
 * @return {}
 */
function formartDate(date, mart) {
    if (date == "--") {
        return date;
    } else {
        return dateStr(new Date(date), mart);
    }
}

function formarAmt(num,flag){
	var argNum = arguments.length;
	flag = argNum >= 2 ? flag : true;
	return new Number(num).toFixed(flag?2:0);
}

function setSpreadCookie(value) {
	var c_name = "SP_NUM";
	var exdate = new Date();
	exdate.setDate(exdate.getTime() + 1000*365*24*60*60);
	document.cookie = c_name + "=" + escape(value) + ";expires=" + exdate.toGMTString();
}

function getSpreadCookie() {
	var c_name = "SP_NUM";
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

//日期比较
function comptime(strtime,num) {
    var beginTime = strtime;
    var endTime = "2009-09-21 00:00:00";
    var beginTimes = beginTime.substring(0, 10).split('-');
    var endTimes = endTime.substring(0, 10).split('-');

    beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
    if (beginTimes[0] == "2015") {
        if(Number(num)==1){
	        if (beginTimes[1] == "04") {
	            if (Number(beginTimes[2]) >= 12) {
	                return true;
	            }
	        }
	        else if (beginTimes[1] == "05") {
	            if (Number(beginTimes[2]) <= 31) {
	                return true;
	            }
	        }
	        else
	        {
	            return false;
	        }
	    }
	    else
	    {
	        if (Number(beginTimes[1]) <= 9) {
	            if (Number(beginTimes[2]) <= 30) {
	                return true;
	            }
	        }
	        else
	        {
	            return false;
	        }
	    }
    }
}



/**
 * 消息提示框
 */
function Jmsg(txt,_callBack){
	var argNum = arguments.length;
	layer.open({
	    content: txt,
	    time: 3,
	    end : argNum>=2?_callBack:function() {
		}
	});
}
/**
 * 页面引入框
 */
function Jcontent(_obj,_callBack){
	var argNum = arguments.length;
	layer.open({
	    type: 1,
	    content: _obj,
	    style: 'width:500px;height:800px;',
	    end : argNum>=2?_callBack:function() {
		}
	});
}
/**
 * 弹出框
 */
function Jalert(txt,_callBack){
	var argNum = arguments.length;
	layer.open({
	    content: txt,
	    btn: ['确定'],
		end : argNum>=2?_callBack:function() {
		}
	});
}
/**
 * 确认继续操作
 */
function Jconfirm(txt,_callBack){
	var argNum = arguments.length;
	layer.open({
	    content: txt,
	    btn: ['确定','取消'],
	    yes: argNum>=2?_callBack:function() {
		}
	});
}

/**
 * 加载提示信息
 * @param text
 * @param _callBack
 */
var loadIndex;
function Jload(_callBack){
	var argNum = arguments.length;
	loadIndex = layer.open({
			type : 2,
			end : argNum>=1?_callBack:function() {
			}
		});
	return loadIndex;
};


/**
 * 描述：点击click事件提交表单，跳转页面，兼容所有的浏览器
 * 
 * @param url
 *            链接的URL
 * @param jsonObj
 *            参数对象json ｛"a":b,"c":d,"d":[数组]｝
 */
function hrefToBlank(url, jsonObj) {
	var fid = "form_open_win", obj = $("#" + fid);
	if (obj && obj != null) {
		obj.remove();
	}
	var form = null;
	try {
		form = document.createElement("<form></form>");
	} catch (e) {
	}
	if (form == null) {
		form = document.createElement("form");
	}
	$("body").append(form);
	obj = $(form);
	obj.hide();
	var tj = null;
	$.each(jsonObj, function(key, val) {
		tj = jsonObj[key];
		if (tj instanceof Array) {
			$.each(tj, function(i, value) {
						var tempClone = null;
						try {
							tempClone = document.createElement("<input type='checkbox' name='" + key + "' />");
						} catch (e) {
						}
						if (tempClone == null) {
							tempClone = document.createElement("input");
							tempClone.type = "checkbox";
						}
						$(tempClone).attr({
									"checked" : true,
									"id" : Math.random(),
									"name" : key
								}).val(value);
						obj.append(tempClone);
					});
		} else {
			var tempClone = null;
			try {
				tempClone = document.createElement("<input type='text' name='"
						+ key + "' />");
			} catch (e) {
			}
			if (tempClone == null) {
				tempClone = document.createElement("input");
				tempClone.type = "text";
			}
			$(tempClone).attr({
						"id" : Math.random(),
						"name" : key
					}).val(val);
			obj.append(tempClone);
		}
	});
	url = url && url != null ? url : '/';
	var method = jsonObj.method;
	method = method && method != '' ? method : "post";
	obj.attr({
				"action" : url,
				"method" : method,
				"id" : fid
			}).submit();
}