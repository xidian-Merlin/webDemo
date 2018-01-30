$(document).ready(function (){


var urlParamObj = index_query_param_get();

view_init();

function view_init()
{
	$.ajax({
				type: "GET",
				url: "tpl/workorder/"+urlParamObj.id+".html",
				success :function(data)
				{
					$("#workorder_template").html(data);
				}
		});
}


});