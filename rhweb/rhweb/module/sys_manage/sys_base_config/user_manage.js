$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	var list_url = "user/queryUserList";
	var list_col = [
						{text:'用户名称',name:"userName",searchRender:function (el){
				  			el.append('<input type="text" class="form-control input-sm" search-data="userName">');
				  		}},
						{text:'账号',name:"userAccount"},
						{text:'固定电话',name:"userPhone"},
						{text:'移动电话',name:"userMobilePhone"},
						{text:'邮件地址',name:"userEmail"}
				   ];
	var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  	{icon:"rh-icon rh-unlock" ,text:"锁定" ,aclick:index_list_lock ,customRender:function (rowData){
					  		return {
					  					icon : rowData.userAccountLocked === "F" ? "rh-icon rh-unlock" : "rh-icon rh-lock",
					  					text : rowData.userAccountLocked === "F" ? "锁定" : "解锁"
					  				};
					  	}},
					  	{icon:"rh-icon rh-inter-policy" ,text:"访问策略" ,aclick:policy_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:delete_list_init ,isShow : function(rowData){
		  			  		if(rowData.system)
		  			  		{
		  			  			return false;
		  			  		}
		  			  		else
		  			  		{
		  			  			return true;
		  			  		}	
		  				}},
					 ];

	var user_create_url = "user/addUser";

	var delete_list_url = "user/delUser";

	var user_update_url = "user/updUser";

	var user_lock_url = "user/updUserStatus";

	var user_role_tree_url = "user/queryRoleDataStore";

	var user_detail_url = "user/queryUserDetail";

	event_init();

	user_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(user_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function event_init()
	{
		$("#add_btn").click(function (){
			edit_template_init();
		});
	}

	function user_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: index_oper,
			 operWidth:"121px",
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 dbClick : detail_template_init
		});
	}

	function delete_list_init(rowData)
	{
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : delete_list_url,
					paramObj : {userId : rowData.userId ,userName : rowData.userName ,userAccount:rowData.userAccount},
					successCallBack : function(data){
						user_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});	
	}

	function edit_template_init(rowData)
	{
		var title = rowData ? "用户修改" : "用户添加";
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/user_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=user_edit_template]"),{
					width:"560px",
					init:init,
					initAfter:initAfter,
					title : title,
					saveclick:save_click,
					top:"6%"
				});
			}
		});

		function init(el)
		{
			if (rowData)
			{
				el.umDataBind("render" ,rowData);
				//el.find("[data-id=oldUserPwd]").val(rowData.userPwd);
				el.find("[data-id=userPwd]").val("");
				el.find("[data-id=userAccount]").addClass("no-write");
				el.find("[data-id=userAccount]").attr("readonly" ,"readonly");
				el.find("[data-id=userPwdCon]").val("");
				el.find("[data-type=is_modify_pwd]").show();
				el.find("[data-type=pwd]").hide();
				el.find("[type=password]").attr("disabled" ,"disabled");
				el.find("[data-type=is_modify_pwd]").find("input").click(function (){
					if ($(this).is(":checked"))
					{
						el.find("[data-type=pwd]").show();
						el.find("[type=password]").removeAttr("disabled");
					}
					else
					{
						el.find("[data-type=pwd]").hide();
						el.find("[type=password]").attr("disabled" ,"disabled");
					}
				});
			}
		}

		function initAfter(el)
		{
			if (rowData)
			{
				um_ajax_get({
					url : "user/querySecDomainTreeListForUpd",
					paramObj : {userId : rowData.id},
					maskObj : el,
					successCallBack : function (data){
						um_ajax_get({
							url :"securitydomainmanage/queryTreeChildrenList",
							paramObj : {},
							isLoad : false,
							successCallBack : function (data1){
								for (var i = 0; i < data1.length; i++) {
									data1[i].label = data1[i].domaName;
								}
								inputdrop.renderTree(el.find("[id=securityDomainId]") ,data1,{
														  	initVal:data?data:null,
														  	id:"domaId",pId:"pdomaId",label:"domaName"
														 });
							}
						});
					}
				});
			}
			else
			{
				um_ajax_get({
					url :"securitydomainmanage/queryTreeChildrenList",
					paramObj : {},
					isLoad : false,
					successCallBack : function (data){
						for (var i = 0; i < data.length; i++) {
							data[i].label = data[i].domaName;
						}
						inputdrop.renderTree(el.find("[id=securityDomainId]") ,data,{
												  				id:"domaId",pId:"pdomaId",label:"domaName"
												 			});
					}
				});
			}
			
		}

		function save_click(el ,saveObj)
		{
			var url = user_create_url;
			rowData && (url = user_update_url);
			if (rowData && !el.find("[data-type=is_modify_pwd]").find("input").is(":checked"))
			{
				delete saveObj.userPwd;
			}

			if (g_validate.validate(el))
			{
				//校验两次输入的密码是否一致
				if (!el.find("[data-type=pwd]").is(":hidden") && saveObj.userPwd != saveObj.userPwdCon)
				{
					g_dialog.dialogTip(el ,{msg:"两次输入密码不一致!"});
					return false;
				}

				delete saveObj.userPwdCon;

				if (saveObj.userPwd)
				{
					saveObj.userRawPwd = $.base64.encode(saveObj.userPwd);
					saveObj.userPwd = $.base64.encode($.md5(saveObj.userPwd));
				}
				//saveObj.newUserPwd = $.base64.encode($.md5(saveObj.userPwd));

				um_ajax_post({
					url : url,
					paramObj : saveObj,
					maskObj : el,
					successCallBack : function (data){
						g_dialog.operateAlert();
						g_dialog.hide(el);
						g_grid.refresh($("#table_div"));
					}
				});
			}
		}
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/user_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=user_detail_template]"),{
					width:"450px",
					init:init,
					title:"用户详细信息",
					isDetail : true
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
			el.find("[data-id=userState]").html(rowData.userAccountLocked==="F" ? "未锁定" : "锁定");
		}
	}

	function index_list_lock(rowData)
	{
		var lock_msg = "是否锁定该用户？";
		var unlock_msg = "是否解除该用户的锁定状态？";
		msg = rowData.userAccountLocked==="F" ? lock_msg : unlock_msg;
		g_dialog.operateConfirm(msg ,{
			saveclick : function (){
				um_ajax_post({
					url : user_lock_url,
					paramObj : {
									userId : rowData.userId,
									userName : rowData.userName,
									userAccount : rowData.userAccount,
									status : rowData.userAccountLocked==="F"?"lock":"unlock"
								},
					maskObj : "body",
					successCallBack : function (data){
						g_dialog.operateAlert();
						g_grid.refresh($("#table_div"));
					}
				});
			}
		});
	}

	function policy_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/user_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=user_access_policy_template]"),{
					width:"630px",
					init:init,
					initAfter:initAfter,
					title : "用户访问策略",
					saveclick:save_click,
					top:"6%"
				});
			}
		});

		function init(el)
		{
			el.find("[id=isOpen]").click(function (){
				if ($(this).is(":checked"))
				{
					el.find("[data-type=select]").removeAttr("disabled");
					el.find("[data-value=runTime]").removeAttr("disabled");
					el.find("[data-id=cycleType]").change();
				}
				else
				{
					el.find("[data-type=select]").attr("disabled" ,"disabled");
					el.find("[data-value=runTime]").attr("disabled" ,"disabled");
				}
				g_validate.clear(el.find("[id=query_form]"));
			});

			el.find("[data-id=cycleType]").change(function (){
				el.find("[data-id=cyclePeriod]").find("option").remove();
				if ($(this).val() == "1")
				{
					el.find("[data-id=cyclePeriod]").attr("disabled" ,"disabled");
				}
				else if ($(this).val() == "2")
				{
					el.find("[data-id=cyclePeriod]").removeAttr("disabled");
					el.find("[data-id=cyclePeriod]").append('<option value="1">星期一</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="2">星期二</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="3">星期三</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="4">星期四</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="5">星期五</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="6">星期六</option>');
					el.find("[data-id=cyclePeriod]").append('<option value="7">星期日</option>');
				}
				else
				{
					for (var i = 1; i < 29; i++)
					{
						el.find("[data-id=cyclePeriod]").removeAttr("disabled");
						el.find("[data-id=cyclePeriod]").append('<option value="'+i+'">'+i+'日'+'</option>');
					}
				}
				el.find("[data-id=cyclePeriod]").trigger("change");
			});

			el.find("[data-id=cycleStart]").click(function (){
				if (!$(this).val())
				{
					$(this).val("00:00:00");
				}
			});

			el.find("[data-id=cycleEnd]").click(function (){
				if (!$(this).val())
				{
					$(this).val("23:59:59");
				}
			});

		}

		function initAfter(el)
		{
			um_ajax_get({
				url : "user/queryUserLoginTime",
				paramObj : {userId : rowData.id},
				maskObj : el,
				successCallBack : function (data){
					if (data)
					{
						el.umDataBind("render" ,data);
						el.find("[id=isOpen]").click();
						el.find("[data-id=cycleType]").val(data.cycleType);
						el.find("[data-id=cycleType]").trigger("change");
						el.find("[data-id=cyclePeriod]").val(data.cyclePeriod);
						el.find("[data-id=cyclePeriod]").trigger("change");
					}
				}
			});
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}
			var timeStart = el.find("[data-id=cycleStart]").val();
			var timeEnd = el.find("[data-id=cycleEnd]").val();
			if (((timeStart || timeEnd) !== "") && timeStart >= timeEnd) 
			{
				g_dialog.dialogTip(el, {msg:"运行时间的起始时间必须小于终止时间。"});
				return false;
			}

			var obj = new Object();

			if (el.find("[id=isOpen]").is(":checked"))
			{
				obj = saveObj;
				obj.config = 1;
			}
			else
			{
				obj.config = 0;
			}
			obj.userId = rowData.id;

			um_ajax_post({
				url : "/user/configUserLoginTime",
				paramObj : obj,
				maskObj : el,
				successCallBack : function (){
					g_dialog.hide(el);
					g_dialog.operateAlert();
					g_grid.refresh($("#table_div"));
				}
			});
		}
	}
});
});