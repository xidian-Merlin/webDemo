define(['/tdyth/resources/plugins/tab/tab.js',
		'/tdyth/resources/plugins/event/event.js'],function(tab ,pevent){
 	var globalremindCound = 0;
 	var tab_message = 0,tab_work = 0,tab_bulletin = 0,tab_fault = 0,tab_property = 0;
 	var table_height = 0;
	var isClicked = false;
	return {
		render:function()
		{
			var tis = this;
			var self = $("#user_btn");
			var pop = [];
			var popList = [];
			um_ajax_get({
				url : "globalremind/getGlobalRemindCount",
				successCallBack : function (data)
				{
					tab_message = +data.pendingMessageCount;
					tab_work = +data.pendingWorkCount;
					tab_bulletin = +data.bulletinCount;
					tab_fault = +data.faultAlarmEventCount;
					tab_property = +data.performanceEventCount;
					globalremindCound = +data.pendingMessageCount + data.pendingWorkCount + data.bulletinCount + data.faultAlarmEventCount + data.performanceEventCount;
					$("#user_icon i")[globalremindCound === 0?"hide":"show"]();
					popList = [
		 								{name:data.pendingMessageCount ? data.pendingMessageCount :"",text:"<i class='icon-menu-message'></i>消息管理",aclick:"message",attr:"pendingMessageCount"},
		 								{name:data.pendingWorkCount ? data.pendingWorkCount : "",text:"待办工作",aclick:"work",attr:"pendingWorkCount"},
		 								{name:data.bulletinCount ? data.bulletinCount : "",text:"<i class='icon-menu-bulletin'></i>公告信息",aclick:"bulletin",attr:"bulletinCount"},
		 								{name:data.faultAlarmEventCount ? data.faultAlarmEventCount : "",text:"<i class='icon-menu-fault'></i>故障提醒",aclick:"fault",attr:"faultAlarmCount"},
		 								{name:data.performanceEventCount ? data.performanceEventCount : "",text:"<i class='icon-menu-property'></i>性能提醒",aclick:"property",attr:"performAlarmCount"},
		 								{name:"",text:"<i class='icon-menu-hf1'></i>更换皮肤",aclick:"menu_hf",attr:""},
		 								{name:"",text:"<i class='icon-menu-operate'></i>工作台",aclick:"operate",attr:""},
		 								{name:"",text:"<i class='icon-menu-changepasscode'></i>修改密码",aclick:"changepasscode",attr:""},
		 								{name:"",text:"<i class='icon-menu-logout'></i>退出",aclick:"logout",attr:""}
										];
	 				pop.push('<div id="user_pop_div" style="display:none;" class="selectBan"><input type="hidden" id="user_pop_interval"/>');
	 				for (var i = 0; i < popList.length; i++) {
						pop.push('<div class="user_pop_list" data-action="aclick" data-aclick="'+popList[i].aclick+'" data-text="'+popList[i].text+'" data-name="'+popList[i].name+'">');
						pop.push(popList[i].text);
						if (+popList[i].name !== 0)
						{
							pop.push('<span data-attr="'+popList[i].attr+'">'+popList[i].name+'</span>');
						}
						else
						{
							pop.push('<span data-attr="'+popList[i].attr+'" style="display:none">'+popList[i].name+'</span>');
						}
						pop.push('</div>');
	 				}
	 				pop.push('</div>');
	 				self.append(pop.join(""));
	 				$("#user_icon").append("<span id='user_account' title='"+index_user_info.userAccount+"'>"+index_user_info.userAccount+"</span>");
	 				if(index_user_info.userAccount == "sysauditor" || index_user_info.userAccount == "admin")
					{
						$("[data-aclick=work]").hide();
						$("[data-aclick=fault]").hide();
						$("[data-aclick=property]").hide();
						$("[data-aclick=operate]").hide();
						$("#user_icon").addClass("admin");
						$("#user_pop_div").addClass("admin");
					}
					else
					{
						$("[data-aclick=message]").hide();
						$("[data-aclick=work]").hide();
						$("[data-aclick=bulletin]").hide();
						$("#user_icon").addClass("normal");
						$("#user_pop_div").addClass("normal");
					}
					// hideMenu为1的时候不执行
					var urlParamObj = index_query_param_get();
					if (urlParamObj.hideMenu !=1 )
					{
						$("#user_pop_interval").everyTime(120000 , function (){
		 					tis.interval();
		 				});
					}
	 				
					$("#user_pop_div").find("[data-action=aclick]").each(function(i){
						$(this).click(function(){
							if ($('body').find("[class=um_mask]").size() > 0)
							{
								return false;
							}
							tis.aClick(i ,{
									type : popList[i].aclick,
									tab_message : tab_message,
									tab_work : tab_work,
									tab_bulletin : tab_bulletin,
									tab_fault : tab_fault,
									tab_property : tab_property
							});
						});
					});
				}
			});
		},
		interval:function()
		{
			var tis = this;
			um_ajax_get({
				url : "globalremind/getGlobalRemindCount",
				isLoad : false,
				successCallBack : function (data){
					tab_message = +data.pendingMessageCount;
					tab_work = +data.pendingWorkCount;
					tab_bulletin = +data.bulletinCount;
					tab_fault = +data.faultAlarmEventCount;
					tab_property = +data.performanceEventCount;
					globalremindCound = +data.pendingMessageCount + data.pendingWorkCount + data.bulletinCount + data.faultAlarmEventCount + data.performanceEventCount;
					$("#user_icon i")[globalremindCound === 0?"hide":"show"]();

					if (globalremindCound !== 0)
					{
						var tmp = $("#pg-content-msg").clone();
						$("#pg-container").append(tmp);
						tmp.show();
						tmp.oneTime(10 ,function (){
							tmp.css("right" ,"30px");
						});
						tmp.oneTime(5000 ,function (){
							tmp.css("bottom" ,"50px");
							tmp.css("opacity" ,"0");
							tmp.oneTime(1000 ,function (){
								tmp.remove();
							});
						});
						tmp.find("[id=pg-content-msg-close]").click(function (){
							tmp.remove();
						});
						tmp.click(function (){
							tis.aClick(3,{ 
									tab_message : tab_message,
									tab_work : tab_work,
									tab_bulletin : tab_bulletin,
									tab_fault : tab_fault,
									tab_property : tab_property
							});
						});
					}

					$("#user_pop_div").find("span[data-attr]").each(function (){
						if (data[$(this).attr("data-attr")])
						{
							if (data[$(this).attr("data-attr")] == 0)
							{
								$(this).hide();
							}
							else
							{
								$(this).show();
								$(this).html(data[$(this).attr("data-attr")]);
							}
						}
						if ($(this).attr("data-attr") == "faultAlarmCount")
						{
							if (data.faultAlarmEventCount == 0)
							{
								$(this).hide();
							}
							else
							{
								$(this).show();
								$(this).html(data.faultAlarmEventCount);
							}
							
						}
						if ($(this).attr("data-attr") == "performAlarmCount")
						{
							if (data.performanceEventCount == 0)
							{
								$(this).hide();
							}
							else
							{
								$(this).show();
								$(this).html(data.performanceEventCount);
							}
						}
					});
				}
			});	
		},
		aClick:function(index ,opt)
		{
			var tis = this;
			if (isClicked) 
			{
				return false;
			}
			if (opt.type==="operate") 
			{
				var itsm_url = index_itsm_url== undefined ? "index.html" : (index_itsm_url + "/itsm/pages/autoLogin.jsp?user="+index_user_info.userAccount+"&key=558GYD4KD8EE");
				window.open(itsm_url);
				return;
			}
			if (opt.type==="changepasscode")
			{
				$.ajax({
					type: "GET",
					url: "js/plugin/usercenter/usercenter.html",
					success :function(data)
					{
						g_dialog.dialog($(data).find("[id=index_user_password_change]") ,{
							width:"500px",
							title:"修改密码",
							init:init,
							saveclick:saveclick
						});
						function init(el) 
						{

						}
						function saveclick(el ,saveObj) 
						{
							if (!g_validate.validate(el))
							{
								return false;
							}

							if (saveObj.newPwd != saveObj.newPwdConf)
							{
								g_dialog.dialogTip(el ,{
									msg : "两次输入的密码不一致。"
								});
								return false;
							}

							saveObj.oldPwd = $.base64.encode($.md5(saveObj.oldPwd));
							saveObj.userRawPwd = $.base64.encode(saveObj.newPwd);
							saveObj.newPwd = $.base64.encode($.md5(saveObj.newPwd));
							saveObj.userId = index_user_info.id;
							
							delete saveObj.newPwdConf;
							
							um_ajax_post({
								url : "user/updUserPwd",
								paramObj : saveObj,
								maskObj : el,
								successCallBack : function (){
									g_dialog.hide(el);
									g_dialog.operateAlert();
								}
							});
						}
					}
				});
				return;
			}
			if (opt.type==="logout") 
			{
				g_dialog.operateConfirm("确认退出么？" ,{
					saveclick : function (){
						um_ajax_get({
							url : "logout",
							successCallBack : function (data){
								window.location.href = "/login.html";
							}
						});
					}
				});
				return;
			}
			if (opt.type==="menu_hf") 
			{
				g_dialog.dialog('<div id="hf_div"></div>' ,{
							width:"500px",
							title:"更换皮肤",
							init:init,
							saveclick:saveclick
				});
				function init(el)
				{
					var el_hf_div = el.find("[id=hf_div]");
					el_hf_div.append('<div data-class="app-default" class="hf-unit-div default"><i class="icon-ok-circle"></i></div>');
					el_hf_div.append('<div data-class="app-grey" class="hf-unit-div grey"><i class="icon-ok-circle"></i></div>');
					el_hf_div.find("div").click(function (){
						el_hf_div.find("div").removeClass("active");
						$(this).addClass("active");
					});
					var current_class_name = $("body").attr("class");
					el_hf_div.find("div[data-class="+current_class_name+"]").addClass("active");
				}
				function saveclick(el)
				{
					$("body").removeAttr("class");
					$("body").addClass(el.find("div[class*=active]").attr("data-class"));
					localStorage.skin=el.find("div[class*=active]").attr("data-class");
					g_dialog.hide(el);
				}
				return;
			}
			$.ajax({
				type: "GET",
			url: "js/plugin/usercenter/usercenter.html",
				success : function(data) 
				{
					g_dialog.dialog($(data).find("[id=usercenter_pop_div]") ,{
						width:"1000px",
						top:"6%",
						init:init,
						initAfter:initAfter,
						isDetail:true,
						title:"用户中心",
						closeCbf : function(){
							isClicked = false;
						}
					});
				function init(el) 
				{
					if(index_user_info.userAccount != "sysauditor" || index_user_info.userAccount != "admin")
					{
						el.find("[data-nav=message]").hide();
						el.find("[data-nav=work]").hide();
						el.find("[data-nav=bulletin]").hide();
					}
 					tab.tab(el.find("[id=global_tab]") ,{
					    	oper:[],
					    	index:index
					    });
				}
				function initAfter(el) 
				{
					$("[data-nav=message]").find("i")[opt.tab_message === 0 ?"hide":"show"]();
					$("[data-nav=work]").find("i")[opt.tab_work === 0 ?"hide":"show"]();
					$("[data-nav=bulletin]").find("i")[opt.tab_bulletin === 0 ?"hide":"show"]();
					$("[data-nav=fault]").find("i")[opt.tab_fault === 0 ?"hide":"show"]();
					$("[data-nav=property]").find("i")[opt.tab_property === 0 ?"hide":"show"]();
					table_height = el.find("[id=global_tab]").height() - 50;
					var otype = opt.type || "fault";
					el.find("[data-id=tab-ul]").each(function(){
						$(this).find("li").click(function(){
							var itype = $(this).data("nav");
							switch (itype) {
								case "message":
									tis.message_init(el);
								break;
								case "work":
									tis.work_init(el);
								break;
								case "bulletin":
									tis.bulletin_init(el);
								break;
								case "fault":
									tis.fault_init(el);
								break;
								case "property":
									tis.property_init(el);
								break;
							}
						});
					});
					switch (otype) {
						case "message":
							tis.message_init(el);
						break;
						case "work":
							tis.work_init(el);
						break;
						case "bulletin":
							tis.bulletin_init(el);
						break;
						case "fault":
							tis.fault_init(el);
						break;
						case "property":
							tis.property_init(el);
						break;
					}
				}
				}
			});
			isClicked = true;
		},
		message_init:function(el)
		{
			var in_list_url = "sysmessage/queryReceiveMessageList";
			var out_list_url = "sysmessage/querySendMessageList";
			el.find("[id=msg_inbox_table_div]").height(table_height);
			el.find("[id=msg_outbox_table_div]").height(table_height);
			var in_header = [
										{text:"",name:"",width:"5"},
										{text:"发件人",name:"send_USER",width:"15"},
										{text:"发送时间",name:"enter_DATE",width:"25"},
										{text:"内容",name:"sms_DESC",width:"55"}
									];
			var out_header = [
										{text:"",name:"",width:"5"},
										{text:"收件人",name:"receive_USER",width:"15"},
										{text:"发送时间",name:"enter_DATE",width:"25"},
										{text:"内容",name:"sms_DESC",width:"55"}
									];
			var in_oper = [
									{icon:"icon-trash",text:"删除",aclick:message_delete}
								];
			var out_oper = [
									{icon:"icon-trash",text:"删除",aclick:message_delete}
								];
			event_init();
			g_grid.render(el.find("[data-id=msg_inbox_table_div]") ,{
				url:in_list_url,
				header : in_header,
				oper : in_oper,
				operWidth : "50px",
				maskObj:el.find("[data-id=msg_inbox_table_div]"),
				dbClick : true,
				hideSearch : true
			});
			function event_init() 
			{
				el.find("[id=msg_nav_inbox_btn]").click(function(){
					$("#msg_nav_inbox_btn").css("color","#1199c4");
					$("#msg_nav_inbox_btn").find("i").show();
					$("#msg_nav_outbox_btn").css("color","#aaaaaa");
					$("#msg_nav_outbox_btn").find("i").hide();
					el.find("[data-id=msg_inbox_table_div]").show();
					el.find("[data-id=msg_outbox_table_div]").hide();
					g_grid.render(el.find("[data-id=msg_inbox_table_div]") ,{
						url:in_list_url,
						header : in_header,
						oper : in_oper,
						operWidth : "50px",
						maskObj:el.find("[data-id=msg_inbox_table_div]"),
						dbClick : true,
						hideSearch : true
					});
				});
				el.find("[id=msg_nav_outbox_btn]").click(function(){
					$("#msg_nav_inbox_btn").css("color","#aaaaaa");
					$("#msg_nav_inbox_btn").find("i").hide();
					$("#msg_nav_outbox_btn").css("color","#1199c4");
					$("#msg_nav_outbox_btn").find("i").show();
					el.find("[data-id=msg_outbox_table_div]").show();
					el.find("[data-id=msg_inbox_table_div]").hide();
					g_grid.render(el.find("[data-id=msg_outbox_table_div]") ,{
						url:out_list_url,
						header : out_header,
						oper : out_oper,
						operWidth : "50px",
						maskObj:el.find("[data-id=msg_outbox_table_div]"),
						dbClick : true,
						hideSearch : true
					});
				});
			}
			function message_delete(rowData)
			{

			}
		},
		work_init:function(el)
		{
			require(['js/plugin/workorder/workorder.js'],function(workorder){

				var list_url ="workflow/queryCurWorkItemData";
				var list_col = [
									{text:'工单名称',name:"processInstanceName"},
									{text:'工单编号',name:"processInstanceID"},
									{text:'任务名称',name:"workItemName"},
									{text:'模板名称',name:"processTemplateName"},
									{text:'工单申请人',name:"approveUser",searchRender:function(el){
										g_formel.select_render(el ,{
											data : [
													 {text:"----" ,id:"-1"},
													 {text:"Candidate" ,id:"1"},
													 {text:"Entry" ,id:"2"}
												   ],
											name : "status"
										});
									}},
									{text:'任务创建时间',name:"createTime" ,searchRender:function(el){
										index_render_div(el ,{
											type : "date"
										});
									}}
							   ];

				todo_work_list();

				index_search_div_remove_click(todo_work_list);

				function todo_work_list()
				{
					$("[data-id=work_table_div]").height(table_height+30);
					g_grid.render($("[data-id=work_table_div]"),{
						 header:list_col,
						 url:list_url,
						 oper: [
								    {icon:"rh-icon rh-edit" ,text:"办理" ,aclick:todo_work_handle_init}
							   ],
						 operWidth : "50px",
						 allowCheckBox : false,
						 hideSearch : true
					});
				}
				
				function todo_work_handle_init(rowData)
				{	
					var id = rowData.actTmpId;
					var procInstanceId = rowData.processInstanceID;
					var workItemID = rowData.workItemID;
					var processTemplateName = rowData.processTemplateName;
					var tplName;
					if(id.split("_")[0] == "socsjczlc")
					{
						tplName = processTemplateName.split("(")[1].split(")")[0];
					}

					$.ajax({
						type: "GET",
						url: "module/oper_workorder/workorder_handle/todo_work_tpl.html",
						success :function(data)
						{
							g_dialog.dialog($(data).find("[id=tab]"),{
								width:"900px",
								init:init,
								initAfter:initAfter,
						    	btn_array:[
							 				{id:"save_btn",text:"保存",aClick:save},
							 				{id:"commission_btn",text:"代办",aClick:reassign_handle}
					 		   		      ],
					 		    title:"待办工作办理",
					 		    top:"3%",
								saveclick:save_click
							});
						}
					});

					function init(el)
					{	
						tab.tab(el.find("[id=tab]"),{oper : [null,null]});
						el.find("[id=workorder_div]").data("step" ,id);
						el.find("[id=workorder_div]").data("tplName",tplName);
						el.find("[id=workorder_div]").data("procInstanceId",procInstanceId);

						$.ajax({
							type: "GET",
							url: "tpl/workorder/"+id.split("_")[0]+".html",
							success :function(data)
							{
								el.find("[id=workorder_div]").html($(data).find("[data-type=workorder]").html());
							}
						});
					}

					function initAfter(el)
					{
						um_ajax_get({
							url : "workflow/queryWorkflowOrderDetail",
							paramObj : {procInsId:rowData.processInstanceID,workItemID:rowData.workItemID},
							maskObj : el,
							successCallBack : function (data){
								delete data['${wf_applicant}'];
								if(id.split("_")[0] == "socsjczlc" || id.split("_")[0] == "sjczlc")
								{	
									delete data['wf_step2_aprresult'];
									delete data['procInstanceId'];
								}
								workorder.workorder_init(id ,{data:data});
								el.umDataBind("render" ,data);
								workorder.workorder_render(id ,data);
							}
						});
					}

					function save(el)
					{	
						var el_div = el.find("[id=workorder_div]");
						var el_form = el_div.find("[id="+id.split("_")[1]+"]");
						
						if (!g_validate.validate(el_form))
						{
							return false;
						}
						else
						{  
							var saveObj = el_form.umDataBind("serialize");

							var obj = new Object();
							obj.variables = saveObj;
							obj.taskId = rowData.workItemID;

							um_ajax_post({
								url : "workflow/save",
								paramObj : obj,
								maskObj : "body",
								successCallBack : function (data){
									g_dialog.operateAlert();
									g_dialog.hide(el);
									todo_work_list();
								}
							});
						}
					}

					function reassign_handle(el)
					{
						$.ajax({
							type: "GET",
							url: "module/oper_workorder/workorder_handle/todo_work_tpl.html",
							success :function(data)
							{
								g_dialog.dialog($(data).find("[id=reassign_handle_template]"),{
									width:"450px",
									init:init,
						 		    title:"工作项代办",
									saveclick:saveclick
								});
							}
						});

						function init(aEl)
						{
							var header_col = [
												 {text:'人员名称',name:"userName" ,render:function (txt ,rowData){
												 	return rowData.userName + "(" + rowData.userAccount + ")";
												 }},
												 {text:'',name:"radio" ,render:function(txt ,rowData){
													   return '<input type="radio" name="user_btn" value="'+rowData.userId+'"/>';
												 }}
											 ]; 
							g_grid.render(aEl.find("[id=table_div]"),{
								url : "/workflow/queryAssignUserList",
								header:header_col,
								paramObj : {taskId:rowData.workItemID},
								maskObj : aEl,
								paginator:false,
								allowCheckBox:false,
								hideSearch : true
							});
						}

						function saveclick(aEl)
						{
							var userId = aEl.find("[name=user_btn]:checked").val();
							um_ajax_post({
								url : "/workflow/reassignhandle",
								paramObj : {userId:userId,taskId:rowData.workItemID},
								maskObj : aEl,
								successCallBack : function (data){
									g_dialog.operateAlert();
									g_dialog.hide(aEl);
									g_dialog.hide(el);
									todo_work_list();
								}
							});
						}
					}

					function save_click(el)
					{
						var el_div = el.find("[id=workorder_div]");
						var el_form = el_div.find("[id="+id.split("_")[1]+"]");
						var check_url = "AssetRepair/checkEdWorkFlowType";
						// 校验
						if (!g_validate.validate(el_form))
						{
							return false;
						}
						else
						{  
							if(id == "zcfplc_step3" || id == "zcdxlc_step1" || id == "zyzcdplc_step3" || id == "zyzcdplc_step1")
							{
								var edId;
								if(id == "zyzcdplc_step1")
								{
									edId = el_form.find("[data-id=wf_step1_assetname]").val();
									var aimassetId = el_form.find("[data-id=assetDst]").val();
								}
								else
								{
									edId = el_form.find("[asset]").find("input").eq(1).val();
								}
								
								um_ajax_post({
									url : check_url,
									paramObj : {edId:edId},
									isLoad : false,
									successCallBack : function (data){
										if(data.str == "1")
										{
											if(aimassetId)
											{
												um_ajax_post({
													url : check_url,
													paramObj : {edId:aimassetId},
													isLoad : false,
													successCallBack : function (data1){
														if(data1.str == "1")
														{
															submit();
														}
														else
														{
															g_dialog.operateAlert("body",data1.str ,"error");
														}
													}
												});
											}
											else
											{
												submit();
											}
										}
										else
										{
											g_dialog.operateAlert("body",data.str ,"error");
										}														
									}
								});
							}
							else
							{
								submit();
							}
							
							function submit(){
								var saveObj = el_form.umDataBind("serialize");
								saveObj.procInstanceId = rowData.processInstanceID;
								saveObj.htmlFormKeyClassMethod = id.split("_")[1];

								if(id.split("_")[0] == "socsjczlc" || id.split("_")[0] == "sjczlc")
								{
									saveObj.noticeStore = [];
									var data = g_grid.getData($("#notice_table_div"));
									for (var i = 0; i < data.length; i++) {
										saveObj.noticeStore.push(
											data[i]
										);
									}
								}

								var obj = new Object();
								obj.variables = saveObj;
								obj.taskId = rowData.workItemID;
								obj.procInsId = rowData.processInstanceID;

								if(id == "zcrklc_step1")
								{
									saveObj.assetStore = [];
									var data = g_grid.getData(el_form.find("[id=asset_list_div]"));
									for (var i = 0; i < data.length; i++) {
										saveObj.assetStore.push(
											data[i]
										);
									}
									obj.assetStore = saveObj.assetStore;
								}

								if(id == "zcdxlc_step4")
								{
									var store = new Object();
									store.addStore = [];
									store.updStore = [];

									el_form.find("#table_in_workorder").find("[data-id=um-grid-table-div]").find("tr").each(function (){
										var status = $(this).find("input[type=radio]:checked").val()
										var trData = $(this).data("data");
										if (status == 0)
										{
											store.updStore.push(trData);
										}
										else
										{
											store.addStore.push(trData);
										}
									});

									um_ajax_post({
										url : "AssetRepair/updWorkFlowVsEdStatus",
										paramObj : store,
										isLoad : false,
										successCallBack : function (data){
										}
									});
								}

								um_ajax_post({
									url : "workflow/execute",
									paramObj : obj,
									maskObj : "body",
									successCallBack : function (data){
										g_dialog.operateAlert();
										g_dialog.hide(el);
										todo_work_list();
									}
								});	
							}	
						}
					}
				}	
			});
		},
		bulletin_init:function(el)
		{
			var list_url = "AttendanceBulletin/queryAttendanceBulletin";
			el.find("[id=tab_bulletin]").height(table_height+30);
			var header = [
										{text:"公告内容",name:"desc",width:"70"},
										{text:"发布时间",name:"date",width:"30"}
									];
			g_grid.render(el.find("[id=tab_bulletin]") ,{
				url : list_url,
				header : header, 
				paramObj : {abType:1},
				hideSearch : true,
				allowCheckBox:false
			});
		},
		fault_init:function(el)
		{
			var list_url = "faultAlarmEvent/queryFaultEventList";
			el.find("[data-id=fault_table_div]").height(table_height);
			var header = dict_fault_event_header;
			event_init();
			g_grid.render(el.find("[data-id=fault_table_div]") ,{
				url : list_url,
				header : header,
				paramObj: {faultStatus : "1,3"},
				dbClick : fault_event_detail,
				hideSearch : true
			});
			function event_init() 
			{
				el.find("[id=database_ignore_btn]").unbind("click");
				el.find("[id=database_ignore_btn]").click(function (){
					var array = g_grid.getIdArray($("[data-id=fault_table_div]") ,{chk:true,attr:"faultID"});
					if (+array.length === 0)
					{
						g_dialog.operateAlert($("[data-id=fault_table_div]"),index_select_one_at_least_msg ,"error");
						return false;
					}
					pevent.ignore({
						gridEl : $("[data-id=fault_table_div]"),
						attr : "faultNO",
						ignore_url : "faultAlarmEvent/doIgnore",
						cb : function (){
							g_grid.refresh($("[data-id=fault_table_div]") ,{
								queryBefore : function (paramObj){
									paramObj.currentStatus = 0;
									paramObj.faultStatus = 1;
								}
							});
						}
					});
				});
				el.find("[id=database_work_btn]").unbind("click");
				el.find("[id=database_work_btn]").click(function (){
					pevent.createWorkOrder({
						gridEl : $("[data-id=fault_table_div]"),
						descKey : "faultModule",
						eventIdKey : "faultNO",
						eventTypeVal : "2"
					});
				});
			}

			function fault_event_detail(rowData)
			{
				pevent.faultEventDetail(rowData);
			}
		},
		property_init:function(el)
		{
			var list_url = "performanceEvent/queryPerformanceEventList";
			el.find("[data-id=property_table_div]").height(table_height);
			var header = dict_perform_event_header;
			event_init();
			g_grid.render(el.find("[data-id=property_table_div]") ,{
				url : list_url,
				header : header,
				paramObj : {perfStatus : "1,3"},
				dbClick : perform_event_detail,
				hideSearch : true
			});
			function event_init() 
			{
				el.find("[id=database_ignore_btn]").unbind("click");
				el.find("[id=database_ignore_btn]").click(function (){
					var array = g_grid.getIdArray($("[data-id=property_table_div]") ,{chk:true,attr:"performanceNo"});
					if (+array.length === 0)
					{
						g_dialog.operateAlert($("[data-id=property_table_div]"),index_select_one_at_least_msg ,"error");
						return false;
					}
					pevent.ignore({
						gridEl : $("[data-id=property_table_div]"),
						attr : "performanceNo",
						ignore_url : "performanceEvent/doPerformanceEventIgnore",
						cb : function (){
							g_grid.refresh($("[data-id=property_table_div]") ,{
								queryBefore : function (paramObj){
									paramObj.currentStatus = 0;
									paramObj.perfStatus = 1;
								}
							});
						}
					});
				});
				el.find("[id=database_work_btn]").unbind("click");
				el.find("[id=database_work_btn]").click(function (){
					pevent.createWorkOrder({
						gridEl : $("[data-id=property_table_div]"),
						descKey : "perfModule",
						eventIdKey : "performanceNo",
						eventTypeVal : "3"
					});
				});
			}

			function perform_event_detail(rowData)
			{
				pevent.performEventDetail(rowData);
			}
		}

	};
});