$(document).ready(function (){
require(['tree'] ,function (tree){
$("#content_div").addClass("appbgf");

var left_menu_tree_url = "sysconfig/menuconfig/queryMenuTree";

var left_menu_tree_add_node_url = "sysconfig/menuconfig/addMenu";

var left_menu_tree_delete_node_url = "sysconfig/menuconfig/delMenu";

var right_form_menu_update_url = "sysconfig/menuconfig/updMenu";

var left_menu_tree_do_drop_url = "sysconfig/menuconfig/doDrop";

var orig_parent_id;

event_init();

menu_tree_get("root");

function event_init()
{

	$("[data-type=select]").select2({
    	width : "100%"
    });

	g_validate.init($("#form"));

	$("#submit_btn").click(function (){
		if (g_validate.validate($("#form")))
		{
			menu_form_update();
		}
		
	});
}

var add_btn_click_flag = false;

var el_menu_tree = $("#menu_tree");

function menu_tree_get(expandId)
{
	um_ajax_get({
		url : left_menu_tree_url,
		maskObj : "body",
		successCallBack : function (data){
			for (var i = 0; i < data.length; i++)
			{
				data[i].id = data[i].name;
			}
			data.push({id:"root" ,parent:"root1" ,title:"全部"});
			tree.render($("#menu_tree") ,{
				zNodes : data,
				edit : true,
				dragable : true,
				showRemoveBtn : true,
				showAddBtn : true,
				pId:"parent",
				label:"title",
				id:"id",
				zTreeOnClick : function (event, treeId, treeNode){
					g_validate.reset($("#form"));
					$("[data-id=location]").removeAttr("disabled");
					if (treeNode.id == "root")
					{
						$("#mask").show();
						add_btn_click_flag = false;
						return;
					}
					if (!add_btn_click_flag)
					{
						if(treeNode.children)
						{
							$("[data-id=location]").attr("disabled" ,"disabled");
						}
						$("#panel").umDataBind("render" ,treeNode);
						if (treeNode.roleType)
						{
							$("[data-id=roleType]").val(treeNode.roleType.split(","));
						}
						$("#mask").hide();
						$("#panel").hide();
						$("#panel").oneTime(50 ,function (){
							$("[data-id=roleType]").trigger("change");
							$("#panel").show();
						});
					}
					add_btn_click_flag = false;
				},
				beforeDrop : function(treeId, treeNodes, targetNode, moveType, isCopy) {	
					orig_parent_id = treeNodes[0].pId;
					return true;
				},
				onDrop : function (event, treeId, treeNodes, targetNode, moveType, isCopy){
					var paramObj = new Object();
					paramObj.sourceId = treeNodes[0].id;
					paramObj.sourcePid = orig_parent_id;
					paramObj.targetId = targetNode.id;
					paramObj.targetPid = targetNode.pId;
					if (moveType == "prev")
					{
						paramObj.point = "top";
					}
					if (moveType == "next")
					{
						paramObj.point = "bottom";
					}
					if (moveType == "inner")
					{
						paramObj.point = "append";
					}
					
					um_ajax_post({
						url : left_menu_tree_do_drop_url,
						paramObj : paramObj,
						successCallBack : function (){
							menu_tree_get("root");
						}
					});

				},
				beforeRemove : function (treeId, treeNode){
					if (treeNode.id == "root")
					{
						g_dialog.operateAlert($("#left_div") ,"顶级节点不允许删除。" ,"error");
						return false;
					}
					g_dialog.operateConfirm("确定执行删除操作么?" ,{
						saveclick : function (){
							um_ajax_post({
								url : left_menu_tree_delete_node_url,
								paramObj : {id : treeNode.id},
								successCallBack : function (){
									el_menu_tree.data("tree").removeNode(treeNode);
									g_dialog.operateAlert($("#menu_div"));
									$("#mask").hide();
								}
							});
						}
					});
					return false;
				},
				zTreeOnAdd:function (treeId, treeNode ,newNode){
					g_dialog.waitingAlert();
					um_ajax_post({
						url : left_menu_tree_add_node_url,
						isLoad : false,
						paramObj : {"parent":treeNode.id ,"menuName":"*新节点"},
						successCallBack : function (data){
							g_dialog.waitingAlertHide();
							g_dialog.operateAlert($("#menu_div"));
							menu_tree_get(treeNode.id);
						}
					});
					add_btn_click_flag = true;
				}
			});

			// 默认展开第一级
			!expandId && (expandId = "root")
			var treeObj = el_menu_tree.data("tree");
			var nodes = treeObj.getNodesByParam("id",expandId, null);
			treeObj.expandNode(nodes[0] ,true ,false);
		}
	});
}

function menu_form_update()
{
	g_dialog.waitingAlert();
	var saveObj = $("#form").umDataBind("serialize");
	saveObj.roleType = !!saveObj.roleType?saveObj.roleType.join(","):saveObj.roleType;
	um_ajax_post({
		url : right_form_menu_update_url,
		isLoad : false,
		paramObj : saveObj,
		successCallBack : function (){
			g_dialog.waitingAlertHide();
			g_dialog.operateAlert();
			menu_tree_get(saveObj.pId);
		}
	});
}


})
});