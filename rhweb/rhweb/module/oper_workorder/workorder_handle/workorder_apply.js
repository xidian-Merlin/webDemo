$(document).ready(function (){

$("[class*=workorder-div]").click(function (){
	window.location.href = "#/oper_workorder/workorder_handle/workorder_detail?id="+$(this).attr("data-url");
});


});