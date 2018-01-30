$(document).ready(function (){
	var list_header = [
						{text:"邮件发送时间",name:"sendTime",searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startDate",
								endKey : "endDate"
							});
						}},
						{text:"收件人",name:"mailTo"},
						{text:"邮件主题",name:"subject",hideSearch:true},
						{text:"邮件内容",name:"contentStr",hideSearch:true}
					  ];
	var list_url = "EmailSendLogsController/queryEmailSendLogsList";
    var list_oper = [{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:delete_init}];
    var delete_url = "EmailSendLogsController/delEmailSendLog";
    var export_url = "";

	event_init();

	list_init();

	function event_init()
	{
		$("#export_btn").click(function(){
			export_init();
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
			 dbClick : detail_template_init
		});
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/oper_workorder/notice_record/email_post_record_tpl.html",
			success : function (data){
				g_dialog.dialog($(data).find("[id=detail_template]"),{
					width:"500px",
					init:init,
					isDetail:true,
					title:"邮件发送记录详细信息"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
		}
	}

	function export_init()
	{
		var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"localId"});
		window.location.href = index_web_app + "EmailSendLogsController/expEmailSendLogs?ids=" + idArray.join(",");
	}

	function delete_init(rowData)
	{
		g_dialog.operateConfirm("确定执行删除操作么?" ,{
			saveclick : function (){
				um_ajax_post({
					url : delete_url,
					paramObj : {ids : rowData.localId},
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
		array = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"localId"});
		if(array.length == 0){
			g_dialog.operateAlert($("#table_div") ,index_select_one_at_least_msg ,"error");
			return false;
		}
		var ids = array.join(",");
		um_ajax_post({
			url : delete_url,
			paramObj : {ids : ids},
			isLoad : true,
			maskObj : "body",
			successCallBack : function(data){
				g_dialog.operateAlert();	
				list_init();
			}
		});
	}
});