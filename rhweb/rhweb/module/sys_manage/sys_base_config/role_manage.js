$(document).ready(function (){
require(['/js/plugin/tree/tree.js',
		 '/js/plugin/inputdrop/inputdrop.js'] ,function (tree ,inputdrop){

	var list_url = "role/queryRolesList";
	var list_col = [
						{text:'角色名称',name:"roleName"},
						{text:'角色描述',name:"roleDescription"}
				   ];
	var list_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init ,width:"33.3%"},
					  	{icon:"rh-icon rh-config" ,text:"配置" ,aclick:config_template_init ,width:"33.3%"},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:role_delete ,width:"33.3%" ,isShow:function (rowData){
					  		return !rowData.system;
					  	}}
					];

	var role_create_url = "role/addRoles";

	var role_update_url = "role/updRoles";

	var role_config_url = "role/rolesUserConfig";

	var role_delete_url = "role/delRoles";

	var role_batch_delete_url = "role/delBatchRoles";

	var form_menu_tree_detail = "role/queryMenuTreeDetail";

	var form_menu_tree = "role/queryMenuTreeByType";

	var form_user_tree_url = "role/queryUserTree";

	var role_user_config_url = "role/rolesUserConfig";

	var role_detail_url = "role/queryRolesDetail";

	event_init();

	role_list({maskObj:"body"});

	function event_init()
	{
		$("#add_btn").click(function (){
			edit_template_init();
		});

		$("#delete_btn").click(function (){
			role_delete();
		});
	}

	function role_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: list_oper,
			 operWidth:"150px",
			 operLayout:true,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 dbClick : detail_template_init
		});
	}

	function edit_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/role_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=role_edit_template]"),{
					width:"550px",
					init:init,
					initAfter:initAfter,
					title:"角色编辑",
					saveclick:save_click,
					top:"6%",
					autoHeight:"autoHeight"
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

		function initAfter(el)
		{
			el.find("[data-id=roleType]").change(function (){
				form_menu_tree_render(el ,rowData);
			});

			if (rowData)
			{
				el.umDataBind("render" ,rowData);
			}

			form_menu_tree_render(el ,rowData);
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}
			if (!el.find("[data-id=defaultResourceId]").val())
			{
				g_dialog.operateAlert(el ,"请选择默认进入菜单。" ,"error");
				return false;
			}
			var flag_url =  role_create_url;
			if (rowData)
			{
				flag_url = role_update_url;
			}
			var obj = new Object();
			obj.rolestore = saveObj;
			var treeObj = el.find("[id=visible_tree]").data("tree");
			var checkedNodes = treeObj.getCheckedNodes(true);
			var nodeArray = [];
			for (var i = 0; i < checkedNodes.length; i++) {
				if(checkedNodes[i].id != "root")
				{
					nodeArray.push(checkedNodes[i])
				}
			}
			obj.menustore = nodeArray;

			um_ajax_post({
				url : flag_url,
				paramObj : obj,
				maskObj : el,
				successCallBack : function (){
					g_dialog.hide(el);
					g_dialog.operateAlert();
					role_list({maskObj:$("#table_div")});
				}
			});

		}
	}

	function config_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/role_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=user_config_template]"),{
					width:"450px",
					init:init,
					title:"用户配置",
					saveclick:save_click,
					top:"6%",
					autoHeight : "autoHeight"
				});
			}
		});

		function init(el)
		{
			form_user_config_tree_render(el ,rowData)
		}

		function save_click(el)
		{
			var treeObj = el.find("[id=tree]").data("tree");
			var checkedNodes = treeObj.getCheckedNodes(true);
			var nodeArray = [];
			for (var i = 0; i < checkedNodes.length; i++) {
				if(checkedNodes[i].id != "-1")
				{
					nodeArray.push(checkedNodes[i].id);
				}
			}
			um_ajax_post({
				url : role_user_config_url,
				paramObj : {roleId : rowData.roleId ,users : nodeArray.join(",")},
				successCallBack : function (){
					g_dialog.hide(el);
					g_dialog.operateAlert();
					role_list({maskObj:$("#table_div")});
				}
			});
		}
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/role_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=role_detail_template]"),{
					width:"500px",
					init:init,
					title:"角色详情",
					isDetail : true,
					top:"6%",
					autoHeight : "autoHeight"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
			um_ajax_get({
				url : form_menu_tree_detail,
				paramObj : {roleId : rowData.roleId},
				successCallBack : function (data){
					if (data.length > 0)
					{
						data.push({id:"root" ,parent:"root1" ,label:"全部"});
						tree.render(el.find("[id=tree]") ,{
							zNodes : data,
							edit : true,
							expandNode : "root"
						});
					}
					
				}
			});

			um_ajax_get({
				url : role_detail_url,
				paramObj : {roleId : rowData.roleId},
				successCallBack : function (data){
					var userList = data.users.split("，");
					var buffer = [];
					for (var i = 0; i < userList.length; i++) {
						buffer.push(userList[i]);
						if ((i+1)%2 == 0)
						{
							el.find("[data-id=users]").append(buffer.join(" , ") + "</br>");
							buffer = [];
						}
						if (i == userList.length-1 && i%2 == 0)
						{
							el.find("[data-id=users]").append(buffer.join(" , ") + "</br>");
						}
					}
					
				}
			});	
		}
	}

	function form_menu_tree_render(el ,rowData)
	{
		var roleId = (rowData?rowData.roleId:"");
		um_ajax_get({
			url : form_menu_tree,
			isLoad : true,
			maskObj : el,
			paramObj : {type : el.find("[data-id=roleType]").val() ,roleId : roleId},
			successCallBack : function (data){
				data.push({id:"root" ,parent:"root1" ,label:"全部"});
				tree.render(el.find("[id=visible_tree]") ,{
					zNodes : data,
					edit : true,
					chk : true,
					expandNode : "root",
					zTreeOnCheck : function (event, treeId, treeNode){
						var treeObj = el.find("[id=visible_tree]").data("tree");
						var checkedNodes = treeObj.getCheckedNodes(true);
						var nodeList = [];
						for (var i = 0; i < checkedNodes.length; i++) {
							nodeList.push({id:checkedNodes[i].id ,label:checkedNodes[i].label ,parentID:checkedNodes[i].pId});
						}
						el.find("[id=defaultResourceId]").html("");
						inputdrop.renderTree(el.find("[id=defaultResourceId]"),nodeList,{
							position:"top",
							height:"160px",
							enableChk:false,
							onlyLastChild:true,
							rootNode:"root"
						});
					}
				});

				var treeObj = el.find("[id=visible_tree]").data("tree");
				//treeObj.checkAllNodes(true);

				for (var i = 0; i < data.length; i++) {
					if (i != (data.length - 1))
					{
						var nodes = treeObj.getNodesByParam("id", data[i].id, null);
						treeObj.checkNode(nodes[0], nodes[0]._s, false);
					}
				}

				if (rowData)
				{
					var treeObj = el.find("[id=visible_tree]").data("tree");
					var checkedNodes = treeObj.getCheckedNodes(true);
					var nodeList = [];
					for (var i = 0; i < checkedNodes.length; i++) {
						nodeList.push({id:checkedNodes[i].id ,label:checkedNodes[i].label ,parentID:checkedNodes[i].pId});
					}
					el.find("[id=defaultResourceId]").html("");
					inputdrop.renderTree(el.find("[id=defaultResourceId]"),nodeList,{
						position:"top",
						height:"160px",
						enableChk:false,
						onlyLastChild:true,
						rootNode:"root",
						initVal:rowData.defaultResourceId
					});
				}		
			}
		});
	}

	function form_user_config_tree_render(el ,rowData)
	{
		var roleId = (rowData?rowData.roleId:"");

		um_ajax_get({
			url : form_user_tree_url,
			paramObj : {roleId : roleId},
			successCallBack : function (data){
				data.push({id:"-1" ,parent:"root1" ,label:"全部"});
				tree.render(el.find("[id=tree]") ,{
					zNodes : data,
					edit : true,
					chk : true,
					expandNode : -1
				});

				var treeObj = el.find("[id=tree]").data("tree");

				for (var i = 0; i < data.length; i++) {
					if (i != (data.length - 1))
					{
						var nodes = treeObj.getNodesByParam("id", data[i].id, null);
						treeObj.checkNode(nodes[0], nodes[0]._s, false);
					}
				}
			}
		});
	}

	function role_delete(rowData)
	{
		var paramObj = new Object();
		var flag_url = role_delete_url;

		if (!rowData)
		{
			var idArray = g_grid.getIdArray($("#table_div") ,{chk:true ,attr:"roleId"});
			if (idArray.length == 0)
			{
				g_dialog.operateAlert(null ,"请选择一条记录。" ,"error");
				return;
			}
			paramObj.roleIds = idArray.join(",");
			flag_url = role_batch_delete_url;
		}
		else
		{
			paramObj.roleId = rowData.roleId;
		}
		
		g_dialog.operateConfirm("是否进行删除操作？" ,{
			saveclick : function (){
				um_ajax_post({
					url : flag_url,
					paramObj : paramObj,
					successCallBack : function (data){
						g_dialog.operateAlert();
						role_list({maskObj:$("#table_div")});
					}
				});
			}
		});
		
	}
});
});