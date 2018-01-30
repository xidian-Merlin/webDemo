$(document).ready(function(){
require(["/js/plugin/inputdrop/inputdrop.js",
		"/js/plugin/tree/tree.js"] ,function (inputdrop ,tree){

var emergency_map = new HashMap();
emergency_map.put("1" ,"未处理");
emergency_map.put("3" ,"处理中");
emergency_map.put("4" ,"已处理");

$("#content_div").addClass("appbgf");

var url = {
	biz_area_create : "bussinessdomainmanage/addSave",
	biz_area_edit   : "bussinessdomainmanage/updSave",
	biz_area_delete : "bussinessdomainmanage/doDel",
	biz_area_tree   : "bussinessdomainmanage/queryTreeChildrenList",
	biz_area_detail : "bussinessdomainmanage/queryBussinessDetail",
	drop_url : 		  "bussinessdomainmanage/updDomaSort",
	user_detail :     "staffmanage/queryStaffList",
	user_batch_del :  "staffmanage/doDelAll",
	user_del :        "staffmanage/delStaff",
	user_info_edit :  "staffmanage/updStaff",
	user_info_add :   "staffmanage/addStaff",
	template :        "/module/base_sysdate/asset_manage/biz_area_manage_tpl.html",
	sec_check_list : "securitycheck/preSecurityCheck",
	sec_check_add : "securitycheck/addSecurityCheck",
	sec_check_update : "securitycheck/updateSecurityCheck",
	sec_check_delete : "securitycheck/delSecurityCheck",
	emegency_list : "emergencyevent/preEmergencyEvent",
	emegency_add : "emergencyevent/addEmergencyEvent",
	emegency_update : "emergencyevent/updateEmergencyEvent",
	emegency_delete : "emergencyevent/delEmergencyEvent"
};

var header = {
	user :      [
					{text : "姓名" ,name : "name"},
					{text : "性别" ,name : "sexName"},
					{text : "职务" ,name : "staffPost"},
					{text : "办公电话" ,name : "mobile"},
				],
	sec_check : [
					{text : "检查名称" ,name : "checkName"},
					{text : "检查时间" ,name : "checkDate"},
					{text : "检查结果" ,name : "introduction"},
					{text : "附件" ,name : "appendixName"}
				],
	emergency :  [
					{text : "告警名称" ,name : "emergencyEventName"},
					{text : "发生时间" ,name : "emergencyEventDate"},
					{text : "上报部门" ,name : "reportUnit"},
					{text : "处置部门" ,name : "disposalUnit"},
					{text : "告警结果" ,name : "emergencyEventStatus" ,render : function (txt){return emergency_map.get(txt)}}
				],
};
var oper = {
	user : [
					{icon : "rh-icon rh-edit" ,text : "修改" ,aclick : user_edit_template_init},
					{icon : "rh-icon rh-delete" ,text : "删除" ,aclick : user_form_delete}
				],
	sec_check : [
					{icon : "rh-icon rh-edit" ,text : "修改" ,aclick : sec_check_edit_template_init},
					{icon : "rh-icon rh-delete" ,text : "删除" ,aclick : sec_check_delete}
				],
	emergency : [
					{icon : "rh-icon rh-edit" ,text : "修改" ,aclick : emergency_edit_template_init},
					{icon : "rh-icon rh-delete" ,text : "删除" ,aclick : emergency_delete}
				]
};

var current_selected_node_id = "";
var current_parent_id = "";
var tree_nodes;
var target_node = current_parent_id;
var add_btn_click_flag = false;
var orig_parent_id;


view_init();
event_init();

function view_init() 
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");

	tree_init();

	g_formel.code_list_render({
		key : "agentConfigList",
		agentEl : $("#nodeId")
	});

	user_grid_init();
	sec_check_grid_init();
	emergency_grid_init();
	g_validate.clear($("#biz_area_form"));
	g_validate.init($("#biz_area_form"));

	$("#biz_tree").slimscroll();
}

//初始化
function event_init() 
{
	$("#user_add_btn").click(function () 
	{
		user_edit_template_init();
	});

	$("#user_remove_btn").click(function () 
	{
		user_remove();
	});

	$("#biz_area_edit_submit").click(function () 
	{
		submit_click_init();
	});

	$("#sec_add_btn").click(function (){
		sec_check_edit_template_init();
	});

	$("#emergency_add_btn").click(function (){
		emergency_edit_template_init();
	});
}

function user_grid_init() 
{
	g_grid.render($("#user-um-grid-table-div") ,{
		header : header.user,
		oper : oper.user,
		operWidth : "100px",
		data : [],
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : true
	});
}

function sec_check_grid_init() 
{
	g_grid.render($("#sec-um-grid-table-div") ,{
		header : header.sec_check,
		oper : oper.sec_check,
		operWidth : "100px",
		data : [],
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : false
	});
}

function emergency_grid_init() 
{
	g_grid.render($("#emergency-um-grid-table-div") ,{
		header : header.emergency,
		oper : oper.emergency,
		operWidth : "100px",
		data : [],
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : false
	});
}

function base_form_init() 
{
	var data_null = {domaName : "" ,domaAbbreviation : "" ,faxNo : "" ,complaintTel : "" ,officeTel : "" ,email : "" ,domaAddress : "" ,nodeName : "" ,domaMemo : ""};
	$("#base_form").umDataBind("render" ,data_null);
	inputdrop.clearSelect($("#nodeId"));
}


function tree_init(treeName)
{
	um_ajax_get({
		url : url.biz_area_tree,
		paramObj : {domaId : "" ,flag : "1"},
		successCallBack : function (data) 
		{
			for (var i = 0; i < data.length; i++) 
			{
				data[i].children = [];
				data[i].dropInner = false;
			}
			// 加一个父节点
			//data.businessDomainTreeStore.push({id:"-1" ,parent:"-2" ,label:"全部"});
			data.push({domaId:"-1" ,pdomaId:"-2" ,domaName:"业务域"});
			tree.render($("#biz_tree") ,{
				zNodes : data,
				edit : true,
				expand : true,
				id  : "domaId",
				pId : "pdomaId",
				label : "domaName",
				showRemoveBtn : true,
				showAddBtn : true,
				zTreeOnClick : function (event ,treeId ,treeNode) 
				{
					if (treeNode.id=="-1" && !add_btn_click_flag)
					{
						return false;
					}
					$("#mask").hide();
					if (add_btn_click_flag) 
					{
						add_btn_click_flag = false;
						current_selected_node_id = "";
						g_mask.mask($("#user_info_div"));
						g_mask.mask($("#sec_chck_div"));
						g_mask.mask($("#emergency_event_div"));
						return;
					}

					if (treeNode.isAdd) 
					{
						g_mask.mask($("#user_info_div"));
						g_mask.mask($("#sec_chck_div"));
						g_mask.mask($("#emergency_event_div"));
						current_selected_node_id = "";
						base_form_init();
						user_grid_init();
						sec_check_grid_init();
						emergency_grid_init();
					}
					else 
					{
						g_mask.maskRemove($("#user_info_div"));
						g_mask.maskRemove($("#sec_chck_div"));
						g_mask.maskRemove($("#emergency_event_div"));
						current_selected_node_id = treeNode.id;
						current_parent_id = treeNode.pId;
						tree_click(current_selected_node_id);
						user_list();
						sec_check_list();
						emergency_list();
					}

					add_btn_click_flag = false;

				},
				beforeRemove : function (treeId, treeNode) 
				{			
					if(treeNode.id == "-1")
					{
						g_dialog.operateAlert(null ,"禁止删除全部！" ,"error");
						return false;
					}
					else if (!treeNode.domaId)
					{
						var treeObj = $.fn.zTree.getZTreeObj(treeId);
						treeObj.removeNode(treeNode);
						g_mask.maskRemove($("#user_info_div"));
						g_mask.maskRemove($("#sec_chck_div"));
						g_mask.maskRemove($("#emergency_event_div"));
						$("#mask").show();
						return false;
					}
					else 
					{
						g_mask.maskRemove($("#user_info_div"));
						g_mask.maskRemove($("#sec_chck_div"));
						g_mask.maskRemove($("#emergency_event_div"));
						$("#mask").show();
						tree_remove(treeNode);
					}
					return false;
				},
				zTreeOnAdd : function (treeId, treeNode) 
				{
					add_btn_click_flag = true;
					current_parent_id = treeNode.id;
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					if (treeNode.id != "-1" && !treeNode.domaId)
					{
						return false;
					}
					var newNode = treeObj.addNodes(treeNode ,{
						name : "*新节点",
						isAdd : true,
						dropInner : false,
						drag : false
					});

					$("#biz_tree").oneTime(10 ,function (){
						tree.selectNode($("#biz_tree") ,{
							key : "name",
							value : "*新节点"
						});
					});

					$("#base_form").umDataBind("reset");
					inputdrop.clearSelect($("#nodeId"));
					user_grid_init();
					sec_check_grid_init();
					emergency_grid_init();
					$("[data-id=domaMemo]").val("");
				},
				beforeDrop : function(treeId, treeNodes, targetNode, moveType, isCopy) {	
					orig_parent_id = treeNodes[0].pId;
					return true;
				},
				onDrop : function (event ,treeId ,treeNodes ,targetNode ,moveType ,isCopy) 
				{
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
						url : url.drop_url,
						paramObj : paramObj,
						successCallBack : function (){
							g_dialog.operateAlert();
							tree_init();
							current_selected_node_id = "";
							base_form_init();
							user_grid_init();
							sec_check_grid_init();
							emergency_grid_init();
							$("#mask").show();
						}
					});
				},
				dropPrev : function (treeId, nodes, targetNode){
					if (nodes[0].pId == targetNode.pId && !targetNode.isAdd)
					{
						return true;
					}
					else
					{
						return false;
					}
				},
				dropNext : function (treeId, nodes, targetNode){
					if (nodes[0].pId == targetNode.pId && !targetNode.isAdd)
					{
						return true;
					}
					else
					{
						return false;
					}
				}
			});

			if (treeName)
			{
				$("#biz_tree").oneTime(10 ,function (){
					var node = tree.selectNode($("#biz_tree") ,{
						key : "name",
						value : treeName
					});
					current_selected_node_id = node.domaId;
				});
			}
			
		}
	});
}


function tree_click(id)
{
	if(!current_selected_node_id) 
	{
		return;
	}

	um_ajax_get({
		url : url.biz_area_detail,
		paramObj : {domaId : id},
		successCallBack : function (data) 
		{
			$("#base_form").umDataBind("render" ,data.detailStore);
			g_validate.clear($("#base_form"));
			inputdrop.setDataSelect($("#nodeId") ,data.detailStore.nodeId);
			g_validate.init($("#base_form"));
		}
	});
	user_list();
	sec_check_list();
	emergency_list();
}

function tree_remove(treeNode) 
{
	current_selected_node_id = treeNode.id;

	g_dialog.operateConfirm("确认删除此业务域么？" ,{
		saveclick : function() 
		{
			um_ajax_post({
				url : url.biz_area_delete,
				paramObj : {domaId : current_selected_node_id},
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"业务域删除成功！");
					tree.removeNode($("#biz_tree") ,current_selected_node_id);
				}
			});
		}
	});
	return false;
}

// 人员信息详情
function user_info_detail(rowData)
{
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data) 
		{
			g_dialog.dialog($(data).find("[id=user_info_detail_template]") ,{
				width : "600px",
				title : "人员信息详情",
				init : init,
				isDetail : true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);
	}	
}

//人员信息
function user_list() 
{
	g_grid.render($("#user-um-grid-table-div") ,{
		url : url.user_detail,
		paramObj : {domaId : current_selected_node_id},
		header : header.user,
		oper : oper.user,
		operWidth : "100px",
		maskObj : $("#user-um-grid-table-div"),
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : true,
		dbClick : user_info_detail
	});
}

function user_edit_template_init(rowData)
{
	var title = rowData ? "人员信息修改" : "人员信息添加";
	var tarUrl = rowData ? url.user_info_edit : url.user_info_add;
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data){
			g_dialog.dialog($(data).find("[id=user_form_template]") ,{
				width : "800px",
				title : title,
				init : init,
				saveclick : save_click
			});
		}
	});

	function init(el) 
	{
		if (rowData) 
		{
			el.umDataBind("render" ,rowData);
		}
	}

	function save_click(el ,saveObj) 
	{
		if(!g_validate.validate(el.find("#user_form_template"))) 
		{
			return false;
		}
		var obj = el.find("#user_form_template").umDataBind("serialize");
		if (rowData) 
		{
			obj.staffId = rowData.staffId;
		}
		else 
		{
			obj.sex = Number(obj.sex);
			obj.domaId = current_selected_node_id;
		}
		um_ajax_post({
			url : tarUrl,
			isLoad : true,
			paramObj : obj,
			successCallBack : function(data) 
			{
				g_dialog.hide(el);
				g_dialog.operateAlert(null ,title+"成功！");
				user_list();
			}
		});
	}
}

function user_remove()
{
	var ready_to_delete = [];
	var rowData = g_grid.getData($("[id=user-um-grid-table-div]") ,{
		chk : true
	});
	var del_ids = "";

	for(var i=0 ,len = rowData.length ;i<len ;i++) 
	{
		ready_to_delete.push(rowData[i].name);
		del_ids += rowData[i].staffId+",";
	}

	if(ready_to_delete.length === 0) 
	{
		g_dialog.operateAlert(null ,"未选中任何人员记录！" ,"error");
		return false;
	}

	del_ids = del_ids.slice(0,-1).substring(0,del_ids.length-1);

	g_dialog.operateConfirm("确认删除所选人员信息么？" ,{
		saveclick : function() 
		{
			g_grid.removeData($("[id=user-um-grid-table-div]"));

			if(current_selected_node_id === "" || del_ids === "undefined") 
			{
				g_dialog.operateAlert(null ,"人员信息删除成功！");
			}
			else 
			{
				um_ajax_post({
					url : url.user_batch_del,
					paramObj : {delIds : del_ids},
					successCallBack : function(data) 
					{
						g_dialog.operateAlert(null ,"人员信息删除成功！");
					}
				});
			}

		}
	});
}

function user_form_delete(rowData) 
{
	g_dialog.operateConfirm("确认删除此人员信息么？" ,{
		saveclick : function() 
		{
			um_ajax_post({
				url : url.user_del,
				paramObj : {staffId : rowData.staffId},
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"人员信息删除成功！");
					tree_click(current_selected_node_id);
				}
			});
		}
	});
}

// 安全检查
function sec_check_list()
{
	g_grid.render($("#sec-um-grid-table-div") ,{
		url : url.sec_check_list,
		paramObj : {domaId : current_selected_node_id},
		header : header.sec_check,
		oper : oper.sec_check,
		operWidth : "100px",
		maskObj : $("#sec-um-grid-table-div"),
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : false
	});
}

function sec_check_edit_template_init(rowData)
{
	var title = rowData ? "安全检查信息修改" : "安全检查信息添加";
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data){
			g_dialog.dialog($(data).find("[id=sec_form_template]") ,{
				width : "800px",
				title : title,
				init : init,
				initAfter : initAfter,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		index_create_upload_el(el.find("[id=edmtMap]"));
		if (rowData)
		{
			el.umDataBind("render" ,rowData);
			el.find("[data-id=oldAppendixPath]").val(rowData.appendixPath);
			el.find("[data-id=oldCheckDate]").val(rowData.checkDate);
			el.find("[id=file_name_div]").show();
			el.find("[id=file_upload_div]").hide();
		}
		el.find("[data-id=domaId]").val(current_selected_node_id);

		el.find("[id=img_remove_i]").click(function (){
			el.find("[id=file_name_div]").hide();
			el.find("[id=file_upload_div]").show();
			el.find("[data-id=deleteOldAppendix]").val(1);
			el.find("[data-id=appendixPath]").val("");
		});
	}

	function initAfter(el) 
	{
		g_validate.initEvent(el.find("[data-id=introduction]"));
	}

	function save_click(el)
	{
		if (!g_validate.validate(el)) 
		{
			g_dialog.operateAlert(el, "请完善信息。" ,"error");
			return false;
		}
		var flag_url = url.sec_check_add;
		if (rowData)
		{
			flag_url = url.sec_check_update;
		}
		um_ajax_file(el.find("form") ,{
			url : flag_url,
			maskObj : el,
			successCallBack : function (data){
				g_dialog.operateAlert(null ,title+"成功！");
				g_dialog.hide(el);
				sec_check_list();
			}
		});
	}
}

function sec_check_delete(rowData)
{
	g_dialog.operateConfirm(index_delete_confirm_msg ,{
		saveclick : function (){
			um_ajax_post({
				url : url.sec_check_delete,
				paramObj : rowData,
				successCallBack : function (){
					g_dialog.operateAlert(null ,"安全检查信息删除成功！");
					sec_check_list();
				}
			});
		}
	});
}

// 应急事件
function emergency_list()
{
	g_grid.render($("#emergency-um-grid-table-div") ,{
		url : url.emegency_list,
		paramObj : {domaId : current_selected_node_id},
		header : header.emergency,
		oper : oper.emergency,
		operWidth : "100px",
		maskObj : $("#emergency-um-grid-table-div"),
		hasBorder : false,
		paginator : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		allowCheckBox : false,
		dbClick : emergency_grid_detail
	});
}

function emergency_grid_detail(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_manage/biz_area_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=emergency_grid_detail_template]"),{
				width : "650px",
				init : init,
				title : "应急事件信息",
				isDetail : true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);
		el.find("[data-id=emergencyEventStatus]").text(emergency_map.get(rowData.emergencyEventStatus));	
	}	
}

function emergency_edit_template_init(rowData)
{
	var title = rowData ? "应急事件修改" : "应急事件添加";
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data){
			g_dialog.dialog($(data).find("[id=eme_form_template]") ,{
				width : "800px",
				title : title,
				init : init,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		if (rowData)
		{
			el.umDataBind("render" ,rowData);
		}
	}

	function save_click(el ,saveObj)
	{
		if (!g_validate.validate(el)) 
		{
			g_dialog.operateAlert(el, "请完善信息。" ,"error");
			return false;
		}
		var tarUrl = rowData ? url.emegency_update : url.emegency_add;
		var obj = saveObj;
		obj.domaId = current_selected_node_id;
		um_ajax_post({
			url : tarUrl,
			paramObj : obj,
			successCallBack :function (){
				g_dialog.operateAlert(null ,title+"成功！");
				g_dialog.hide(el);
				emergency_list();
			}
		});
	}
}

function emergency_delete(rowData)
{
	g_dialog.operateConfirm(index_delete_confirm_msg ,{
		saveclick : function (){
			um_ajax_post({
				url : url.emegency_delete,
				paramObj : rowData,
				successCallBack : function (){
					g_dialog.operateAlert(null ,"应急事件删除成功！");
					emergency_list();
				}
			});
		}
	});
}

//提交
function submit_click_init() 
{
	var target_url ,user_target_url ,target_param;
	var base_data = $("#base_form").umDataBind("serialize");
	var obj = $("#biz_area_form").umDataBind("serialize");

	function add_args_init()
	{
		target_url = url.biz_area_create,
		user_target_url = url.user_info_add;
		target_param = obj;
		obj.pdomaId = current_parent_id;
		obj.sex = $("#sec_area_form input:radio[name=sex]:checked").val();
	}

	function edit_args_init() 
	{
		target_url = url.biz_area_edit;
		user_target_url = url.user_info_edit;
		target_param = base_data;
		base_data.domaId = current_selected_node_id;
		base_data.pdomaId = current_parent_id;
		base_data.oldPdomaId = current_parent_id;
		base_data.pdomaId = target_node ==="" ? base_data.oldPdomaId : target_node.domaId;
	}

	current_selected_node_id === "" ?  add_args_init(): edit_args_init(); 

	if(g_validate.validate($("#base_form"))) 
	{
		um_ajax_post({
			url : target_url,
			isLoad : true,
			paramObj : target_param,
			successCallBack : function(data) 
			{
				tree_init(obj.domaName);
				g_dialog.operateAlert(null ,"基本信息提交成功！");
				g_mask.maskRemove($("#user_info_div"));
				g_mask.maskRemove($("#sec_chck_div"));
				g_mask.maskRemove($("#emergency_event_div"));
			}
		});
	}
	else 
	{
		g_dialog.operateAlert(null ,"请完成填写后提交！" ,"error");
	}
}


});
});