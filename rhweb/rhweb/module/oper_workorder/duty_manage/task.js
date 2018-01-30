$(document).ready(function (){


var index_list_url = "AttendanceBulletin/queryAttendanceBulletin";

var index_list_col_header = [
							  {text:'任务描述',name:"desc"},
							  {text:'创建人',name:"creatorName"},
							  {text:'创建时间',name:"date"}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];

var task_create_url = "AttendanceBulletin/addAttendanceBulletin";

var task_delete_url = "AttendanceBulletin/delBatch";

event_init();

task_list({paramObj:null,isLoad:true,maskObj:"body"});

function event_init()
{
	// 批量删除按钮点击事件
	$("#delete_btn").click(function (){
		batch_delete_btn_init();
	});

	// 新增按钮点击事件
	$("#add_btn").click(function (){
		add_template_init();
	});
}

function task_list(option)
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"80px",
		 url:index_list_url,
		 paramObj : {abType:2},
		 isLoad : option.isLoad,
		 hideSearch : true,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url:task_delete_url,
				paramObj:{ids : rowData.id},
				successCallBack:function(data){
					g_dialog.operateAlert(null ,"删除成功！");
					task_list({paramObj:null,isLoad:true,maskObj:$("#table_div")});
				}
			});
		}
	});
}

function batch_delete_btn_init(rowData)
{
	var dataArray = g_grid.getData($("#table_div") ,{chk : true});

	if(dataArray.length === 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var data = g_grid.getData($("#table_div") ,{chk:true});

	var tmp=[];
	for (var i = 0; i < data.length; i++) {
		tmp.push(data[i].id);
	}

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : task_delete_url,
				paramObj : {ids : tmp.join(",")},
				successCallBack : function(data){
					task_list({paramObj:null,isLoad:true,maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}


function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/task_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width : "500px",
				init : init,
				title : "任务提醒查看",
				isDetail : true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);		
	}
}

function add_template_init()
{
	$.ajax({
		type: "GET",
		url: "module/oper_workorder/duty_manage/task_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=add_template]"),{
				width:"500px",
				title:"提醒添加",
				saveclick:save_click
			});
		}
	});

	function save_click(el ,saveObj)
	{
		if (!g_validate.validate(el.find("#add_template")))
		{
			return false;
		}

		else
		{
			saveObj.abType = 2;
		    um_ajax_get({
				url : task_create_url,
				paramObj : saveObj,
				maskObj:el,
				successCallBack : function (data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"操作成功!");
					task_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}
	}
}


});