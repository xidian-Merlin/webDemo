$(document).ready(function (){
require(['/js/plugin/accordion/accordion.js',
		'/js/plugin/tab/tab.js',
		'/js/plugin/timepicker/timepicker.js',
		'/js/plugin/switch/switch.js',
		'/js/plugin/inputdrop/inputdrop.js',
		'/js/plugin/tree/tree.js',
		'/js/plugin/ABPanel/abPanel.js',
		'/js/plugin/wizard/wizard.js',
		'/js/plugin/asset/asset.js'],
		function (accordion ,tab ,timepicker ,switchBox ,inputdrop ,tree ,abPanel ,wizard ,asset){

// 左侧导航树url
var left_nav_tree_url = "AssetOperation/queryCntTreeList";

// 右侧资产url
var right_asset_list_url = "AssetOperation/queryAsset";
var right_asset_list_header = [
								  {text:'',name:"t",width:7,hideSearch:"hide",render:function (txt ,rowData){
								  		return '<img src="/img/'+rowData.ptMap+'" title="'+rowData.osTypeName+'" style="width:20px; height:20px;"></img>';
								  }},
								  {text:'资产名称',name:"assetName" ,width:21 ,align:"left" ,searchRender : function (el){
								  		el.append('<input type="hidden" search-data="type" value="3" searchCache/>');
								  		el.append('<input type="hidden" search-data="securityDomainId" searchCache/>');
								  		el.append('<input type="hidden" search-data="bussinessDomainId" searchCache/>');
								  		el.append('<input type="hidden" search-data="assetTypeId" searchCache/>');
								  		el.append('<input type="text" search-data="assetName" class="form-control input-sm" />');
								  }},
								  {text:'主IP',name:"mainIp",width:23.5 ,align:"left",searchRender:function (el){
								  		index_render_div(el ,{type:"ip"});
								  }},
								  {text:'责任人',name:"liablePersonName" ,width:20.5 ,align:"left",searchRender:function (el){
								  		//责任人搜索下拉列表
								  		var items = [];
								  		um_ajax_get({
											url: "AssetOperation/queryResponsePerson",
									    	isLoad: false,
									    	successCallBack:function (data){
									    		items.push({text:"----" ,id:"-1"});
									    		for (var i = 0; i < data.length; i++) {
									    			items.push({text:data[i].userName,id:data[i].userId});
													// el.find("[data-id=responsiblePersonId]").append('<option value="'+data[i].id+'">'+data[i].userName+'</option>');
												}

												g_formel.select_render(el ,{
													data : items,
													name : "liablePersonId"
												});
									    	}
									    });
								  }},
								  {text:'资产价值',name:"assetValueName" ,width:10.5 ,searchRender:function (el){
									  	var searchEl = $('<select class="form-control input-sm" data-id="assetValue" search-data="assetValue"></select>');
									  	el.append(searchEl);
									  	g_formel.asset_value_render(searchEl);
								  },render:function (txt ,rowData){
									  	if(txt == null){
									  		txt = "";
									  	}
									  	return '<i style="font-size:20px"></i><span class="dib prel" style="padding:0 3px;width:3em; background-color:'+dict_level_name_bgcolor[txt]+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
												+txt+'</span>';
								  }},
								  // {text:'资产状态',name:"edTempStatusName" ,width:15.5 ,searchRender:function (el){
								  // 		var searchEl = $('<select class="form-control input-sm" search-data="edTempStatus"></select>');
								  // 		el.append(searchEl);
								  // 		$(searchEl).oneTime(10 ,function (){
										// 	searchEl.select2({
										// 			  data: index_asset_status_with_all_list,
										// 			  width:"100%"
										// 			});
										// })
								  // }},
								  // {text:'资产状态',name:"edTempStatusName" ,width:15.5 ,searchRender:function (el){
								  // 		var searchEl = $('<select class="form-control input-sm" search-data="edTempStatus"></select>');
								  // 		el.append(searchEl);
								  // 		$(searchEl).oneTime(10 ,function (){
										// 	searchEl.select2({
										// 			  data: index_asset_status_with_all_list,
										// 			  width:"100%"
										// 			});
										// })
								  // }},

								  // {text:'操作系统类型',name:"osTypeName",width:13.5 ,searchRender:function (el){
								  // 		var searchEl = $('<select class="form-control input-sm" search-data="osType"></select>');
								  // 		el.append(searchEl);
								  //  	    g_formel.code_list_render({
								  //  	   		key : "osCodeList",
								  //  	   		osCodeEl : searchEl
								  //  	    });
								  // }},
								  {text:'使用状态',name:"assetStatusName",width:15.5 ,searchRender:function (el){
								  		var data = [
														{text:"----" ,id:"-1"},
								  						{text:"启用" ,id:"0"},
								  						{text:"停用" ,id:"2"}
											  		];
										g_formel.select_render(el ,{
											data : data,
											name : "assetStatus"
										});
								  }},
							  ];
var right_asset_list_oper = [
								{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:oper_asset_edit_template_init },
								{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:asset_delete }
						   ];

// 右侧资产详情url
var right_asset_detail_url = "AssetOperation/queryAssetDetail";

// 表单树类型
var form_tree_url = "AssetOperation/queryDialogTreeList";

// codeList
var form_codeList_url = "rpc/getCodeList";

// 自定义属性
var form_custom_attr_url = "AssetOperation/queryCustomProperty";

// 资产创建
var index_oper_asset_create_url = "AssetOperation/addAsset";

// 资产更新
var index_oper_asset_update_url = "AssetOperation/updAsset";

// 资产批量创建
var index_oper_asset_batch_create_url = "AssetOperation/batchAddAsset";

// 获取IP列表
var form_asset_ip_conflict_url = "AssetOperation/doBatchAssetIpConflict";

// 资产批量修改
var asset_batch_UpdAsset_url = "AssetOperation/batchUpdAsset";

// 资产删除
var asset_delete_url = "AssetOperation/delAsset";

// 资产批量删除
var oper_asset_batch_delete_url = "AssetOperation/delAsset";

// 导出excel
var export_excel_url = "AssetOperation/exportExcel";

// 导出html
var export_html_url = "AssetOperation/exportAssetHtml";

var list_current_node;

var list_current_type;

var list_current_data_name;

var form_custom_attr_list = [];

var form_current_step_num;

var el_accordion = $("#accordion");

var left_type = new HashMap();
left_type.put("3" ,"securityDomainId");
left_type.put("1" ,"bussinessDomainId");
left_type.put("4" ,"assetTypeId");

view_init();

event_init();

initLayout();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
	$("#accordion_icon").find("div").click(function (){
		list_current_type = $(this).attr("data-type");
		list_current_data_name = $(this).attr("data-name");;
		$("#accordion_icon").find("div").removeClass("active");
		$(this).addClass("active");
		var self = this;
		um_ajax_post({
			url : left_nav_tree_url,
			paramObj : {cntTree : 1},
			isLoad : false,
			successCallBack : function (data){
				tree.render($("#accordion") ,{
							zNodes : data[$(self).attr("data-name")],
							zTreeOnClick : accordion_click
						});
				tree.expandSpecifyNode($("#accordion") ,"roota");
				accordion_click(null ,null ,tree.selectNode($("#accordion") ,{key:"id",value:"roota"}));
			}
		});
	});

	g_formel.interval_refresh_render($("#refresh_btn") ,{
		elTable : $("#table_div"),
		hideOption : true,
		cbf:function(){
			accordion_init(true ,true);
		}
	});
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});

	// 资产查询按钮 点击
	$("#query_btn").click(function (){
		oper_asset_query_template_init();
	});

	// 资产新增按钮 点击事件
	$("#add_btn").click(function (){
		oper_asset_edit_template_init();
	});

	// 自定义列按钮
	$("#custom_col_btn").click(function (){
		oper_asset_custom_col_template_init();
	});

	// 自定义导出按钮
	$("#custom_export_btn").click(function (){
		oper_asset_custom_export_template_init();
	});

	// 批量增加按钮
	$("#batch_add_btn").click(function (){
		oper_asset_edit_template_init(null ,"batch");
	});

	// 批量删除按钮
	$("#batch_delete_btn").click(function (){
		asset_batch_delete();
	});

	// 批量修改按钮
	$("#batch_update_btn").click(function (){
		asset_batch_update();
	});


	$("#export_ul").find("li[data-id]").click(function (){
		export_excute($(this));
	});

	//导入模板下载
	$("#import_template_download_btn").click(function (){
		window.location.href = index_web_app + "assetTemplate/downNoHongLoadTemplate";
	});

	//导入按钮点击
	$("#import_btn").click(function (){
		import_template_init();
	});

	// 导入任务按钮点击事件
	$("#import_task_btn").click(function (){
		import_task_template_init();
	});
}

function initLayout()
{
	index_initLayout();
	$("#table_div").oneTime(500 ,function (){
		$("#table_div").height(
						$("#content_div").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							- 20
					  );
	});
}

function accordion_init(flag)
{
	um_ajax_post({
		url : left_nav_tree_url,
		paramObj : {cntTree : 1},
		isLoad : false,
		successCallBack : function (data){
			tree.render($("#accordion") ,{
						zNodes : data[list_current_data_name],
						zTreeOnClick : accordion_click
					});
			tree.expandSpecifyNode($("#accordion") ,"roota");
			tree.selectNode($("#accordion") ,{key:"id",value:list_current_node.id});
		}
	});
}

function accordion_click(event, treeId, treeNode)
{
	list_current_node = treeNode;

	var type = list_current_type;
	
	var tree = el_accordion.data("tree");

	var nodes = tree.getNodesByFilter(function (node){
		return true;
	} ,false ,treeNode);

	var queryId = [];

	for (var i = 0; i < nodes.length; i++) {
		queryId.push(nodes[i].id);
	}

	queryId.push(treeNode.id);

	var paramObj;

	if (type == 3)
	{
		paramObj = {type:type,securityDomainId:queryId.join(",")};
		if (treeNode.id == "roota")
		{
			paramObj.securityDomainId = "";
		}
	}
	else if (type == 1)
	{
		paramObj = {type:type,bussinessDomainId:queryId.join(",")};
		if (treeNode.id == "roota")
		{
			paramObj.bussinessDomainId = "";
		}
	}
	else if (type == 4)
	{
		paramObj = {type:type,assetTypeId:queryId.join(",")};
		if (treeNode.id == "roota")
		{
			paramObj.assetTypeId = "";
		}
	}

	asset_list({paramObj:paramObj});
}

function asset_list(opt)
{
	g_grid.render($("#table_div"),{
		header:right_asset_list_header,
		paramObj:opt.paramObj,
		url:right_asset_list_url,
		oper: right_asset_list_oper,
		operWidth:"100px",
		isLoad:opt.isLoad,
		pageSize:50,
		cbf:function (){
			$("#table_div").find("[search-data=type]").val(opt.paramObj.type);
			$("#table_div").find("[search-data=securityDomainId]").val(opt.paramObj.securityDomainId);
			$("#table_div").find("[search-data=bussinessDomainId]").val(opt.paramObj.bussinessDomainId);
			$("#table_div").find("[search-data=assetTypeId]").val(opt.paramObj.assetTypeId);
		},
		dbClick:function (rowData){
			asset.detailDialog({
				id : rowData.edId,
				mainIp : rowData.mainIp
			});
		},
		dbIndex:1
	});
}

function oper_asset_query_template_init()
{
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/oper_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=asset_query]"),{
				"width":"1100px",
				"height":"600px",
				"init":init,
				"saveclick":save_click
			});
		}
	});

	function init(el){
		um_ajax_get({
			url: "/data/asset/sec_tree.json",
			isLoad: false,
			successCallBack:function (data){
				inputdrop.renderTree(el.find('[id=assetTypeId]') ,data);
			}
		});
	}
	function save_click(){

	}
}

function oper_asset_edit_template_init(rowData ,type)
{
	asset.editDialog({
		rowData : rowData,
		type : type,
		cbf : function (){
			accordion_init(true ,true);
			g_grid.refresh($("#table_div"));
		}
	});
}

function oper_asset_custom_col_template_init()
{
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/oper_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=custom_col]"),{
				"width":"700px",
				"height":"500px",
				"init":init,
				"saveclick":save_click
			});
			function init(){

			}
			function save_click(){

			}
		}
	});
}

function oper_asset_custom_export_template_init()
{
	var el_left_table;
	var el_right_table;
	var el_export_table;
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/oper_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=custom_export]"),{
				 width:"900px",
				 init:init,
				 initAfter:initAfter,
				 saveclick:save_click,
				 title:"自定义导出",
				 btn_array:[
				 			   {id:"save_template" ,text:"保存模板" ,aClick:template_name_dialog}
				 		   ]
			});
			function init(el){
				el_left_table = el.find("[id=left_col_table]");
				el_right_table = el.find("[id=right_col_table]");
				el_export_table = el.find("[id=export_table]");

				el.find("[id=chevron-right]").click(function (){
					var data = g_grid.getData(el_left_table ,{chk:true});
					g_grid.removeData(el_left_table);
					g_grid.addData(el_right_table ,data);
				});

				el.find("[id=chevron-left]").click(function (){
					var data = g_grid.getData(el_right_table ,{chk:true});
					g_grid.removeData(el_right_table);
					g_grid.addData(el_left_table ,data);
				});
			}
			function initAfter(el){
				g_grid.render(el_left_table ,{
					data : [
							 {id:"assetName" ,wait_col:"资产名称"},
							 {id:"assetCode" ,wait_col:"资产编号"},
							 {id:"securityDomainName" ,wait_col:"安全域"},
							 {id:"bussinessDomainName" ,wait_col:"业务域"},
							 {id:"assetTypeName" ,wait_col:"资产类型"},
							 {id:"isOperationAssetName" ,wait_col:"是否运维资产"},
							 {id:"isComputeRiskName" ,wait_col:"是否计算风险"},
							 {id:"assetValueName" ,wait_col:"资产价值"},
							 {id:"osTypeName" ,wait_col:"操作系统类型"},
							 {id:"supplierName" ,wait_col:"生产厂商"},
							 {id:"assetStatusName" ,wait_col:"使用状态"},
							 {id:"edTempStatusName" ,wait_col:"资产状态"},
							 {id:"assetModelName" ,wait_col:"资产型号"},
							 {id:"hostName" ,wait_col:"主机名"},
							 {id:"cpu" ,wait_col:"CPU信息"},
							 {id:"memory" ,wait_col:"内存信息"},
							 {id:"webConsole" ,wait_col:"Web控制台"},
							 {id:"disk" ,wait_col:"硬盘信息"},
							 {id:"location" ,wait_col:"物理位置"},
							 {id:"liablePersonName" ,wait_col:"责任人"},
							 {id:"mainIp" ,wait_col:"主IP"},
							 {id:"mainMac" ,wait_col:"主MAC"},
							 {id:"createDate" ,wait_col:"注册时间"},
							 {id:"startDate2" ,wait_col:"启动时间"}
							 
						   ],
					header : [{text:"待选列" ,name:"wait_col"}],
					paginator : false,
					hideSearch : true
				});

				g_grid.render(el_right_table ,{
					data : [],
					header : [{text:"已选列" ,name:"wait_col"}],
					paginator : false,
					hideSearch : true
				});

				export_col_list();

				function export_col_list(){
					g_grid.render(el_export_table ,{
						url : "AssetOperation/queryExportTemplateInfo",
						header : [{text:"导出模板" ,name:"templateName" ,click:export_col_click}],
						oper : [{icon:"icon-trash" ,text:"删除" ,aclick:export_col_delete}],
						operWidth : "30px",
						paginator : false,
						hideSearch : true,
						allowCheckBox : false,
						tdClick : true
					});
				}

				function export_col_click(rowData){
					g_dialog.hide(el);
					var idArray = g_grid.getIdArray($("#table_div") ,{attr:"edId" ,chk:"true"});
					window.location.href = index_web_app + "AssetOperation/exportAssetTemplate" + "?exportEdId="+idArray.join(",")+"&exportTemplateOrder="+rowData.templateInfo+"&exportTemplateOrderText="+rowData.templateMemo;
				}

				function export_col_delete(rowData){
					g_dialog.operateConfirm(index_delete_confirm_msg ,{
						saveclick : function (){
							um_ajax_post({
								url : "AssetOperation/delExportTemplateInfo",
								paramObj : {
												templateId : rowData.templateId
											},
								maskObj : el_export_table,
								successCallBack : function (data){
									g_dialog.operateAlert();
									export_col_list();
								}
							});
						}
					});
				}
			}
			function save_click(el ,saveObj){
				var idArray = g_grid.getIdArray($("#table_div") ,{attr:"edId" ,chk:"true"});
				var dataArray = g_grid.getData(el_right_table ,{});
				if (dataArray.length == 0)
				{
					g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
					return false;
				}
				window.location.href = index_web_app + "AssetOperation/exportAssetTemplate" + "?exportEdId="+idArray.join(",")+"&exportTemplateOrder="
											+g_grid.getIdArray(el_right_table ,{attr:"id"})+"&exportTemplateOrderText="+g_grid.getIdArray(el_right_table ,{attr:"wait_col"});
				g_dialog.hide(el);
			}

			function template_name_dialog(el){
				$.ajax({
					type: "GET",
					url: "module/monitor_info/asset_info/oper_asset_tpl.html",
					success :function(data){
						g_dialog.dialog($(data).find("[id=custom_export_template_name]"),{
						   width:"500px",
						   saveclick:t_save_click,
						   title:"导出模板添加",
						});

						function t_save_click(t_el ,saveObj){
							um_ajax_post({
								url : "AssetOperation/addExportTemplateInfo",
								maskObj : t_el,
								paramObj : {
											templateName:saveObj.name,
											templateInfo:g_grid.getIdArray(el_right_table ,{attr:"id"}).join(","),
											templateMemo:g_grid.getIdArray(el_right_table ,{attr:"wait_col"}).join(",")
										   },
								successCallBack : function (data){
									g_dialog.operateAlert(el);
									g_dialog.hide(t_el);
									g_grid.refresh(el_export_table);
								}
							});
						}
					}
				});
			}
		}
	});
}

function asset_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此条记录么？" ,{
		saveclick : function (){
			um_ajax_post({
					url : asset_delete_url,
					paramObj : {edIds : rowData.edId},
					successCallBack : function (){
						// 弹出成功提示
						g_dialog.operateAlert();
						accordion_init(true ,true);
						g_grid.refresh($("#table_div"));
					}
				});
		}
	});
	
}

function asset_batch_delete(rowData)
{
	var data = g_grid.getData($("#table_div") ,{chk:true});
	if (data.length == 0)
	{
		// 弹出提示
		g_dialog.operateAlert(null ,"请选择要删除的记录!" ,"error");
		// 直接返回
		return false;
	}
	// 组装edId
	var buffer = [];
	for (var i = 0; i < data.length; i++) {
		buffer.push(data[i].edId);
	}
	g_dialog.operateConfirm("确认删除选中记录么？" ,{
		saveclick : function (){
			um_ajax_post({
				url : asset_delete_url,
				paramObj : {edIds : buffer.join(",")},
				successCallBack : function (){
					// 弹出成功提示
					g_dialog.operateAlert();
					accordion_init(true ,true);
					g_grid.refresh($("#table_div"));
				}
			});
		}
	});

}

function asset_batch_update(){
	var data = g_grid.getData($("#table_div") ,{chk:true});
	if (data.length == 0)
	{
		g_dialog.operateAlert(null ,"请选择要修改的记录!" ,"error");
		return false;
	}
	asset.batchEditDialog({
		cbf : function (){
			accordion_init(true ,true);
			g_grid.refresh($("#table_div"));
		}
	});
}


function export_excute(el)
{
	var idArray = g_grid.getIdArray($("#table_div") ,{attr:"edId" ,chk:"true"});
	window.location.href = index_web_app + el.attr("data-id") + "?exportEdId="+idArray.join(",");
}

function import_template_init(){
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/oper_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=import_template]"),{
				"width":"600px",
				title:"导入",
				"init":init,
				isDetail:true
			});
		}
	});

	function init(el){
		index_create_upload_el(el.find("[id=ptMap]"));

		var el_form = el.find("form");

		el.find("[class=a_btn]").click(function (){
			if (!el.find("[id=ptMap]").val())
			{
				g_dialog.operateAlert(el ,"请选择文件" ,"error");
				return false;
			}
			um_ajax_file(el_form ,{
				url : "assetTemplate/assetImport",
				maskObj : el,
				successCallBack : function (data){
					g_dialog.operateAlert(el);
					g_grid.addData(el_table ,data.errorList);
					g_grid.refresh($("#table_div"));
				}
			});
		});

		var el_table = el.find("[class=table_div]");
		g_grid.render(el_table ,{
			data:[],
			header:[
					{text:"行号" ,name:"rowNum"},
					{text:"错误信息" ,name:"message"},
				   ],
			paginator : false,
			hideSearch : true,
			allowCheckBox:false
		});
	}
}

function import_task_template_init(){
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/oper_asset_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=import_task_template]"),{
				 width:"800px",
				 title:"导入任务",
				 init:init,
				 isDetail:true
			});
		}
	});

	function init(el){
		var el_table = el.find("[class*=table_div]");
		g_grid.render(el_table ,{
			url : "AssetOperation/queryimportTaskList",
			header : [
						{text:"用户名" ,name:"userFullName"},
						{text:"开始导入时间" ,name:"importDate"},
						{text:"导入资产条数" ,name:"totalCnt"}
					 ],
			allowCheckBox : false,
			hideSearch : true
		});
	}
}

});
});