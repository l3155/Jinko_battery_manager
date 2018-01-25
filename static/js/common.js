var BASE_URL='http://localhost/BatteryManager';
Date.prototype.Format = function (fmt) { 
	var o = {  
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "H+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };  
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
    for (var k in o)  
    	if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
    return fmt;  
}  
function getDate(offset){
	var curDate=new Date();
	return new Date(curDate.getTime()-offset*24*60*60*1000);
}
function compareDate(start,end){
    return new Date(start+':00:00') >= new Date(end+':00:00');
}
function makeDivHeight(id,offset){
  var mainHeight=$(window).height()-offset+"px";
  $(id).css("height",mainHeight);
}