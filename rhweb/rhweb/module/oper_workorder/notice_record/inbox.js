$(document).ready(function (){
	var list_header = [
						{text:"",name:"hasAppendix",width:7,render:function(txt,data){
							if(data.hasAppendix != 0)
							{
								return '<i class="icon-paperclip" title="有附件" style="color:#000;font-size:16px"></i>';
							}
						},searchRender:function(el){
							g_formel.select_render(el ,{
															data:[
																	{text:"----",id:"-1"},
																	{text:"有附件",id:"1"},
																	{text:"无附件",id:"0"}
																 ],
															name:"hasAppendix"
												  });
						}},
						{text:"主题",name:"emailTitle",width:33},
						{text:"发件人",name:"emailFrom",width:25},
						{text:"日期",name:"emailDate",width:15,searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "dateStart",
								endKey : "dateEnd"
							});
						}},
						{text:"邮件大小(KB)",name:"appendixSize",width:10,hideSearch:true},
						{text:"是否与工单关联",name:"emailStatus",width:10,render:function(txt,data){
							if(data.emailStatus == "1")
							{
								return "是";
							}
							else
							{
								return "否";
							}
						},searchRender:function(el){
							g_formel.select_render(el ,{
															data:[
																	{text:"----",id:"-1"},
																	{text:"是",id:"1"},
																	{text:"否",id:"0"}
																 ],
															name:"emailStatus"
												  });
						}}
					 ];
	var list_url = "InBoxController/preInboxList";
    var list_oper = [{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:delete_init}];
    var delete_url = "InBoxController/delBatchEmail";

	event_init();

	list_init();

	function event_init()
	{
		$("#get_mail_btn").click(function(){
			get_mail_init();
		});

		$("#delete_btn").click(function(){
			batch_delete();
		 });
	}

	function list_init()
	{
		g_grid.render($("#table_div"),{
			 header:list_header,
			 url:list_url,
			 oper : list_oper,
			 operWidth:"80px",
			 isLoad : true,
			 maskObj : "body",
			 dbClick : detail_template_init,
			 dbIndex : 1
		});
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/oper_workorder/notice_record/inbox_tpl.html",
			success : function (data){
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"600px",
					init:init,
					isDetail:true,
					title:"邮件详细"
				});
			}
		});

		function init(el)
		{
			um_ajax_get({
				url : "InBoxController/queryAppendixByEmail",
				paramObj : {emailCode : rowData.emailCode},
				isLoad : true,
				maskObj : "body",
				successCallBack : function(data){
					el.umDataBind("render" ,rowData);
					(rowData.emailStatus == "0") && (el.find("[data-id=emailStatus]").text("否"));
					(rowData.emailStatus == "1") && (el.find("[data-id=emailStatus]").text("是"));
					el.find("[data-id=emailDescription]").html(rowData.emailDescription);

		 			for (var i = 0; i < data.length; i++) {
		 				var app_div;
						app_div = '<div class="form-group">'
	 							+'<label class="col-lg-12 control-label tl">'
	 							+'<a href="javascript:void(0);" id="'+data[i].appendixPath+'" data-flag="appendix" data-id="'+data[i].appendixCode+'">'
	 							+data[i].appendixName
	 							+'</a>'
	 							+'</label>'
	 							+'</div>'; 
		 				el.find("[id=appendixList]").append(app_div);
		 			}
		 			appendix_event_init();
		 			function appendix_event_init()
		 			{
						el.find("[data-flag=appendix]").click(function(){
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
				}
			});
		}
	}

	function get_mail_init()
	{
		um_ajax_get({
			url : "InBoxController/getEmail",
			isLoad : true,
			maskObj : "body",
			successCallBack : function(data){
				g_dialog.operateAlert();	
				list_init();
			}
		});
	}

	function delete_init(rowData)
	{
		g_dialog.operateConfirm("确定执行删除操作么?" ,{
			saveclick : function (){
				if(rowData.emailStatus == "1")
				{
					g_dialog.operateAlert($("#table_div") ,"该邮件与工单关联,不能删除。" ,"error");
					return false;
				}
				um_ajax_post({
					url : delete_url,
					paramObj : {inboxStore : [{"emailCode":rowData.emailCode}]},
					isLoad : true,
					maskObj : "body",
					successCallBack : function(data){
						g_dialog.operateAlert();	
						list_init();
					}
				});
			}
		});
	}

	function batch_delete()
	{
		var array = [];
		array = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"emailCode"});
		if(array.length == 0){
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}
		for (var i = 0; i < array.length; i++) {
			array[i] = {"emailCode":array[i]};
		}
		um_ajax_post({
			url : delete_url,
			paramObj : {inboxStore : array},
			isLoad : true,
			maskObj : "body",
			successCallBack : function(data){
				g_dialog.operateAlert();	
				list_init();
			}
		});
	}
});