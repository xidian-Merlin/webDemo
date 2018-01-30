$(document).ready(function (){
require(['/js/plugin/accordion/accordion.js',
		'/js/plugin/tree/tree.js'],function (accordion ,tree){

var left_nav_tree_url = "assetInterfaceManage/queryCntTreeList";

var el_accordion = $("#accordion");

var list_current_node;

var list_current_type;

var list_current_data_name;

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
}

function event_init()
{
	$("#candidate_asset_btn").click(function(){
		candidate_asset_tem_init();
	});
	$("#delete_btn").click(function(){
		selected_asset_list_batch_delete();
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
	else if (type == 4)
	{
		paramObj = {type:type,assetTypeId:queryId.join(",")};
		if (treeNode.id == "roota")
		{
			paramObj.assetTypeId = "";
		}
	}

	selected_asset_list({paramObj:paramObj});
}

function selected_asset_list(opt ,paramObj ,isLoad)
{
	g_grid.render($("#table_div1"),{
		 header:[	
		 		  {text:'',name:"t",width:4,hideSearch:"hide"},
				  {text:'资产名称',name:"ed_name",width:24,align:"left",searchRender:function (el){
						el.append('<input type="text" search-data="assetName" class="form-control input-sm">');
						el.append('<input type="hidden" search-data="type" value="4" searchCache/>');
				  		el.append('<input type="hidden" search-data="securityDomainId" searchCache/>');
				  		el.append('<input type="hidden" search-data="assetTypeId" searchCache/>');
				  }},
				  {text:'资产IP',name:"ip",width:24,align:"left" ,searchRender:function (el){
						index_render_div(el ,{type:"ip"});
				  }},
				  {text:'代理服务器',name:"domain",width:24,hideSearch:true,searchRender:function (el){
				  }},
				  {text:'编码方式',name:"equipType",width:24,hideSearch:true,searchRender:function (el){
				  }}
				 ],
		 oper:[
				  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:selected_asset_list_update},
				  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:selected_asset_list_delete}
			   ],
		 operWidth:"90px",
		 url:"assetInterfaceManage/queryAssetList",
		 paramObj : opt.paramObj,
		 maskObj:"body",
		 dbIndex:1,
		 cbf:function (){
			$("#table_div1").find("[search-data=type]").val(opt.paramObj.type);
			$("#table_div1").find("[search-data=securityDomainId]").val(opt.paramObj.securityDomainId);
			$("#table_div1").find("[search-data=assetTypeId]").val(opt.paramObj.assetTypeId);
		 },
		 dbClick : selected_asset_detail,
		 hideSearch:true
	});
}

function selected_asset_detail(rowData)
{		
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/log_occur_source_config_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=selected_asset_detail_template]"),{
				width:"700px",
				init:init,
				isDetail:true,
				title:"已选资产详细信息",
				isDetail:true
			});
		}
	});
	function init(el)
	{
		el.umDataBind("render",rowData);
	}
}

function selected_asset_list_update(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/log_occur_source_config_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=selected_asset_edit_template]"),{
				width:"500px",
				init:init,
				title:"已选资产信息修改",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		el.umDataBind("render",rowData);
	}
	function save_click(el,saveObj)
	{
		if(!g_validate.validate(el))
		{
			return false;
		}
		um_ajax_post({
			url:"",
			paramObj:saveObj,
			isLoad:true,
			maskObj:"body",
			successCallBack:function(data){
				g_dialog.hide(el);
				g_dialog.operateAlert(null ,"操作成功！");
				selected_asset_list({paramObj:{}});
			}
		});
	}
}

function selected_asset_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除选中的记录么?" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : "",
				paramObj : {ed_id:ed_id},
				successCallBack : function(data){
					selected_asset_list({paramObj:{}});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function selected_asset_list_batch_delete()
{
	var dataArray = g_grid.getIdArray($("[id=table_div1]") ,{chk : true,attr:"ed_id"});
	if(dataArray.length == 0){
		g_dialog.operateAlert($("[id=table_div1]") ,index_select_one_at_least_msg ,"error");
		return false;
	}

	g_dialog.operateConfirm("确认删除选中的记录么?" ,{
		saveclick : function()
		{
			um_ajax_post({
				url : "",
				paramObj : {ed_ids:dataArray.join(",")},
				successCallBack : function(data){
					selected_asset_list({paramObj:{}});
					g_dialog.operateAlert(null ,"操作成功！");
				}
			});
		}
	});
}

function candidate_asset_tem_init()
{
	$.ajax({
		type: "GET",
		url: "module/sys_manage/monitor_config/log_occur_source_config_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=candidate_asset_template]"),{
				width:"800px",
				top:"6%",
				init:init,
				title:"待选资产",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		g_validate.init(el);
		g_grid.render(el.find("[id=table_div]"),{
			header:[
					{text:"资产名称",name:"ed_name"},
					{text:"资产IP",name:""},
					{text:"安全域",name:""},
					{text:"业务域",name:""}
					],
			url:"",
			paramObj:{},
			isLoad:true,
			maskObj:"body"
		});
	}

	function save_click(el,saveObj)
	{
		if(!g_validate.validate(el))
		{
			return false;
		}
		var dataArray = g_grid.getData($("[id=table_div]") ,{chk : true});
		if(dataArray.length == 0){
			g_dialog.operateAlert($("[id=table_div]") ,index_select_one_at_least_msg ,"error");
			return false;
		} 
		paramObj = saveObj;
		paramObj.assetStore = dataArray;
		um_ajax_post({
			url : "",
			paramObj : paramObj,
			successCallBack : function(data){
				selected_asset_list({paramObj:{}});
				g_dialog.operateAlert(null ,"操作成功！");
			}
		});
	}
}



});
});