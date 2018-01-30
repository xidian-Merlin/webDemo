$(document).ready(function (){
/*require(["/tdyth/resources/plugins/inputdrop/inputdrop.js",'/tdyth/resources/plugins/dialog/dialog.js'] ,function(inputdrop,g_dialog){*/


var index_list_url = "EquipmentType/queryEquipmentTypeData";

var index_list_col_header = [
	                 
					  {text : "安全域编号" ,name : "secDomId"},
					  {text : "安全域名字" ,name : "secDomName" ,searchRender:function(el){
							var searchEl = $('<select class="form-control input-sm" search-data="deviceClassName" data-id="deviceClassName"></select>');
							el.append(searchEl);
							/*g_formel.code_list_render({
								key : "equipmentClasslist",							
								equipmentEl : searchEl
							});*/
						}},
					  {text : "描述" ,name : "description"}
					];

var index_list_col_oper = [
		  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick :edit_template_init},
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick :index_list_delete ,isShow : function(rowData){
		  			  		//根据传入参数判断是否显示删除按钮，true显示，false隐藏
		  			  		return true;
		  			  }}
	   			  ];

var module_obj_create_url = "EquipmentType/addEquipmentTypeSave";

var module_obj_update_url = "EquipmentType/updEquipmentTypeSave";

var module_obj_delete_url = "EquipmentType/delETBatch";

var form_codeList_url = "rpc/getCodeList";

var el_table_div = $("#table_div1");

var current_selected_node_id = -1;

var current_selected_node_name = "资产类别";

view_init();

event_init(); 

initLayout();

/*asset_class_tree();*/

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

	$("#remove_btn").click(function (){
		index_list_batch_delete();
	});
	$("#tree_add_btn").click(function(){
		tree_edit();
	});
}

function initLayout()
{
	index_initLayout();
/*	$("#table_div1").oneTime(500 ,function (){*/
		$("#table_div1").height(
						400
					  );
/*	});*/
}
function asset_class_tree(opt)
{
	/*if(opt)
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
			data.push({id:"-1" ,parent:"root" ,label:"资产类别"});
			tree.render($("#asset_class_tree") ,{
				pId:"parent",
				label:"label",
				id:"id",
				zNodes : data,
				edit:true,
				showRenameBtn: function(treeId, treeNode){
					if(treeNode.id == "-1")
					{
						return false;
					}
					return true;
				},
				showRemoveBtn:function(treeId, treeNode){
					if(treeNode.id == "-1")
					{
						return false;
					}
					return true;
				},
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
				},
				beforeEditName:function(treeId, treeNode){
					tree_edit(treeNode);
					return false;
				},
				beforeRemove : function (treeId, treeNode){
					if(treeNode.label.split("(")[1].split(")")[0] != 0)
					{
						g_dialog.operateAlert($("#asset_class_tree") ,"此类别下包含资产类型，禁止删除。" ,"error");
						return false;
					}
					g_dialog.operateConfirm("确定执行删除操作么?" ,{
						saveclick : function (){
							um_ajax_post({
								url : "EquipmentClass/delETBatch",
								paramObj : {deviceClassStr : treeNode.deviceClass},
								successCallBack : function (){
									$("#asset_class_tree").data("tree").removeNode(treeNode);
									g_dialog.operateAlert($("#asset_class_tree"));
									index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
								}
							});
						}
					});
					return false;
				}
			});
		}
	});*/
}
function tree_edit(opt)
{
	var title = "资产类别添加";
	var url = "EquipmentClass/addEquipmentTypeSave";

	if(opt)
	{
		title = "资产类别修改";
		url = "EquipmentClass/updEquipmentTypeSave";
	}
	$.ajax({
		type: "GET",
		url: "/tdyth/resources/js/asset_type_tpl.html",
		success : function(data){
			g_dialog.dialog($(data).find("[id=tree_update_template]") ,{
				width : "450px",
				init : init,
				title : title,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		if(opt)
		{
			var label = opt.label.split("(")[0];
			el.find("[data-id=deviceClassName]").val(label);
		}
	}
	function save_click(el,saveObj)
	{
		var url = "EquipmentClass/addEquipmentTypeSave";
		var tree_id = current_selected_node_id;
		if(opt)
		{
			url = "EquipmentClass/updEquipmentTypeSave";
			saveObj.deviceClass = opt.deviceClass;
			tree_id = opt.id;
		}
		um_ajax_post({
			url : url,
			paramObj : saveObj,
			successCallBack : function(data){
				g_dialog.operateAlert(null ,"操作成功！");
				g_dialog.hide(el);
				asset_class_tree(tree_id);
			}
		});
	}
}
function index_list_get(option)
{
	g_grid.render($("#table_div1") ,{
 		header : index_list_col_header,
 		oper : index_list_col_oper,
 		operWidth : "100px",
 		url : "eqpManage/eqpSecDomList",
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj,
 		dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{   console.log(rowData.id);
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: "eqpManage/eqpSecDomModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpSecDomIdList:rowData.secDomId},
				success :function(data)
			/*um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {deviceType : rowData.deviceType},
				successCallBack : function(data)*/{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
					/*var paramObj = {deviceClass:current_selected_node_id};
					if(current_selected_node_id == "-1")
					{
						paramObj = null;
					}
					index_list_get({
						paramObj:paramObj,
						isLoad:true,
						maskObj:"body"
					});
			 		asset_class_tree(current_selected_node_id);*/
				}
			});
		}
	});
}

function index_list_batch_delete()
{
	var target_attributed_id = [];
	var rowData = g_grid.getData($("#table_div1") ,{
		chk : true
	});
	console.log(rowData);
	var eqpSecDomIdList = "";
	for(var i=0 ,len = rowData.length ;i<len ;i++){
		eqpSecDomIdList += rowData[i].secDomId ;
		if (i != (len-1)){
			eqpSecDomIdList += ","
		}
	}
	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: "eqpManage/eqpSecDomModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpSecDomIdList:eqpSecDomIdList},
				success :function(data)
			/*um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {deviceType : rowData.deviceType},
				successCallBack : function(data)*/{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
					/*var paramObj = {deviceClass:current_selected_node_id};
					if(current_selected_node_id == "-1")
					{
						paramObj = null;
					}
					index_list_get({
						paramObj:paramObj,
						isLoad:true,
						maskObj:"body"
					});
			 		asset_class_tree(current_selected_node_id);*/
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var target_title = rowData ? "资产类型修改" : "资产类型添加";
	var url = rowData? "/tdyth/resources/js/eqpSecDom_tpl.html" : "/tdyth/resources/js/eqpSecDom_tpl_1.html"
 
    console.log(rowData);
	$.ajax({
		type: "GET",
		url: url,
		success : function(data){
			g_dialog.dialog($(data).find("[id=edit_template]") ,{
				width : "650px",
				title : target_title,
				saveclick : save_click
			});
		}
	});

	function save_click(el ,saveObj)
	{
		
	
		if(rowData){
		el.find("[data-id=eqpSecDomId]").val(rowData.secDomId);
		}
	
		el.find("form").action = "eqpManage/eqpSecDomModify";
		el.find("form").submit();
		$("#iframe_display").load(function(){
			var text = $(this).contents().find("body").text();  //获取到的是json的字符串
			var j = $.parseJSON(text);  //json字符串转换成json
			g_dialog.hide(el);
			index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
			
		})
		

		/*um_ajax_file(el.find("form") ,{
			url : eqpManage/eqpTypeModify,
			maskObj : "body",
			successCallBack : function (data){
				g_dialog.hide(el);
		 		g_dialog.operateAlert(null ,"操作成功！");
		 		var paramObj = {deviceClass:current_selected_node_id};
				if(current_selected_node_id == "-1")
				{
					paramObj = null;
				}
				index_list_get({
					paramObj:paramObj,
					isLoad:false
				});
		 		asset_class_tree(current_selected_node_id);
			},
			failCallBack:function(){
				el.find("[data-id=deviceClass]").attr("disabled","disabled");
			}
		})*/
	}
}

function detail_template_init(rowData)
{

	$.ajax({
		type: "GET",
		url: "/tdyth/resources/js/asset_type_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]") ,{
				width : "600px",
				title : "资产类型详细信息",
				init : init,
				isDetail : true
			});
			function init(el)
			{
				el.umDataBind("render" ,rowData);
				el.find("[data-id=img]").attr("src" ,rowData.deviceTypeMap);
			}
		}
	});
}

});