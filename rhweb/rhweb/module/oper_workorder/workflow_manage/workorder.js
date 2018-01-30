$(document).ready(function (){
require(['/js/plugin/tab/tab.js',
		'js/plugin/workorder/workorder.js'] ,function (tab,workorder){

var list_url = "WorkOrderMonitorController/queryWorkOrderData";

var list_col_header = [
						  {text:'工单名称',name:"processInstanceName"},
						  {text:'工单编号',name:"procCode"},
						  {text:'模板名称',name:"processTemplateName"},
						  {text:'工单申请人',name:"processInstanceCreator",searchRender:function(el){
								um_ajax_get({
									url:"workflow/queryUserCodeList",
									paramObj:{status : "2"},
									isLoad : false,
									successCallBack : function(data){
										var buffer = [];
										for (var i = 0; i < data.length; i++) {
											buffer.push({text:data[i].codename ,id:data[i].codevalue});
										}
										buffer.insert(0 ,{id:"-1" ,text:"---"});
										g_formel.select_render(el ,{data:buffer,name:"processInstanceCreator"});
									}
								});
						  }},
						  {text:'工单状态',name:"workOrderStatus",render:function(tdTxt,rowData){
						  	if(rowData.workOrderStatus == "1") 
						  	{
						  		return "已完成";
						  	}
						  	else if(rowData.workOrderStatus == "2") 
						  	{
						  		return "未完成";
						  	}
						  },searchRender:function(el){
						  	var data = [{text:"---",id:"-1"},
						  				{text:"已完成" ,id:"1"},
										{text:"未完成" ,id:"2"}];
							g_formel.select_render(el ,{
														data:data,
														name:"workOrderStatus"
													});
						  }},
						  {text:'创建时间',name:"createTime",searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startCreateTime",
								endKey : "endCreateTime"
							});
						  }},
						  {text:'完成时间',name:"completeTime",searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startCompleteTime",
								endKey : "endCompleteTime"
							});
						  }},
						  {text:'当前节点',name:"currentNodeName",hideSearch:true},
						  {text:'',name:"",width:"4",hideSearch:"hide",render:function(tdTxt,rowData){
						  	var idName = rowData.processTemplateName.split("_")[1];
							if(idName.indexOf("(")>0)
							{
								idName = idName.split("(")[0];	
							}
						  	if(rowData.caseStatus == "1")
						  	{
						  		return '<i class="icon-hand-up" title="已生成案例" style="margin-right:35px;color:green"></i>';
						  	}
						  	else if((rowData.caseStatus == "0") && (idName == "socsjczlc") && (rowData.workOrderStatus != "2"))
						  	{
						  		return '<i class="icon-hand-right" title="可生成案例" style="margin-right:35px;color:orange"></i>';
						  	}
						  }}
					  ];

var batch_stop_url = "WorkOrderMonitorController/opWorkOrder";
var batch_delete_url = "WorkOrderMonitorController/delWorkOrder";

event_init();

workorder_list();

function workorder_list(option)
{
	g_grid.render($("#table_div"),{
		 header:list_col_header,
		 url:list_url,
		 isLoad : true,
		 maskObj : "body",
		 dbClick : detail_template_init
	});
}

function detail_template_init(rowData)
{
	var processTemplateName = rowData.processTemplateName;
	var idName = processTemplateName.split("_")[1];
	if(idName.indexOf("(")>0)
	{
		idName = idName.split("(")[0];	
	}
	var id = idName+"_step3";
	var tplName;
	if(idName == "socsjczlc")
	{
		tplName = processTemplateName.split("(")[1].split(")")[0];
	}
	workorder.done_workorder(
							{
								id:id,
								tplName:tplName,
								processInstanceID:rowData.processInstanceID,
								caseStatus:rowData.caseStatus,
								workOrderStatus : rowData.workOrderStatus,
								procStatus:rowData.procStatus,
								cbf:function (){
									g_grid.refresh($("#table_div"));
								}
							},
							"case");
}

function event_init()
{
	$("#stop_btn").click(function (){
		batch_stop();
	});

	$("#delete_btn").click(function (){
		batch_delete();
	});
}

function batch_stop()
{
	var idArray = [];
	idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"processInstanceID"})
	if(idArray.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}
	var array = [];	
	array = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"workOrderStatus"});
	if(array.indexOf("1") > -1)
	{
		g_dialog.operateAlert($("#table_div") ,"只可终止未完成工单，请重新选择。" ,"error");
		return false;
	}
	var ids = idArray.join(",");	
	g_dialog.operateConfirm("确认终止所选工单么？" ,{
		saveclick:function(){
			um_ajax_post({
				url : batch_stop_url,
				paramObj : {procInstID : ids,operation : "abort"},
				isLoad : true,
				maskObj : "body",
				successCallBack : function(data){
					g_dialog.operateAlert();
					workorder_list();	
				}
			});
		}
	});
}

function batch_delete()
{
	var idArray = [];
	idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"processInstanceID"})
	if(idArray.length == 0){
		g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
		return false;
	}
	var array = [];
	array = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"workOrderStatus"});
	if(array.indexOf("2") > -1)
	{
		g_dialog.operateAlert($("#table_div") ,"只可删除已完成工单，请重新选择。" ,"error");
		return false;
	}
	var ids = idArray.join("#");
	g_dialog.operateConfirm("确认删除所选工单么？" ,{
		saveclick:function(){
			um_ajax_post({
				url : batch_delete_url,
				paramObj : {procInstIDs : ids},
				isLoad : true,
				maskObj : "body",
				successCallBack : function(data){
					g_dialog.operateAlert();
					workorder_list();	
				}
			});
		}
	});
}

});
});