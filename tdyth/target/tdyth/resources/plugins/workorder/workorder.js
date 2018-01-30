define(['inputdrop' ,'js/plugin/asset/asset.js' ,'tree','/js/plugin/tab/tab.js'], function(inputdrop ,asset ,tree,tab) {

	return {
		notice_user_dialog : function (){
			$.ajax({
				type: "GET",
				url: "js/plugin/workorder/workorder.html",
				success: function(data) {
					g_dialog.dialog($(data).find("[id=notice_template]"), {
						width: "1000px",
						init: init,
						initAfter: initAfter,
						top : "0",
						title : "通知交流",
						isDetail : true,
						btn_array:[
					 				{id:"email_btn",class:"dialog-email",text:"邮件",aClick:email_notice_init},
					 				{id:"phone_btn",class:"dialog-phone",text:"电话",aClick:phone_notice_init},
					 				{id:"message_btn",class:"dialog-message",text:"短信",aClick:message_notice_init}
			 		   		      ]
					});
				}
			});

			var header = [
							{text:"姓名" ,name:"name"} ,
							{text:"性别" ,name:"sex",render:function (tdTxt,rowData){
					  			if (rowData.sex == 1)
					  			{
					  				return "男";
					  			}
					  			else if(rowData.sex == 2)
					  			{
					  				return "女";
					  			}
					  		}},
						  	{text:"办公电话" ,name:"telephone"} ,{text:"手机" ,name:"mobile"},
						  	{text:"邮箱" ,name:"email"} ,{text:"职务" ,name:"staffPost"}
						  ];
			var el_table_top;
			var el_table_bottom;
			var eventSTR;
			try{
				eventSTR = $("[data-id=eventStr]").val().split(",").join("_");
			}catch(e){

			};
			(eventSTR == "") && (eventSTR = "null");
			var eventType = $("[data-id=eventType]").val();

			function init(el){
				el_table_top = el.find("[id=table_top]");
				el_table_bottom = el.find("[id=table_bottom]");

				g_grid.render(el_table_top ,{
					data:[],
					header:header,
					hideSearch : true,
					paginator : false
				});

				g_grid.render(el_table_bottom ,{
					data:[],
					header:header,
					hideSearch : true,
					paginator : false
				});

				el.find("[id=accordion_icon]").find("i").click(function (){
					el.find("[id=accordion_icon]").find("i").removeClass("icon-active");
					$(this).addClass("icon-active");
					var self = this;
					um_ajax_post({
						url : $(this).attr("data-url"),
						isLoad : true,
						maskObj : el,
						paramObj : {numShowFlag:"0"},
						successCallBack:function (data){
							if ($(self).attr("data-key"))
							{
								data = data[$(self).attr("data-key")];
							}
			 				tree.render($("#left_tree") ,{
			 					zNodes : data,
			 					zTreeOnClick : function (event, treeId, treeNode){
			 						g_grid.removeData(el_table_top ,{});

			 						var domainId = treeNode.id;
			 						var flag = "user";

			 						if ($(self).attr("data-key"))
									{
										flag = "";
									}
			 						
			 						var userGroupGridStore = [];
			 						var dataArray = g_grid.getData(el_table_bottom);
			 						for(var i = 0; i < dataArray.length; i++)
			 						{
			 							userGroupGridStore.push({staffId:dataArray[i].staffId});
			 						}
			 						um_ajax_post({
										url : "workflow/notify/queryStaffList",
										paramObj : {domaId:domainId,flag:flag,userGroupGridStore:userGroupGridStore},
										isLoad : true,
										maskObj : el,
										successCallBack:function (data){
											g_grid.addData(el_table_top ,data);
										}
									});
			 					},
			 					expandNode : "-1"
			 				});
			 				current_treeType = $(self).attr("data-type");
						}
					});
				});

				el.find("[id=up_btn]").click(function (){
					var downDataArray = g_grid.getData(el_table_bottom ,{chk:true});
					if (downDataArray.length == 0)
					{
						g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
						return false;
					}
					g_grid.removeData(el_table_bottom);
					g_grid.addData(el_table_top ,downDataArray);
				});

				el.find("[id=down_btn]").click(function (){
					var upDataArray = g_grid.getData(el_table_top ,{chk:true});
					if (upDataArray.length == 0)
					{
						g_dialog.operateAlert(el ,index_select_one_at_least_msg ,"error");
						return false;
					}
					g_grid.removeData(el_table_top);
					g_grid.addData(el_table_bottom ,upDataArray);
				});
			}

			function initAfter(el){
				el.find("[id=accordion_icon]").find("i").eq(0).click();
			}
	
			function email_notice_init(el)
			{
				var data = g_grid.getData(el_table_bottom);
				if(data.length == 0)
				{
					g_dialog.operateAlert(el_table_bottom ,"请选择待通知人员。" ,"error");
					return false;
				}
				var eArray = g_grid.getIdArray(el_table_bottom,{attr:"email"});
				if(eArray.indexOf("") > -1)
				{
					var tmp = [];
					for (var i = 0; i < data.length; i++) {
						if(data[i].email == "")
						{
							tmp.push(data[i].name);
						}
					}
					var user = tmp.join(",");
					g_dialog.operateAlert(el_table_bottom ,user+" 未配置电子邮箱，不能发送邮件。" ,"error");
					return false;
				}
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=email_notice_template]"), {
							width: "700px",
							top : "8%",
							init: init,
							title : "邮件交流",
							isDetail : true,
							btn_array:[{id:"post_btn",class:"dialog-post",text:"发送",aClick:email_post}]
						});
					}
				});

				var extMap = new HashMap();

				function init(aEl)
				{
					var nameArray = [];
					var staffIdArray = [];
					var emailArray = [];
					for(var i = 0; i < data.length; i++)
					{
						nameArray.push(data[i].name);
						staffIdArray.push(data[i].staffId);
						emailArray.push(data[i].email);
					}
					var name = nameArray.join(";");
					var staffId = staffIdArray.join(";")
					var email = emailArray.join(";");
					aEl.find("[data-id=mainDeliveryName]").text(name);
					aEl.find("[data-id=mainDelivery]").val(staffId);
					aEl.find("[id=email]").text(email);

					um_ajax_post({
						url : "NotifyController/queryInitInfo",
						paramObj : {type:"email"},
						isLoad : true,
						maskObj : "body",
						successCallBack:function (data){
							g_formel.selectEl_render(aEl.find("[data-id=carbonCopy]"),{
								data:data.assetUserGroupStore,
								text:"codename",
								id:"codevalue"
							});
							g_formel.selectEl_render(aEl.find("[data-id=emailTemplateName]"),{
								data:data.emailTemplateStore,
								text:"codename",
								id:"codevalue"
							});

							for (var i = 0; i < data.emailTemplateStore.length; i++) {
								extMap.put(data.emailTemplateStore[i].codevalue,
												data.emailTemplateStore[i].ext);
							}

							aEl.find("[data-id=emailTemplateName]").change(function(){
								aEl.find("[data-id=notifyContent]").val(extMap.get($(this).val()));
							});
						}
					});
					
					um_ajax_post({
						url : "EventControllerService/queryEventList4Notify",
						paramObj : {eventStore:{eventStr:eventSTR,eventType:eventType}},
						isLoad : true,
						maskObj : "body",
						successCallBack:function (data){
							aEl.find("[data-id=notifyContent]").val(data.eventStore.mailNotifyDesc);
						}
					});
				}

				function email_post(aEl)
				{
					var type = "email";
					submit(el,aEl,type);
				}
			}

			function phone_notice_init(el)
			{
				var data = g_grid.getData(el_table_bottom);
				if(data.length == 0)
				{
					g_dialog.operateAlert(el ,"请选择待通知人员。" ,"error");
					return false;
				}
				var mArray = g_grid.getIdArray(el_table_bottom,{attr:"mobile"});
				var pArray = g_grid.getIdArray(el_table_bottom,{attr:"telephone"});
				if(mArray.indexOf("") > -1 &&  pArray.indexOf("") > -1)
				{
					var tmp = [];
					for (var i = 0; i < data.length; i++) {
						if(data[i].mobile == "" && data[i].telephone == "")
						{
							tmp.push(data[i].name);
						}
					}
					var user = tmp.join(",");
					g_dialog.operateAlert(el_table_bottom ,user+" 未配置联系电话，不能电话通知。" ,"error");
					return false;
				}
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=phone_notice_template]"), {
							width: "700px",
							top : "9%",
							init: init,
							title : "电话交流",
							isDetail : true,
							btn_array:[{id:"post_btn",class:"dialog-post",text:"确认",aClick:phone_post}]
						});
					}
				});

				function init(aEl)
				{
					var nameArray = [];
					var staffIdArray = [];
					var phoneArray = [];
					var mobileArray = [];
					for(var i = 0; i < data.length; i++)
					{
						nameArray.push(data[i].name);
						staffIdArray.push(data[i].staffId);
						phoneArray.push(data[i].telephone);
						mobileArray.push(data[i].mobile)
					}
					var name = nameArray.join(";");
					var staffId = staffIdArray.join(";");
					var phone = phoneArray.join(";");
					var mobile = mobileArray.join(";");
					aEl.find("[data-id=mainDeliveryName]").text(name);
					aEl.find("[data-id=mainDelivery]").val(staffId);
					aEl.find("[data-id=telephone]").text(phone);
					aEl.find("[data-id=mobile]").text(mobile);
				}

				function phone_post(aEl)
				{
					var type = "phone";
					submit(el,aEl,type);
				}
			}

			function message_notice_init(el)
			{
				var data = g_grid.getData(el_table_bottom);
				if(data.length == 0)
				{
					g_dialog.operateAlert(el_table_bottom ,"请选择待通知人员。" ,"error");
					return false;
				}
				var mArray = g_grid.getIdArray(el_table_bottom,{attr:"mobile"});
				if(mArray.indexOf("") > -1)
				{
					var tmp = [];
					for (var i = 0; i < data.length; i++) {
						if(data[i].mobile == "")
						{
							tmp.push(data[i].name);
						}
					}
					var user = tmp.join(",");
					g_dialog.operateAlert(el_table_bottom ,user+" 未配置手机号码，不能发送短信。" ,"error");
					return false;
				}
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=message_notice_template]"), {
							width: "700px",
							top : "12%",
							init: init,
							title : "短信交流",
							isDetail : true,
							btn_array:[{id:"post_btn",class:"dialog-post",text:"发送",aClick:message_post}]
						});
					}
				});

				function init(aEl)
				{
					var nameArray = [];
					var staffIdArray = [];
					
					var mobileArray = [];
					for(var i = 0; i < data.length; i++)
					{
						nameArray.push(data[i].name);
						staffIdArray.push(data[i].staffId);
						mobileArray.push(data[i].mobile)
					}
					var name = nameArray.join(";");
    				var staffId = staffIdArray.join(";")
					var mobile = mobileArray.join(";");
					aEl.find("[data-id=mainDeliveryName]").text(name);
					aEl.find("[data-id=mainDelivery]").val(staffId);
					aEl.find("[data-id=mobile]").text(mobile);

					um_ajax_post({
						url : "EventControllerService/queryEventList4Notify",
						paramObj : {eventStore:{eventStr:eventSTR,eventType:eventType}},
						isLoad : true,
						maskObj : "body",
						successCallBack:function (data){
							aEl.find("[data-id=notifyContent]").val(data.eventStore.smsNotifyDesc);
						}
					});
				}

				function message_post(aEl)
				{
					var type = "sms";
					submit(el,aEl,type);
				}
			}

			function submit(el,aEl,type)
			{
				if (!g_validate.validate(aEl))
				{
					return false;
				}
				var saveObj = aEl.umDataBind("serialize");

				saveObj.processInstanceID = $("[data-id=procInstanceId]").val();

				if(type == "email")
					saveObj.notifyMethod = "email";
				else if(type == "phone")
					saveObj.notifyMethod = "phone";
				else if(type == "sms")
					saveObj.notifyMethod = "sms";
				
				saveObj.chkBox = "0";
				saveObj.uploadFile = "";
				aEl.find("[name=jsonString]").val(JsonTools.encode(saveObj));

				um_ajax_file(aEl.find("form") ,{
					url : "NotifyController/addNotifyRecord",
					paramObj : {},
					isLoad : true,
					maskObj : "body",
					successCallBack:function (data){
						g_dialog.operateAlert();
						g_dialog.hide(aEl);
						g_dialog.hide(el);
						notice_list_addData(saveObj.processInstanceID);
					}
				});
			}

			function notice_list_addData(processInstanceID)
			{
				um_ajax_post({
					url : "EventController/queryNotify",
					paramObj : {queryStore:{procInstID:processInstanceID}},
					isLoad : true,
					maskObj : "body",
					successCallBack:function (data){
						g_grid.removeData($(notice_table_div),{});
						g_grid.addData($(notice_table_div) ,data.queryStore);
					}
				});
			}	
		},
		/** 
			封装资产输入框
		*/
		assetInput: function(el ,opt) {
			el.wrap('<div class="prel"></div>');
			var el_asset_input = el;
			el.after('<i class="icon-search" style="position:absolute; bottom: 8px;right:5px;font-size:15px;opacity:0.4"></i>');
			var el_icon_search = el.next();
			if (el_asset_input.hasClass("noEdit"))
			{
				el_icon_search.hide();
			}
			var el_asset_table;
			el_icon_search.click(function() {
				if($(this).prev().hasClass("disable"))
				{
					return false;
				}

				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=asset_template]"), {
							width: "830px",
							top:"10%",
							title:"资产名称",
							init: init,
							saveclick: save
						});
					}
				});

				function init(el) {
					el_asset_table = el.find('[id=table_in_asset]');

					g_grid.render(el_asset_table, {
						header: [{
							text: '资产名称',
							name: "assetName"
						},
						{
							text: '资产类型',
							name: "assetTypeName",
							searchRender:function (el){
								el.append('<div class="inputdrop" id="assetTypeId"></div>');
								g_formel.sec_biz_render({
									assetTypeEl : el.find("div")
								});
							}
						}, {
							text: '安全域',
							name: "securityDomainName",
							searchRender:function (el){
								el.append('<div class="inputdrop" id="securityDomainId"></div>');
								g_formel.sec_biz_render({
									secEl : el.find("div")
								});
							}
						}, {
							text: '业务域',
							name: "bussinessDomainName",
							searchRender:function (el){
								el.append('<div class="inputdrop" id="bussinessDomainId"></div>');
								g_formel.sec_biz_render({
									bizEl : el.find("div")
								});
							}
						},{
							text: 'IP',
							name: "mainIp",
							searchRender:function (el){
							   index_render_div(el ,{type:"ip"});
							}
						}],
						url: "AssetOperation/queryAsset",
						paramObj: {noEdIds : el_asset_input.find("[data-type=id_inp]").val()},
						allowCheckBox: true,
						isLoad:"true",
						maskObj:"body"
					});

					//查询
					el.find("[id=asset_query_btn]").click(function() {
						asset.queryDialog({
							saveclick : function (dataList){
								g_grid.addData(el_asset_table ,[{edName:"123"}]);
							}
						});
					});
				}

				function save(el, saveObj) {
					var data = g_grid.getData(el_asset_table ,{chk:true});
					//var idKey = "assetName";
					var idKey = "edId";

					if (opt && opt.idKey)
					{
						idKey = opt.idKey;
					}
					for (var i = 0; i < data.length; i++) {
						data[i].id = data[i][idKey];
						data[i].text = data[i].assetName;
					}
					if (data.length == 0)
					{
						g_dialog.operateAlert(el_asset_table ,index_select_one_at_least_msg ,"error");
						return false;
					}
					if (el_asset_input.hasClass("single"))
					{
						if (data.length != 1)
						{
							g_dialog.operateAlert(el_asset_table ,"请只选择一条资产记录。" ,"error");
							return false;
						}
						inputdrop.initSelect(el_asset_input);
					}
					$("[assetIp]").val(data[0].mainIp);
					g_dialog.hide(el);

					inputdrop.addDataSelect(el_asset_input ,{
							data : data
					});
					g_validate.clear([el_asset_input.find("[validate]")]);
					
				}
			});
			var data = [];
			if (opt && opt.data)
			{
				data = opt.data;
			}
			if (opt && opt.required)
			{
				el_asset_input.attr("required" ,"");
			}
			inputdrop.renderSelect(el_asset_input ,{
												data : data,
												allowCheckBox : false,
												hideRemove : false,
												isSingle : true
											});
		},

		workorder_init : function (step,opt){
			var opt = opt?opt:{};
			var data = opt.data?opt.data:{};

			var el_div = $("#workorder_div");
			if (opt.el)
			{
				el_div = opt.el;
				$("#workorder_div").data("el" ,opt.el);
			}
			el_div.data("opt" ,opt);
			var el_form = el_div.find("[id="+step.split("_")[1]+"]");
			el_div.data("data" ,data);

			var self = this;
			if (el_div.find("[asset]").size() > 0)
			{
				el_div.find("[asset]").each(function (){
					var dataArray = [];
					if (Object.keys(data).length > 0)
					{
						try
						{
							var idArray = data[$(this).attr("id")].split(",");
							var nameArray = data[$(this).attr("id")+"name"].split(",");

							for (var i = idArray.length - 1; i >= 0; i--) {
								dataArray.push({id:idArray[i] ,text:nameArray[i]});
							}
						}catch(e){

						}
					}
					
					self.assetInput(
							$(this) ,{
										data:dataArray
									 }
							);
					$(this).find("input").eq(0).attr("data-id" ,$(this).attr("id")+"name");
				});
			}

			if(!(opt && opt.type == "detail"))
			{
				el_form.find("[class=mask]").remove();
				if(step == "sjczlc_step1" || step == "socsjczlc_step1")
				{
					el_div.find("[id=step2]").find("[class=mask]").remove();
					el_div.find("[id=step2]").append('<div class="mask"></div>');
				}
				if(step == "zhsqlc_step1" || step == "zhsqlc_step2")
				{
					el_div.find("[id=step3]").find("[class=mask]").remove();
					el_div.find("[id=step3]").append('<div class="mask"></div>');
				}

				if (el_form.find("[sysDate]").size() > 0)
				{
					um_ajax_get({
						url : "dutyperson/querySysdate",
						isLoad : false,
						successCallBack : function(data){
							
							el_form.find("[sysDate]").text(data.sysdate);
							el_form.find("[sysDate]").val(data.sysdate);
						}
					});
				}

				if (el_form.find("[sessionUser]").size() > 0)
				{
					um_ajax_get({
						url : "querySessionUser",
						successCallBack : function(data){
							
							el_form.find("[sessionUser]").text(data.user.userAccount+'('+data.user.userName+')');
							el_form.find("[sessionUser]").val(data.user.userAccount+'('+data.user.userName+')');
							el_form.find("[sessionUser]").next().val(data.user.userId);
						}
					});
				}

				g_validate.init(el_form);
			}

			else
			{
				if(opt.style == "see")
				{
					el_div.find("[class=mask]").css("opacity","0.3");
				}
				else
				{
					el_form.find("[class=mask]").css("opacity" ,"0.3");
				}
			}

			index_form_init(el_div);

			var workOrderName = step.split("_")[0];
			var currentStepNum = step.split("_")[1].substr(4);

			if (currentStepNum == 0)
			{
				return false;
			}

			for (var i = 1; i <= currentStepNum; i++) 
			{
				try{
					eval("this."+workOrderName+"_step"+i+"_init()");
				}catch(e){

				}
			}
		},
		workorder_render : function (step ,data){
			var el_div = $("#workorder_div");

			el_div.find("select").trigger("change");
		},
		// 已办工单查看 ----------
		done_workorder : function(opt,style){
			var self = this;
			var id = opt.id;
			var tplName = opt.tplName;
			var processInstanceID = opt.processInstanceID;
			var title = "已办工作查看";
			(style && style == "see") && (title = "案例来源表单查看");
			if(style && style == "case")
			{
				title = "工单监控";
				var caseStatus = opt.caseStatus;
				var workOrderStatus = opt.workOrderStatus;
				var procStatus = opt.procStatus;
			}

			var dialogParam = {
				width : "900px",
				init:init,
				initAfter:initAfter,
	 		    title:title,
	 		    isDetail:true,
	 		    top:"3%"
			};

			$.ajax({
				type: "GET",
				url: "module/oper_workorder/workorder_handle/todo_work_tpl.html",
				success :function(data)
				{
					if(style && style == "case" && id.split("_")[0] == "socsjczlc" && caseStatus == "0" && workOrderStatus != "2")
					{
						dialogParam["btn_array"] = [
							{id:"general_case_btn",class:"dialog-create-workorder",text:"生成案例",aClick:general_case_init}
						];
						g_dialog.dialog($(data).find("[id=tab]"),dialogParam);
					}
					else
					{
						g_dialog.dialog($(data).find("[id=tab]"),dialogParam);
					}
				}
			});

			function init(el)
			{	
				tab.tab(el.find("[id=tab]"),{oper : [null,null]});
				if(style && style == "see") {
					el.find("[id=tab]").find("li:eq(1)").remove();
				};
				el.find("[id=workorder_div]").data("step" ,id);
				el.find("[id=workorder_div]").data("tplName",tplName);
				el.find("[id=workorder_div]").data("procInstanceId",processInstanceID);
				el.data("step" ,id);
				el.data("tplName",tplName);

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
					url : "workflow/queryHisWorkflowOrderDetail",
					paramObj : {procInsId:processInstanceID},
					maskObj : "body",
					successCallBack : function (data){
						delete data['${wf_applicant}'];
						var obj = new Object();
						obj.type = "detail";
						obj.data = data;
						if(style)
						{
							obj.style = "see";
							if(style == "see")
							{
								obj.el=el;
							}
						}
						self.workorder_init(id ,obj);
						el.umDataBind("render" ,data);
						self.workorder_render(id ,data);
					}
				});	
				if(!(style && style == "see"))
				{
					var flag = 1;
					(style && style == "case" && workOrderStatus == "1" && procStatus == "0") && (flag = 3);
					el.find("[id=img]").attr("src",index_web_app+"workflow/getFlowDiagram?procInstId="+processInstanceID+"&flag="+flag+"&date="+new Date().getTime());
				}
			}

			function general_case_init(el)
			{
				$.ajax({
					type: "GET",
					url: "module/oper_workorder/workflow_manage/workorder_tpl.html",
					success :function(data)
					{
						g_dialog.dialog($(data).find("[id=general_case_template]"),{
							width:"550px",
							init:init,
				 		    title:"生成案例",
				 		    top : "6%",
							saveclick:save_click
						});
					}
				});
				function init(aEl)
				{
					var caseTitle = el.find("[data-id=wf_step1_wfname]").val();
					var eventType = el.find("[data-id=eventType]").val();
					var eventStr = el.find("[data-id=eventStr]").val();
					var procInstID = el.find("[data-id=procInstanceId]").val();
					aEl.find("[name=caseTitle]").val(caseTitle); 
					aEl.find("[name=eventType]").val(eventType);
					aEl.find("[name=eventStr]").val(eventStr);
					aEl.find("[name=procInstID]").val(procInstID);
					um_ajax_get({
						url : "WorkOrderMonitorController/queryConfigInfo",
						maskObj : "body",
						isLoad : "true",
						successCallBack : function(data){
							aEl.umDataBind("render",data.maxstore[0]);
							g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{});
						}
					});
				}

				function save_click(aEl)
				{
					var maxObj = new Object();
					maxObj.maxUpLoadFileNum = aEl.find("[data-id=maxUpLoadFileNum]").text();
					maxObj.maxUpLoadFileSize = aEl.find("[data-id=maxUpLoadFileSize]").text();
					aEl.find("[name=maxdsjson]").val(JsonTools.encode(maxObj));

					g_formel.appendix_render($("[id=appendixgroup]") ,{
						method : "getUploadStrArray"
					});

					var uploadStr = $("[id=appendixgroup]").data("uploadStrArray").join("|");
					aEl.find("[name=uploadStr]").val(uploadStr);

					um_ajax_file(aEl.find("form") ,{
						url : "WorkOrderMonitorController/newCase",
						paramObj : {},
						isLoad : true,
						maskObj : "body",
						successCallBack:function (data){
							g_dialog.operateAlert("body");
							g_dialog.hide(aEl);
							g_dialog.hide(el);
							opt.cbf && opt.cbf();
						}
					});
				}
			}
		},
		//-----------已办工单查看

		// 库存外借流程 ----------
		kcwjlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.assetBorrow.controller.AssetBorrow";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "kcwjlc";

				var obj = new Object();
				obj.assetborrowStep1Apply = saveObj;
				obj.curstep = "assetborrowStep1Apply";
				obj.procDefID = "kcwjlc:1:140004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "asset_admeasure";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				})
			}
		},
		// -------------库存外借流程

		// 事件处置流程 ----------
		sjczlc_step1_init : function(){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data")?el_div.data("data"):{};
			var noticeStore = data.noticeStore?data.noticeStore:[];
			var procInstanceId = el_div.data("procInstanceId");
			var step = el_div.data("step");
			var opt = el_div.data("opt");

			var self = this;

			form_init();

			notice_list();

			event_init();

			function form_init()
			{
				var secVal = data?data.securityDomianId:"";
				var bizVal = data?data.bussinessDomianId:"";
				g_formel.sec_biz_render({
											secEl:$("[id=securityDomianId]"),
											secVal:secVal
										});
				g_formel.sec_biz_render({
											bizEl:$("[id=bussinessDomianId]"),
											bizVal:bizVal
										});
				if(step)
				{
					$("[data-id=procInstanceId]").val(procInstanceId);
				}
			    else
			    {	
			    	var time = g_moment().format('ddd MM DD YYYY HH:mm:ss');
					var int = parseInt(500*Math.random());
					var processInstanceID = "3rd_faultEvent_"+time+"_"+int;
					$("[data-id=procInstanceId]").val(processInstanceID);
			    	el_form.find("[data-id=eventType]").change(function(){
			    		var eventType = $(this).val();
			    		var eventtype;
						(eventType == "2") && (eventtype = "faultEvent");
						(eventType == "3") && (eventtype = "perfEvent");
						(eventType == "13") && (eventtype = "deployEvent");
						(eventType == "14") && (eventtype = "vulTaskEvent");
						processInstanceID = "3rd_"+eventtype+"_"+time+"_"+int;
						$("[data-id=procInstanceId]").val(processInstanceID);
			    	});
			    }	
			}

			function event_init()
			{
				el_form.find("[id=notice_btn]").click(function(){
					self.notice_user_dialog();
				});

				el_form.find("[id=email_associate_btn]").click(function(){
					email_associate();
				});
			}

			function notice_list()
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				var gridParam = {
					header : [
							  {text:'通知人',name:"userName"},
							  {text:'被通知人',name:"mainDelivery"},
							  {text:'通知方式',name:"notifyMethod"},
							  {text:'通知时间',name:"notifyTime"}
							  ],
					data : noticeStore,
					isLoad : false,
					allowCheckBox : false,
					hideSearch : true,
					paginator:false,
					dbClick : notice_detail_init
				};

				if( step && step.split("_")[1] == "step2" && (opt.type != "detail"))
				{
					$("#step1").find("[class=mask]").remove();
					$("#one").append('<div class="mask"></div>');
					gridParam["oper"] = [
											{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:phone_update ,isShow:function (data){
												return (data.notifyMethod == "电话");
											}},
										];
					gridParam["operWidth"] = "100px";					
				}

				g_grid.render($("#notice_table_div"),gridParam);
			}

			function phone_update(rowData)
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=phone_update_template]"), {
							width: "600px",
							top : "6%",
							init: init,
							title : "电话通知修改",
							saveclick : save_click
						});
					}
				});

				function init(aEl)
				{
					var obj = new Object();
					obj.notifyID = rowData.notifyID;
					obj.procInstID = procInstID;
					obj.notifyType = "phone";
					obj.type = "modify";
					obj.pagetype = "edit";

					um_ajax_get({
						url : "NotifyController/queryNotifyDetail",
						paramObj : obj,
						isLoad : true,
						maskObj : "body",
						successCallBack:function (data){
							var mainDeliveryArray = [];
							var phoneArray = [];
							var mobileArray = [];

							for(var i = 0;i < data.notifydetailstore.length;i++)
							{
								var data1 = data.notifydetailstore[i];
								mainDeliveryArray.push(data1.mainDelivery);
								phoneArray.push(data1.phone);
								mobileArray.push(data1.mobile);	
							}
							var mainDelivery = mainDeliveryArray.join(";");
							var phone = phoneArray.join(";");
							var mobile = mobileArray.join(";");
							aEl.find("[data-id=mainDelivery]").text(mainDelivery);
							aEl.find("[data-id=phone]").text(phone);
							aEl.find("[data-id=mobile]").text(mobile);
							aEl.find("[data-id=userName]").text(data.notifydetailstore[0].userName);
							aEl.find("[data-id=notifyTime]").text(data.notifydetailstore[0].notifyTime);
							aEl.find("[data-id=notifyContent]").text(data.notifydetailstore[0].notifyContent);
						}
					});
				}

				function save_click(aEl,saveObj)
				{
					var obj = new Object();
					obj.notifyID = rowData.notifyID;
					obj.processInstanceID = procInstID;
					obj.notifyContent = saveObj.notifyContent;

					um_ajax_post({
						url : "NotifyController/updRecord",
						paramObj : obj,
						successCallBack : function(data){
							g_dialog.operateAlert("body");
							g_dialog.hide(aEl);
							notice_list_refresh();
						}

					});
				}
			}
			
			function notice_detail_init(rowData)
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				var title;
				var width = "700px";
				if(rowData.notifyMethod == "邮件")
				{
					title = "邮件通知详情";
					width = "600px";
				}
				else if(rowData.notifyMethod == "电话")
				{
					title = "电话通知详情";
				}
				else if(rowData.notifyMethod == "短信")
				{
					title = "短信通知详情";
				}

				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=notice_detail_template]"), {
							width: width,
							top : "6%",
							init: init,
							initAfter : initAfter,
							title : title,
							isDetail : true
						});
					}
				});

				function init(aEl)
				{
					if(rowData.notifyMethod == "邮件")
					{
						aEl.find("[id=phone_sms_div]").remove();
					}
					else
					{
						aEl.find("[id=email_div]").remove();
						g_grid.render(aEl.find("[id=table_in_notice_detail]"),{
							 header : [
									  {text:'通知人',name:"userName",width:"15"},
									  {text:'被通知人',name:"mainDelivery",width:"15"},
									  {text:'通知时间',name:"notifyTime",width:"30"},
									  {text:'通知内容',name:"notifyContent"}
									  ],
							 data : [],
							 allowCheckBox : false,
							 hideSearch : true
						});
					}
				}

				function initAfter(aEl)
				{
					um_ajax_post({
						url : "NotifyController/queryNotifyDetail",
						paramObj :{notifyID:rowData.notifyID,procInstID:procInstID,notifyType:rowData.notifyMethodEn},
						isLoad : false,
						isDetail : true,
						maskObj : "body",
						successCallBack : function(data){
							if(rowData.notifyMethod == "邮件")
							{
								um_ajax_get({
									url : "InBoxController/queryAppendixByEmail",
									paramObj : {emailCode : rowData.notifyID},
									isLoad : true,
									maskObj : "body",
									successCallBack : function(data1){
										aEl.umDataBind("render" ,data.notifydetailstore[0]);
										aEl.find("[data-id=email]").html(data.notifydetailstore[0].email);
										aEl.find("[data-id=notifyContent]").html(data.notifydetailstore[0].notifyContent);
										for (var i = 0; i < data1.length; i++) {
							 				var app_div;
											app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+data1[i].appendixPath+'" data-flag="appendix" data-id="'+data1[i].appendixCode+'">'
						 							+data1[i].appendixName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
							 				aEl.find("[id=appendixList]").append(app_div);
							 			}
										aEl.find("[data-flag=appendix]").click(function(){
											var url = $(this).attr("id");
											um_ajax_get({
												url : "InBoxController/queryAppendixExist",
												paramObj : {appendixCode : $(this).attr("data-id")},
												isLoad : true,
												maskObj : "body",
												successCallBack : function(data){
													window.location.href = url;
												}
											});
										});
							 				
									}
								});
							}
							else 
							{
								g_grid.addData(aEl.find("[id=table_in_notice_detail]") ,data.notifydetailstore);	
							}		
						}
					});
				}
			}
			
			function email_associate()
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=email_template]"), {
							width: "700px",
							top : "8%",
							init: init,
							title : "往来邮件关联",
							btn_array:[
						 				   {id:"associate_btn",class:"dialog-associate",text:"关联",aClick:associate}
				 		   		      ],
							isDetail : true
						});

						function init(aEl)
						{
							g_grid.render(aEl.find("[id=table_in_query_email]"),{
								 header : [
											    {text:'主题',name:"emailTitle"},
											    {text:'发件人',name:"emailFrom"},
											    {text:'日期',name:"emailDate"},
											    {text:'',name:"radio" ,width:10,render:function(txt ,rowData){
											   		return '<input type="radio" name="email_btn" value=""/><div style="display:none">'+rowData.emailCode+','+rowData.emailDate+','+rowData.emailFrom+','+rowData.emailTitle+','+rowData.emailDescription+'</div>';
										        }}
										  ],
								 url:"InBoxController/preInboxList",
								 paramObj : {procInstID:procInstID},
								 allowCheckBox : false,
								 isLoad : true,
								 maskObj: "body",
								 hideSearch : true
							});		
						}

						function associate(aEl)
						{
							var tmp = aEl.find("[name=email_btn]:checked").next().html().split(",");;
							var obj = new Object();
							obj.procInstID = procInstID;
							obj.emailID = tmp[0];
							obj.emailDate = tmp[1];
							obj.emailFrom = tmp[2];
							obj.emailTitle = tmp[3];
							obj.emailContent = tmp[4];
							console.log(obj);
							um_ajax_post({
								url : "NotifyController/addEmailAssociateRecord",
								paramObj : obj,
								maskObj : aEl,
								successCallBack : function (data){
									g_dialog.operateAlert();
									g_dialog.hide(aEl);
									notice_list_refresh();
								}
							});
						}
					}
				});
			}

			function notice_list_refresh()
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				um_ajax_post({
					url : "EventController/queryNotify",
					paramObj : {queryStore:{procInstID:procInstID}},
					isLoad : true,
					maskObj : "body",
					successCallBack:function (data){
						g_grid.removeData($(notice_table_div),{});
						g_grid.addData($(notice_table_div) ,data.queryStore);
					}
				});
			}

			if(opt.type == "detail")
			{
				this.sjczlc_step2_init();
			}
		},
		sjczlc_step2_init : function(){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step2]");
			var data = el_div.data("data");
			var procInstanceId = el_div.data("procInstanceId");
			var opt = el_div.data("opt");

			event_init();

			upload_attachments_init();

			function event_init()
			{
				el_form.find("[id=aprresult]").click(function(){
					if($(this).is(":checked"))
					{
						el_form.find("[data-id=wf_step2_aprresult]").val("0");
					}
					else
					{
						el_form.find("[data-id=wf_step2_aprresult]").val("1");
					}
				});
			}

			function upload_attachments_init()
			{
				el_form.find("[id=upload_btn]").click(function(){
					var dialogParam = {
						init:init,
					};
					$.ajax({
						type: "GET",
						url: "tpl/workorder/upload_tpl.html",
						success :function(data)
						{
							if(opt.type == "detail")
							{
								dialogParam["width"] = "459px";
								dialogParam["title"] = "附件查看";
								dialogParam["isDetail"] = true;
								g_dialog.dialog($(data).find("[id=appendix_show_template]"),dialogParam);
							}
							else
							{
								dialogParam["width"] = "600px";
								dialogParam["title"] = "附件信息";
								dialogParam["saveclick"] = save_click;
								g_dialog.dialog($(data).find("[id=upload_template]"),dialogParam);
							}
						}
					});

					function init(aEl)
					{
						if(opt.type == "detail")
						{
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									var appendixstore = data.appendixstore;
						 			for (var i = 0; i < appendixstore.length; i++) {
						 				var app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+appendixstore[i].attachPath+'" data-flag="appendix">'
						 							+appendixstore[i].attachName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
						 				aEl.find("[id=appendixgroup]").append(app_div);
						 				event_init();
						 				function event_init()
						 				{
						 					aEl.find("[data-flag=appendix]").click(function(){
												var url = $(this).attr("id");
												window.location.href = url;
											});
						 				}
						 			}
								}
							});
						}
						else
						{
							aEl.find("[name=procInstID]").val(procInstanceId);
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									aEl.umDataBind("render",data.maxstore[0]);
									aEl.find("[name=maxUploadSize]").val(data.maxstore[0].maxUpLoadFileSize);
									g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{
										data : data.appendixstore,
										key : "attachName",
										url : "attachPath",
										procInstID :procInstanceId
									});
								}
							});
						}		
					}

					function save_click(aEl)
					{
						g_formel.appendix_render($("[id=appendixgroup]") ,{
							method : "getUploadStrArray"
						});

						var delAppendixIdStr = $("[id=appendixgroup]").data("delStrArray" ).join("|");
						aEl.find("[name=delAppendixIdStr]").val(delAppendixIdStr);

						var uploadStr = $("[id=appendixgroup]").data("uploadStrArray").join("|");
						aEl.find("[name=uploadStr]").val(uploadStr);

						um_ajax_file(aEl.find("form") ,{
							url : "GeneralController/updGeneralAppendixs",
							paramObj : {},
							isLoad : true,
							maskObj : "body",
							successCallBack:function (data){
								g_dialog.operateAlert("body");
								g_dialog.hide(aEl);
							}
						});
					}
				});
			}
		},
		sjczlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.event.controller.UnEventController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "sjczlc";
				saveObj.noticeStore = [];
				var data2 = g_grid.getData(el_form.find("[id=notice_table_div]"));
				for (var i = 0; i < data2.length; i++) {
					saveObj.noticeStore.push(
						data2[i]
					);
				}

				var obj = new Object();
				obj.eventHandleStep1Apply = saveObj;
				obj.curstep = "eventHandleStep1Apply";
				obj.procDefID = "sjczlc:1:117504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "3rd_part_event";
				obj.tmpProcInstId = el_form.find("[data-id=procInstanceId]").val();
				obj.eventType = saveObj.eventType;

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------事件处置流程

		// 值班人员变更流程 ----------
		zbrybglc_step1_init : function(){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data");
			um_ajax_get({
				url : "dutyperson/queryDutyDateList",
				isLoad : false,
				successCallBack : function(data1){
					g_formel.selectEl_render(el_form.find("[offDate]"),{
						data:data1.date_codelist,
						text:"codename",
						id:"codevalue",
						val:data.wf_step1_offdate
					});
				}
			});

			el_form.find("[offDate]").change(function(){
				var offdate = el_form.find("[offDate]").val();
				um_ajax_post({
					url : "dutyperson/queryPersonList",
					isLoad : false,
					paramObj : {date:offdate},
					successCallBack : function (data1){
						el_form.find("[offPeople]").find("option").remove();
						
						g_formel.selectEl_render(el_form.find("[offPeople]"),{
							data:data1.person_codelist,
							text:"codename",
							id:"codevalue",
							val:data.wf_step1_offpeople
						});
					}
				});
			});	
		},
		zbrybglc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";

			var dateId = el_form.find("[offDate]").val();
			var personId = el_form.find("[offPeople]").val();
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				um_ajax_post({
					url : "dutyperson/checkDuplicate",
					isLoad : "true",
					maskObj : "body",
					paramObj : {date:dateId,person:personId},
					successCallBack:function(data){
						if(data.flag == true)
						{
							g_dialog.operateAlert(el_form,"该调休人在您选中日期已有其它工单调休记录，请重新选择调休人。","error");
						}
						else
						{
							submit();
						}
					}
				});

				function submit()
				{
					var saveObj = el_form.umDataBind("serialize");
					saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.dutyPersonReplace.controller.DutyPersonReplaceController";
					saveObj.htmlFormKeyClassMethod = "startProcess";
					saveObj.formFile = "zbrybglc";

					var obj = new Object();
					obj.dutyModifyStep1Apply = saveObj;
					obj.curstep = "dutyModifyStep1Apply";
					obj.procDefID = "zbrybglc:1:125004";
					obj.proInsId = "";
					obj.businessKey = "";
					obj.type = "config_change_event";

					um_ajax_post({
						url : url,
						isLoad : "true",
						maskObj : "body",
						paramObj : {workflowinfo:obj},
						successCallBack : function(){
							g_dialog.operateAlert();
							window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
						}
					});
				}
			}
		},
		// -------------值班人员变更流程

		// 系统升级流程 ----------
		xtsjlc_step1_init : function (){
			var el_div = $("#workorder_div");
			var opt = el_div.data("opt");

			if(opt.type == "detail")
			{
				this.xtsjlc_step2_init();
			}
		},
		xtsjlc_step2_init : function(){
			var el_div = $("#workorder_div");
			var opt = el_div.data("opt");

			if(opt.type == "detail")
			{
				this.xtsjlc_step3_init();
			}
		},
		xtsjlc_step3_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step3]");

			select_init();
			function select_init()
			{
				var el_object_type = el_form.find("[data-id=objectType]");
				el_object_type.append('<option value="1">病毒库</option>');
				el_object_type.append('<option value="2">规则库</option>');
				el_object_type.append('<option value="3">引擎</option>');
				el_object_type.append('<option value="4">其他</option>');
				el_object_type.trigger("change");
			}
		},
		xtsjlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.systemUpgrade.controller.SystemUpgradeController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "xtsjlc";

				var obj = new Object();
				obj.systemUpdateStep1Apply = saveObj;
				obj.curstep = "systemUpdateStep1Apply";
				obj.procDefID = "xtsjlc:1:130004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------系统升级流程

		// 综合申请流程 ----------
		zhsqlc_step1_init : function(){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data");
			var opt = el_div.data("opt");

			um_ajax_get({
				url : "MultiApplicationController/queryCodeList",
				isLoad : false,
				successCallBack : function(data1){
					g_formel.selectEl_render(el_form.find("[data-id=objectType]"),{
						data:data1.apptype_codelist,
						text:"codename",
						id:"codevalue",
						val:data.objectType
					});
				}
			});
			if(opt.type == "detail")
			{
				this.zhsqlc_step3_init();
			}
		},
		zhsqlc_step2_init : function(){
			var opt = el_div.data("opt");
			if(opt.type == "detail")
			{
				this.zhsqlc_step3_init();
			}
		},
		zhsqlc_step3_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step3]");
			var data = el_div.data("data");
			var opt = el_div.data("opt");
			var procInstanceId = el_div.data("procInstanceId");

			upload_attachments_init();
			function upload_attachments_init()
			{
				el_form.find("[id=upload_btn]").click(function(){
					var dialogParam = {
						init:init,
					};
					$.ajax({
						type: "GET",
						url: "tpl/workorder/upload_tpl.html",
						success :function(data)
						{
							if(opt.type == "detail")
							{
								dialogParam["width"] = "459px";
								dialogParam["title"] = "附件查看";
								dialogParam["isDetail"] = true;
								g_dialog.dialog($(data).find("[id=appendix_show_template]"),dialogParam);
							}
							else
							{
								dialogParam["width"] = "600px";
								dialogParam["title"] = "附件信息";
								dialogParam["saveclick"] = save_click;
								g_dialog.dialog($(data).find("[id=upload_template]"),dialogParam);
							}
						}
					});

					function init(aEl)
					{
						if(opt.type == "detail")
						{
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									var appendixstore = data.appendixstore;
						 			for (var i = 0; i < appendixstore.length; i++) {
						 				var app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+appendixstore[i].attachPath+'" data-flag="appendix">'
						 							+appendixstore[i].attachName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
						 				aEl.find("[id=appendixgroup]").append(app_div);
						 				event_init();
						 				function event_init()
						 				{
						 					aEl.find("[data-flag=appendix]").click(function(){
												var url = $(this).attr("id");
												window.location.href = url;
											});
						 				}
						 			}
								}
							});
						}
						else
						{
							aEl.find("[name=procInstID]").val(procInstanceId);
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									aEl.umDataBind("render",data.maxstore[0]);
									aEl.find("[name=maxUploadSize]").val(data.maxstore[0].maxUpLoadFileSize);
									g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{
										data : data.appendixstore,
										key : "attachName",
										url : "attachPath",
										procInstID :procInstanceId
									});
								}
							});
						}	
					}

					function save_click(aEl)
					{
						g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{
							method : "getUploadStrArray"
						});

						var delAppendixIdStr = aEl.find("[id=appendixgroup]").data("delStrArray" ).join("|");
						aEl.find("[name=delAppendixIdStr]").val(delAppendixIdStr);

						var uploadStr = aEl.find("[id=appendixgroup]").data("uploadStrArray").join("|");
						aEl.find("[name=uploadStr]").val(uploadStr);

						um_ajax_file(aEl.find("form") ,{
							url : "GeneralController/updGeneralAppendixs",
							paramObj : {},
							isLoad : true,
							maskObj : "body",
							successCallBack:function (data){
								g_dialog.operateAlert("body");
								g_dialog.hide(aEl);
							}
						});
					}
				});
			}	
		},
		zhsqlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.multiapplication.controller.MultiApplicationController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "zhsqlc";

				var obj = new Object();
				obj.comprehensiveApplicationStep1Apply = saveObj;
				obj.curstep = "comprehensiveApplicationStep1Apply";
				obj.procDefID = "zhsqlc:1:120004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				})
			}
		},
		// -------------综合申请流程

		// 配置变更事件处置流程 ----------
		pzbgsjczlc_step1_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");

			el_form.find("[data-id=objectType]").change(function(){
				var val = $(this).val();
				var newversionnum = el_form.find("[data-id=wf_step1_newversionnum]");
				if(val == "1")
				{
					newversionnum.removeAttr("disabled");	
				}
				else
				{
					newversionnum.attr("disabled","disabled");
					newversionnum.val("");
				}
			});
		},
		pzbgsjczlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.configChangeEvent.controller.ConfigChangeEventController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "pzbgsjczlc";

				var obj = new Object();
				obj.configModifyEventHandleStep1Apply = saveObj;
				obj.curstep = "configModifyEventHandleStep1Apply";
				obj.procDefID = "pzbgsjczlc:1:122504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				})
			}
		},
		// -------------配置变更事件处置流程

		// 安全策略变更事件处置流程 ----------
		aqclbgczlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.configChangeEvent.controller.ConfigChangeEventController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "aqclbgczlc";

				var obj = new Object();
				obj.safeStrategyModifyHandleStep1Apply = saveObj;
				obj.curstep = "safeStrategyModifyHandleStep1Apply";
				obj.procDefID = "aqclbgczlc:1:127504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------安全策略变更事件处置流程

		// 资产回收流程 ----------
		zchslc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.assetReclaim.controller.AssetReclaimController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "zchslc";

				var obj = new Object();
				obj.assetRecycleStep1Apply = saveObj;
				obj.curstep = "assetRecycleStep1Apply";
				obj.procDefID = "zchslc:1:267504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "asset_admeasure";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------资产回收流程

		// 资产申请流程 ----------
		zcsqlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.objectType_name = el_form.find("[data-id=objectType] option:selected").text();
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.deviceApplication.controller.DeviceApplicationController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "zcsqlc";

				var obj = new Object();
				obj.assetApplyStep1Apply = saveObj;
				obj.curstep = "assetApplyStep1Apply";
				obj.procDefID = "zcsqlc:1:132504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------资产申请流程
		// 资产入库流程 ----------
		zcrklc_step1_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data")?el_div.data("data"):{};
			var assetStore = data.assetStore?data.assetStore:[];

			event_init();

			zcrklc_list();

			function event_init()
			{	
				el_form.find("[id=add_btn]").click(function(){
					edit_tpl_init();
				});		
			}

			function zcrklc_list()
			{
				g_grid.render(el_div.find("[id=asset_list_div]"),{
					header:[
							  {text:'资产名称',name:"assetName"},
							  {text:'资产编号',name:"assetCode"},
							  {text:'资产类型',name:"assetTypeName"},
							  {text:'生产厂商',name:"supplierName"},
							  {text:'操作系统类型',name:"osTypeName"}
							],
					oper:[
							{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_tpl_init},
							{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:asset_del}
						 ],
					data:assetStore,
					operWidth:"50px",
					hideSearch:true,
					isLoad:false,
					allowCheckBox : false,
					paginator : false
				});
			}

			function edit_tpl_init(rowData,trObj)
			{
				var title_msg = "资产添加";
				if (rowData)
				{
					title_msg = "资产修改";
				}
				$.ajax({
					type: "GET",
					url: "tpl/workorder/zcrklc_tpl.html",
					success :function(data)
					{
						g_dialog.dialog($(data).find("[id=asset_edit_template]"),{
							width:"450px",
							init:init,
							title:title_msg,
							saveclick:save_click
						});
					}
				});

				function init(el)
				{
					var assetTypeVal = rowData?rowData.assetTypeId:"";
					var osCodeVal = rowData?rowData.osType:"";
					var supplierVal = rowData?rowData.supplierId:"";
					g_formel.sec_biz_render({
												assetTypeEl : el.find("[data-id=assetTypeId]"),
												assetTypeVal : assetTypeVal
											});
					g_formel.code_list_render({
										   	   		key : "osCodeList,factoryManageList",
										   	   		osCodeEl : el.find("[data-id=osType]"),
										   	   		osCodeVal : osCodeVal,
										   	   		supplierEl : el.find("[data-id=supplierId]"),
										   	   		supplierVal : supplierVal
										   	   });
					if(rowData)
					{				
						el.umDataBind("render" ,rowData);
					}
				}

				function save_click(el ,saveObj)
				{
					if (g_validate.validate(el))
					{
						g_dialog.hide(el);

						var obj = new Object();
						obj = saveObj;
						obj.assetTypeName = el.find("[data-id=assetTypeId] input:eq(0)").val();
						obj.osTypeName = el.find("[data-id=osType] option:selected").text();
						obj.supplierName = el.find("[data-id=supplierId] option:selected").text();

						var buffer = [];
						buffer.push(obj);

						if(rowData)
						{
							g_grid.updateData(el_div.find("[id=asset_list_div]"),{
								trObj:trObj,data:obj
							});

							return false;
						}

						g_grid.addData(el_div.find("[id=asset_list_div]") ,buffer);
					}
				}
			}

			function asset_del(rowData,trObj)
			{
				trObj.remove();			
			}	
		},
		zcrklc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.assetinstorage.controller.AssetInController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "zcrklc";
				saveObj.assetStore = [];
				var data = g_grid.getData(el_form.find("[id=asset_list_div]"));
				for (var i = 0; i < data.length; i++) {
					saveObj.assetStore.push(
						data[i]
					);
				}

				var obj = new Object();
				obj.assetWarehousingStep1Apply = saveObj;
				obj.curstep = "assetWarehousingStep1Apply";
				obj.procDefID = "zcrklc:1:105004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";
				obj.assetStore = saveObj.assetStore;

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------资产入库流程

		// 设备配置变更流程 ----------
		sbpzbglc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.deviceConfigChange.controller.DeviceConfigChangeController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "sbpzbglc";

				var obj = new Object();
				obj.deviceConfigModifyStep1Apply = saveObj;
				obj.curstep = "deviceConfigModifyStep1Apply";
				obj.procDefID = "sbpzbglc:1:107504";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------设备配置变更流程

		// 资产分配流程 ----------
		zcfplc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.assetAdmeasure.controller.AssetAdmeasureController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "zcfplc";

				var obj = new Object();
				obj.assetAssignStep1Apply = saveObj;
				obj.curstep = "assetAssignStep1Apply";
				obj.procDefID = "zcfplc:1:95004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "asset_admeasure";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------资产分配流程

		// 设备巡检流程 ----------
		sbxjlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.devicePatrol.controller.DevicePatrolController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "sbxjlc";

				var obj = new Object();
				obj.devicePatrolStep1Apply = saveObj;
				obj.curstep = "devicePatrolStep1Apply";
				obj.procDefID = "sbxjlc:1:110004";
				obj.proInsId = "";
				obj.businessKey = "";
				obj.type = "config_change_event";

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
					}
				});
			}
		},
		// -------------设备巡检流程

		// 资产报废流程 ----------
		zcbflc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var edId = el_form.find("[data-id=wf_step1_assetname]").val();

				um_ajax_post({
					url : "AssetRepair/checkEdWorkFlowType",
					paramObj : {edId:edId},
					isLoad : false,
					successCallBack : function (data){
						if(data.str == "1")
						{
							var saveObj = el_form.umDataBind("serialize");
							saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.deviceScrap.controller.DeviceScrapController";
							saveObj.htmlFormKeyClassMethod = "startProcess";
							saveObj.formFile = "zcbflc";

							var obj = new Object();
							obj.assetDiscardStep1Apply = saveObj;
							obj.curstep = "assetDiscardStep1Apply";
							obj.procDefID = "zcbflc:1:100004";
							obj.proInsId = "";
							obj.businessKey = "";
							obj.type = "config_change_event";

							um_ajax_post({
								url : url,
								paramObj : {workflowinfo:obj},
								successCallBack : function(){
									g_dialog.operateAlert();
									window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
								}
							});
						}
						else
						{
							g_dialog.operateAlert("body",data.str ,"error");
						}
					}
				});
			}
		},
		// -------------资产报废流程

		// 资产待修流程 ----------
		zcdxlc_step1_init : function (){
			this.zcdxlc_step3_init();
		},
		zcdxlc_step3_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step3]");

			event_init();

			function event_init()
			{
				el_form.find("[data-id=wf_step3_servicetype]").change(function(){
					var tmp = $(this).val();
					var servicecompany = el_form.find("[data-id=wf_step3_servicecompany]");
					if (tmp == "2")
					{
						servicecompany.removeAttr("disabled");
						servicecompany.attr("validate","required");
					}	
					else
					{
						servicecompany.attr("disabled","disabled")
						servicecompany.removeAttr("validate");
						servicecompany.val("");
						g_validate.clear([servicecompany]);
					}
				});	
			}
				
			this.zcdxlc_step4_init();	
		},
		zcdxlc_step4_init : function (){
			var el_div = $("#workorder_div");
			var step = el_div.data("step");
			var data = el_div.data("data");
			var opt = el_div.data("opt");
			var procInstanceId = el_div.data("procInstanceId");

			if (!$("#workorder_div").data("hasInit"))
			{
				zcdxlc_list();
			}

			function zcdxlc_list()
			{
				var i=0;
				var gridParam = {
					header:[
							    {text:'资产名称',name:"edName"},
							    {text:'资产编号',name:"edId"},
							    {text:'责任人',name:"responsible"},
							    {text:'',name:"edStatus",render:function (tdTxt,rowData){
							  		i++;
							  		if(step == "zcdxlc_step4" && opt.type != "detail")
							  		{
							  			var buffer = [];
								  		buffer.push('<input type="radio" name="edStatus'+i+'" value="1">');
								  		buffer.push('<span style="margin-left:3px;">已修好</span>');
								  		buffer.push('<input type="radio" name="edStatus'+i+'" value="0" checked style="margin-left:7px;">');
								  		buffer.push('<span style="margin-left:3px;">未修好</span>');
								  		return buffer.join("");
							  		}
							  		else 
							  		{
							  			if (rowData.edStatus == 0)
							  			{
							  				return "闲置";
							  			}
							  			else if (rowData.edStatus == 1)
							  			{
							  				return "使用中";
							  			}
							  			else if (rowData.edStatus == 2)
							  			{
							  				return "待维修";
							  			}
							  			else if (rowData.edStatus == 3)
							  			{
							  				return "维修";
							  			}
							  			else if (rowData.edStatus == 4)
							  			{
							  				return "送修";
							  			}
							  			else if (rowData.edStatus == 5)
							  			{
							  				return "外借";
							  			}
							  			else if (rowData.edStatus == 6)
							  			{
							  				return "分配";
							  			}
							  			else if (rowData.edStatus == 7)
							  			{
							  				return "待报废";
							  			}
							  			else if (rowData.edStatus == 8)
							  			{
							  				return "报废";
							  			}
							  			else if (rowData.edStatus == 9)
							  			{
							  				return "库房";
							  			}
							  		}							  		
							    }}
							],
					url : "AssetRepair/queryWorkFlowVsEdInfoList",
					paramObj : {procInstID:procInstanceId},
					isLoad : false,
					allowCheckBox : false,
					hideSearch : true
				};

				$("#workorder_div").data("hasInit" ,true);

				if (step != "zcdxlc_step4" && step != "zcdxlc_step5" && opt.type != "detail")
				{
					delete gridParam["url"];
					gridParam["data"] = [];
				}

				g_grid.render(el_div.find("#table_in_workorder"),gridParam);
			}
		},
		zcdxlc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{   
				var edId = el_form.find("[data-id=wf_step1_assetname]").val();

				um_ajax_post({
					url : "AssetRepair/checkEdWorkFlowType",
					paramObj : {edId:edId},
					isLoad : false,
					successCallBack : function (data){
						if(data.str == "1")
						{
							var saveObj = el_form.umDataBind("serialize");
							saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.assetRepair.controller.AssetRepair";
							saveObj.htmlFormKeyClassMethod = "startProcess";
							saveObj.formFile = "zcdxlc";

							var obj = new Object();
							obj.assetRepairedStep1Apply = saveObj;
							obj.curstep = "assetRepairedStep1Apply";
							obj.procDefID = "zcdxlc:1:322504";
							obj.proInsId = "";
							obj.businessKey = "";
							obj.type = "config_change_event";

							um_ajax_post({
								url : url,
								paramObj : {workflowinfo:obj},
								successCallBack : function(){
									g_dialog.operateAlert();
									window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
								}
							});
						}
						else
						{
							g_dialog.operateAlert("body",data.str ,"error");
						}
					}
				});
			}
		},
		// -------------资产待修流程

		// 在用资产调配流程 ----------
		zyzcdplc_step1_init : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data");

			event_init();

			el_form.find("[name=operationSystem][value="+data.operationSystem+"]").click();

			function event_init()
			{
				el_form.find("[name=operationSystem]").click(function(){
					if($(this).val() == "1")
					{
						inputdrop.setDisable(el_form.find("[id=assetDst]"));
						el_form.find("[id=assetDst]").children().val("");
					}
					else
					{
						inputdrop.setEnable(el_form.find("[id=assetDst]"));
					}
				});	
			}
		},
		zyzcdplc_step1_submit : function (){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url = "workflow/createAndStartProcInst";
			var check_url = "AssetRepair/checkEdWorkFlowType";
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var assetId = el_form.find("[data-id=wf_step1_assetname]").val();
				var aimassetId = el_form.find("[data-id=assetDst]").val();

				um_ajax_post({
					url : check_url,
					paramObj : {edId:assetId},
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
											g_dialog.operateAlert("[id=assetDst]",data1.str ,"error");
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
							g_dialog.operateAlert("[id=wf_step1_assetname]",data.str ,"error");
						}
					}
				});

				function submit()
				{
					var saveObj = el_form.umDataBind("serialize");
					saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.services.assetDeploy.controller.AssetDeployController";
					saveObj.htmlFormKeyClassMethod = "startProcess";
					saveObj.formFile = "zyzcdplc";

					var obj = new Object();
					obj.usedAssetAssignStep1Apply = saveObj;
					obj.curstep = "usedAssetAssignStep1Apply";
					obj.procDefID = "zyzcdplc:1:342504";
					obj.proInsId = "";
					obj.businessKey = "";
					obj.type = "config_change_event";

					um_ajax_post({
						url : url,
						paramObj : {workflowinfo:obj},
						successCallBack : function(){
							g_dialog.operateAlert();
							window.location.href = "#/oper_workorder/workorder_handle/workorder_apply"
						}
					});
				}
			}
		},
		// -------------在用资产调配流程

		//SOC事件处置流程----------
		socsjczlc_step1_init : function(){
			var el_div = $("#workorder_div");
			if ($("#workorder_div").data("el"))
			{
				el_div = $("#workorder_div").data("el");
			}
			var el_form = el_div.find("[id=step1]");
			var data = el_div.data("data")?el_div.data("data"):{};
			var eventStore = data.eventStore?data.eventStore:[];
			var noticeStore = data.noticeStore?data.noticeStore:[];
			var step = el_div.data("step");
			var procInstanceId = el_div.data("procInstanceId");
			var workItemID = el_div.data("workItemID");
			var tplName = el_div.data("tplName");
			var opt = el_div.data("opt");
			var self = this;

			form_init();

			event_init();

			fault_event_list();

			notice_list();

			function form_init()
			{
				if(step)
				{
					el_form.find("[data-id=procInstanceId]").val(procInstanceId);
					g_formel.sec_biz_render({
												secEl:el_form.find("[id=securityDomianId]"),
												secVal:data.securityDomianId
											});

					g_formel.sec_biz_render({
												bizEl:el_form.find("[id=bussinessDomianId]"),
												bizVal:data.bussinessDomianId
											});
				}
			    else
			    {	
			    	var urlParamObj = index_query_param_get();
					var eventType = urlParamObj.eventType;

					el_form.find("[data-id=eventStr]").val(urlParamObj.eventStr);
					el_form.find("[data-id=eventType]").val(eventType);

					var time = g_moment().format('ddd MM DD YYYY HH:mm:ss');
					var int = parseInt(500*Math.random());

					var eventtype;
					(eventType == "2") && (eventtype = "faultEvent");
					(eventType == "3") && (eventtype = "perfEvent");
					(eventType == "13") && (eventtype = "deployEvent");
					(eventType == "14") && (eventtype = "vulTaskEvent");

					var processInstanceID = eventtype+"_"+time+"_"+int;
					el_form.find("[data-id=procInstanceId]").val(processInstanceID);

					um_ajax_get({
						url : "EventController/queryDomainByEvent",
						paramObj : {queryStore:{eventIdStr:urlParamObj.eventStr,eventType:eventType}},
						isLoad : false,
						successCallBack : function(data1){
							
							g_formel.sec_biz_render({
														secEl:el_form.find("[id=securityDomianId]"),
														secVal:data1.store.sdStr
													});
							g_formel.sec_biz_render({
														bizEl:el_form.find("[id=bussinessDomianId]"),
														bizVal:data1.store.bdStr
													});
							um_ajax_get({
								url : "EventController/queryAssetObject",
								paramObj : {assetlistStore:{edIds:data1.store.edStr}},
								isLoad : false,
								successCallBack : function(data2){
									for(i = 0;i < data2.assetlistStore.length;i ++)
									{
										data2.assetlistStore[i].text = 
													data2.assetlistStore[i].codename;
										data2.assetlistStore[i].id = 
													data2.assetlistStore[i].codevalue;
									}

									inputdrop.addDataSelect(el_form.find("[id=wf_step1_assetname]") ,{
											data : data2.assetlistStore,
									});
								}
							});
						}
					});
				}
			}

			function event_init()
			{
				el_form.find("[id=case_btn]").click(function(){
					related_case();
				});

				el_form.find("[id=notice_btn]").click(function(){
					self.notice_user_dialog();
				});

				el_form.find("[id=email_associate_btn]").click(function(){
					email_associate();
				});
			}

			function related_case()
			{
				var procInstID = el_form.find("[data-id=procInstanceId]").val();
				var eventSTR = el_form.find("[data-id=eventStr]").val().split(",").join("_");
				var eventType = el_form.find("[data-id=eventType]").val();

				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=email_template]"), {
							width: "700px",
							top : "8%",
							init: init,
							title : "相关案例查看",
							isDetail : true
						});	
					}
				});

				function init(aEl)
				{
					var obj = new Object();
					obj.procInstID = procInstID;
					obj.eventStr = eventSTR;
					obj.eventType = eventType;
					obj.casestore = {};
					step && (obj.eventStr = "null");

					g_grid.render(aEl.find("[id=table_in_query_email]"),{
						header : [
									    {text:'案例名称',name:"title"},
									    {text:'生成时间',name:"createDate"},
									    {text:'案例描述',name:"desc"}
								  ],
						url : "WorkOrderMonitorController/getCaseList",
						paramObj : obj,
						dbClick : case_detail_init,
						allowCheckBox : false,
						isLoad : true,
						maskObj : "body",
						hideSearch : true
					});

					function case_detail_init(rowData)
					{
						$.ajax({
							type: "GET",
							url: "js/plugin/workorder/workorder.html",
							success: function(data) {
								g_dialog.dialog($(data).find("[id=case_detail_template]"), {
									width: "450px",
									top : "6%",
									init: init,
									title : "案例详细信息",
									isDetail : true
								});	
							}
						});	

						function init(bEl)
						{
							um_ajax_get({
								url : "CaseAnalyse/queryDetailInfo",
								paramObj : {caseId : rowData.caId},
								isLoad : true,
								maskObj : "body",
								successCallBack : function(data){
									bEl.umDataBind("render",data[0]);
									var eventVOList = data[0].eventVOList;
						 			for (var i = 0; i < eventVOList.length; i++) {
						 				var list_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+eventVOList[i].eventId+'" data-flag="event">'
						 							+eventVOList[i].eventName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
						 				bEl.find("[id=eventVOList]").append(list_div);
						 			}
						 			var appendixList = data[0].appendixList;
						 			for (var i = 0; i < appendixList.length; i++) {
						 				var app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+appendixList[i].appendixPath+'" data-flag="appendix">'
						 							+appendixList[i].appendixName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
						 				bEl.find("[id=appendixList]").append(app_div);
						 			}
						 			var work_div = '<a href="javascript:void(0);" id="'+data[0].procId+'" data-flag="work">'
						 							+data[0].procName
						 							+'</a>'
						 			bEl.find("[id=procName]").append(work_div);
						 			event_init();
						 			function event_init()
						 			{
						 				require(['/js/plugin/event/event.js'] ,function (pevent){
						 					bEl.find("[data-flag=event]").click(function(){				 					
												var eventId = $(this).attr("id");
												var obj = new Object();
												if(eventType == "2") 
												{
													obj.faultNO = eventId;
													pevent.faultEventDetail(obj);
												}
												else if(eventType == "3") 
												{
													obj.performanceNo = eventId;
													pevent.performEventDetail(obj);
												}
												else if(eventType == "13") 
												{
													obj.deploy_NO = eventId;
													pevent.deployEventDetail(obj);
												}
												else if(eventType == "14") 
												{
													obj.ed_id = eventId;
													pevent.vulnerEventDetail(obj);
												}
											});
										});

										bEl.find("[data-flag=appendix]").click(function(){
											var url = $(this).attr("id");
											window.location.href = url;
										});

										bEl.find("[data-flag=work]").click(function(){
											var obj = new Object();
											obj.processInstanceID = $(this).attr("id");
											obj.id = "socsjczlc_step1";
											(eventType == "2") && (obj.tplName = "故障事件");
											(eventType == "3") && (obj.tplName = "性能事件");
											(eventType == "13") && (obj.tplName = "配置事件");
											(eventType == "14") && (obj.tplName = "脆弱性事件");
											var style = "see";
											self.done_workorder(obj,style);
										});
						 			}									
								}
							});
						}
					}
				}
			}

			function fault_event_list()
			{
				var gridParam = {
					allowCheckBox : false,
					isLoad : false,
					hideSearch : true,
					paginator:false,
					dbClick : fault_detail_init
				};

				var eventType;
				var eventSTR;

				if(tplName)
				{
					(tplName == "故障事件") && (eventType = "2");
					(tplName == "性能事件") && (eventType = "3");
					(tplName == "脆弱性事件") && (eventType = "14");
					(tplName == "配置事件") && (eventType = "13");
				}
				else
				{
					eventSTR = el_form.find("[data-id=eventStr]").val().split(",").join("_");
					eventType = el_form.find("[data-id=eventType]").val();
				}

				if(eventType == "2")
				{
					gridParam["header"] = [
						{text:'事件名称',name:"faultName"},
					    {text:'事件类型',name:"className"},
					    {text:'设备名称',name:"edName"},
					    {text:'发生时间',name:"enterDate"},
					    {text:'恢复时间',name:"updateDate"}
					];
					grid_render();
				}
				else if(eventType == "3")
				{
					gridParam["header"] = [
						{text:'事件名称',name:"perfName"},
					    {text:'事件类型',name:"className"},
					    {text:'设备名称',name:"edName"},
					    {text:'发生时间',name:"enterDate"},
					    {text:'恢复时间',name:"updateDate"}
					];
					grid_render();
				}
				else if(eventType == "13")
				{
					gridParam["header"] = [
						{text:'事件名称',name:'depl_NAME'},
						{text:'资产名称',name:'ed_ID'},
						{text:'监控器名称',name:'monitor_ID'},
						{text:'发生时间',name:'enter_DATE'},
						{text:'数量',name:'depl_COUNT'}
					];
					grid_render();
				}
				else if(eventType == "14")
				{
					gridParam["header"] = [
						{text:'资产名称',name:'ed_name'},
						{text:'全部漏洞数量',name:'totalVulNum'}
					];
					grid_render();
				}

				function grid_render()
				{
					if(step)
					{
						gridParam["data"] = eventStore;
						g_grid.render(el_form.find("#case_table_div"),gridParam);
					}
					else
					{
						gridParam["url"] = "EventControllerService/queryWorkorderEventList";
						gridParam["paramObj"] = {eventStore:{eventStr:eventSTR,eventType:eventType,procInstID:""}};
						g_grid.render(el_form.find("#case_table_div"),gridParam);
					}
				}
				
				function fault_detail_init(rowData)
				{
					var type = eventType;
					require(['/js/plugin/event/event.js'] ,function (pevent){
						(eventType == 2) && pevent.faultEventDetail(rowData);
						(eventType == 3) && pevent.performEventDetail(rowData);
						(eventType == 13) && pevent.deployEventDetail(rowData);
						(eventType == 14) && pevent.vulnerEventDetail(rowData,type);
					});					
				}
			}

			function notice_list()
			{
				var procInstID = el_form.find("[data-id=procInstanceId]").val();
				var gridParam = {
					header : [
							  {text:'通知人',name:"userName"},
							  {text:'被通知人',name:"mainDelivery"},
							  {text:'通知方式',name:"notifyMethod"},
							  {text:'通知时间',name:"notifyTime"}
							  ],
					data : noticeStore,
					isLoad : false,
					allowCheckBox : false,
					hideSearch : true,
					paginator:false,
					dbClick : notice_detail_init
				};

				if( step && step.split("_")[1] == "step2" && (opt.type != "detail"))
				{
					el_div.find("#step1").find("[class=mask]").remove();
					el_form.find("#one").append('<div class="mask"></div>');
					el_form.find("#two").append('<div class="mask"></div>');
					gridParam["oper"] = [
											{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:phone_update ,isShow:function (data){
												return (data.notifyMethod == "电话");
											}},
										];
					gridParam["operWidth"] = "100px";					
				}

				g_grid.render(el_form.find("#notice_table_div"),gridParam);

				function phone_update(rowData)
				{
					$.ajax({
						type: "GET",
						url: "js/plugin/workorder/workorder.html",
						success: function(data) {
							g_dialog.dialog($(data).find("[id=phone_update_template]"), {
								width: "600px",
								top : "6%",
								init: init,
								title : "电话通知修改",
								saveclick : save_click
							});
						}
					});

					function init(aEl)
					{
						var obj = new Object();
						obj.notifyID = rowData.notifyID;
						obj.procInstID = procInstID;
						obj.notifyType = "phone";
						obj.type = "modify";
						obj.pagetype = "edit";

						um_ajax_get({
							url : "NotifyController/queryNotifyDetail",
							paramObj : obj,
							isLoad : true,
							maskObj : "body",
							successCallBack:function (data){
								var mainDeliveryArray = [];
								var phoneArray = [];
								var mobileArray = [];

								for(var i = 0;i < data.notifydetailstore.length;i++)
								{
									var data1 = data.notifydetailstore[i];
									mainDeliveryArray.push(data1.mainDelivery);
									phoneArray.push(data1.phone);
									mobileArray.push(data1.mobile);	
								}
								var mainDelivery = mainDeliveryArray.join(";");
								var phone = phoneArray.join(";");
								var mobile = mobileArray.join(";");
								aEl.find("[data-id=mainDelivery]").text(mainDelivery);
								aEl.find("[data-id=phone]").text(phone);
								aEl.find("[data-id=mobile]").text(mobile);
								aEl.find("[data-id=userName]").text(data.notifydetailstore[0].userName);
								aEl.find("[data-id=notifyTime]").text(data.notifydetailstore[0].notifyTime);
								aEl.find("[data-id=notifyContent]").text(data.notifydetailstore[0].notifyContent);
							}
						});	
					}

					function save_click(aEl,saveObj)
					{
						var obj = new Object();
						obj.notifyID = rowData.notifyID;
						obj.processInstanceID = procInstID;
						obj.notifyContent = saveObj.notifyContent;

						um_ajax_post({
							url : "NotifyController/updRecord",
							paramObj : obj,
							successCallBack : function(data){
								g_dialog.operateAlert("body");
								g_dialog.hide(aEl);
								notice_list_refresh();
							}

						});
					}
				}
			}

			function notice_detail_init(rowData)
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				var title;
				var width = "700px";
				if(rowData.notifyMethod == "邮件")
				{
					title = "邮件通知详情";
					width = "600px";
				}
				else if(rowData.notifyMethod == "电话")
				{
					title = "电话通知详情";
				}
				else if(rowData.notifyMethod == "短信")
				{
					title = "短信通知详情";
				}

				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=notice_detail_template]"), {
							width: width,
							top : "6%",
							init: init,
							initAfter : initAfter,
							title : title,
							isDetail : true
						});
					}
				});

				function init(aEl)
				{
					if(rowData.notifyMethod == "邮件")
					{
						aEl.find("[id=phone_sms_div]").remove();
					}
					else
					{
						aEl.find("[id=email_div]").remove();
						g_grid.render(aEl.find("[id=table_in_notice_detail]"),{
							 header : [
									  {text:'通知人',name:"userName",width:"15"},
									  {text:'被通知人',name:"mainDelivery",width:"15"},
									  {text:'通知时间',name:"notifyTime",width:"30"},
									  {text:'通知内容',name:"notifyContent"}
									  ],
							 data : [],
							 allowCheckBox : false,
							 hideSearch : true
						});
					}
				}

				function initAfter(aEl)
				{
					um_ajax_post({
						url : "NotifyController/queryNotifyDetail",
						paramObj :{notifyID:rowData.notifyID,procInstID:procInstID,notifyType:rowData.notifyMethodEn},
						isLoad : false,
						isDetail : true,
						maskObj : "body",
						successCallBack : function(data){
							if(rowData.notifyMethod == "邮件")
							{
								um_ajax_get({
									url : "InBoxController/queryAppendixByEmail",
									paramObj : {emailCode : rowData.emailID},
									isLoad : true,
									maskObj : "body",
									successCallBack : function(data1){
										aEl.umDataBind("render" ,data.notifydetailstore[0]);
										aEl.find("[data-id=email]").html(data.notifydetailstore[0].email);
										aEl.find("[data-id=notifyContent]").html(data.notifydetailstore[0].notifyContent);
										for (var i = 0; i < data1.length; i++) {
							 				var app_div;
											app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+data1[i].appendixPath+'" data-flag="appendix" data-id="'+data1[i].appendixCode+'">'
						 							+data1[i].appendixName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
							 				aEl.find("[id=appendixList]").append(app_div);
							 			}
										aEl.find("[data-flag=appendix]").click(function(){
											var url = $(this).attr("id");
											um_ajax_get({
												url : "InBoxController/queryAppendixExist",
												paramObj : {appendixCode : $(this).attr("data-id")},
												isLoad : true,
												maskObj : "body",
												successCallBack : function(data){
													window.location.href = url;
												}
											});
										});		
									}
								});
							}
							else 
							{
								g_grid.addData(aEl.find("[id=table_in_notice_detail]") ,data.notifydetailstore);	
							}		
						}
					});
				}
			}
			
			function email_associate()
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				$.ajax({
					type: "GET",
					url: "js/plugin/workorder/workorder.html",
					success: function(data) {
						g_dialog.dialog($(data).find("[id=email_template]"), {
							width: "700px",
							top : "8%",
							init: init,
							title : "往来邮件关联",
							btn_array:[
						 				   {id:"associate_btn",text:"关联",aClick:associate}
				 		   		      ],
							isDetail : true
						});

						function init(aEl)
						{
							g_grid.render(aEl.find("[id=table_in_query_email]"),{
								 header : [
											    {text:'主题',name:"emailTitle"},
											    {text:'发件人',name:"emailFrom"},
											    {text:'日期',name:"emailDate"},
											    {text:'',name:"radio" ,width:10,render:function(txt ,rowData){
											   		return '<input type="radio" name="email_btn" value="'+rowData.emailCode+','+rowData.emailDate+','+rowData.emailFrom+','+rowData.emailTitle+','+rowData.emailDescription+'"/>';
										        }}
										  ],
								 url:"InBoxController/preInboxList",
								 paramObj : {procInstID:procInstID},
								 allowCheckBox : false,
								 isLoad : true,
								 maskObj: "body",
								 hideSearch : true
							});		
						}

						function associate(aEl)
						{
							var tmp = aEl.find("[name=email_btn]:checked").val().split(",");
							var obj = new Object();
							obj.procInstID = procInstID;
							obj.emailID = tmp[0];
							obj.emailDate = tmp[1];
							obj.emailFrom = tmp[2];
							obj.emailTitle = tmp[3];
							obj.emailContent = tmp[4];
							um_ajax_post({
								url : "NotifyController/addEmailAssociateRecord",
								paramObj : obj,
								maskObj : aEl,
								successCallBack : function (data){
									g_dialog.operateAlert();
									g_dialog.hide(aEl);
									notice_list_refresh();
								}
							});
						}
					}
				});
			}

			function notice_list_refresh()
			{
				var procInstID = $("[data-id=procInstanceId]").val();
				um_ajax_post({
					url : "EventController/queryNotify",
					paramObj : {queryStore:{procInstID:procInstID}},
					isLoad : true,
					maskObj : "body",
					successCallBack:function (data){
						g_grid.removeData($(notice_table_div),{});
						g_grid.addData($(notice_table_div) ,data.queryStore);
					}
				});
			}

			if(opt.type == "detail")
			{
				this.socsjczlc_step2_init();
			}
		},
		socsjczlc_step2_init : function(){
			var el_div = $("#workorder_div");
			if ($("#workorder_div").data("el"))
			{
				el_div = $("#workorder_div").data("el");
			}
			var el_form = el_div.find("[id=step2]");
			var data = el_div.data("data");
			var procInstanceId = el_div.data("procInstanceId");
			var opt = el_div.data("opt");

			event_init();

			upload_attachments_init();

			function event_init()
			{
				el_form.find("[id=aprresult]").click(function(){
					if($(this).is(":checked"))
					{
						el_form.find("[data-id=wf_step2_aprresult]").val("0");
					}
					else
					{
						el_form.find("[data-id=wf_step2_aprresult]").val("1");
					}
				});
			}

			function upload_attachments_init()
			{
				el_form.find("[id=upload_btn]").click(function(){

					var dialogParam = {
						init:init,
					};
					$.ajax({
						type: "GET",
						url: "tpl/workorder/upload_tpl.html",
						success :function(data)
						{
							if(opt.type == "detail")
							{
								dialogParam["width"] = "459px";
								dialogParam["title"] = "附件查看";
								dialogParam["isDetail"] = true;
								g_dialog.dialog($(data).find("[id=appendix_show_template]"),dialogParam);
							}
							else
							{
								dialogParam["width"] = "600px";
								dialogParam["title"] = "附件信息";
								dialogParam["saveclick"] = save_click;
								g_dialog.dialog($(data).find("[id=upload_template]"),dialogParam);
							}
						}
					});

					function init(aEl)
					{
						var procInstanceId = el_div.find("[data-id=procInstanceId]").val();
						if(opt.type == "detail")
						{
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									var appendixstore = data.appendixstore;
						 			for (var i = 0; i < appendixstore.length; i++) {
						 				var app_div = '<div class="form-group">'
						 							+'<label class="col-lg-12 control-label tl">'
						 							+'<a href="javascript:void(0);" id="'+appendixstore[i].attachPath+'" data-flag="appendix">'
						 							+appendixstore[i].attachName
						 							+'</a>'
						 							+'</label>'
						 							+'</div>';
						 				aEl.find("[id=appendixgroup]").append(app_div);
						 				event_init();
						 				function event_init()
						 				{
						 					aEl.find("[data-flag=appendix]").click(function(){
												var url = $(this).attr("id");
												window.location.href = url;
											});
						 				}
						 			}
								}
							});
						}
						else
						{
							aEl.find("[name=procInstID]").val(procInstanceId);
							um_ajax_get({
								url : "GeneralController/queryAppendixInfo",
								paramObj : {procInstID : procInstanceId},
								isLoad : true,
								maskObj :"body",
								successCallBack : function(data){
									aEl.umDataBind("render",data.maxstore[0]);
									aEl.find("[name=maxUploadSize]").val(data.maxstore[0].maxUpLoadFileSize);
									g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{
										data : data.appendixstore,
										key : "attachName",
										url : "attachPath",
										procInstID :procInstanceId
									});
								}
							});
						}
						
					}

					function save_click(aEl)
					{
						g_formel.appendix_render(aEl.find("[id=appendixgroup]") ,{
							method : "getUploadStrArray"
						});

						var delAppendixIdStr = aEl.find("[id=appendixgroup]").data("delStrArray" ).join("|");
						aEl.find("[name=delAppendixIdStr]").val(delAppendixIdStr);

						var uploadStr = aEl.find("[id=appendixgroup]").data("uploadStrArray").join("|");
						aEl.find("[name=uploadStr]").val(uploadStr);

						um_ajax_file(aEl.find("form") ,{
							url : "GeneralController/updGeneralAppendixs",
							paramObj : {},
							isLoad : true,
							maskObj : "body",
							successCallBack:function (data){
								g_dialog.operateAlert("body");
								g_dialog.hide(aEl);
							}
						});
					}
				});
			}
		},
		socsjczlc_step1_submit : function(){
			var el_div = $("#workorder_div");
			var el_form = el_div.find("[id=step1]");
			var url="workflow/createAndStartProcInst";

			var eventSTR = $("[data-id=eventStr]").val().split(",").join("_");
			var eventType = $("[data-id=eventType]").val();
			
			if (!g_validate.validate(el_form))
			{
				return false;
			}
			else
			{  
				var saveObj = el_form.umDataBind("serialize");
				saveObj.htmlFormKeyClass = "com.rh.soc.workflow.workflowmanage.form.event.controller.EventController";
				saveObj.htmlFormKeyClassMethod = "startProcess";
				saveObj.formFile = "socsjczlc";
				saveObj.eventStore = [];
				var data1 = g_grid.getData(el_form.find("[id=case_table_div]"));
				for (var i = 0; i < data1.length; i++) {
					saveObj.eventStore.push(
						data1[i]
					);
				}
				saveObj.noticeStore = [];
				var data2 = g_grid.getData(el_form.find("[id=notice_table_div]"));
				for (var i = 0; i < data2.length; i++) {
					saveObj.noticeStore.push(
						data2[i]
					);
				}

				var obj = new Object();
				obj.devicePatrolStep1Apply = saveObj;
				obj.curstep = "devicePatrolStep1Apply";
				obj.procDefID = "socsjczlc:1:355004";
				obj.tmpProcInstId = el_form.find("[data-id=procInstanceId]").val();
				obj.businessKey = "";
				obj.type = "event";
				obj.eventStr = eventSTR;
				obj.eventType = eventType;

				um_ajax_post({
					url : url,
					paramObj : {workflowinfo:obj},
					successCallBack : function(){
						g_dialog.operateAlert();
						window.history.go(-1);
					}
				});
			}
		},
		//-------------SOC事件处置流程
	}
});