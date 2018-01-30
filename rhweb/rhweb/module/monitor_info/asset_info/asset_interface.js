$(document).ready(function (){
require(['/js/plugin/accordion/accordion.js',
		'/js/plugin/tree/tree.js'],function (accordion ,tree){

var left_nav_tree_url = "assetInterfaceManage/queryCntTreeList";

var left_type = new HashMap();
left_type.put("3" ,"securityDomainId");
left_type.put("1" ,"bussinessDomainId");
left_type.put("4" ,"assetTypeId");

var el_accordion = $("#accordion");

var list_current_node;

var list_current_type;

var list_current_data_name;

view_init();

event_init();

initLayout();

// asset_interface_list();

$("#accordion_icon").find("div").eq(0).click();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
	$("#accordion_icon").find("div").click(function (){
		list_current_type = $(this).attr("data-type");
		list_current_data_name = $(this).attr("data-name");
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
		elTable : $("#table_div1"),
		hideOption : true
	});
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
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

	asset_interface_list({paramObj:paramObj});
}

function asset_interface_list(opt ,paramObj ,isLoad)
{
	g_grid.render($("#table_div1"),{
		 header:[
		 		  {text:'',name:"t",width:5,hideSearch:"hide"},
				  {text:'资产名称',name:"ed_name",width:19,align:"left",searchRender:function (el){
						el.append('<input type="text" search-data="assetName" class="form-control input-sm">');
						el.append('<input type="hidden" search-data="type" value="3" searchCache/>');
				  		el.append('<input type="hidden" search-data="securityDomainId" searchCache/>');
				  		el.append('<input type="hidden" search-data="bussinessDomainId" searchCache/>');
				  		el.append('<input type="hidden" search-data="assetTypeId" searchCache/>');
				  }},
				  {text:'主IP',name:"ip",width:19,align:"left" ,searchRender:function (el){
						index_render_div(el ,{type:"ip"});
				  }},
				  {text:'安全域',name:"domain",hideSearch:true,width:19,searchRender:function (el){
				  }},
				  {text:'资产类型',name:"equipType",hideSearch:true,width:19,searchRender:function (el){
				  }},
				  {text:'接口数量',name:"portSumNum",width:19,hideSearch:true}
				 ],
		 oper:[
				  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:asset_interface_list_update_dialog}
			   ],
		 operWidth:"90px",
		 url:"assetInterfaceManage/queryAssetList",
		 paramObj : opt.paramObj,
		 maskObj:"body",
		 dbIndex:1,
		 cbf:function (){
			$("#table_div1").find("[search-data=type]").val(opt.paramObj.type);
			$("#table_div1").find("[search-data=securityDomainId]").val(opt.paramObj.securityDomainId);
			$("#table_div1").find("[search-data=bussinessDomainId]").val(opt.paramObj.bussinessDomainId);
			$("#table_div1").find("[search-data=assetTypeId]").val(opt.paramObj.assetTypeId);
		 },
		 dbClick : asset_interface_detail,
		 allowCheckBox : false
	});
}

function asset_interface_detail(rowData)
{		
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/asset_interface_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=asset_interface_template_detail]"),{
				width:"700px",
				init:init,
				initAfter:initAfter,
				isDetail:true,
				title:"资产接口查看",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{			
		el.find("[id=asset_interface_template_detail]").umDataBind("render" ,rowData);					
	}

	function initAfter(el)
	{
		var dialog_table_url = "assetInterfaceManage/queryAssetInterface";
		var dialog_table_header = [
			{text:'接口索引',name:"interface_ind"},
			{text:'接口名称',name:"interface_name"},
			{text:'接口描述',name:"interface_desc"},
			{text:'接口类型',name:"interface_type"},
			{text:'接口带宽(M)',name:"interface_speed",render:function(data){
					return Math.round(data/(1000*1000));
			}}
	   ];
		g_grid.render(el.find("[id=dialog_table]"),{
			url:dialog_table_url,
			header:dialog_table_header, 
	 		paramObj : {ed_id:rowData.ed_id},
			allowCheckBox:false,
			maskObj:el.find("[id=dialog_table]"),
			paginator:false,
			hideSearch:true
		});
	}

	function save_click(el)
	{
		g_dialog.hide(el);
	}
}

function asset_interface_list_update_dialog(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/monitor_info/asset_info/asset_interface_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=template_update]"),{
				width:"800px",
				height:"500px",
				init:init,
				title:"资产接口修改",
				isDetail:true,
				closeCbf : function (){
					g_grid.refresh($("#table_div1"));
				}
			});
		}
	});

	function init(el)
	{
		var template_update = $("[data-id=template_update_div]");
		var paramTmp = new Object();
		paramTmp.ed_id = rowData.ed_id;
		template_update.umDataBind("render" ,rowData);

		interface_list();

		template_update.find("[data-id=template_update_add_btn]").click(function (){
			interface_add_update_dialog();
		});

		template_update.find("[data-id=template_datch_delete_btn]").click(function (){
			index_update_batch_delete(rowData);
		});

		template_update.find('[data-id=template_batch_show]').click(function (){
			index_update_batch_show(rowData);
		});

		template_update.find('[data-id=template_batch_hide]').click(function (){
			index_update_batch_hide(rowData);
		});

		template_update.find("[data-id=template_scan_btn]").click(function (){
			g_dialog.operateConfirm("本次扫描会覆盖上一次扫描结果,需要对资产进行接口扫描吗？" ,{
				saveclick : function()
				{
					$.ajax({
						type: "GET",
						url: "module/monitor_info/asset_info/asset_interface_tpl.html",
						success :function(data)
						{
							g_dialog.dialog($(data).find("[id=asset_interface_scan_template_detail]"),{
								width:"600px",
								title:"接口扫描",
								init:init,
								initAfter:initAfter,
								saveclick:save_click
							});
						}
					});

					function init(el)
					{
						el.umDataBind("render" ,rowData);
						
						el.find("[data-id=result]").text("扫描中...");
					}

					function initAfter(el)
					{	
						um_ajax_post({
							url : "assetInterfaceManage/scanAsset",
							paramObj : {"ed_id":rowData.ed_id},
							maskObj : el,
							successCallBack : function(rData){
								rowData.result = rData.result;
								el.find("[id=asset_interface_scan_template_detail]").umDataBind("render" ,rowData);
							},
							failCallBack : function (){
								el.find("[data-id=result]").text("扫描失败");
							}
						});
					}

					function save_click(el)
					{
						interface_list({maskObj : $("#tablegrid1")});
						g_dialog.operateAlert(null ,"操作成功！");
						g_dialog.hide(el);
					}							
				}
			});				
			// 	maskObj : template_update.parent()
		});


		function interface_list()
		{
			g_grid.render(template_update.find("[data-id=tablegrid1]"),{
				header:[
						  {text:'接口索引',name:"interface_ind"},
						  {text:'接口名称',name:"interface_name"},
						  {text:'接口描述',name:"interface_desc"},
						  {text:'接口类型',name:"interface_type"},
						  {text:'接口带宽(M)',name:"interface_speed",render:function(data){
						  		return Math.round(data/(1000*1000));
						  }},
						  {text:'显示',name:'is_visuable',render:function (data){
						  	
						  	return data=='1'?'不显示':'显示';
						  }}
						 ],
				oper:[
						  {icon:"icon-edit" ,text:"修改" ,aclick:interface_update_dialog},
						  {icon:"icon-trash" ,text:"删除" ,aclick:interface_delete_dialog}
					   ],
				operWidth:"100px",
				paginator : false,
				url : "assetInterfaceManage/queryAssetInterface",
				paramObj : {ed_id:rowData.ed_id},
				maskObj:$("[data-id=tablegrid1]"),
				hideSearch:true
			});
		}

		function interface_add_update_dialog(rData)
		{
			var title = rData ? "接口修改" : "接口新增";
			var add_update_url = "assetInterfaceManage/addPort";
			if (rData)
			{
				add_update_url = "assetInterfaceManage/updPort";
			}
			$.ajax({
				type: "GET",
				url: "module/monitor_info/asset_info/asset_interface_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=template_add]"),{
						width:"500px",
						height:"450px",
						title :title,
						init:init,
						saveclick:save_click
					});
				}
			});
			function init()
			{
				var template_add_div = $("[data-id=template_add_div]");
				g_validate.init(template_add_div.find("form"));
				if (rData)
				{
					console.log(rData);
					template_add_div.umDataBind("render" ,rData);
					template_add_div.find("[data-id=interface_speed]").val(parseInt(rData.interface_speed)/(1000*1000));
				}
			}
			function save_click()
			{
				var template_add_div = $("[data-id=template_add_div]");
				if (g_validate.validate(template_add_div))
				{
					var portStore = template_add_div.umDataBind("serialize");
					portStore.interface_speed = (portStore.interface_speed * 1000 * 1000);
					var oldStore ;
					if (rData)
					{
						oldStore = rData;
						oldStore.ed_id = rowData.ed_id;
					}
					var equipStore = rowData;
					var obj = {};
					obj.portStore = portStore;
					obj.equipStore = equipStore;
					obj.oldStore = oldStore;
				
					um_ajax_post({
						url : add_update_url,
						paramObj : obj,
						successCallBack : function (){
							g_dialog.operateAlert(template_update.parent() ,"编辑成功!");
							interface_list();
						}
					});
					return true;
				}
			}
		}

		function interface_update_dialog(rData)
		{
			interface_add_update_dialog(rData);
		}

		function interface_delete_dialog(rData)
		{
			g_dialog.operateConfirm("确认进行删除操作么?",{
				saveclick:function (){
					var interfaceStore = rData;
					var equipStore = rowData;
					var obj = {};
					obj.interfaceStore = interfaceStore;
					obj.equipStore = equipStore;
					um_ajax_post({
						url : "assetInterfaceManage/delPort",
						paramObj : obj,
						successCallBack : function (){
							g_dialog.operateAlert(template_update.parent() ,"删除成功!");
							interface_list();
							//g_grid.refresh($("#table_div1"));
						}
					});
				}
			});
		}
	}

	function index_update_batch_delete(rowData)
	{
		var dataArray = g_grid.getData($("[data-id=tablegrid1]") ,{chk : true});

		if(dataArray.length === 0){
			g_dialog.operateAlert($("[data-id=tablegrid1]") ,index_select_one_at_least_msg ,"error");
			return false;
		}

		// var data = g_grid.getData($("[data-id=tablegrid1]") ,{chk:true});

		// var tmp=[];
		var interfaceStore = dataArray;
		var equipStore = [];
		for (var i = 0; i < dataArray.length; i++) {
			equipStore.push(rowData);
		}

		g_dialog.operateConfirm("确认删除选中的记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : "assetInterfaceManage/batchDelPort",
					paramObj : {interfaceStore:dataArray ,equipStore:equipStore},
					successCallBack : function(data){
						g_grid.refresh($("[data-id=tablegrid1]") ,{
							queryBefore : function (paramObj){
								paramObj.ed_id = rowData.ed_id;
							}
						});
						//g_grid.refresh($("#table_div1"));
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function index_update_batch_show(rowData){
		var dataArray = g_grid.getData($("[data-id=tablegrid1]") ,{chk : true});

		if(dataArray.length === 0){
			g_dialog.operateAlert($("[data-id=tablegrid1]") ,index_select_one_at_least_msg ,"error");
			return false;
		}

		// var data = g_grid.getData($("[data-id=tablegrid1]") ,{chk:true});

		// var tmp=[];
		var interfaceStore = dataArray;
		var equipStore = [];
		for (var i = 0; i < dataArray.length; i++) {
			equipStore.push(rowData);
		}

		um_ajax_post({
			url : "assetInterfaceManage/batchSetInterfaceVisuable",
			paramObj : {interfaceStore:dataArray ,equipStore:equipStore},
			successCallBack : function(data){
				g_grid.refresh($("[data-id=tablegrid1]") ,{
					queryBefore : function (paramObj){
						paramObj.ed_id = rowData.ed_id;
					}
				});
				//g_grid.refresh($("#table_div1"));
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
	}
	function index_update_batch_hide(rowData){
		var dataArray = g_grid.getData($("[data-id=tablegrid1]") ,{chk : true});

		if(dataArray.length === 0){
			g_dialog.operateAlert($("[data-id=tablegrid1]") ,index_select_one_at_least_msg ,"error");
			return false;
		}

		// var data = g_grid.getData($("[data-id=tablegrid1]") ,{chk:true});

		// var tmp=[];
		var interfaceStore = dataArray;
		var equipStore = [];
		for (var i = 0; i < dataArray.length; i++) {
			equipStore.push(rowData);
		}

		um_ajax_post({
			url : "assetInterfaceManage/batchSetInterfaceUnVisuable",
			paramObj : {interfaceStore:dataArray ,equipStore:equipStore},
			successCallBack : function(data){
				g_grid.refresh($("[data-id=tablegrid1]") ,{
					queryBefore : function (paramObj){
						paramObj.ed_id = rowData.ed_id;
					}
				});
				//g_grid.refresh($("#table_div1"));
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
	}
}


});
});