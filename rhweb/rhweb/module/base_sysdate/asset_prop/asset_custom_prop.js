$(document).ready(function (){


var index_list_url = "AssetType/queryEquipmentDIYAttributeList";

var index_list_col_header = [
					  {text : '属性名称' ,name : "attributeName"},
					  {text : '属性类型' ,name : "attributeType" ,searchRender : function (el){
					  	var data = [
											{text:"----" ,id:"-1"},
				  						{text:"字符类型" ,id:"字符类型"},
				  						{text:"数值类型" ,id:"数值类型"}
							  		];
							g_formel.select_render(el ,{
								data : data,
								name : "attributeType"
							});
					  }},
					  {text : '属性长度（字节）' ,name : "attributeLength"},
					  {text : '是否为空' ,name : "attributeIsNull" ,searchRender : function (el){
					  	var data = [
											{text:"----" ,id:"-1"},
				  						{text:"是" ,id:"1"},
				  						{text:"否" ,id:"0"}
							  		];
							g_formel.select_render(el ,{
								data : data,
								name : "attributeIsNull"
							});
					  }}
					];
var index_list_col_oper = [
		  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick : edit_template_init},
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick : index_list_delete}
	   			  	];
var module_obj_create_url = "AssetType/addEquipmentDIYAttribute";

var module_obj_update_url = "AssetType/updEquipmentDIYAttribute";

var module_obj_delete_check_url = "AssetType/preBatchDel";

var module_obj_delete_url = "AssetType/delBatchEquipmentDIYAttribute";

event_init();

index_list_get({paramObj : null ,isLoad : true ,maskObj : "body"});

function event_init()
{
	// 新增按钮点击事件
	$("#add_btn").click(function (){
		edit_template_init();
	});

	// 批量删除按钮点击事件
	$("#remove_btn").click(function (){
		index_list_batch_delete();
	});
}

function index_list_get(option)
{
	g_grid.render($("#table_div") ,{
 		header : index_list_col_header,
 		oper : index_list_col_oper,
 		operWidth : "100px",
 		url : index_list_url,
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj,
 		dbClick : detail_template_init
	});
}

function index_list_delete(rowData)
{	
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function(){
			um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {attributeId : rowData.attributeId},
				successCallBack : function(data){
					index_list_get({paramObj : null ,isLoad : true ,maskObj : "body"});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
			return true;
		}
	});
}

function index_list_batch_delete()
{
	var target_attributed_id = [];

	var rowData = g_grid.getData($("#table_div") ,{
		chk : true
	});

	for(var i=0 ,len = rowData.length ;i < len ;i++){
		target_attributed_id.push(rowData[i].attributeId);
	}

	if (target_attributed_id.length == 0)
	{
		g_dialog.operateAlert($("#table_div") , "未选中记录" ,"error");
		return false;
	}

	target_attributed_id = target_attributed_id.join(",");
	
	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function(){
			um_ajax_post({
				url : module_obj_delete_url,
				paramObj : {attributeId : target_attributed_id},
				successCallBack : function(data){
					index_list_get({paramObj : null ,isLoad : true ,maskObj : "body"});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
			return true;
		}
	});
}

function edit_template_init(rowData)
{
	var target_title = rowData ? "资产自定义属性修改" : "资产自定义属性添加";

	$.ajax({
		type : "GET",
		url : "/module/base_sysdate/asset_prop/asset_custom_prop_tpl.html",
		success : function(data)
		{
			g_dialog.dialog($(data).find("[id=edit_template]") ,{
				width:"500px",
				init : init,
				title : target_title,
				top : "20%",
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		if (rowData){
			$(el).umDataBind("render" ,rowData);
		}
	}

	function save_click(el ,saveObj)
	{

		if (!g_validate.validate(el)){
			return false;
		}

		var target_url = rowData ? module_obj_update_url : module_obj_create_url;

		switch (saveObj.attributeIsNull)
		{
			case "是":
				saveObj.attributeIsNull = 1;
				break;
			case "否":
				saveObj.attributeIsNull = 0;
				break;
		}

		um_ajax_post({
			url : target_url,
			paramObj : saveObj,
			successCallBack : function(data){
				index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
		return true;
	}
}

function detail_template_init(rowData)
{
	$.ajax({
		type : "GET",
		url : "module/base_sysdate/asset_prop/asset_custom_prop_tpl.html",
		success : function(data)
		{
			g_dialog.dialog($(data).find("[id=detail_template]") ,{
				width : "400px",
				height : "600px",
				title : "属性详情",
				top : "20%",
				isDetail:true,
				init : init,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		$(el).umDataBind("render" ,rowData);
		el.find("select").trigger("change");
	}

	function save_click()
	{
	
	}
}


});