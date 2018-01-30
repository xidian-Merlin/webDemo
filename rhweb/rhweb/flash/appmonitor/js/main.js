var language = unieap.Action.getCodeList("sys_language").getRowSet().primary[0].CODEVALUE;
function goBack(type,fromType){
	if(type=="edit"){
		if(fromType=='grid'){
			window.location = unieap.appPath + "/appMonitorIndex.do";
        }else if(fromType=='duty'){//杭州社保
			window.location = unieap.appPath + "/dutyThumbnail.do";
        }else{
			window.location = unieap.appPath + "/appMonitorThumbnail.do";
		}
	}else if(type=="view"){
		if(fromType=='grid'){
			window.location = unieap.appPath + "/appMonitorViewIndex.do";
        }else if(fromType=='duty'){//杭州社保
			window.location = unieap.appPath + "/dutyViewThumbnail.do";
        }else{
			window.location = unieap.appPath + "/appMonitorViewThumbnail.do";
		}
	}
} 

function goTopo(topoId,appId,appName){
	var flag = 3;//权限过滤，1：拓扑编辑;0：拓扑监控、网络拓扑
	var appMonitorFlag = 1;
	window.location = unieap.appPath + "/shared/media/flash/topo/TopoMain.jsp" +
			"?topoId=" + topoId + "&topoType=" + 2 +"&flag=" + flag + "&appMonitorFlag=" + appMonitorFlag + "&appId=" + appId + "&appName=" + encodeURI(encodeURIComponent(appName));
}
//添加监控器
function addMonitor(type){
	var currNode = null;
	var swfId = "Main";
	DialogUtil.showDialog({
	    url:unieap.appPath + "/MonitorConfigAdd.do",
	    title:'监控器添加',
	    iconCloseComplete:true,
	    isExpand:false,
	    isClose:true,
	    resizable:false,
	    dialogData:{
			    	language:language
			    },
		onComplete:function(data){
			if(data!=null&&data!=false){
				refreshMonitor(swfId,type)
			}
	    },
	    width:720,
	    height:500
	});
}

/**
 * 显示监控器列表
 */

function showMonitor(compId,compType,id){
	var dc = new unieap.ds.DataCenter();
	var instStatus = null;
	if("database"==compType){
		instStatus = "1";
	}
	var edmonitorstore = new unieap.ds.DataStore("edmonitorstore");	
	edmonitorstore.addParameter("monitorId",compId);
	edmonitorstore.addParameter("language",language);
	edmonitorstore.addParameter("instStatus",instStatus);
	edmonitorstore.setPageSize(1000000);
	edmonitorstore.setPageNumber(1);
	dc.addDataStore(edmonitorstore);
	//应用系统
	if("appSystem"==compType){
		new DialogUtil.showDialog({
					    url:unieap.WEB_APP_NAME + "//appMonitorEventIndexPopup.do",
					    title:'应用监控事件',
					    iconCloseComplete:true,
					    isExpand:false,
					    resizable:false,
					    isClose:true,
					    dialogData:{
					    	compId:compId
					    },
					    onComplete:function(data){
					    	parent.freshPendingWorknum();
					    	if(data){
					    	}
					    },
					    width:900,
	   					height:450
					});
	}
	//如果是监控器类型的
	else if("os"==compType||"middleware"==compType||"database"==compType||
	   "netDevice"==compType||"securityDevice"==compType||"storeDevice"==compType||
	   "appsoftware"==compType||"generalAgreement"==compType){
		//执行后台查询
		var tdc = unieap.Action.requestData({
			url:unieap.WEB_APP_NAME + "/MonitorViewAction.do?method=queryEdMonitor",
			sync : false,
			load : function(dc) {
					var resultstore = dc.getDataStore("edmonitorstore");
					if(resultstore.getRealRecordCount()<1){
						MessageBox.alert({'type':"info",
										'height':'105',
											title:'信息提示',
											'message':'该资产上没有配置监控器。'});
					   	return;
					}
					new DialogUtil.showDialog({
					    url:unieap.WEB_APP_NAME + "/monitorView.do",
					    title:'监控器查看',
					    iconCloseComplete:true,
					    isExpand:false,
					    resizable:false,
					    isClose:true,
					    dialogData:{
					    	monitorId:compId,
					    	instStatus:instStatus,
					    	edId:"",
					    	monitorStore:resultstore,
					    	language:language
					    },
					    onComplete:function(data){
					    	if(data){
					    	}
					    },
					    width:982,
					    height:607
					});
			}
		}, dc);
	}else{
		var tdc = unieap.Action.requestData({
			url:unieap.WEB_APP_NAME + "/appMonitorAction.do?method=queryEventsList&compId="+compId+"&id="+id+"&compType="+compType,
			sync : false,
			load : function(dc) {
					var resultstore = dc.getDataStore("eventStore");
					new DialogUtil.showDialog({
					    url:unieap.WEB_APP_NAME + "/appMonitorCompEvent.do",
					    title:'事件详细信息',
					    iconCloseComplete:true,
					    isExpand:false,
					    resizable:false,
					    isClose:true,
					    dialogData:{
					    	eventStore:resultstore
					    },
					    onComplete:function(data){
					    	if(data){
					    	}
					    },
					    width:700,
	   					height:450
					});
			}
		}, dc);
	}
}

/**
 * 添加监控器后刷新监控器列表
 */
function refreshMonitor(swfId,type){
	document.getElementById(swfId).refreshMonitor(type);
}