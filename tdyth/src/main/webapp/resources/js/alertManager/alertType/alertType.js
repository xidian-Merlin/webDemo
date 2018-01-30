$(document).ready(function (){


var index_list_col_header = [
	 				  {text : "编号" ,name : "id"},
					  {text : "类型名称" ,name : "typeName"},
					  {text : "描述" ,name : "description"},
					  {text : "混合类型" ,name : "mixType"},
					  {text : "混合类型值" ,name : "mixTypeValue"}
					];

var index_list_col_oper = [
		  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick :edit_template_init},
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick :index_list_delete ,isShow : function(rowData){
		  			  		//根据传入参数判断是否显示删除按钮，true显示，false隐藏
		  			  		return true;
		  			  }}
	   			  ];


var el_table_div = $("#table_div1");

var current_selected_node_id = -1;

var current_selected_node_name = "资产类别";

view_init();

event_init(); 

initLayout();

/*asset_class_tree();*/

index_list_get({paramObj :{currentPage:1,numPerPage:50,operateType:1} ,isLoad : false ,maskObj : "body"});

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
 		url : "alertManage/alertTypeList",
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj
	});
	
}

function index_list_delete(rowData)
{   console.log(rowData.id);
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: "alertManage/alertTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,alertTypeIdList:rowData.id},
				success :function(data)
			{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : {currentPage:1,numPerPage:50,operateType:1} ,isLoad : false ,maskObj : "body"});
					
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
				url: " alertManage/alertTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,alertTypeIdList:eqpTypeIdList},
				success :function(data)
			{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : {currentPage:1,numPerPage:50,operateType:1} ,isLoad : false ,maskObj : "body"});
					
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var target_title = rowData ? "告警类型修改" : "告警类型新增";
	var url = rowData? "/tdyth/resources/js/alertManager/alertType/alertType_tp1.html" : "/tdyth/resources/js/alertManager/alertType/alertType_tp1_1.html"
 
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
		el.find("[data-id=mixType]").select2({
			data :[{id:0,text:"基本告警类型"},{id:1,text:"混合告警类型"}],
			width : "100%"
		});
		
		(el.find("[data-id=mixTypeValueDiv]")).hide();	
		el.find("[data-id=mixType]").change(function(){
			if(el.find("[data-id=mixType]").val() == 1){
				//alert(el.find("[data-id=mixTypeValueDiv]"));
				//console.log(el.find("[data-id=mixTypeValueDiv]"));
				(el.find("[data-id=mixTypeValueDiv]")).show();	
			}else{
				(el.find("[data-id=mixTypeValueDiv]")).hide();
				
			}
		});

	}

	
	function initAfter(el)
	{
		
		$.ajax({
			type: "POST",
			url: "alertManage/alertTypeList",
			dataType: "json",
			data:{currentPage:1,numPerPage:50,operateType:1},
			timeout : 120000, //超时时间设置，单位毫秒
			success :function(data)
		{
				
	    		var equipList = data.infoList;
	    		for (var i = 0; i < equipList.length; i++) {
	    			equipList[i].id = equipList[i].id;
	    			equipList[i].text = equipList[i].typeName;
	    		}
	    		el.find("[data-id=mixTypeValue]").select2({
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
		el.find("[data-id=alertTypeId]").val(rowData.id);
		}
		  
		el.find("form").action = "alertManage/alertTypeModify";
		el.find("form").submit();
		$("#iframe_display").load(function(){
			var text = $(this).contents().find("body").text();  //获取到的是json的字符串
			var j = $.parseJSON(text);  //json字符串转换成json
			g_dialog.hide(el);
			index_list_get({paramObj : {currentPage:1,numPerPage:50,operateType:1} ,isLoad : false ,maskObj : "body"});
			
		})
		
	}
}



});