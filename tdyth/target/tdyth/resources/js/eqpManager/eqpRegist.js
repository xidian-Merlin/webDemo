$(document).ready(function (){
/*require(["/tdyth/resources/plugins/inputdrop/inputdrop.js",'/tdyth/resources/plugins/dialog/dialog.js'] ,function(inputdrop,g_dialog){*/


var index_list_url = "EquipmentType/queryEquipmentTypeData";

var index_list_col_header  = [
	{text:'设备编号',name:"eqpNo",width:12},
	{text:'设备名称',name:"name",width:12},
	{text:'主IP',name:"ip",width:13,searchRender:function (el){
			 index_render_div(el ,{type:"ip"});
	}},
	{text:'设备类型',name:"assetType",width:13,hideSearch:true},
	{text:'安全域',name:"securityDomain",width:14,hideSearch:true},
	{text:'设备价值',name:"assetValue",width:14}

 ];

var index_list_col_oper = [
	                               
	
	
		  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick :edit_template_init},
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick :index_list_delete ,isShow : function(rowData){
		  			  		//根据传入参数判断是否显示删除按钮，true显示，false隐藏
		  			  		return true;
		  			  }},
		  			 {icon : "rh-icon rh-config" ,text : "配置" ,aclick :config_template_init}
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
	$("#autoAdd").click(function (){
		alert("自动扫描没有完成,老翔接锅");
	});
	$("#batch_add_btn").click(function(){
		batch_add_init();
	});
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#remove_btn").click(function (){
		index_list_batch_delete();
	});
}

function initLayout()
{
	index_initLayout();
	$("#table_div1").oneTime(500 ,function (){
		
		$("#table_div1").height(
						$("#right-panel").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							
				
					  );
	});
}

function index_list_get(option)
{
	g_grid.render($("#table_div1") ,{
 		header : index_list_col_header,
 		oper : index_list_col_oper,
 		operWidth : "100px",
 		url : "eqpManage/eqpRegList",
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
				url: "eqpManage/eqpTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpTypeIdList:rowData.id},
				success :function(data)
			{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
					
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
	var eqpTypeIdList = "";
	for(var i=0 ,len = rowData.length ;i<len ;i++){
		eqpTypeIdList += rowData[i].id ;
		if (i != (len-1)){
			eqpTypeIdList += ","
		}
	}
	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: "eqpManage/eqpTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpTypeIdList:eqpTypeIdList},
				success :function(data){
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
				
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var target_title = rowData ? "设备信息修改" : "设备信息添加";
	var url = rowData? "/tdyth/resources/js/eqpManager/eqpRegist_tp1.html" : "/tdyth/resources/js/eqpManager/eqpRegist_tp1_1.html"
 
	$.ajax({
		type: "GET",
		url: url,
		success : function(data){
			g_dialog.dialog($(data).find("[id=edit_template]") ,{
				width : "650px",
				init : init,
				initAfter : initAfter,
				title : target_title,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		var show_in_edit = el.find("[data-id=show-in-edit]");

		rowData ? show_in_edit.show() : show_in_edit.hide();		

		// 上传元素初始化
		index_create_upload_el(el.find("[id=deviceTypeMap]"));

		if (!rowData)
		{
			el.find("[id=img_label]").text("类型图片");
		}
		
		if(rowData){
			el.find("[data-id=eqpNo]").val(rowData.eqpNo);
			el.find("[data-id=eqpID]").val("");
			el.find("[data-id=name]").val(rowData.name);
			el.find("[data-id=securityDomain]").val(rowData.securityDomain).trigger("change");
			el.find("[data-id=assetValue]").val(rowData.assetValue);
			el.find("[data-id=os]").val(rowData.os);
			el.find("[data-id=ip]").val(rowData.ip);
		
			
		}
		
	}

	function initAfter(el)
	{
	
		el.find("[data-id=workMode]").select2({
			data : [{id:1,text:'直接管理'},{id:2,text:'间接管理'}],
			width : "100%"
		});
		
		el.find("[data-id=manageMode]").select2({
			data : [{id:1,text:'全天候'}],
			width : "100%"
		});
		
		$.ajax({
			type: "POST",
			url: "eqpManage/eqpTypeList",
			dataType: "json",
			data: {currentPage:1,numPerPage:50},
			timeout : 120000, //超时时间设置，单位毫秒
			success :function(data){
				
	    		var equipList = data.infoList;
	    		for (var i = 0; i < equipList.length; i++) {
	    			equipList[i].id = equipList[i].id;
	    			equipList[i].text = equipList[i].typeName;
	    		}
	    		el.find("[data-id=assetType]").select2({
	    			data : equipList,
	    			width : "100%"
	    		});
				if(current_selected_node_id != -1)
				{
					el.find("[data-id=deviceClass]").val(current_selected_node_id);
					el.find("[data-id=deviceClass]").attr("disabled","disabled");
					el.find("select").trigger("change");
				}

				if (rowData){
					//el.umDataBind("render" ,rowData);
					el.find("[data-id=deviceClass]").removeAttr("disabled");
					el.find("[data-id=img]").attr("src" ,rowData.deviceTypeMap);
					el.find("[data-id=olddeviceTypeName]").val(rowData.deviceTypeName);
					el.find("select").trigger("change");
				}

				
			}
		});
		
		
		$.ajax({
			type: "POST",
			url: "eqpManage/eqpSecDomList",
			dataType: "json",
			data: {currentPage:1,numPerPage:50},
			timeout : 120000, //超时时间设置，单位毫秒
			success :function(data){
				
	    		var equipList = data.infoList;
	    		for (var i = 0; i < equipList.length; i++) {
	    			equipList[i].id = equipList[i].secDomId;
	    			equipList[i].text = equipList[i].secDomName;
	    		}
	    		el.find("[data-id=securityDomain]").select2({
	    			data : equipList,
	    			width : "100%"
	    		});
				if(current_selected_node_id != -1)
				{
					el.find("[data-id=deviceClass]").val(current_selected_node_id);
					el.find("[data-id=deviceClass]").attr("disabled","disabled");
					el.find("select").trigger("change");
				}

				if (rowData){
					//el.umDataBind("render" ,rowData);
					el.find("[data-id=deviceClass]").removeAttr("disabled");
					el.find("[data-id=img]").attr("src" ,rowData.deviceTypeMap);
					el.find("[data-id=olddeviceTypeName]").val(rowData.deviceTypeName);
					el.find("select").trigger("change");
				}

				
			}
		});
		
	}

	
	//弹框保存
	function save_click(el ,saveObj)
	{
	

		el.find("[data-id=deviceClass]").removeAttr("disabled");
		if(rowData){
			if(current_selected_node_id != -1)
			{
				current_selected_node_id = el.find("[data-id=deviceClass]").val();
			}
		}
		console.log(rowData);
		if(rowData){
		el.find("[data-id=eqpTypeId]").val(rowData.id);
		}
		
	/*	var target_url = rowData ? module_obj_update_url : module_obj_create_url;*/
		el.find("form").action = "eqpManage/eqpRegManualAdd";
		el.find("form").submit();
		$("#iframe_display").load(function(){
			var text = $(this).contents().find("body").text();  //获取到的是json的字符串
			var j = $.parseJSON(text);  //json字符串转换成json
			g_dialog.hide(el);
			index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
			
		})
		
	}
}

function detail_template_init(rowData)
{

	/*$.ajax({
		type: "GET",
		url: "/tdyth/resources/js/eqpManager/eqpType_tp1.html",
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
	});*/
}

function batch_add_init(){
	var target_title = "设备批量新增";
	var url = "/tdyth/resources/js/eqpManager/batchEqpRegist_tpl.html"
 
	$.ajax({
		type: "GET",
		url: url,
		success : function(data){
			g_dialog.dialog($(data).find("[id=edit_template]") ,{
				width : "650px",
				init : initUpLoad,
				title : target_title,
				saveclick : upLoadFile
			});
		}
	});
	
	
}

function initUpLoad(){
	// 上传元素初始化
	index_create_upload_el(el.find("[id=fileName]"));
}

function upLoadFile(el){
	el.find("form").action = "eqpManage/excelUpload";
	el.find("form").submit();
	$("#iframe_display").load(function(){
		var text = $(this).contents().find("body").text();  //获取到的是json的字符串
		var j = $.parseJSON(text);  //json字符串转换成json
		g_dialog.hide(el);
		index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
		
	})
	
}

function config_template_init(){
	
	var url = "/tdyth/resources/js/eqpManager/packageFilterConfig.jsp";
	
	window.open(url);
}




});