$(document).ready(function(){
	require(['/js/plugin/tab/tab.js','js/plugin/workorder/workorder.js'],function(tab ,workorder){

	var list_url ="workflow/queryCurWorkItemData";
	var list_col = [
						{text:'工单名称',name:"processInstanceName"},
						{text:'工单编号',name:"procCode"},
						{text:'任务名称',name:"workItemName"},
						{text:'模板名称',name:"processTemplateName"},
						{text:'工单申请人',name:"approveUser",searchRender:function(el){
							um_ajax_get({
								url:"workflow/queryUserCodeList",
								paramObj:{status : "2"},
								isLoad : false,
								successCallBack : function(data){
									var buffer = [];
									for (var i = 0; i < data.length; i++) {
										buffer.push({text:data[i].codename ,id:data[i].codevalue});
									}
									buffer.insert(0 ,{id:"-1" ,text:"---"});
									g_formel.select_render(el ,{data:buffer,name:"processInstanceCreator"});
								}
							});
						}},
						{text:'任务创建时间',name:"createTime" ,searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startCreateTime",
								endKey : "endCreateTime"
							});
						}}
				   ];

	todo_work_list();

	index_search_div_remove_click(todo_work_list);

	function todo_work_list()
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 oper: [
					    {icon:"rh-icon rh-edit" ,text:"办理" ,aclick:todo_work_handle_init}
				   ],
			 operWidth : "80px",
			 isLoad : true,
			 allowCheckBox : false,
			 maskObj : "body"
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
				 				{id:"save_btn",class:"dialog-save",text:"保存",aClick:save},
				 				{id:"commission_btn",class:"dialog-rea-handle",text:"代办",aClick:reassign_handle}
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
				maskObj : "body",
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
			el.find("[id=img]").attr("src",index_web_app+"workflow/getFlowDiagram?procInstId="+rowData.processInstanceID+"&flag=2&date="+new Date().getTime());
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
					url : "workflow/queryAssignUserList",
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
					url : "workflow/reassignhandle",
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
});
