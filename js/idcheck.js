/**1.2 身份证号码验证 */
function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i]<'0'||varArray[i]>'9')&&(i!= 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
/**
 * 判断是否为“YYYYMMDD”式的时期
 *
 */
function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year<1700||year>2500) return false;
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month<1||month>12) return false;
    if (day<1||day>iaMonthDays[month - 1]) return false;
    return true;
}
/** 
 * 判断是否为“YYYYMM”式的时期 
 * 
 */  
function isDate6(sDate) {  
   if(!/^[0-9]{6}$/.test(sDate)) {  
      return false;  
   }  
   var year, month, day;  
   year ="19"+sDate.substring(0, 2);  
   month = sDate.substring(2, 4);  
   day=sDate.substring(4, 6); 
   if (year<1700||year>2500) return false; 
   if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;  
   if (month < 1||month>12) return false;  
   if (day < 1 ||day>aMonthDays[month - 1]) return false;  
   return true;  
} 
/*1.3 检查是否成人*/
function chk18(idcard) {
    var intStrLen = idcard.length;
    var year, month, day;
    if (intStrLen == 18) {
        //check date
        var date8 = idcard.substring(6, 14);
        year = Number(date8.substring(0, 4));
        month = Number(date8.substring(4, 6));
        day = Number(date8.substring(6, 8));
    }
    else if (intStrLen == 15) {        //length is 15
        //check date
        var date6 = idcard.substring(6, 12);
        year = Number("19" + date6.substring(0, 2));
        month = Number(date6.substring(2, 4));
        day = Number(date6.substring(4, 6));
    } else {
        return false;
    }

    var nDate = new Date();
    var n_year = nDate.getFullYear();
    var n_month = nDate.getMonth() + 1;
    var n_day = nDate.getDate();
    if (n_year - year < 18) {
        return false;
    } else if (n_year - year == 18) {
        if (n_month < month) {
            return false;
        } else if (n_month == month) {
            if (n_day < day) return false;
        }
    }
    return true;
}