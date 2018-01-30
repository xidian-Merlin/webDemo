$(document).ready(function (){
require(['/js/plugin/tab/tab.js','/js/plugin/asset/asset.js'] ,function (tab,asset){


var backup_asset_list_url = "AssetVest/queryAsset";
var backup_asset_list_header = [
								   {text:'主IP',name:"mainIp" ,searchRender : function (el){
								   		index_render_div(el ,{type:"ip"});
								   }},
								   {text:'资产类型',name:"assetTypeName",searchRender : function (el){
								   	   var searchEl = $('<div class="inputdrop" id="assetTypeId"></div>');
								   	   g_formel.sec_biz_render({
								   	   		assetTypeEl : searchEl
								   	   });
								   	   el.append(searchEl);
								   }},
								   {text:'安全域',name:"securityDomainName" ,searchRender : function (el){
								   	   var searchEl = $('<div class="inputdrop" id="securityDomainId"></div>');
								   	   g_formel.sec_biz_render({
								   	   		secEl : searchEl
								   	   });
								   	   el.append(searchEl);
								   }}
							    ];
var backup_asset_list_oper = [
								{icon:"rh-icon rh-asset-transform" ,text:"资产转换" ,aclick:backup_asset_change},
								{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:backup_asset_delete}
							 ];

var updateble_asset_list_url = "AssetVest/queryUpdateAsset";
var updateble_asset_list_header = [
								   {text:'资产名称',name:"userEmail"},
								   {text:'安全域',name:"userEmail" ,searchRender : function (el){
								   	   var searchEl = $('<div class="inputdrop" id="securityDomainName"></div>');
								   	   g_formel.sec_biz_render({
								   	   		secEl : searchEl
								   	   });
								   	   el.append(searchEl);
								   }},
								   {text:'资产类型',name:"userEmail" ,searchRender : function (el){
								   	   var searchEl = $('<div class="inputdrop" id="assetTypeName"></div>');
								   	   g_formel.sec_biz_render({
								   	   		assetTypeEl : searchEl
								   	   });
								   	   el.append(searchEl);
								   }},
								   {text:'操作系统',name:"userEmail" ,searchRender : function (el){
								   	   var searchEl = $('<select class="form-control input-sm"></select>');
								   	   g_formel.code_list_render({
								   	   		key : "osCodeList",
								   	   		osCodeEl : searchEl
								   	   });
								   	   el.append(searchEl);
								   }},
								   {text:'主IP',name:"userEmail" ,searchRender:function (el){
								  		index_render_div(el ,{type:"ip"});
								   }},
								   {text:'MAC地址',name:"userEmail"},
								   {text:'SNMP版本',name:"userEmail",render:function(text){
										if (text == "1")
										{
											return 'SNMP V1';
										}
										else if (text == "2")
										{
											return 'SNMP V2c';
										}
										else if (text == "3")
										{
											return 'SNMP V3';
										}
									} ,searchRender:function (el){
										var data = [
														{text:"SNMP V1" ,id:"1"},
								  						{text:"SNMP V2c" ,id:"2"},
								  						{text:"SNMP V3" ,id:"3"}
											  		];
										g_formel.select_render(el ,{
											data : data,
											name : "userEmail"
										});
									}},
							    ];
var updateble_asset_list_oper = [
								{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:updateble_asset_delete,style:"square-oper red"}
							 ];

var backup_asset_change_url = "AssetVest/updBatchAsset";
var backup_asset_delete_url = "AssetVest/delBatchAsset";
var updateble_asset_delete_url = "";

view_init();

event_init();

function view_init()
{
	layout_init();
	$(window).on("resize.module" ,function (){
		$(this).stopTime();
		$(this).oneTime(100 ,function (){
			layout_init();
		});
	})
	tab.tab($("#tab"),{oper : [backup_asset_list,updateble_asset_list]});
}

function event_init()
{
	$("#backup_change_btn").click(function (){
		backup_asset_batch_change();
	});

	$("#backup_delete_btn").click(function (){
		backup_asset_delete();
	});

	$("#updateble_delete_btn").click(function (){
		updateble_asset_delete();
	});
}

function layout_init()
{
	index_initLayout();
	$("[class*=table-div]").height(
									$("#content_div").height() - 100
								 );
}

function backup_asset_list()
{
	g_grid.render($("#backup_table_div"),{
		url : backup_asset_list_url,
		header : backup_asset_list_header,
		oper : backup_asset_list_oper,
		operWidth : "100px",
		dbClick : backup_asset_detail_init
	});
}

function updateble_asset_list()
{
	g_grid.render($("#updateble_table_div"),{
		url : updateble_asset_list_url,
		header :updateble_asset_list_header,
		oper : updateble_asset_list_oper,
		operWidth : "100px",
		dbClick : updateble_asset_detail_init
	});
}

function backup_asset_detail_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_manage/backup_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=backup_asset_detail_template]"),{
				width:"650px",
				title:"资产详细信息",
				isDetail:true,
				init:init
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);
	}
}

function backup_asset_change(rowData)
{
	asset.editDialog({
		rowData : rowData,
		type : "backup",
		detailUrl : "AssetVest/queryAssetDetail",
		updateUrl : "AssetVest/updAsset",
		cbf : function (){
			backup_asset_list();
		}
	});
}

function backup_asset_batch_change()
{
	var idArray = g_grid.getIdArray($("#backup_table_div") ,{attr:"edId" ,chk:true});
	if (idArray.length == 0) 
	{
		g_dialog.operateAlert(null ,"	请选择要转换的设备！" ,"error");
		return false;
	}
	asset.batchEditDialog({
		title : "资产批量转换",
		url : "AssetVest/updBatchAsset",
		elTable : $("#backup_table_div"),
		init : function (el){
			el.find("[id=responsiblePerson_div]").remove();
			el.find("[id=osType_div]").css("margin-bottom" ,"100px");
		},
		cbf : function (){
			backup_asset_list();
		}
	});
}


function backup_asset_delete(rowDate)
{
	if(rowDate)
	{
		edIds = rowDate.edId;
	}

	else
	{
		var idArray = g_grid.getIdArray($("#backup_table_div") ,{attr:"edId" ,chk:true});
		if (idArray.length == 0) 
		{
			g_dialog.operateAlert(null ,"	请选择要删除的资产！" ,"error");
			return false;
		}

		edIds = idArray.join(",");
	}

	g_dialog.operateConfirm(index_batch_delete_confirm_msg ,{
		saveclick : function (){
			um_ajax_post({
				url : backup_asset_delete_url,
				paramObj : {edIds : edIds},
				successCallBack : function (){
					g_dialog.operateAlert();
					backup_asset_list();
				}
			});
		}
	});
}

function updateble_asset_detail_init(rowDate)
{

}

function updateble_asset_delete(rowDate)
{
	if(rowDate)
	{
		edIds = rowDate.id;
	}
	else
	{
		var idArray = g_grid.getIdArray($("#updateble_table_div") ,{attr:"edId" ,chk:true});
		if (idArray.length == 0) 
		{
			g_dialog.operateAlert(null ,"	请选择要删除的资产！" ,"error");
			return false;
		}

		edIds = idArray.join(",");
	}
	g_dialog.operateConfirm(index_batch_delete_confirm_msg ,{
		saveclick : function (){
			um_ajax_post({
				url : updateble_asset_delete_url,
				paramObj : {edIds : edIds},
				successCallBack : function (){
					g_dialog.operateAlert();
					updateble_asset_list();
				}
			});
		}
	});
}

});
});