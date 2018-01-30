$(document).ready(function (){
require(['/js/plugin/timepicker/timepicker.js',
	     '/js/plugin/tree/tree.js',
	     '/js/plugin/drag/drag.js'] ,function (timepicker ,tree ,drag){

$("#content_div").addClass("appbgf");

$("#content_div").css("padding" ,"10px");

$("#menu_right_oper_div").html($("#time_pick_div"));

$("#menu-index").show();

drag.scrollTop($("#content_div"));

var urlParamObj = index_query_param_get();

var monitorTypeId;

// 通过资产ID进行查询
var queryByAsset = urlParamObj.queryByAsset;

// 通过监控器ID进行查询
var queryByMonitor = urlParamObj.queryByMonitor;

var el_monitor_quota_div = $("#monitor_quota_info_outer_div");
var el_monitor_info_detail = $("#monitor_info_detail");

var monitor_health_statistics_url = "monitorView/queryMonitorHealthStatistics";

var initClick = true;

view_init();

event_init();

quota_list();

function view_init()
{
	if (queryByAsset != 1)
	{
		monitorTypeId = urlParamObj.monitorTypeId.toLocaleLowerCase();
	}
	$("#query_time_label").text(g_moment().format("YYYY-MM-DD HH:mm:ss"));
}

function event_init()
{
	$("#timeinphidden").jeDate({
	    format: 'YYYY-MM-DD hh:mm:ss',
	    isTime:true,
	    choosefun:function(elem, val) {
			$("#query_time_label").text(val);
			index_monitor_init();
	    },
	    okfun:function(elem, val) {
			$("#query_time_label").text(val);
			index_monitor_init();
	    }
	});

	$("#monitor_refresh_btn").click(function (){
		$("#query_time_label").text(g_moment().format("YYYY-MM-DD HH:mm:ss"));
		index_monitor_init();
	});
}

// 左侧监控指标列表
function quota_list()
{
	if (queryByAsset == 1)
	{
		var zNodes = [];
		var map = new HashMap();
		var monitorObj = new Object();
		var monitor_type_list = [];
		var tmp_monitor_type;
		um_ajax_get({
			url : "monitorView/queryMonitorForEd",
			paramObj : {edId : urlParamObj.assetId},
			successCallBack : function (data){
				for (var i = 0; i < data.length; i++) {
					tmp_monitor_type = data[i].monitorType;
					monitor_type_list.push({type:tmp_monitor_type ,name:data[i].monitorName ,id:data[i].monitorId});
					map.put(tmp_monitor_type.toLocaleLowerCase() ,data[i].monitorId);
					zNodes.push({id:data[i].monitorId,parentID:"-1",label:data[i].monitorName});
					um_ajax_get({
						server : "/",
						url : "data/monitor/" + tmp_monitor_type.toLocaleLowerCase() + ".json",
						successCallBack : function (data){
							var monitorId = map.get(data.fileName);
							var quotaArray = data.quota;
							for (var i = 0; i < quotaArray.length; i++) {
								zNodes.push({
									         id:new Date().getTime(),
											 parentID:monitorId,
											 label:quotaArray[i].text,
											 href:quotaArray[i].href,
											 icon:quotaArray[i].icon,
											 monitorId:monitorId});
							}
							monitorObj[tmp_monitor_type] = zNodes;
						}
					});
				}

				$("#monitor_quota_div").oneTime(1000 ,function (){
					var el_monitor_list_div1 = $("#monitor_quota_div").children();
					el_monitor_list_div1.html("");
					el_monitor_list_div1.append('<div class="prel w-all h-all" style="overflow-y:auto"></div>');
					var el_monitor_list_div = el_monitor_list_div1.children();
					for (var i = 0; i < monitor_type_list.length; i++) {
						el_monitor_list_div.append('<div data-id="'+monitor_type_list[i].id+'" data-type="'+monitor_type_list[i].type+'" class="monitor-info-name monitor-icon '+monitor_type_list[i].type+'">'+monitor_type_list[i].name+'</div>');
					}
					el_monitor_list_div.find("div").each(function (){
						var el_ul = $('<ul style="display:none"></ul>');
						var id = $(this).attr("data-id");
						for (var i = 0; i < zNodes.length; i++) {
							if (zNodes[i].parentID == id)
							{
								var tmpLi = $('<li><i class="icon-png l mr5 '+zNodes[i].icon+'"></i><span>'+zNodes[i].label+'</span></li>');
								el_ul.append(tmpLi);
								tmpLi.data("data" ,zNodes[i]);
							}
						}
						$(this).after(el_ul);
						$(this).click(function (){
							el_ul.siblings("ul").slideUp();
							el_ul.slideToggle();
						});
						el_ul.find("li").click(function (){
							el_monitor_list_div.find("li").removeClass("active");
							$(this).addClass("active");
							var treeNode = $(this).data("data");
							if (!treeNode.href)
							{
								return false;
							}
							$.ajax({
								type : "GET",
								url : "tpl/monitor_classify/"+treeNode.href,
								success : function (data){
									$("[data-id=monitorId]").val(treeNode.monitorId);
									el_monitor_info_detail.hide();
									el_monitor_info_detail.oneTime(10 ,function (){
										el_monitor_info_detail.show();
										el_monitor_info_detail.html(data);
									});
								}
							});
						});
					});
					el_monitor_list_div.find("div").eq(0).click();
					el_monitor_list_div.oneTime(100 ,function (){
						el_monitor_list_div.find("ul").eq(0).find("li").eq(0).click();
					});
				});
			}
		});
	}
	else if (queryByMonitor == 1){
		var monitorTypeIdTmp;
		um_ajax_get({
			url : "/monitorView/queryMonitorInfoByMonitorId",
			paramObj : {monitorId : urlParamObj.monitorId},
			successCallBack : function (aData){
				monitorTypeIdTmp = aData.monitorType;
				um_ajax_get({
					server : "/",
					url : "data/monitor/"+aData.monitorType.toLocaleLowerCase()+".json",
					successCallBack : function (data){
						el_monitor_quota_div.find("div").addClass(monitorTypeIdTmp);
						el_monitor_quota_div.find("div").attr("title" ,aData.monitorName);
						el_monitor_quota_div.find("div").find("span").eq(0).text(aData.monitorName);
						$("[data-id=param-assetId]").val(aData.edId);
						$("[data-id=param-monitorTypeId]").val(monitorTypeIdTmp);
						for (var i = 0; i < data.quota.length; i++)
						{
							if (data.quota[i].hide != "true")
							{
								el_monitor_quota_div.find("ul")
								.append('<li data-href="'+data.quota[i].href+'"><i class="icon-png l '+data.quota[i].icon+' mr5"></i><span>'+data.quota[i].text+'</span></li>');
							}
						}
						// 列表单项点击事件
						el_monitor_quota_div.find("li").click(function (){
							el_monitor_quota_div.find("li").removeClass("active");
							$(this).addClass("active");
							var href = $(this).attr("data-href");
							$.ajax({
								type : "GET",
								url : "tpl/monitor_classify/"+href,
								success : function (data){
									el_monitor_info_detail.hide();
									el_monitor_info_detail.oneTime(10 ,function (){
										el_monitor_info_detail.show();
										el_monitor_info_detail.html(data);
									});
								}
							});
						});
						$("#pg-container").show();
						if (initClick)
						{
							el_monitor_quota_div.find("li").eq(0).click();
							initClick = false;
						}
					}
				});
			}
		});
	}
	else
	{
		um_ajax_get({
			server : "/",
			url : "data/monitor/"+monitorTypeId+".json",
			successCallBack : function (data){
				el_monitor_quota_div.find("[class*=monitor-icon]").addClass(urlParamObj.monitorTypeId);
				//el_monitor_quota_div.find("p").text(decodeURI(urlParamObj.monitorName));
				el_monitor_quota_div.find("[class*=monitor-icon]").attr("title" ,decodeURI(urlParamObj.monitorName));
				el_monitor_quota_div.find("[class*=monitor-icon]").find("span").eq(0).text(decodeURI(urlParamObj.monitorName));
				for (var i = 0; i < data.quota.length; i++)
				{
					if (data.quota[i].hide != "true")
					{
						el_monitor_quota_div.find("ul")
						.append('<li data-href="'+data.quota[i].href+'"><i class="icon-png l '+data.quota[i].icon+' mr5"></i><span>'+data.quota[i].text+'</span></li>');
					}
				}

				// 列表单项点击事件
				el_monitor_quota_div.find("li").click(function (){
					el_monitor_quota_div.find("li").removeClass("active");
					$(this).addClass("active");
					var href = $(this).attr("data-href");
					$.ajax({
						type : "GET",
						url : "tpl/monitor_classify/"+href,
						success : function (data){
							el_monitor_info_detail.hide();
							el_monitor_info_detail.oneTime(10 ,function (){
								el_monitor_info_detail.show();
								el_monitor_info_detail.html(data);
							});
							$("#content_div").animate({scrollTop:"0px"} ,100 ,function(){});
						}
					});
				});
				$("#pg-container").show();
				if (initClick)
				{
					el_monitor_quota_div.find("li").eq(0).click();
					initClick = false;
				}
			}
		});
	}
}

});
});

window.index_monitor_status_get = function (monitorId ,type ,nameAttr){
	if (!monitorId)
	{
		 g_dialog.waitingAlertHide($("#monitor_info_detail"));
		return false;
	}
	var el_panel_head = $("#scale_list").prev();
	var buffer = [];
	buffer.push('<div class="pabs" style="height:10px;left:36%;top:10px">');
	buffer.push('<span class="dib ml5 mr5 bggreen" style="width: 30px;height: 100%;"></span>正常');
	buffer.push('<span class="dib ml5 mr5 bgorange" style="width: 30px;height: 100%;"></span>性能');
	buffer.push('<span class="dib ml5 mr5 bgred" style="width: 30px;height: 100%;"></span>故障');
	buffer.push('<span class="dib ml5 mr5 bgdeepblue" style="width: 30px;height: 100%;"></span>凭证');
	buffer.push('<span class="dib ml5 mr5 bggrey" style="width: 30px;height: 100%;"></span>未知');
	buffer.push('</div>');
	el_panel_head.append(buffer.join(""));
	var monitor_status_url = "monitorView/queryMonitorStatus";
	um_ajax_get({
        url : monitor_status_url,
        paramObj : {monitorId : monitorId,type : type,direction : 0,
                    time:$("#query_time_label").text()},
        isLoad : false,
        successCallBack : function (data){
            $("#scale_list").height(data.timerTable.length * 75);
            $("#scale_list").html("");
            for (var i = 0; i < data.timerTable.length; i++)
            {
                var el = $('<div class="scale" style="padding-top:10px"></div>');
                $("#scale_list").append(el);
                g_monitor.monitorStatusChart(el ,{
                    time : $("#query_time_label").text(),
                    data : data.timerTable[i].status,
                    name : data.timerTable[i][nameAttr]
                });
            }
            $("#ip_info_span").text("(" + data.ipvAddress + ")");
            var el_event_li = $("[class*=monitor-event]").parent();
            if (data.total == 0)
            {
            	el_event_li.find("[class=icon-warning-sign]").remove();
            }
            else
            {
            	if (el_event_li.find("[class=icon-warning-sign]").size() == 0)
            	{
            		el_event_li.append('<i class="icon-warning-sign" style="margin-left:45px"></i>');
            	}
            }
            
            g_dialog.waitingAlertHide($("#monitor_info_detail"));
        }
    });
}