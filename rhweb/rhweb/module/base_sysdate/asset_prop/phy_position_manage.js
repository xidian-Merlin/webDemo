$(document).ready(function (){
require(['/js/plugin/tree/tree.js'] ,function (tree){

var list_url = "ComputerRoomLocation/queryComputerRoomLocationList";
var right_tree_url = "ComputerRoomLocation/queryTreeRight";
var phy_position_create_url="ComputerRoomLocation/addComputerRoomLocation";
var phy_position_update_url="ComputerRoomLocation/updComputerRoomLocation";
var phy_position_delete_url="ComputerRoomLocation/delComputerRoomLocation";
var list_col = [
					{text:'物理位置',name:"ldName",align:"left",searchRender:function (el){
						el.append('<input type="hidden" search-data="ldNo" value="-1" searchCache/>');
					}}
			   ];
var index_oper = [
					{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				 ];

var el_table_div = $("#table_div1");

var current_selected_node_id = -1;

view_init();

event_init();

initLayout();

phy_position_type_tree();

phy_position_list({paramObj:null,isLoad:true,maskObj:"body"});

function phy_position_type_tree()
{
	um_ajax_post({
		url : "ComputerRoomLocation/queryTreeList",
		successCallBack : function (data){
			tree.render($("#position_tree") ,{
				zNodes : data,
				expandNode : -1,
				selectNode : current_selected_node_id,
				zTreeOnClick : function (event, treeId, treeNode){
					current_selected_node_id = treeNode.id;
					right_tree_list({
							paramObj:{ldNo:treeNode.id},
							isLoad:true,
							maskObj:el_table_div,
						}
					);
				}
			});
		}
	});
}

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

	$("#batch_delete_btn").click(function (){
		index_list_batch_delete();
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

function phy_position_list(option)
{
	g_grid.render($("#table_div1"),{
		 header:list_col,
		 oper: index_oper,
		 operWidth:"100px",
		 url:list_url,
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init,
		 hideSearch : true
	});
}

function right_tree_list(option)
{
	g_grid.render($("#table_div1"),{
		 header:list_col,
		 oper: index_oper,
		 operWidth:"100px",
		 url:right_tree_url,
		 paramObj : option.paramObj,
		 isLoad : option.isLoad,
		 maskObj : option.maskObj,
		 dbClick : detail_template_init,
		 hideSearch : true
	});
}

function edit_template_init(rowData)
{
	var title = rowData ? "物理位置修改" : "物理位置添加";
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_prop/phy_position_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=phy_position_edit_query_template]"),{
				width:"500px",
				init:init,
				title:title,
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		if (rowData)
		{
			$(el).umDataBind("render" ,rowData);
		}
	}

	function save_click(el ,saveObj)
	{
		if (!g_validate.validate(el)){
			return false;
		}
		var flag_url = phy_position_create_url;
		saveObj.pldNo = current_selected_node_id;
		if(rowData){
			flag_url = phy_position_update_url;
			saveObj.pldNo = rowData.pldNo;
			saveObj.ldNo = rowData.ldNo;
		}
		um_ajax_post({
			url : flag_url,
			paramObj: saveObj,
			maskObj:el,
			successCallBack : function(data){
				g_dialog.hide(el);
				right_tree_list({paramObj:{ldNo:current_selected_node_id},isLoad:true,maskObj:el_table_div});
				phy_position_type_tree();
				g_dialog.operateAlert(null ,"操作成功");
			}
		});

	}
}

function detail_template_init(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_prop/phy_position_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=phy_position_detail_template]"),{
				width:"500px",
				init:init,
				title:"物理位置详细信息",
				isDetail:true
			});
		}
	});

	function init(el)
	{
		$(el).umDataBind("render" ,rowData);
	}

}

function index_list_delete(rowData)
{
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick:function(){
			um_ajax_post({
				url:phy_position_delete_url,
				paramObj:{pldNo:rowData.ldNo},
				successCallBack:function(data){
					right_tree_list({paramObj:{ldNo:current_selected_node_id},isLoad:true,maskObj:el_table_div});
					phy_position_type_tree();
					g_dialog.operateAlert(null ,"删除成功");
					return true;
				}
			})

		}
	});
}
function index_list_batch_delete(rowData)
{
	var phy_position_attributed_id = [];

	var rowData = g_grid.getData($("#table_div1") ,{
		chk : true
	});

	for(var i=0, len=rowData.length; i<len;i++){
		phy_position_attributed_id.push(rowData[i].ldNo);
	}

	if(phy_position_attributed_id.length == 0){
		g_dialog.operateAlert(null ,index_select_one_at_least_msg ,"error");
		return false;
	}

	phy_position_attributed_id = phy_position_attributed_id.join(",");
	g_dialog.operateConfirm("确认删除选中的记录么",{
		saveclick : function(){
			um_ajax_post({
				url : phy_position_delete_url,
				paramObj : {pldNo:phy_position_attributed_id},
				successCallBack : function(data){
					right_tree_list({paramObj:{ldNo:current_selected_node_id},isLoad:true,maskObj:el_table_div});
					phy_position_type_tree();
					g_dialog.operateAlert(null,"操作成功！");
				}
			});
			return true;
		}
	});
}


});
});