$(document).ready(function(){
require(['/js/plugin/inputdrop/inputdrop.js',
		 '/js/plugin/tree/tree.js'] ,function (inputdrop ,tree){

$("#content_div").addClass("appbgf");
var url = {
	sec_area_create : "securitydomainmanage/addSave",
	sec_area_edit :   "securitydomainmanage/updSave",
	sec_area_delete : "securitydomainmanage/doDel",
	sec_area_detail : "securitydomainmanage/querySecurityDetail",
	sec_area_tree :   "securitydomainmanage/queryTreeChildrenList",
	template :        "/module/base_sysdate/asset_manage/sec_area_manage_tpl.html",
	user_detail :     "staffmanage/queryStaffList",
	user_batch_del :  "staffmanage/doDelAll",
	user_del :        "staffmanage/delStaff",
	user_info_edit :  "staffmanage/updStaff",
	user_info_add :   "staffmanage/addStaff",
	web_detail :      "ipdomainmgr/queryData",
	web_info_add :    "ipdomainmgr/addIpDomain",
	web_info_edit :   "ipdomainmgr/updIpDomain",
	web_del :         "ipdomainmgr/delIpDomain",
	proxy_server :    "appconfig/queryInitInfo",
	drop_url : 		  "securitydomainmanage/updDomaSort"
};
var col = {
	user_header : [
					{text : "姓名"     ,name : "name"},
					{text : "性别"     ,name : "sexName"},
					{text : "职务"     ,name : "staffPost"},
					{text : "办公电话" ,name : "mobile"},
				],
	user_oper : [
					{icon : "rh-icon rh-edit" ,text : "修改" ,aclick : user_form_edit},
					{icon : "rh-icon rh-delete" ,text : "删除" ,aclick : user_form_delete}
				],
	web_header : [
					{text : "网段名称" ,name : "ipName"},
					{text : "起始IP"   ,name : "ipStart"},
					{text : "终止IP"   ,name : "ipEnd"}
				],
	web_oper : [
					{icon : "rh-icon rh-edit" ,text : "修改" ,aclick : web_form_edit},
					{icon : "rh-icon rh-delete" ,text : "删除" ,aclick : web_form_delete}
				]
};
var current_selected_node_id = "";
var current_parent_id = "";
var tree_nodes;
var target_node = current_parent_id;
var add_btn_click_flag = false;
var user_row = [];
var sec_area_pdomaId,sec_area_oldPdomaId,sec_area_pos;
var ip_domain_vo;
var orig_parent_id;
var user_row = [];

view_init();
event_init();
user_grid_init();
web_grid_init();

function view_init() 
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");

	tree_init();

	g_validate.init($("#base_form"));

	g_formel.code_list_render({
		key : "agentConfigList",
		agentEl : $("#nodeId")
	});

	$("#sec_tree").slimscroll();
}

//初始化
function event_init() 
{
	$("#user_add_btn").click(function () 
	{
		user_add();
	});

	$("#user_remove_btn").click(function () 
	{
		user_remove();
	});

	$("#web_add_btn").click(function () 
	{
		web_add();
	});

	$("#web_remove_btn").click(function ()
	{
		web_remove();
	});

	$("#sec_area_edit_submit").click(function () 
	{
		submit_click_init();
	});
}

function base_form_init() 
{
	var data_null = {domaName : "" ,domaAbbreviation : "" ,faxNo : "" ,complaintTel : "" ,officeTel : "" ,email : "" ,domaAddress : "" ,nodeId : "" ,nodeName : "" ,domaMemo : ""};
	$("#base_form").umDataBind("render" ,data_null);
	g_validate.clear([$("[data-id=domaName]")]);
	inputdrop.clearSelect($("#nodeId"));

}

function user_grid_init() 
{
	g_grid.render($("[data-id=user-um-grid-table-div]") ,{
		header : col.user_header,
		oper : col.user_oper,
		operWidth : "100px",
		paginator : false,
		data : [],
		hasBorder : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		dbClick : user_form_detail
	});
}

function web_grid_init() 
{
	g_grid.render($("[data-id=web-um-grid-table-div]") ,{
		header : col.web_header,
		oper : col.web_oper,
		operWidth : "100px",
		paginator : false,
		data : [],
		hasBorder : false,
		gridCss : "um-grid-style",
		hideSearch :true,
		dbClick : user_form_edit_detail
	});
}

function tree_init(treeName) 
{
	um_ajax_get({
		url : url.sec_area_tree,
		paramObj : {domainId : -1},
		successCallBack : function (data) 
		{
			for (var i = 0; i < data.length; i++) 
			{
				data[i].children = [];
				data[i].dropInner = false;
			}

			// 加一个父节点
			data.push({domaId:"-1" ,pdomaId:"-2" ,domaName:"安全域"});

			tree.render($("#sec_tree") ,{
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
						g_mask.mask($("#net_info_div"));
						return;
					}

					if (treeNode.isAdd) 
					{
						g_mask.mask($("#user_info_div"));
						g_mask.mask($("#net_info_div"));
						current_selected_node_id = "";
						base_form_init();
						user_grid_init();
						web_grid_init();
					}
					else 
					{
						g_mask.maskRemove($("#user_info_div"));
						g_mask.maskRemove($("#net_info_div"));
						current_selected_node_id = treeNode.id;
						current_parent_id = treeNode.pId;
						user_grid_init();
						web_grid_init();
						tree_click(current_selected_node_id);
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
						g_mask.maskRemove($("#net_info_div"));
						$("#mask").show();
						return false;
					}
					else 
					{
						g_mask.maskRemove($("#user_info_div"));
						g_mask.maskRemove($("#net_info_div"));
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
					
					$("#sec_tree").oneTime(10 ,function (){
						tree.selectNode($("#sec_tree") ,{
							key : "name",
							value : "*新节点"
						});
					});
					user_grid_init();
					web_grid_init();
					console.log(1);
					$("#base_form").umDataBind("reset");
					inputdrop.clearSelect($("#nodeId"));
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
							g_dialog.operateAlert(null ,"操作成功！");
							tree_init();
							current_selected_node_id = "";
							base_form_init();
							user_grid_init();
							web_grid_init();
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
				$("#sec_tree").oneTime(10 ,function (){
					var node = tree.selectNode($("#sec_tree") ,{
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
		url : url.sec_area_detail,
		paramObj : {domaId : id},
		successCallBack : function (data) 
		{
			$("#base_form").umDataBind("render" ,data.detailStore);
			g_validate.clear($("#base_form"));
			inputdrop.setDataSelect($("#nodeId") ,data.detailStore.nodeId);
			g_validate.init($("#base_form"));
		}
	});

	um_ajax_get({
		url : url.user_detail,
		paramObj : {domaId : id},
		successCallBack : function (data) 
		{
			var user_info_list_call_back = [];

			for (var i = 0; i < data.length; i++) 
			{
				user_info_list_call_back.push(data[i]);
			}
			g_grid.removeData($("[data-id=user-um-grid-table-div]") ,{});
			g_grid.addData($("[data-id=user-um-grid-table-div]") ,user_info_list_call_back);
		}
	});

	um_ajax_get({
		url : url.web_detail,
		paramObj : {queryTag : "query" ,queryStore : {domainType : 1 ,domainId : id}},
		successCallBack : function (data) 
		{
			var web_info_list_call_back = [];
			var obj = {};

			ip_domain_vo = data.ipdomainstore;


			for (var i = 0; i < data.ipdomainstore.length; i++) 
			{
				obj.ipName = data.ipdomainstore[i].ipName;
				obj.ipStart = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipStart : data.ipdomainstore[i].ipvStart;
				obj.ipEnd = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipEnd : data.ipdomainstore[i].ipvEnd;
				obj.ipDomainId = data.ipdomainstore[i].ipDomainId;
				obj.domainId = data.ipdomainstore[i].domainId;
				obj.ipvStart = data.ipdomainstore[i].ipvStart;
				obj.ipvEnd = data.ipdomainstore[i].ipvEnd;
				obj.ipTotal = data.ipdomainstore[i].ipTotal;
				obj.ipFree = data.ipdomainstore[i].ipFree;
				obj.secutiryDomName = data.ipdomainstore[i].secutiryDomName;
				obj.ipUsed = data.ipdomainstore[i].ipUsed;

				web_info_list_call_back.push(obj);
				obj = {};
			}
			g_grid.removeData($("[data-id=web-um-grid-table-div]") ,{});
			g_grid.addData($("[data-id=web-um-grid-table-div]") ,web_info_list_call_back);
		}

	});
}

function tree_remove(treeNode) 
{
	current_selected_node_id = treeNode.id;

	g_dialog.operateConfirm("确认删除此安全域么？" ,{
		saveclick : function() 
		{
			um_ajax_post({
				url : url.sec_area_delete,
				paramObj : {domaId : current_selected_node_id},
				successCallBack : function(data) 
				{
					tree.removeNode($("#sec_tree") ,current_selected_node_id);
					g_dialog.operateAlert(null ,"安全域删除成功！");
				}
			});
		}
	});
}

//人员信息
function user_form_detail(rowData)
{
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data) 
		{
			g_dialog.dialog($(data).find("[id=user_form_detail_template]") ,{
				width : "600px",
				title : "人员信息详情",
				init : init,
				isDetail : true
			});
		}
	});

	function init(el)
	{
		$(el).umDataBind("render" ,rowData);
	}
}

function user_add() 
{
	if (current_selected_node_id == "") 
	{
		g_dialog.operateAlert(null, "请先完善基本信息","error");
		return false;
	}
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data){
			g_dialog.dialog($(data).find("[id=user_form_template]") ,{
				width : "800px",
				title : "人员信息添加",
				init : init,
				saveclick : save_click
			});
		}
	});

	function init() 
	{

	}

	function save_click(el ,saveObj) 
	{
				
		user_row = el.find("#user_form_template").umDataBind("serialize");
		user_row.sex = Number(user_row.sex);
		user_row.domaId = current_selected_node_id;

		if(g_validate.validate(el))
		{
			um_ajax_post({
				url : url.user_info_add,
				isLoad : true,
				paramObj : user_row,
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"人员信息添加成功！");

					//g_grid.refresh($("[data-id=user-um-grid-table-div]"));
					g_dialog.hide(el);

					//user_grid_init();

					um_ajax_get({
						url : url.user_detail,
						paramObj : {domaId : current_selected_node_id},
						successCallBack : function (data) 
						{
							var user_info_list_call_back = [];

							for (var i = 0; i < data.length; i++) 
							{
								user_info_list_call_back.push(data[i]);
							}
							g_grid.removeData($("[data-id=user-um-grid-table-div]") ,{});
							g_grid.addData($("[data-id=user-um-grid-table-div]") ,user_info_list_call_back);
						}
					});
				}
			});
		}
		// return true;
	}
}

function user_remove() 
{
	var ready_to_delete = [];
	var rowData = g_grid.getData($("[data-id=user-um-grid-table-div]") ,{
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
			g_grid.removeData($("[data-id=user-um-grid-table-div]"));

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

function user_form_edit(rowData) 
{
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data) 
		{
			g_dialog.dialog($(data).find("[id=user_form_template]") ,{
				width : "800px",
				title : "人员信息修改",
				init : init,
				saveclick : save_click
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
	
	function save_click(el) 
	{

		var staffInfoVO = $("#user_form_template").umDataBind("serialize");
		staffInfoVO.staffId = rowData.staffId;

		if(!g_validate.validate($("#user_form_template"))) 
		{
			return false;
		}

		um_ajax_post({
			url : url.user_info_edit,
			paramObj : staffInfoVO,
			successCallBack : function(data) 
			{
				g_dialog.operateAlert(null ,"人员信息修改成功！");

				user_grid_init();

				um_ajax_get({
					url : url.user_detail,
					paramObj : {domaId : current_selected_node_id},
					successCallBack : function (data) 
					{
						g_dialog.hide(el);
						var user_info_list_call_back = [];

						for (var i = 0; i < data.length; i++) 
						{

							user_info_list_call_back.push(data[i]);
						}

						g_grid.addData($("[data-id=user-um-grid-table-div]") ,user_info_list_call_back);
					}
				});
			}
		});
	}
}

function user_form_edit_detail(rowData)
{
	$.ajax({
		type: "GET",
		url: "module/base_sysdate/asset_manage/sec_area_manage_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=user_form_edit_detail_template]"),{
				width : "650px",
				init : init,
				title : "网段详细信息",
				isDetail : true
			});
		}
	});

	function init(el)
	{
		el.umDataBind("render" ,rowData);		
	}
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

					user_grid_init();

					tree_click(current_selected_node_id);
				}
			});
		}
	});
}

//网段信息
function web_add() 
{
	if (current_selected_node_id == "") 
	{
		g_dialog.operateAlert(null, "请先完善基本信息","error");
		return false;
	}
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data) 
		{
			g_dialog.dialog($(data).find("[id=web_form_template]") ,{
				width : "800px",
				title : "网段信息添加",
				init : init,
				saveclick : save_click
			});
		}
	});

	function init(el){

		web_form_init("0");
	}

	function save_click(el ,saveObj) 
	{
		if (!g_validate.ipValidate($("[data-id=ipvStart]"),$("[data-id=ipvEnd]"))) 
		{
			var error_msg = "起始IP、结束IP必须同一网段且起始IP不能大于结束IP";
			g_validate.setError($("[data-id=ipvEnd]") ,error_msg);
			return false;
		}
		web_row = $("#web_form_template").umDataBind("serialize");
		web_row.domainId = current_selected_node_id;
		web_row.ipvStart = web_row.ipvStart;
		web_row.ipvEnd = web_row.ipvEnd;
		web_row.ipStart = ipToInt(web_row.ipvStart);
		web_row.ipEnd = ipToInt(web_row.ipvEnd);
		web_row.ipType = web_row.ipStatus = web_row.ipStatus === "IPV4" ? "0" : "1";
		web_row.updFlag = "1";
		delete web_row.maskIp;
		delete web_row.maskCode;

		if(web_row.ipStatus === "1") 
		{
			web_row.ipvStart = ipV6ToExtension(web_row.ipvStart);
			web_row.ipvEnd = web_row.ipvStart;
			web_row.ipStart = web_row.ipEnd = "9999999991";
		}
		if(!g_validate.validate($("#web_form_template"))) 
		{
			g_dialog.operateAlert(el, "请输入正确信息。" ,"error");
			return false;
		}
		if(g_validate.validate($("#web_form_template"))) 
		{
			um_ajax_post({
				url : url.web_info_add,
				isLoad : true,
				paramObj : web_row,
				maskObj : el,
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"网段信息添加成功！");
					g_dialog.hide(el);
					web_list_call_back();
				}
			});
		}
	}
}

function web_form_init(ipStatus) 
{
	$("input[value=IPV6]").click(function() 
	{
		$("[data-ip=ipv4]").attr("disabled","disabled");
		$("[data-id=ipvEnd]").attr("disabled","disabled");
		$("[data-id=maskIp]").attr("disabled","disabled");
		$("[data-id=maskCode]").attr("disabled","disabled");
		$("[data-ip=ipv6]").removeAttr("disabled");
		$("[data-ip=ipv6]").attr("data-id" ,"ipvStart");
		$("[data-ip=ipv4]").attr("data-id" ,"");
		$("[data-id=maskCreate]").attr("disabled" ,"disabled");
		g_validate.clear([$("[data-ip=ipv4]") ,$("[data-id=ipvEnd]")]);
		$("[data-ip=ipv4]").val("");
		$("[data-id=ipvEnd]").val("");
		$("[id=control_mask]")[0].checked=false;
		$("[id=mask_div]").hide();
	});

	$("input[value=IPV4]").click(function() 
	{
		$("[data-ip=ipv6]").attr("disabled","disabled");
		$("[data-ip=ipv4]").removeAttr("disabled");
		$("[data-id=ipvEnd]").removeAttr("disabled");
		$("[data-id=maskCreate]").removeAttr("disabled");
		$("[data-ip=ipv4]").attr("data-id" ,"ipvStart");
		$("[data-ip=ipv6]").attr("data-id" ,"");
		$("[id=mask_div]").show();
		$("[id=control_mask]").click(function(){
			if ($(this).is(":checked"))
			{
				$("[data-id=maskIp]").removeAttr("disabled");
				$("[data-id=maskCode]").removeAttr("disabled");
			}
			else
			{
				$("[data-id=maskIp]").attr("disabled" ,"disabled");
				$("[data-id=maskCode]").attr("disabled" ,"disabled");	

				g_validate.clear([$("[data-id=maskIp]") ,$("[data-id=maskCode]")]);

				$("[data-id=maskIp]").val("");
				$("[data-id=maskCode]").val("");	
			}
		});

		$("[data-id=maskCreate]").click(function(){
			if($("[id=control_mask]").is(":checked"))
			{
				ip_mask_set();
			}			
		});
	});

	if(ipStatus === "0") 
	{
		$("input[value=IPV4]").click();
	}
	else
	{
		$("input[value=IPV6]").click();
	}
}


function web_list_call_back() 
{
	web_grid_init();
	um_ajax_get({
		url : url.web_detail,
		paramObj : {queryTag : "query" ,queryStore : {domainType : 1 ,domainId : current_selected_node_id}},
		successCallBack : function (data) 
		{
			var web_info_list_call_back = [];
			var obj = {};

			ip_domain_vo = data.ipdomainstore;

			for (var i = 0; i < data.ipdomainstore.length; i++) 
			{
				obj.ipName = data.ipdomainstore[i].ipName;
				obj.ipStart = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipStart : data.ipdomainstore[i].ipvStart;
				obj.ipEnd = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipEnd : data.ipdomainstore[i].ipvEnd;
				obj.ipDomainId = data.ipdomainstore[i].ipDomainId;
				obj.domainId = data.ipdomainstore[i].domainId;
				obj.ipvStart = data.ipdomainstore[i].ipvStart;
				obj.ipvEnd = data.ipdomainstore[i].ipvEnd;
				obj.ipTotal = data.ipdomainstore[i].ipTotal;
				obj.ipFree = data.ipdomainstore[i].ipFree;
				obj.secutiryDomName = data.ipdomainstore[i].secutiryDomName;
				obj.ipUsed = data.ipdomainstore[i].ipUsed;
				web_info_list_call_back.push(obj);
				obj = {};
			}

			g_grid.addData($("[data-id=web-um-grid-table-div]") ,web_info_list_call_back);
		}
	});
}

function web_detail_call_back(rowData) 
{
	web_grid_init();
	um_ajax_get({
		url : url.web_detail,
		paramObj : {queryTag : "query" ,queryStore : {domainType : 1 ,domainId : current_selected_node_id ,ipvStart : rowData.ipvStart}},
		successCallBack : function (data) 
		{
			var web_info_list_call_back = [];
			var obj = {};

			ip_domain_vo = data.ipdomainstore;

			for (var i = 0; i < data.ipdomainstore.length; i++) 
			{
				obj.ipName = data.ipdomainstore[i].ipName;
				obj.ipStart = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipStart : data.ipdomainstore[i].ipvStart;
				obj.ipEnd = data.ipdomainstore[i].ipType === 0 ? data.ipdomainstore[i].ipEnd : data.ipdomainstore[i].ipvEnd;
				obj.ipDomainId = data.ipdomainstore[i].ipDomainId;
				obj.domainId = data.ipdomainstore[i].domainId;
				obj.ipvStart = data.ipdomainstore[i].ipvStart;
				obj.ipvEnd = data.ipdomainstore[i].ipvEnd;
				obj.ipTotal = data.ipdomainstore[i].ipTotal;
				obj.ipFree = data.ipdomainstore[i].ipFree;
				obj.secutiryDomName = data.ipdomainstore[i].secutiryDomName;
				obj.ipUsed = data.ipdomainstore[i].ipUsed;
				web_info_list_call_back.push(obj);
				obj = {};
			}

			g_grid.addData($("[data-id=web-um-grid-table-div]") ,web_info_list_call_back);
		}
	});
}
//批量删除
function web_remove() 
{
	var ready_to_delete = [];
	var rowData = g_grid.getData($("[data-id=web-um-grid-table-div]") ,{
		chk : true
	});
	var del_ids = [];
	var obj = {};

	for (var i = 0; i < ip_domain_vo.length; i++) 
	{
		for (var j = 0; j < rowData.length; j++) 
		{
			if(ip_domain_vo[i].ipName === rowData[j].ipName) 
			{
				ready_to_delete.push(rowData[j].ipName);
				obj.ipDomainId = ip_domain_vo[i].ipDomainId;
				obj.domainId = ip_domain_vo[i].domainId;
				obj.ipStart = ip_domain_vo[i].ipStart;
				obj.ipvStart = ip_domain_vo[i].ipvStart;
				obj.ipEnd = ip_domain_vo[i].ipEnd;
				obj.ipvEnd = ip_domain_vo[i].ipvEnd;
				obj.nodeId = ip_domain_vo[i].nodeId;
				del_ids.push(obj);
				obj = {};
			}
		}
	}

	if(rowData.length === 0) 
	{
		g_dialog.operateAlert(null ,"未选中任何网段记录！" ,"error");
		return false;
	}

	g_dialog.operateConfirm("确认删除选中网段信息么？" ,{
		saveclick : function() 
		{
			g_grid.removeData($("[data-id=web-um-grid-table-div]"));
			um_ajax_post({
				url : url.web_del,
				paramObj : {voList : del_ids},
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"网段信息删除成功！");

					web_grid_init();

					tree_click(current_selected_node_id);
				}
			});
		}
	});
}

function web_form_edit(rowData) 
{
	$.ajax({
		type : "GET",
		url : url.template,
		success : function(data) 
		{
			g_dialog.dialog($(data).find("[id=web_form_template]") ,{
				width : "800px",
				title : "网段信息修改",
				init : init,
				saveclick : save_click
			});
		}
	});

	function init(el) 
	{
		if (rowData) 
		{
			var target_data;
			var tar;
			if (rowData.ipStart.indexOf(".")>0) {
				var ipS = rowData.ipStart;
				var ipE = rowData.ipEnd;
				tar = {queryTag : "query" ,queryStore : {domainType : 1 ,domainId : current_selected_node_id ,ipStart : ipS ,ipEnd : ipE ,ipStatus : "0"}};
			}
			else 
			{
				tar = {queryTag : "query" ,queryStore : {domainType : 1 ,domainId : current_selected_node_id ,ipvStart : ipS ,ipStatus : "1"}};
			}

			um_ajax_get({
				url : url.web_detail,
				paramObj : tar,
				successCallBack : function (data) 
				{
					for (var i = 0; i < data.ipdomainstore.length; i++) 
					{
						if (data.ipdomainstore[i].ipName === rowData.ipName) 
						{
							target_data = data.ipdomainstore[i];
							el.find("[id=ipStatus]").on("change" ,function() 
							{
								if(data.ipdomainstore[i].ipType === "0") 
								{
									el.find("[data-ip=ipv6]").attr("data-id" ,"").attr("disabled" ,"disabled");
									el.find("[data-ip=ipv4]").attr("data-id" ,"ipvStart").removeAttr("disabled");
									el.find("[data-id=ipvEnd]").removeAttr("disabled");
								}
								else 
								{
									el.find("[data-ip=ipv6]").attr("data-id" ,"ipvStart").removeAttr("disabled");
									el.find("[data-ip=ipv4]").attr("data-id" ,"").attr("disabled" ,"disabled");
									el.find("[data-id=ipvEnd]").attr("data-id" ,"").attr("disabled" ,"disabled");
									el.find("[data-id=maskIp]").attr("disabled" ,"disabled");
									el.find("[data-id=maskCode]").attr("disabled" ,"disabled");
								}
							});
							

							if(data.ipdomainstore[i].ipType==="0") 
							{
								el.find("[data-ip=ipv6]").attr("data-id" ,"").attr("disabled" ,"disabled");
								el.find("[data-ip=ipv4]").attr("data-id" ,"ipvStart").removeAttr("disabled");
								el.find("[data-id=ipvEnd]").removeAttr("disabled");
							}
							else 
							{
								el.find("[data-ip=ipv6]").attr("data-id" ,"ipvStart").removeAttr("disabled");
								el.find("[data-ip=ipv4]").attr("data-id" ,"").attr("disabled" ,"disabled");
								el.find("[data-id=ipvEnd]").attr("disabled" ,"disabled");
								el.find("[data-id=maskIp]").attr("disabled" ,"disabled");
								el.find("[data-id=maskCode]").attr("disabled" ,"disabled");//kaka
							}
							web_form_init(data.ipdomainstore[i].ipType);
							$(el).umDataBind("render" ,target_data);
							if(data.ipdomainstore[i].ipType!="0")
							{
								el.find("[data-id=ipvEnd]").val("");
							}
						}
					}
				}
			});
		}
	}
	
	function save_click(el ,saveObj) 
	{
		if(!g_validate.validate(el.find("#web_form_template"))) 
		{
			return false;
		}
		var IpDomainVO = el.find("#web_form_template").umDataBind("serialize");
		var obj = {};
		var vo = {
			updFlag : "0",
			ipStatus : IpDomainVO.ipStatus === "IPV4" ? "0" : "1",
			ipName : IpDomainVO.ipName
		};
		vo.ipDomainId = rowData.ipDomainId;
		vo.domainId = rowData.domainId;
		obj.ipStart = rowData.ipStart;
		obj.ipvStart = rowData.ipvStart;
		obj.ipEnd = rowData.ipEnd;
		obj.ipvEnd = rowData.ipvEnd;
		if(obj.ipvStart!=IpDomainVO.ipvStart || obj.ipvEnd!=IpDomainVO.ipvEnd) 
		{
			vo.ipChange = true;
			vo.newStartIp = IpDomainVO.ipvStart;
			vo.newEndIp = IpDomainVO.ipvEnd;
			vo.oldStartIp = obj.ipvStart;
			vo.oldEndIp = obj.ipvEnd;
		}
		else
		{
			vo.newStartIp = IpDomainVO.ipvStart;
			vo.newEndIp = IpDomainVO.ipvEnd;
		}
		if(vo.ipStatus==="0") 
		{
			vo.ipvStart = vo.newStartIp;
			vo.ipvEnd = vo.newEndIp;
			vo.ipStart = ipToInt(vo.ipvStart);
			vo.ipEnd = ipToInt(vo.ipvEnd);
			vo.ipType = vo.ipStatus;
		}
		else 
		{
			vo.ipType = vo.ipStatus;
			vo.ipvStart = ipV6ToExtension(vo.newStartIp);
			vo.ipvEnd = ipV6ToExtension(vo.newStartIp);
			vo.ipStart = "9999999991";
			vo.ipEnd = "9999999991";
			vo.newStartIp = "";
			vo.newEndIp = "";
			vo.oldStartIp = "";
			vo.oldEndIp = "";
		}
		vo.ipDomainId = rowData.ipDomainId;
		vo.domainId = rowData.domainId;
		

		um_ajax_post({
			url : url.web_info_edit,
			paramObj : vo,
			maskObj : el,
			successCallBack : function(data) 
			{
				g_dialog.operateAlert(null ,"网段信息修改成功！");
				g_dialog.hide(el);
				web_detail_call_back(rowData);
			}
		});
	}
}

function web_form_delete(rowData) 
{
	var ready_to_delete = [];
	var del_ids = [];
	var obj = {};

	for (var i = 0; i < ip_domain_vo.length; i++) 
	{
		if(ip_domain_vo[i].ipName === rowData.ipName) 
		{
			ready_to_delete.push(rowData.ipName);
			obj.ipDomainId = ip_domain_vo[i].ipDomainId;
			obj.domainId = ip_domain_vo[i].domainId;
			obj.ipStart = ip_domain_vo[i].ipStart;
			obj.ipvStart = ip_domain_vo[i].ipvStart;
			obj.ipEnd = ip_domain_vo[i].ipEnd;
			obj.ipvEnd = ip_domain_vo[i].ipvEnd;
			obj.nodeId = ip_domain_vo[i].nodeId;
			del_ids.push(obj);
			obj = {};
		}
	}

	g_dialog.operateConfirm("确认此网段信息删除么？" ,{
		saveclick : function() 
		{
			um_ajax_post({
				url : url.web_del,
				paramObj : {voList : del_ids},
				successCallBack : function(data) 
				{
					g_dialog.operateAlert(null ,"网段信息删除成功！");

					web_grid_init();

					tree_click(current_selected_node_id);
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
	var obj = $("#sec_area_form").umDataBind("serialize");

	function add_args_init() 
	{
		target_url = url.sec_area_create;
		user_target_url = url.user_info_add;
		target_param = obj;
		obj.pdomaId = current_parent_id;
		obj.sex = $("#sec_area_form input:radio[name=sex]:checked").val();
	}

	function edit_args_init() 
	{
		target_url = url.sec_area_edit;
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
				g_mask.maskRemove($("#net_info_div"));
			}
		});
	}
	else 
	{
		g_dialog.operateAlert(null ,"请完成填写后提交！" ,"error");
	}
}

function ipV6ToExtension(ipV6)
{
	if(ipV6===null || ipV6==="") 
	{
		return 0;
	}

	var extension = ipV6;
	var arrLen = extension.split("::").length;

	if (1 != arrLen) 
	{//存在简写
		var arr = extension.split("::");
		var begin = arr[0];
		var end = arr[1];
		
		var beginArr = begin.split(":");
		var endArr = end.split(":");
			
		var beginLen = beginArr.length;
		var endLen = endArr.length;

		var conLen = beginLen + endLen;
			
		var abbreviationStr = "";
			
		for (var i = 0; i < 8 - conLen; i++) 
		{
			abbreviationStr += "0000:";
		}

		abbreviationStr = abbreviationStr.substr(0 ,abbreviationStr.length-1);		
		extension = begin + ":" + abbreviationStr + ":" + end;
	}
	
	var returnVal = "";
	
	var arr = extension.split(":");
	
	for (var h = 0; h < arr.length; h++) 
	{
		var len = 4 - arr[h].length;
		var left0 = "";

		for (var j = 0; j < len; j++) 
		{
			 left0 += "0" ;
		}
	  returnVal += left0 +  arr[h] + ":";
	}

	returnVal = returnVal.substr(0,returnVal.length - 1);
	return returnVal;
}

function ipToInt(IP) 
{
	if(IP===null || IP==="") 
	{
		return 0;
	}

	var a = IP.split(".");

	for (var i=0; i<4; i++) 
	{
		a[i] = parseInt(a[i]);
	  	if (isNaN(a[i])) a[i] = 0;
	  	if (a[i] < 0) a[i] += 256;
	  	if (a[i] > 255) a[i] -= 256;
	}
	return ((a[0]<<16)*256)+((a[1]<<16)|(a[2]<<8)|a[3]);
}

function ip_mask_set() 
{
	if($("[data-ip=ipv4]").val()!="")
	{
		g_dialog.operateConfirm("起始IP和终止IP已填写，是否需要覆盖？" ,{
			saveclick : function(){
				var obj = ip_start_end_get();
				$("[data-id=ipvStart]").val(obj.startIp);
				$("[data-id=ipvEnd]").val(obj.endIp);
			}
		});
	}
	else
	{
		var obj = ip_start_end_get();
		$("[data-id=ipvStart]").val(obj.startIp);
		$("[data-id=ipvEnd]").val(obj.endIp);
	}
}

function ip_start_end_get() 
{
	var ip = $("[data-id=maskIp]").val();
	var maskvalue = $("[data-id=maskCode]").val();

	if(ip==="" || maskvalue==="") 
	{
		return;
	}
	
	var mask = getMask(maskvalue);
	var ipSplit = ip.split(".");
  	var maskSplit = mask.split(".");
	var ip ="";
	var mask ="";
	var netIP ="";
	var broadcastIP = "";
  	var startIP = "";
  	var endIP = "";
  	var binaryMask = "";
  	var addrType = "";
  	//String hostIP = "";
  	var hostNum = 0;
  	//int subNetNum = 0;
  	var subNetMaxNum = 0;
	for(var i = 0; i < 4; i++)
	{			
		var ipTemp = ipSplit[i];
    	var maskTemp = maskSplit[i];
		ip = ip+ipTemp+".";
		mask = mask+maskTemp+".";
		//网络地址
		netIP = netIP + (ipTemp & maskTemp) + ".";
		//广播地址
		broadcastIP = broadcastIP + (~maskTemp+256 | ipTemp) + ".";
		//可分配主机地址
		if(i < 3) {
            startIP = startIP + (ipTemp & maskTemp) + ".";
            endIP = endIP + (~maskTemp+256 | ipTemp) + ".";
        }
		else if(i == 3) {
            if(maskTemp != 254) {
                startIP = startIP + ((ipTemp & maskTemp) + 1);
                endIP = endIP + ((~maskTemp+256 | ipTemp) - 1);
            }
            else {
                startIP = "无.";
                endIP = "无.";
            }
        }	
	}
	var obj = {startIp:startIP,endIp:endIP};

	return obj;
}

function getMask(maskBit) 
{
    if(maskBit == 1)
        return "128.0.0.0";
    else if(maskBit == 2)
        return "192.0.0.0";
    else if(maskBit == 3)
        return "224.0.0.0";
    else if(maskBit == 4)
        return "240.0.0.0";
    else if(maskBit == 5)
        return "248.0.0.0";
    else if(maskBit == 6) 
        return "252.0.0.0";
    else if(maskBit == 7)
        return "254.0.0.0";
    else if(maskBit == 8)
        return "255.0.0.0";
    else if(maskBit ==9)
        return "255.128.0.0";
    else if(maskBit == 10)
        return "255.192.0.0";
    else if(maskBit == 11)
        return "255.224.0.0";
    else if(maskBit == 12)
        return "255.240.0.0";
    else if(maskBit == 13)
        return "255.248.0.0";
    else if(maskBit == 14)
        return "255.252.0.0";
    else if(maskBit == 15)
        return "255.254.0.0";
    else if(maskBit == 16)
        return "255.255.0.0";
    else if(maskBit == 17)
        return "255.255.128.0";
    else if(maskBit == 18)
        return "255.255.192.0";
    else if(maskBit == 19)
        return "255.255.224.0";
    else if(maskBit == 20)
        return "255.255.240.0";
    else if(maskBit == 21)
        return "255.255.248.0";
    else if(maskBit == 22)
        return "255.255.252.0";
    else if(maskBit == 23)
        return "255.255.254.0";
    else if(maskBit == 24)
        return "255.255.255.0";
    else if(maskBit == 25)
        return "255.255.255.128";
    else if(maskBit == 26)
        return "255.255.255.192";
    else if(maskBit == 27)
        return "255.255.255.224";
    else if(maskBit == 28)
        return "255.255.255.240";
    else if(maskBit == 29)
        return "255.255.255.248";
    else if(maskBit == 30)
        return "255.255.255.252";
    else if(maskBit == 31)
        return "255.255.255.254";
    else if(maskBit == 32)
        return "255.255.255.255";
    return "";
}

});
});