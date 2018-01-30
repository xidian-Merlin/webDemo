$(document).ready(function (){
require([],
function (){

var url = {
	index_list_url : "monitorIgnore/queryMonitorIgnoreList",
	delete_url : "monitorIgnore/delMonitorIgnore",
	add_url : "monitorIgnore/addMonitorIgnore",
	monitor_list_url : "monitorIgnore/queryMonitorGrid",
	query_monitorType_url : "monitorIgnore/queryMonitorClassStore"
};
var header = {
	index_list : [
		{text:'监控器名称',name:"monitorName",width : 40,render:function (txt ,data ){
			var $div = $('<div style="text-align:left;width:100%;"></div>');
			var $icon ;
			console.log(data.isFloder);
			if(data.isFloder){
				$icon = $('<i class="icon-folder-open" style="color:#000"></i>');
			}else {
				$icon = $('<i class="icon-file-text" style="color:#000"></i>');
			}
			$icon.css("margin-left",10*data.levelNum+20 + "px");
			var $span = $('<span class="ml5"></span>');
			$span.append(txt);
			$icon.append($span);
			$div.append($icon);
			var temp = '<div style="text-align:left;width:100%;">'+$div.html()+'</div>';
			return temp;
		}},
		{text:'监控器类型',name:"monitorTypeText",width : 20},
		{text:'代理服务器',name:"nodeName",width : 20},
		{text:'被监控资产名称',name:"edName",width : 20}
	],
	monitor_list : [
		{text:'监控器名称',name:'codename'}
	]
};
var oper = {
	index_list : [
		{icon:"rh-icon rh-add",text:"添加监控器依赖关系",aclick:addHandle},
		{icon:"rh-icon rh-delete",text:"删除",aclick:deleteHandle}
	]
};
view_init();
event_init();
index_list_init({maskObj:"body"});


function view_init()
{
	// index_form_init($("#"));
}

function event_init(){
	$("#add_btn").click(function (){
		addHandle();
	});
}
function index_list_init(option){
	g_grid.render($("#table_div"),{
		 url:url.index_list_url,
		 header:header.index_list,
		 oper: oper.index_list,
		 operWidth:"150px",
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 allowCheckBox:false,
		 hideSearch : true,
		 hideSort : true,
		 paginator : false,
		 cbf : function (){
		 	console.log($("#table_div").find(".um-grid-head-tr td").eq(0));
		 	$("#table_div").find(".um-grid-head-tr td").eq(0).children().css("text-align","left").css("padding-left","20px");
		 	//$("#table_div").find(".um-grid-head-tr td").eq(0).css("padding-left","20px");
		 }
	});
}
var monitorIds = "";
function addHandle(rowData){
	var parentId = rowData?rowData.monitorId:"-1";
	var dataList = g_grid.getData($("#table_div") ,{});
	monitorIds = "";
	for(var i=0;i<dataList.length;i++){
		var data = dataList[i];
		monitorIds += data.monitorId + ",";
	}
	monitorIds = monitorIds.substr(0,monitorIds.length-1);
	$.ajax({
			type : "GET",
			url : "module/sys_manage/monitor_config/monitor_dependency_config_tpl.html",
			success : function (data){
				g_dialog.dialog(
					$(data).find("[id=add_template]"),
					{
						width:"640px",
						title:"添加监控器依赖关系",
						init:init,
						saveclick:save_click
					}
				);
				function init(el){
					var left_table = $(el).find("#table_div1");
					var right_table = $(el).find("#table_div2");
					g_grid.render(left_table,{
						url:url.monitor_list_url,
						header:header.monitor_list,
						paramObj : {"monitorIds" : monitorIds},
						isLoad : true,
						maskObj : el,
						gridCss : "um-grid-style",
						hideSearch : true,
						paginator : false
					});
					g_grid.render(right_table,{
						url : "",
						header:header.monitor_list,
						data : [],
						isLoad : true,
						maskObj : el,
						gridCss : "um-grid-style",
						hideSearch : true,
						paginator : false
					});
					el.find("[data-id=chevron-right]").click(function (){
						var data = g_grid.getData(left_table ,{chk:true});
						g_grid.removeData(left_table);
						g_grid.addData(right_table ,data);
					});

					el.find("[data-id=chevron-left]").click(function (){
						var data = g_grid.getData(right_table ,{chk:true});
						g_grid.removeData(right_table);
						g_grid.addData(left_table ,data);
					});
					g_formel.sec_biz_render({
						secEl:el.find("[id=securityDomain]"),
						aCheckCb : function (){
							var domaId = el.find("input[data-id=securityDomain]").val();
							var monitorClass = el.find("[data-id=monitorType]").val();
							var paramObj = { monitorClass : monitorClass , domaId : domaId };
							monitorGrid(left_table,el,paramObj);
						}
					});
					um_ajax_get({
						url : url.query_monitorType_url,
						successCallBack : function (data){
							var tempList = new Array();
							for(var i=0;i<data.length;i++){
								var obj = data[i];
								var tempObj = { id : obj["codevalue"] ,text : obj["codename"] };
								tempList.push(tempObj);
							}
							el.find("[data-id=monitorType]").select2({
								data : tempList,
								width : "100%"
							});
							el.find("[data-id=monitorType]").change(function (){
								var domaId = el.find("input[data-id=securityDomain]").val();
								var monitorClass = el.find("[data-id=monitorType]").val();
								var paramObj = { monitorClass : monitorClass , domaId : domaId };
								monitorGrid(left_table,el,paramObj);
							});
						}
					});
				}
				function save_click(el,saveObj){
					var right_table = $(el).find("#table_div2");
					var data = g_grid.getData(right_table);
					var monitorArray = new Array();
					for (var i = 0; i < data.length; i++) {
						monitorArray.push({ "codevalue" : data[i].codevalue });
					}
					// var toGridStore = monitorArray.join();
					um_ajax_post({
						url : url.add_url,
						maskObj : el,
						paramObj : { toGridStore : monitorArray , parentId : parentId },
						successCallBack : function (data){
							g_dialog.operateAlert();
							g_dialog.hide(el);
							index_list_init({maskObj:"body"});
						}
					})
				}
			}
		});
}
function monitorGrid(tableEl,el,paramObj){
	var isLoad = true;
	if(!el){
		isLoad = false;
	}
	paramObj.monitorIds = monitorIds;
	g_grid.render(tableEl,{
		url:url.monitor_list_url,
		header:header.monitor_list,
		paramObj : paramObj,
		isLoad : isLoad,
		maskObj : el,
		gridCss : "um-grid-style",
		hideSearch : true,
		paginator : false
	});
}
function deleteHandle(rowData){
	g_dialog.operateConfirm("是否进行删除操作？" ,{
		saveclick : function (){
			var delete_url = url.delete_url;
			um_ajax_post({
				url : delete_url,
				paramObj : {parentId : rowData.parentId, monitorId : rowData.monitorId },
				successCallBack : function (data){
					g_dialog.operateAlert();
					index_list_init({maskObj:"body"});
				}
			});
		}
	});
}



});
});