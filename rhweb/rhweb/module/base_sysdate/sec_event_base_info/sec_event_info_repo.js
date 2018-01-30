$(document).ready(function (){
require(["/js/plugin/inputdrop/inputdrop.js",'/js/plugin/tree/tree.js'] ,function(inputdrop,tree){


var index_list_url = "EquipmentType/queryEquipmentTypeData";

var index_list_col_header = [
							  {text : "事件名称" ,name : "deviceTypeName"},
							  {text : "事件描述" ,name : "deviceClassName" }
							];

var index_list_col_oper = [
				  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick :edit_template_init}
			   			  ];

var list_add_url = "";

var list_update_url = "";

var el_table_div = $("#table_div1");

var current_selected_node_id = -1;

var current_selected_node_name = "事件类型";

view_init();

event_init(); 

initLayout();

event_class_tree();

index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});
	$("#add_btn").click(function (){
		edit_template_init();
	});
}

function initLayout()
{
	index_initLayout();
	$("#table_div1").oneTime(500 ,function (){
		$("#table_div1").height(
						$("#content_div").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							- 20
					  );
	});
}
function event_class_tree(opt)
{
	if(opt)
	{
		current_selected_node_id = opt;
	}
	um_ajax_post({
		url : "EquipmentClass/queryClassType",
		successCallBack : function (data){
			for (var i = 0; i < data.length; i++)
			{
				data[i].id = data[i].deviceClass;
				data[i].parent = "-1";
				data[i].label = data[i].deviceClassName;
			}
			data.push({id:"-1" ,parent:"root" ,label:"事件类型"});
			tree.render($("#event_class_tree") ,{
				pId:"parent",
				label:"label",
				id:"id",
				zNodes : data,
				expandNode : -1,
				selectNode : current_selected_node_id,
				zTreeOnClick : function (event, treeId, treeNode){
					current_selected_node_id = treeNode.id;
					current_selected_node_name = treeNode.label;
					var paramObj = {deviceClass:treeNode.id};
					if(treeNode.id == "-1")
					{
						paramObj = null;
					}
					index_list_get({
						paramObj:paramObj,
						isLoad:true,
						maskObj:"body"
					});
				}
			});
		}
	});
}
function index_list_get(option)
{
	g_grid.render($("#table_div1") ,{
 		header : index_list_col_header,
 		oper : index_list_col_oper,
 		operWidth : "100px",
 		url : index_list_url,
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj,
 		allowCheckBox:false,
 		dbClick : detail_template_init
	});
}


function edit_template_init(rowData)
{
	var target_title = rowData ? "修改事件" : "添加事件";

	$.ajax({
		type: "GET",
		url: "/module/base_sysdate/sec_event_info_repo_tpl.html",
		success : function(data){
			g_dialog.dialog($(data).find("[id=list_edit_template]") ,{
				width : "500px",
				init : init,
				title : target_title,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		if (rowData) {
			el.umDataBind("render",rowData);
		}
	}
	function save_click(el ,saveObj)
	{
		if (!g_validate.validate(el)){
			return false;
		}
		var url = rowData ? list_update_url : list_add_url;
		um_ajax_post({
			url:url,
			paramObj:saveObj,
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				g_dialog.hide(el);
				g_dialog.operateAlert();
				var paramObj = {deviceClass:current_selected_node_id};
				if(current_selected_node_id == "-1")
				{
					paramObj = null;
				}
				index_list_get({
					paramObj:paramObj,
					isLoad:false
				});
				event_class_tree(current_selected_node_id);
			}
		});
		
	}
}

function detail_template_init(rowData)
{

	$.ajax({
		type: "GET",
		url: "module/base_sysdate/sec_event_info_repo_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=list_detail_template]") ,{
				width : "500px",
				title : "事件详细信息",
				init : init,
				isDetail : true
			});
			function init(el)
			{
				el.umDataBind("render" ,rowData);
			}
		}
	});
}


});
});