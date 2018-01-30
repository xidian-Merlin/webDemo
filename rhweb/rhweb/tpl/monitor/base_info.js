$(document).ready(function(){
$.ajax({
	type : "GET",
	url : "tpl/monitor/base_info_tpl.html",
	success : function (data) 
	{
		$("[data-id="+$("[data-id=temp_name]").val()+"]").append(data);
	}
});
});