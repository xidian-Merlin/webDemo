$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tab/tab.js',
		 'js/plugin/workorder/workorder.js'] ,function (inputdrop ,tab,workorder){

var index_list_url = "monitorEventIgnore/queryStrategyList";

var index_list_col_header = [
							  {text:'策略名称',name:"eipName"},
							  {text:'策略状态',name:"eipStatusName" ,searchRender:function (el){
									var data = [
													{text:"----" ,id:"-1"},
							  						{text:"启用" ,id:"1"},
							  						{text:"停用" ,id:"0"}
										  		];
									g_formel.select_render(el ,{
										data : data,
										name : "eipStatus"
									});
								}},
							  {text:'日志发生源设备类型',name:"eventTypeName"},
							  {text:'样本名称',name:"createUser"},
							  {text:'关键字(字典表)',name:"enterDate"},
							  {text:'关键字(自定义)',name:""},
							  {text:'生成的事件名称',name:"",hideSearch:true}
							];
var index_list_col_oper = [
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
			   			  ];
var add_url = "";
var update_url = "";
var delete_url = "";

event_init();

alarm_event_policy_list();

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});

	//批量删除
	$("#delete_btn").click(function (){
		index_list_batch_delete();
	});
}

function alarm_event_policy_list()
{
	g_grid.render($("#table_div"),{
		 header:index_list_col_header,
		 oper: index_list_col_oper,
		 operWidth:"100px",
		 url:index_list_url,
		 isLoad : true,
		 maskObj : "body",
		 dbClick:list_detail
	});
}

function list_detail(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/policy_manage/alarm_event_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]"),{
				width:"500px",
				init:init,
				top:"5%",
				title:"日志报警事件策略详细信息",
				isDetail:true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render",rowData);
	}
}
function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function (){
			um_ajax_post({
				url : delete_url,
				paramObj : {eipId: rowData.eipId},
				successCallBack : function(data){
					alarm_event_policy_list();
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}
//批量删除
function index_list_batch_delete()
{
	var idArray  = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"eipId"})

	if(idArray.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var ids = idArray.join(",");

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : delete_url,
				paramObj : {eipId : ids},
				successCallBack : function(data){
					alarm_event_policy_list();
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "日志报警事件策略修改" : "日志报警事件策略添加";
	$.ajax({
		type: "GET",
		url: "module/policy_manage/alarm_event_policy_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]"),{
				width:"500px",
				top:"2%",
				init:init,
				saveclick:save_click,
				title:title
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		el.find("[name=keySource]").click(function(){
			var tmp = $(this).val();
			if(tmp == "1")
			{
				el.find("[data-id=dictionaryTable]").removeAttr("disabled");
				el.find("[data-id=custom]").attr("disabled","disabled");
			}
			else
			{
				el.find("[data-id=dictionaryTable]").attr("disabled","disabled");
				el.find("[data-id=custom]").removeAttr("disabled");
			}
		});

		if(rowData)
		{
			el.umDataBind("render",rowData);
			el.find("[name=keySource][value="+rowData.keySource+"]").click();
			el.find("select").trigger("change");
		}
		
	}

	function save_click(el,saveObj)
	{
		if(!g_validate.validate(el))
		{
			return false;
		}
		var url = add_url;
		if(rowData)
		{
			url = update_url;
		}
		um_ajax_post({
			url:url,
			paramObj:saveObj,
			isLoad :true,
			maskObj:"body",
			successCallBack:function(data){
				g_dialog.hide(el);
				g_dialog.operateAlert(null ,"操作成功！");
				alarm_event_policy_list();
			}
		});
	}	
}
});
});