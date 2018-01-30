$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
			'/js/plugin/workorder/workorder.js'] ,function (inputdrop ,workorder){

	var case_list_url = "CaseAnalyse/queryData";

	var case_list_col = [
							{text:'案例名称',name:"title"},
							{text:'关键字',name:"caseKeyProperty"},
							{text:'生成时间',name:"createDate" ,searchRender:function (el){
								index_render_div(el ,{type:"date",startKey:"dateStart" ,endKey:"dateEnd"});
							}},
							{text:'案例描述',name:"desc" ,hideSearch:true}
				   		];

	var case_list_oper = [
							{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
						  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:case_analysis_delete}
						];

	var case_analysis_delete_url = "CaseAnalyse/delCase";

	var case_delete_all_url = "CaseAnalyse/doBatchDel";

	var edit_case_url = "CaseAnalyse/updCase";

	case_list({paramObj:null,isLoad:true,maskObj:"body"});

	var el_table_div = $("#table_div");

	event_init();


	function case_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:case_list_col,
			 oper:case_list_oper,
			 operWidth:"100px",
			 url:case_list_url,
			 paramObj : {queryTag:"query"},
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 dbClick : detail_template_init,
			 allowCheckBox:true,
			 dataKey:"casestore"
		});
	}

	function event_init()
	{

		$("#delete_all_btn").click(function (){
			delete_all_template_init();
		});
	}

	function edit_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/knowledge_repo/creative_commons/case_analysis_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=edit_template]"),{
					width:"650px",
					title:"案例分析修改",
					init:init,
					saveclick:save_click,
					isDetail:false
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);

			g_formel.appendix_render(el.find("[id=appendix_div]") ,{
				
			});

			index_create_upload_el(el.find(".upload"));
		}
		function save_click(el ,saveObj)
		{
			if (el.find("[id=appendix_div]").text() == "")
			{
				g_dialog.operateAlert(el ,"请添加文档附件" ,"error");
				return false;
			}
			um_ajax_file(el.find("form") ,{
				url:edit_case_url,
				paramObj:{},
				maskObj:el,
				successCallBack:function(data){
					g_dialog.hide(el);
					g_dialog.operateAlert(null ,"修改成功！");
					case_list({paramObj:null,isLoad:true,maskObj:el_table_div});
				}
			});
		}
	}

	//删除
	function case_analysis_delete(rowData)
	{
		g_dialog.operateConfirm("确认删除此记录么？" ,{
			saveclick:function(){
				um_ajax_post({
					url:case_analysis_delete_url,
					paramObj:rowData,
					successCallBack:function(data){
						g_dialog.operateAlert(null ,"删除成功！");
						case_list({paramObj:null,isLoad:true,maskObj:el_table_div});
					}
				});
			}
		});
	}

	//批量删除
	function delete_all_template_init(rowData)
	{
		var dataArray = g_grid.getData($("#table_div") ,{chk : true});

		if(dataArray.length === 0){
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}

		var data = g_grid.getData($("#table_div") ,{chk:true});

		var tmp=[];
		for (var i = 0; i < data.length; i++) {
			tmp.push(data[i]);
		}

		g_dialog.operateConfirm("确认删除所选案例记录么？" ,{
			saveclick:function(){
				um_ajax_post({
					url:case_delete_all_url,
					paramObj:{casestore:data},
					successCallBack:function(data){
						case_list({paramObj:null,isLoad:true,maskObj:el_table_div});
						g_dialog.operateAlert(null ,"删除成功！");
					}
				});
			}
		});
	}

	// 双击详情
	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "/module/knowledge_repo/creative_commons/case_analysis_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=case_detail_template]"),{
					width:"450px",
					init:init,
					top : "6%",
					title:"案例详细信息",
					isDetail:true
				});
			}
		});

		function init(el)
		{
			um_ajax_get({
				url : "CaseAnalyse/queryDetailInfo",
				paramObj : {caseId : rowData.caId},
				isLoad : true,
				maskObj : "body",
				successCallBack : function(data){
					el.umDataBind("render",data[0]);
					var eventVOList = data[0].eventVOList;
		 			for (var i = 0; i < eventVOList.length; i++) {
		 				var list_div = '<div class="form-group">'
		 							+'<label class="col-lg-12 control-label tl">'
		 							+'<a href="javascript:void(0);" id="'+eventVOList[i].eventId+'" data-flag="event">'
		 							+eventVOList[i].eventName
		 							+'</a>'
		 							+'</label>'
		 							+'</div>';
		 				el.find("[id=eventVOList]").append(list_div);
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
		 				el.find("[id=appendixList]").append(app_div);
		 			}
		 			var work_div = '<a href="javascript:void(0);" id="'+data[0].procId+'" data-flag="work">'
		 							+data[0].procName
		 							+'</a>'
		 			el.find("[id=procName]").append(work_div);
		 			event_init();
		 			function event_init()
		 			{
		 				var eventType = el.find("[data-id=eventType]").val();
		 				require(['/js/plugin/event/event.js'] ,function (pevent){
		 					el.find("[data-flag=event]").click(function(){				 					
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

						el.find("[data-flag=appendix]").click(function(){
							var url = $(this).attr("id");
							window.location.href = url;
						});

						el.find("[data-flag=work]").click(function(){
							var obj = new Object();
							obj.processInstanceID = $(this).attr("id");
							obj.id = "socsjczlc_step2";
							(eventType == "2") && (obj.tplName = "故障事件");
							(eventType == "3") && (obj.tplName = "性能事件");
							(eventType == "13") && (obj.tplName = "配置事件");
							(eventType == "14") && (obj.tplName = "脆弱性事件");
							var style = "see";
							workorder.done_workorder(obj,style);
						});
		 			}									
				}
			});
		}
	}

});
});