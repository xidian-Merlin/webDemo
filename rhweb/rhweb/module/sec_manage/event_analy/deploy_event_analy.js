$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js',
	     '/js/plugin/tree/tree.js',
	     '/js/plugin/tab/tab.js',
	     '/js/plugin/plot/plot.js',
	     '/js/plugin/workorder/workorder.js',
	     '/js/plugin/event/event.js'] ,function (inputdrop ,tree ,tab ,plot ,workorder,pevent){

	$("#content_div").addClass("appbgf");

	event_init();

	var el_event_list = $("#table_div");

	pevent.deployEventList();

	function event_init()
	{
		//自定义列
		$("[data-val=fault_event_li]").find("[id=custom_btn]").click(function (){
			pevent.eventCustomCol({
				tplUrl : "module/sec_manage/event_analy/deploy_event_analy_tpl.html",
				colQueryUrl : "deployEvent/queryDeployColumeIds",
				customColumnsUrl : "deployEvent/saveDeployCustomColumn",
				type:"13",
				cbf : function (){
					pevent.deployEventList();
				}
			});
		});

		// 生成工单
		$("#order_btn").click(function (){
			pevent.createWorkOrder({
				gridEl : $("#table_div"),
				descKey : "depl_MODULE",
				eventIdKey : "deploy_NO",
				eventTypeVal : "13"
			});
		});

		//忽略全部
		$("#lgnore_all_btn").click(function(rowData) {
			var data = g_grid.getData($("#table_div") ,{chk:false});
			if (data.length == 0)
			{
				// 弹出提示
				g_dialog.operateAlert($("#table_div") ,"列表无数据。" ,"error");
				// 直接返回
				return false;
			}
			pevent.ignoreAll({
				gridEl: el_event_list,
				lgnore_all_url: "deployEvent/doIgnoreAll",
				cb: function() {
					event_analy_list({
						paramObj: null,
						isLoad: true,
						maskObj: el_event_list
					});
				}
			});
		});

		//忽略
		$("#lgnore_btn").click(function (rowData){
			$.ajax({
				type: "GET",
				url: "module/sec_manage/event_analy/perform_event_analy_tpl.html",
				success :function(data)
				{
					var rowData = g_grid.getData(el_event_list,{
						chk:true
					});
					if(rowData.length!=1){
						g_dialog.operateAlert(null ,"请选择单个要忽略的性能事件!" ,"error");
						return false;
					}
					
					g_dialog.dialog($(data).find("[id=lgnore_template]"),{
						width:"530px",
						init:init,
						title:"忽略",
						saveclick:save
					});
				}
			});
			function init (el){
				
			}

			function save(el ,saveObj){
				saveObj.eventId =
						g_grid.getIdArray(el_event_list ,{chk:true ,attr:"deploy_NO"}).join(",");
				um_ajax_post({
					url : "deployEvent/doIgnore",
					paramObj: saveObj,
					maskObj:el,
					successCallBack : function(data){
						g_dialog.hide(el);
						g_dialog.operateAlert(null ,"操作成功");
						event_analy_list({paramObj : null ,isLoad : true ,maskObj : el_event_list});
					}
				});
				
			}
		});

		//导出EXCEL
		$("#export_btn").click(function (rowData){
			var idArray = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"faultNO"});
			window.location.href = index_web_app + "deployEvent/exportDeploy?eventIds=" + idArray.join(",");
		});

	}

	function sec_event_record_dbclick(rowData){
		pevent.deployEventDetail(rowData);
	}

});
});