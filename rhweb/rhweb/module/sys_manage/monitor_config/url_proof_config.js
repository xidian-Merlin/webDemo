$(document).ready(function (){
require(['/js/plugin/urltoken/urltoken.js'] ,function (urltoken){


view_init();

event_init();

function view_init()
{
	urltoken.list($("#table_div"));
}

function event_init()
{
	$("#add_btn").click(function (){
		urltoken.dialogEdit({});
	});
}


})
});