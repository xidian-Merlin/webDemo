$(document).ready(function (){


var log_query_list_url = "logaudit/queryLogAuditData";

var log_query_list_col_header = [
					{text : "操作用户" ,name : "psnid",searchRender:function (el){
						var searchEl = $('<select class="form-control input-sm" search-data="psnid"></select>');
						el.append(searchEl);
						g_formel.code_list_render({
							key : "allUserList",
							userListEl : searchEl
						});
					}},
					{text : "用户操作" ,name : "loginfoOperation"},
					{text : "操作模块" ,name : "loginfoModule"},
					{text : "操作时间" ,name : "loginfoTime",searchRender:function (el){
						index_render_div(el ,{type:"date",startKey:"enterStartDate" ,endKey:"enterEndDate"});
					}},
					{text : "来源IP" ,name : "loginfoIP"},
					{text : "操作结果" ,name : "loginfoResult",render:function(text){
					  	if (text == 1)
					  	{
				  			return '成功';
				  		}
				  		else if (text == 0)
				  		{
							return '失败';
				  		}
				  		else
				  		{
				  		 	return '';
				  		}
					},searchRender:function (el){
						var data = [
										{text:"----" ,id:"-1"},
				  						{text:"成功" ,id:"1"},
				  						{text:"失败" ,id:"0"}
							  		];
						g_formel.select_render(el ,{
							data : data,
							name : "loginfoResult"
						});
					}}
					];

var log_query_list_col_oper = [
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick :index_list_delete }
	   			  ];

var log_query_delete_url = "logaudit/delBatchLogRecord";

var file_export_url = "logaudit/exportLogAudit";

var current_header = [];

event_init(); 

index_list_get({paramObj : null ,isLoad : true ,maskObj : "body"});

function event_init()
{
	
	$("#export_btn").click(function (){
		export_template_init();
	});

	$("#remove_btn").click(function (){
		log_query_Batch_delete();
	});
}

function index_list_get(option)
{
	g_grid.render($("#table_div") ,{
 		header : log_query_list_col_header,
 		oper : log_query_list_col_oper,
 		operWidth : "80px",
 		url : log_query_list_url,
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj,
 		cbf : function (){
 			var queryObj = $("[class=um-grid-search-tr]").umDataBind("serialize" ,"search-data");
 			$("#table_div").children().data("queryObj" ,queryObj);
 		}
	});
}

function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : log_query_delete_url,
				paramObj : {ids : rowData.loginfoid},
				successCallBack : function(data){
					index_list_get({maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function log_query_Batch_delete()
{
	var dataArray = g_grid.getData($("#table_div") ,{chk : true});

	if(dataArray.length === 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	var data = g_grid.getData($("#table_div") ,{chk:true});

	var tmp=[];
	for (var i = 0; i < data.length; i++) {
		tmp.push(data[i].loginfoid);
	}

	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : log_query_delete_url,
				paramObj : {ids:tmp.join(",")},
				successCallBack : function(data){
					index_list_get({maskObj : $("#table_div")});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function export_template_init(rowData)
{
	var obj = new Object();
	for (var i = 0; i < current_header.length; i++)
	{
		obj[current_header[i].substr(0 ,current_header[i].length-3)] = 1;
	}
	var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"loginfoid"});
	var data = $("#table_div").children().data("queryObj");
	if (data)
	{
		data = JsonTools.encode(data);
	}
	window.location.href = index_web_app + "logaudit/exportLogAudit?data="+data+"&loginfoid="+idArray.join(",");
}

});