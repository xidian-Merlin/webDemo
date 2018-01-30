$(document).ready(function (){
require(['/js/plugin/topo/jtopo-0.4.8-dev.js',
         '/js/plugin/topo/editor.js',
         '/js/plugin/topo/network.js',
         '/js/plugin/topo/topologyProperties.js',
         '/js/lib/JsonTools.js',
         '/js/lib/Json2xml.js',
         '/js/draw/node-ui.js',
         'plot',
         '/js/lib/charts/echarts.min.js',
         '/js/drawToolLable.js'] ,function (jtopo,editorJs,network,topologyProperties,JsonTools,Json2xml,nodeFactory,plot,echarts,toolsLable){

var url = {
	importUrl : 'appMonitor/queryAppMonitorXml',
	statusUrl : 'appMonitor/queryAppCompStatus',
	refreshStatusUrl : 'appMonitor/updateAppStatus',
	exportUrl : 'appMonitor/exportImg'
};

$("#content_div").css("padding" ,"0");
$("#pg-content").css("padding" ,"0");

var this_params = index_query_param_get();
var appId = this_params.appId;

json2xml = new Json2xml({
	attributePrefix : ""
});
var faultNum = 0;
var myChart;
nodeFactory.init();
var nodeFunction = nodeFactory._nodeFunction;
init();
function init(){
	$('#canvas').oneTime(1000,function (){
		initCanvasData();
		um_ajax_get({
			url : url.importUrl + "?id="+appId,
			isLoad : false,
			successCallBack : function (data){
				var jsonobj = json2xml.xml_str2json(data);
				formatJson(jsonobj);
			}
		});
	});
	$('#compTable').slimscroll({
		allowPageScroll : true
	});
	$('#com-state-tips').slimscroll({
		allowPageScroll : true
	});
	$('[data-id=right_div]').slimscroll({
		color : '#fff',
		alwaysVisible : true
	});
	var heightMap = {0:"197px",1:"230px",2:"200px"};
	var firstInitEchart = true;
	$('.float-panel.active').on('mouseover',function (){
		if(!$(this).hasClass('active1'))
			return ;
		var index = $(this).index();
		$(this).oneTime(600,function (){
			$(this).find("[data-id=panel-body]").show();
		});
		$(this).css("height" ,heightMap[index]);
		$(this).css("width" ,"300px");
	}).on("mouseout",function (){
		if(!$(this).hasClass('active1'))
			return ;
		$(this).find("[data-id=panel-body]").hide();
		$(this).css("height" ,'37px');
		$(this).css("width" ,"100px");
	});
	$("[data-action=win_plus]").each(function(){
		$(this).click(function(){
			$(this).closest('.float-panel').toggleClass('active1');
			$(this).toggleClass('rotate-PI2');
		});
	});
	var orgZoom ;
	$("[data-id=zoom_out]").click(function (){
		!orgZoom && (orgZoom = nodeFunction.getStage().childs[0].scaleX);
		nodeFunction.getStage().zoomIn(0.85);
	});
	$("[data-id=zoom_in]").click(function (){
		!orgZoom && (orgZoom = nodeFunction.getStage().childs[0].scaleX);
		nodeFunction.getStage().zoomOut(0.85);
	});
	$("[data-id=zoom_reset]").click(function (){
		// nodeFunction.getStage().zoom(1,1);
		if(orgZoom){
			nodeFunction.getStage().zoom(orgZoom);
		}else {
			return ;
		}
	});
	$("[data-id=exportImg]").click(function (){
		stage.saveImageInfo();
	});
	$("[data-id=save]").click(function (){
		nodeFunction.exportJSONData();
	});

}
function initCanvasData(){
	//初始化画图区
	nodeFunction.initScene("canvas");
	//设置节点连线的颜色，没有修改连线属性的情况下生效
	nodeFunction.setLinkLineColor("0,200,200");
	//设置监控器列表请求地址
	nodeFunction.setQueryMonitorUrl("appMonitor/queryConfigXml?1=1");
	//设置监控器状态请求地址
	nodeFunction.setQueryOneMonitorStatusUrl("appMonitor/queryAppCompStatus");
	//设置保存url
	nodeFunction.setSaveDataUrl("appMonitor/saveAppSystem?1=1");
	//设置通过监控器ID获取监控器属性的请求地址
	nodeFunction.setQueryOneMonitorStatusByIdUrl("/monitorView/queryMonitorInfoByMonitorId");
	//设置获取后台xml模板URL 
	nodeFunction.setXmlModuleUrl("appMonitor/queryAppSystemXml?1=1");
	//设置挂载监控器图片路径
	nodeFunction.setCustomMonitorImgePath("/img/custommonitor/new/",'.svg');
	//设置节点单击事件,本事件只在非编辑状态下生效
	nodeFunction.setNodeClickEventFunction(showOneNodeStatus);
	//设置节点双击事件,本事件只在非编辑状态下生效
	nodeFunction.setNodeDBClickEventFunction(showDBClickUrl);
	//定义鼠标进入进出事件
	initMouseEvent();
}
function initMouseEvent(){
	nodeFactory.customComEvent(
			{
				type:"appSystem",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"os",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"middleware",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"database",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"netDevice",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"securityDevice",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"storeDevice",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"appsoftware",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"generalAgreement",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
	nodeFactory.customComEvent(
			{
				type:"loadBalancing",
				node:{mouseover:showMonitorMes,mouseout:hideMonitorMes}//
			});
}
function formatJson(jsonobj){
	if(jsonobj.root){
    	var _root = jsonobj.root;
    	_root.name && (document.title = _root.name);
    	if(_root.item instanceof Array)
    	{
    		
    	}
    	else if(_root.item != undefined)
    	{
    		var temp = _root.item;
    		_root.item = new Array();
    		_root.item[0] = temp;
    	}
    	if(_root.dependence instanceof Array)
    	{
    		
    	}
    	else if(_root.dependence != undefined)
    	{
    		var temp = _root.dependence;
    		_root.dependence = new Array();
    		_root.dependence[0] = temp;
    	}
    	//创建组件链 不能删
    	createComObj(_root.item,_root.dependence);
    	//添加节点
    	itemToNodeTimerSetParam(_root.item,_root.dependence,nodeFunction.getScene(),_root);
    	itemToNodeTimer();
    	
	}else {
		g_dialog.operateAlert(null,"数据加载出错","error");
	}
}
Array.prototype.remove=function(dx)
{
	if(isNaN(dx)||dx>this.length){return false;}
	for(var i=0,n=0;i<this.length;i++)
	{
		if(this[i]!=this[dx])
		{
			this[n++]=this[i];
		}
	}
	this.length-=1;
}
var associationObjsList = new Array();
/**
 * 创建组件链函数
 */
var totleMonitorNum = 0;
function createComObj(item,dependence)
{
	for(var i=0;item!=undefined&&i<item.length;i++)
	{
		item[i].healthlevel = -1;
		var associationObjs = new Object();
		var thisId = item[i].id;
		var aIds = [];
		var ind = 0;
		try
		{
			for(var j=0;dependence!=undefined&&j<dependence.length;j++)
			{
				if(thisId == dependence[j].endId)
				{
					aIds[ind++] = dependence[j].startId;
				}
			}
		}catch(e)
		{}
		
		associationObjs.name = item[i].name;
		associationObjs.id = thisId;
		associationObjs.aid = aIds;//直接依赖，可用作分层
		associationObjs.type = item[i].compType;
		associationObjs.item = item[i];//节点所有数据
		associationObjsList[i] = associationObjs;
		if(associationObjs.item.compId != "")
			totleMonitorNum = totleMonitorNum+1;
	}
}
/**
 * show
 */
function _showData(id)
{
	try
	{
		initSysState();
	}catch(e){}
	try
	{
		initComStateTip(id);
	}catch(e){
	}
	try
	{
		initComShow();
	}catch(e){
		alert(e);
	}
}
/**
 * 系统状态
 */
function initSysState()
{
	var pdiv = document.getElementById('picanvas_parent');
	
	var data = initSystemStateData();

	var title = '当前业务系统状态:' ;

	if(data[3] == -1){
		title += '未知';
	}else if(data[3]==0){
		title += '故障';
	}else if(data[3]==1){
		title += '性能';
	}else if(data[3]==2){
		title += '正常';
	}
	var seriesData = [];
	for(var i=0;i<data[0].length;i++){
		var temp = {
			name : data[0][i],
			value : data[1][i]
		}
		seriesData.push(temp);
	}
	myChart = echarts.init($(pdiv)[0]);
	var option = {
		title : {
			text: title,
			textStyle : {
				color : 'white',
				fontSize : 12,
				fontWeight : 'normal'
			}, 
			x:10,
			y:0
		},
		tooltip : {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'right',
			textStyle : {
				color : '#fff'
			},
			data: data[0]
		},
		calculable : true,
		series : [
		{
			name: '组件',
			type: 'pie',
			radius : ['50%', '75%'],
			center: ['50%', '50%'],
			data: seriesData,
			avoidLabelOverlap: false,
			label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
       //          normal:
					  // {
					  // 	show:true ,
					  // 	position:"inside",
		     //            formatter:function (data){
		     //            	if(data.value==0){
		     //            		return '';
		     //            	}else {
		     //            		return data.value;
		     //            	}
		     //            },
		     //            textStyle:{fontSize:20}
		     //          }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
			itemStyle: {
				normal : {
					color : function (param){
						var colorList = data[2];

						return colorList[param.dataIndex];
					}
				},
				emphasis: {
					shadowBlur: 10,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
			}
		}
		]
	};
	myChart.setOption(option);
}
/**
 * 统计服务器状态
 */
function initSystemStateData()
{
	var sysStateData = [];
	//
	var objLen1 = 0;//状态-1
	var objLen2 = 0;//状态0
	var objLen3 = 0;//状态1
	var objLen4 = 0;//状态1

	var selfStatu = -1;
	for(var i=0;i<associationObjsList.length;i++)
	{
		//节点屏蔽的情况下不统计
		if(nodeFunction.nodeIsHidden(associationObjsList[i].item) == true){
			if(associationObjsList[i].item.isSelf==true||associationObjsList[i].item.isSelf=='true'){
				selfStatu = associationObjsList[i].status;
			}
			continue;
		}
		if(associationObjsList[i].status == -1)
			objLen1 = objLen1 + 1;
		else if(associationObjsList[i].status == 0)
		{
			objLen2 = objLen2 + 1;
		}
		else if(associationObjsList[i].status == 1)
		{
			objLen3 = objLen3 + 1;
		}
		else if(associationObjsList[i].status == 2)
		{
			objLen4 = objLen4 + 1;
		}
		if(associationObjsList[i].item.isSelf==true||associationObjsList[i].item.isSelf=='true'){
			selfStatu = associationObjsList[i].status;
		}
	}
	sysStateData[0] = ["未知","故障","性能","正常"];
	sysStateData[1] = [objLen1,objLen2,objLen3,objLen4];
	sysStateData[2] = ["#969593","#e74c3c","#ffb933","#64cc34"];
	sysStateData[3] = selfStatu;
	return sysStateData;
}
/**
 * 组件状态提示 ,右上第三个悬浮框内的文字处理
 */
function initComStateTip(id)
{
	//初始化一条数据
	// showOneNodeStatus(id);

	//初始化一条数据
	var id = "";
	if(obj instanceof Object )
		id = obj.id;
	else
		id = obj;
	var str = getAssociationObjsDes(id,0);
	//没配置监控器
//	if(obj instanceof Object){
//		if(		obj.monitor == null || 
//				obj.monitor.entry ==null || 
//				obj.monitor.entry == undefined || 
//				obj.monitor.entry.id == "" || 
//				obj.monitor.entry.id == undefined){
//			//隐藏系统健康度提示
//			$(document.getElementById('systemhealth')).hide();
//		}
//		else{
//			$(document.getElementById('systemhealth')).show();
//		}
//	}
	$(document.getElementById('com-state-tips')).html(str);

	if(obj.monitor && obj.monitor.entry && obj.monitor.entry.id){
		
	}
}
/**
 * 组件列表展示
 */

function initComShow()
{
	var _div = $(document.getElementById('com-show-tips'));
	$(_div).html("");
	for(var i=0;i<associationObjsList.length;i++)
	{
		if(associationObjsList[i].item.isSelf == true|| associationObjsList[i].item.isSelf == 'true')continue;
		var imgUrl = "/img/topo/new/health/normal.svg";
		/**
		-1: 未知
		0 : 故障
		1 : 性能
		2 : 正常
		 */
		if(associationObjsList[i].status == -1)
		{
			imgUrl = "/img/topo/new/health/unknown.svg";
		}
		else if(associationObjsList[i].status == 0)
		{
			imgUrl = "/img/topo/new/health/fault.svg";
		}
		else if(associationObjsList[i].status == 1)
		{
			imgUrl = "/img/topo/new/health/perf.svg";
		}
		var tr = $(	'<tr class="um-grid-head-tr" style="border-top-style: none;">'+
				'<td style="padding: 6px 0px;padding-left:33px;background-image:url('+imgUrl+');background-repeat:no-repeat;background-position: 7px 7px;background-size: 21px 16px;">'+
				'<div style="color: white;font-size: 12px;text-align:left;">'+
				// '<img src="'+imgUrl+'" height="16px" width="21px" style="top:-1px;padding-right:5px;"></img>'+
				'<span class="custom-down" data-id="sort"></span>'+associationObjsList[i].name+
				'<span class="resize" data-id="resize_span"></span></div></td>'+
				'<td style="padding: 6px 0px;text-align:center;">'+
				'<div style="color: white;font-size: 12px;">'+
				'<span class="custom-down" data-id="sort"></span>'+getNameByType(associationObjsList[i].type)+'<span class="resize" data-id="resize_span"></span></div></td>'+
				'</tr>');
		$(tr).hover(function(){
		    $(this).css("background-color","rgb(28,33,36)");
		},function(){
		    $(this).css("background-color","");
		});
		$(_div).append(tr);
	}
}
function getNameByType(type){
	for(var i=0;i<toolsLable.appsystem.length;i++){
		if(type == toolsLable.appsystem[i][1]){
			return toolsLable.appsystem[i][0];
		}
	}
}
/**
 * 初始化状态，当初始化完所有状态
 */
var objLength = 0;

function setAssociationObjsState(id,status)
{
	objLength = objLength+1;
	for(var index=0;index<associationObjsList.length;index++)
	{
		if(associationObjsList[index].id == id)
		{
			associationObjsList[index].status = status;
			associationObjsList[index].init = true;
		}
		else if(associationObjsList[index].init != true){
			associationObjsList[index].status = -1;
		}
	}
	if(objLength>=totleMonitorNum)
	{
		objLength = 0;
		if(nodeFunction.nodeIsHidden(associationObjsList[0].item) == true && associationObjsList.length>1)
			_showData(associationObjsList[1].id);
		else
			_showData(associationObjsList[0].id);
	}
}

function initStatus(node){
	/**
		-1: 未知
		0 : 故障
		1 : 性能
		2 : 正常
	*/
	um_ajax_get({
		url : url.statusUrl + "?id="+node.id+"&compType="+node.compType+"&compId="+node.compId+"&assetId="+node.compType+"&dbId="+node.dbId+"&appId="+node.id,
		isLoad : false,
		successCallBack : function (data){
			var jsonObj = json2xml.xml_str2json(data);
			node.myTopoStyle = true;
			node.healthlevel = jsonObj.root.item.status;
			if(jsonObj.root.item.status==0){
				faultNum++;
			}
			//每次初始化都调用此函数设置状态
			setAssociationObjsState(jsonObj.root.item.id,jsonObj.root.item.status);
			
		},
		failCallBack:function(data){
			node.myTopoStyle = true;
		}
	})
}


var _itemToNodeTimer = null;
var _item = null;
var _root2 = null;
function itemToNodeTimerSetParam(item,dependence,scene,root){
	_item = item;
	_root2 = root;
}
//绘制应用监控结构
function itemToNodeTimer(){
	var flag = false;
	for(var i=0;i<_item.length;i++)
	{
		var compId = _item[i].compId;
		if(compId != "" && _item[i].isQuery != true)//_item[i].myTopoStyle == undefined && 
		{
			initStatus(_item[i]);//请求设置状态 所有状态都获取到之后才绘制和状态有关的显示项
			_item[i].isQuery = true;
		}
		else if(_item[i].isQuery != true){
			_item[i].healthlevel = -1;
			_item[i].myTopoStyle = true;
		}
			
		if(_item[i].imgurl == undefined && compId!=""&&compId!=undefined)
		{
			flag = true;
			itemToNodeCheck(_item[i]);
		}
		//说明没执行完
		if(_item[i].myTopoStyle != true){
			flag = true;
		}
	}
	if(flag == true)
	{
		_itemToNodeTimer = setTimeout(itemToNodeTimer, 1000);
	}
	else
	{
		if(_itemToNodeTimer!=null)
			clearTimeout(_itemToNodeTimer);
		
		_itemToNodeTimer = null;

		// nodeFunction.getNodeEntry().rootObj = _root2;
		//状态初始化完成后再画
		nodeFunction.doinitPanelData(_root2);
		//开启报警闪烁
		// nodeFactory._group.openAlarm(0);
	}
}
//检查静态资源
function itemToNodeCheck(item){
	var imagesPath = "flash/appmonitor/assets/selectBar/common/";
	var imgurl = "";
	var compId = item.compId;
	var compType = item.compType;
	if(compId!=""&&compId!=undefined)
	{
		//检查对应的监控器图片资源是否存在
		var prepath = nodeFunction.getNodeEntry().customMonitorImgePath;
		var suffix = nodeFunction.getNodeEntry().imgsuffix;
		imgurl = prepath + item.compTypeC + suffix;
		if (imgurl !== '') {
	        // 设置Ajax请求超时时间为100ms钟
	        $.ajax(imgurl, {
	            type: 'get',
	            // timeout: 300,
	            success: function() {
	            	item.imgurl = imgurl;
	            },
	            error: function() {
	            	imgurl = imagesPath + compType + ".svg";
	            	item.imgurl = imgurl;
	            	
	            }
	        });
	    }
	}
	else
	{
		imgurl = imagesPath + compType + ".svg";
		item.imgurl = imgurl;
	}
}
function hideMonitorMes(obj){
	//先查监控器
	var compId = obj.node.monitor || obj.node.monitor.id || obj.node.monitor.entry.id;
	if(compId == "" || compId == undefined)
		return;
	$("#monitor_baseinfo").hide();
}
function createMonitorTr(name,v){
	return $(	'<tr class="um-grid-head-tr" style="border-top-style: none;">'+
			'<td style="padding: 6px 0px;padding-left:5px;background-repeat:no-repeat;background-position: 7px 7px;background-size: 21px 16px;width:120px;">'+
			'<div style="color: white;font-size: 12px;text-align:right;">'+
			'<span class="custom-down" data-id="sort"></span>'+name+
			'<span class="resize" data-id="resize_span"></span></div></td>'+
			'<td style="padding: 6px 0px;text-align:center;">'+
			'<div style="color: white;font-size: 12px;text-align:left;">'+
			'<span class="custom-down" data-id="sort"></span>'+v+'<span class="resize" data-id="resize_span"></span></div></td>'+
			'</tr>');
}
function showMonitorMes(obj){
	//先查监控器
	var compId = obj.node.monitor.id;
	if(compId == "" || compId == undefined)
		return;
	um_ajax_get({
		url : "/monitorView/queryMonitorInfoByMonitorId",
		paramObj : {monitorId : compId},
		isLoad : false,
		successCallBack : function (_data){
//			$("#base_info_monitor_div").umDataBind("render" ,_data);
			$("#monitor_baseinfo").css({
				top: obj.event.pageY+20,
				left: obj.event.pageX+20
			}).show().focus().blur(function (){
				$(this).hide();
			});
			$("#showmonitorData").html("");

			um_ajax_get({
		        url : "monitorView/queryMonitorStatus",
		        paramObj : {monitorId : _data.monitorId,type : _data.monitorType,direction : 0},
		        isLoad : false,
		        successCallBack : function (data){
//		        	$("#container_menu").umDataBind("render" ,data);
					var tr = createMonitorTr("IP：",data.ipvAddress);
					$("#showmonitorData").append(tr);
					tr = createMonitorTr("监控器名称：",_data.monitorName);
					$("#showmonitorData").append(tr);
					tr = createMonitorTr("监控器类型：",_data.monitorType);
					$("#showmonitorData").append(tr);
					tr = createMonitorTr("被监控资产名称：",_data.edName);
					$("#showmonitorData").append(tr);
		        }
		    });
		}
		
	});

}



/**
 * 
 */
function showOneNodeStatus(obj){
	//初始化一条数据
	var id = "";
	if(obj instanceof Object )
		id = obj.id;
	else
		id = obj;
	var str = getAssociationObjsDes(id,0);
	//没配置监控器
//	if(obj instanceof Object){
//		if(		obj.monitor == null || 
//				obj.monitor.entry ==null || 
//				obj.monitor.entry == undefined || 
//				obj.monitor.entry.id == "" || 
//				obj.monitor.entry.id == undefined){
//			//隐藏系统健康度提示
//			$(document.getElementById('systemhealth')).hide();
//		}
//		else{
//			$(document.getElementById('systemhealth')).show();
//		}
//	}
	$(document.getElementById('com-state-tips')).html(str);
	
	// um_ajax_get({
	// 	url : "/monitorView/queryMonitorBaseInfoTotal",
	// 	paramObj : {monitorId : obj.monitor.id,instStatus : 1},
	// 	isLoad : false,
	// 	successCallBack : function (data){
	// 		console.log(data);
	// 	}
	// });
}
function showDBClickUrl(obj){
	//初始化一条数据
	var compId = "";
	if(obj instanceof Object )
		compId = obj.monitor.id;
	else
		compId = obj;
	
	if(obj.monitor == undefined || obj.monitor ==null || obj.monitor.id == undefined || obj.monitor.id == null){
		g_dialog.operateAlert(null,"未绑定监控器","error");
		return;
	}
	if(obj.type == "appSystem"){
		window.open("#/monitor_info/app_monitor_topo1?appId="+compId+"&hideMenu=1");
		return;
	}
	//没配置监控器
//	if(obj instanceof Object){
//		if(		obj.monitor == null || 
//				obj.monitor.entry ==null || 
//				obj.monitor.entry == undefined || 
//				obj.monitor.entry.id == "" || 
//				obj.monitor.entry.id == undefined){
//			g_dialog.operateAlert($(document.getElementById('systemhealth')), "节点未配置监控器", "error");
//			return;
//		}
//	}
	var url = '#/monitor_info/monitor_obj/monitor_info?monitorTypeId='+""+'&monitorId='+compId+'&regionId=&assetId='+""+'&hideMenu=1&queryByMonitor=1';
    window.open(url);
}
/**
 * 通过ID获取存储的object
 */
function getAssociationObjs(id)
{
	for(var i=0;i<associationObjsList.length;i++)
	{
		if(associationObjsList[i].id == id)
			return associationObjsList[i];
	}
	return null;
	
}
/**
 * 为每个对象创建描述
 */
function getAssociationObjsDes(id,deep)
{
	var assObj = getAssociationObjs(id);
	if(assObj == null || assObj.type == "or")
		return "";
	var str = "";
	var strnbsp = "";
	var assIds = assObj.aid;
	for(var i = 0; i<deep;i++)
	{
		strnbsp  = strnbsp + "&nbsp;&nbsp;&nbsp;&nbsp;";
	}
	if (assObj.status == -1) {
		if(deep<=0)
		{
			str = str+"<p>【"+assObj.name+"】当前状态：未知</p>";
		}
		else
		{
			str = str+"<p>"+strnbsp+"根本原因：关键依赖 ["+assObj.name+"] 状态未知。</p>";
		}
	}
	else if(assObj.status == 0){
		if(deep<=0)
		{
			str = str+"<p>【"+assObj.name+"】当前状态：故障</p>";
		}
		else
		{
			str = str+"<p>"+strnbsp+"根本原因：关键依赖 ["+assObj.name+"] 发生了故障事件。</p>";
		}
	}
	else if(assObj.status ==1){
		if(deep<=0)
		{
			str = str+"<p>【"+assObj.name+"】当前状态：发生了性能事件</p>";
		}
		else
		{
			str = str+"<p>"+strnbsp+"根本原因：关键依赖 ["+assObj.name+"] 发生了性能事件。</p>";
		}
	}
	else if(assObj.status == 2){
		if(deep<=0)
		{
			str = str+"<p>【"+assObj.name+"】当前状态：良好</p>";
		}
		else
		{
			str = str+"<p>"+strnbsp+"关键依赖：["+assObj.name+"] 状态良好。</p>";
		}
	}
	if(assIds.length > 0)
	{
		deep = deep+1;
		for(var i=0;i<assIds.length;i++)
		{
			str = str + getAssociationObjsDes(assIds[i],deep);
		}
	}
	return str;
}



         });
});