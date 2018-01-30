$(document).ready(function (){
require([] ,function (){

//tip 测试
// test();
// function test(){
// 	require(['/js/plugin/tip/tip.js'],function(tip){
// 		tip.tip($("#license_manage") ,{});
// 	});
// }

license_info_get();

event_init();

function event_init() 
{
	$("#upload_btn").click(function(){
		license_upload_init();
	});
}

function license_info_get(){
	um_ajax_get({
		url : "licInfo/showLicInfo",
		successCallBack : function (data){
			$("#base_form").umDataBind("render" ,data);
		}
	});
}


function license_upload_init() 
{
	$.ajax({
		url : "/module/sys_manage/sys_base_config/license_manage_tpl.html",
		success : function (data) 
		{
			g_dialog.dialog($(data).find("#upload_template") ,{
				width : "600px",
				title : "上传License文件",
				init : init,
				saveclick : saveclick
			});
			function init(el) 
			{
				index_create_upload_el($("#upload_div"));
			}
			function saveclick (el ,saveObj) 
			{
				var v = g_validate.fileSuffixLimit($("#upload_div").val() ,"lic" ,true ,false);
				if (!v.flag) 
				{
					g_validate.setError($("#upload_div") ,v.msg);
					return false;
				}

				var form = el.find("[id=update_form]");
				um_ajax_file(form ,{
					url : "",
					paramObj: saveObj,
					maskObj : el.closest("[data-id*=umDialog]"),
					successCallBack : function (data){
						g_dialog.hide(el);
						g_dialog.operateAlert(null, "上传成功！");
						// os_type_list({paramObj:null,isLoad:true,maskObj:"body"});
					}
				});
			}
		}
	});
}


});
});