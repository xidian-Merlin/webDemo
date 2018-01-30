$(document).ready(function (){
	require(['js/plugin/asset/asset.js',
			 '/js/plugin/timepicker/timepicker.js',
			 '/js/plugin/inputdrop/inputdrop.js',
			 '/js/plugin/FlexoCalendar/FlexoCalendar.js'] ,function (asset,timepicker,inputdrop,FlexoCalendar){
view_init();
event_init();

var current_flag;
var current_para;

var report_url = "Report/getReport";


function view_init()
{
	//index_form_init($("#report_div"));
}

function event_init()
{
	$("[data-type=riskCurrent]").click(function(){
		riskCurrent_init($(this));
	});

	$("[data-type=event]").click(function(){
		eventTpl_init($(this));
	});

	$("[data-type=difTime]").click(function(){
		difTime_init($(this));
	});

	$("[data-type=sameTime]").click(function(){
		sameTime_init($(this));
	});

	$("[data-type=assetCount]").click(function(){
		assetCount_init($(this));
	});

	$("[data-type=workOrder]").click(function(){
		workOrder_init($(this));
	});

	$("[data-type=securityEvent]").click(function(){
		securityEvent_init($(this));
	});

	$("[data-type=repo]").click(function(){
		vulnerEvent_init($(this));
	});

	$("#rbb").click(function(){
		dayReportTpl_init();
	});

	$("#zbb").click(function(){
		weekReportTpl_init();
	});

	$("#ybb").click(function(){
		monthReportTpl_init();
	});

	$("#jdbb").click(function(){
		quarterReportTpl_init();
	});

	$("#nbb").click(function(){
		yearReportTpl_init();
	});

	$("#acxxtj").click(function (){
		current_flag = "AssetInfoStats";
		current_para = undefined;
		um_ajax_post({
			url : "Report/getReport",
			paramObj : {flag : "AssetInfoStats"},
			successCallBack : reportSuccessCallBack
		});
	});

	$("#close_btn").click(function (){
		$("#report_detail_div").hide();
		$("#report_div").show();
		current_flag = undefined;
		current_para = undefined;
	});

	$("#export_ul").find("li[data-id]").click(function (){
		window.location.href = index_web_app + "Report/exportReport?flag="+current_flag+"&exportType="+$(this).attr("data-id")+"&para='"+JSON.stringify(current_para)+"'";
	});
}

function reportSuccessCallBack(data){
	g_dialog.operateAlert();
	g_dialog.hide($(".umDialog"));
	$("#report_div").hide();
	$("#report_detail_show_div").html(data);
	$("#report_detail_div").show();
	$("#content_div").scrollTop(0);
}

function filterCallback(saveObj,selfEl,el){
	if(saveObj.securityDomain) saveObj.securityDomainId = saveObj.securityDomain;
	if(saveObj.bussinessDomain) saveObj.bussinessSystemId = saveObj.bussinessDomain;
	if(saveObj.assetType) saveObj.assetTypeId = saveObj.assetType;
	if(saveObj.ipRadioStatus) saveObj.mainIpType = saveObj.ipRadioStatus;
	if(saveObj.ipRadioStatusStartIp) saveObj.startIp = saveObj.ipRadioStatusStartIp;
	if(saveObj.ipRadioStatusEndIp) saveObj.endIp = saveObj.ipRadioStatusEndIp;
	if(saveObj.ipRadioStatusIpv6) saveObj.mainIp = saveObj.ipRadioStatusIpv6;
	um_ajax_get({
		url : "asset/queryAsset",
		maskObj : el,
		paramObj : saveObj,
		successCallBack : function (data){
			var selectData = new Array();
			
			console.log(selfEl);
			selfEl.find("option").remove();

			for(var i=0;i<data.length;i++){
				data[i].id = data[i].edId;
				data[i].text = data[i].assetName;
				selfEl.append('<option value="'+data[i].id+'">'+data[i].text+'</option>');
			}
			selfEl.trigger("change");

			// selfEl.select2({
			// 	data : data,
			// 	width : "100%"
			// });
		}
	});
}


//日期转换：格式 yyyymmddhhMMss
function dateToInt(date){
	var year = date.substr(0,4);
	var month = date.substr(5,2);
	var day = date.substr(8,2);
	var hour = date.substr(11,2);
	var minute = date.substr(14,2);
	var second = date.substr(17,2);
	var dateStr = year+month+day+hour+minute+second;	
	return dateStr;
	
	
}
//求日期差
function daysBetween(startDate,endDate){
	var date1 = dateToInt(startDate);
	var date2 = dateToInt(endDate);
	var dayNum = date2-date1;
	return dayNum;
};


function riskCurrent_init(aEl)
{

	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=riskCurrent_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var el_security = el.find("[id=security]");
		var el_bussiness = el.find("[id=bussiness]");
		var el_asset = el.find("[id=asset]");
		if(aEl.attr("id") == "allZoneRisk")
		{
			el_security.remove();
			el_bussiness.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "securityDomainRisk")
		{
			el_bussiness.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "businessRisk")
		{
			el_security.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "assetRisk")
		{
			el_security.remove();
			el_bussiness.remove();
			el.find("[id=query_btn]").click(function(){
			 	asset.queryDialog({
			 		saveclick : filterCallback,
			 		selfEl : el.find("[data-id=asset]")
			 	});
			});
		}
		
		if(el.find("[id=securityDomain]").size() != 0)
		{
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]"), enableChk : false });
		}
		if(el.find("[id=bussinessDomain]").size() != 0)
		{
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]"), enableChk : false });
		}

		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:mm:ss'); 
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss'); 
		el.find("[data-id=startDate]").val(lastday);
		el.find("[data-id=endDate]").val(today);
		g_validate.init(el);
	}

	function initAfter(el)
	{
		if(aEl.attr("id") == "assetRisk")
		{
			um_ajax_get({
				url : "asset/queryAsset",
				maskObj : el,
				paramObj : null,
				successCallBack : function (data){
					var selectData = new Array();
					for(var i=0;i<data.length;i++){
						data[i].id = data[i].edId;
						data[i].text = data[i].assetName;
					}
					el.find("[data-id=asset]").select2({
						data : data,
						width : "100%"
					})
				}
			});
		}
	}

	function save_click(el,saveObj)
	{
		if(!g_validate.validate(el)){
			return false;
		}
		if(el.find("[data-id=startDate]").val()>=el.find("[data-id=endDate]").val()){
			g_dialog.operateAlert(el,"开始时间应小于结束时间","error");
			return false;
		}
		var startDate = saveObj.startDate;
		var endDate = saveObj.endDate;
		if(aEl.attr("id") == "allZoneRisk"){
			//计算日期差
			var dayNum = daysBetween(startDate,endDate);
			var flagTime;
			if(dayNum<=1000000){
				flagTime='0';
			}else{
				flagTime='1';
			}
			saveObj.m_flag = flagTime;
		}else if(aEl.attr("id") == "securityDomainRisk"){
			saveObj.domainName = inputdrop.getText(el.find("#securityDomain"));
			saveObj.domaId = saveObj.securityDomain;
			var dayNum = daysBetween(startDate,endDate);
			var m_flag ;
			if (dayNum<=1000000){
				m_flag = "0";
			}else{
				m_flag = "1";
			}
			saveObj.m_flag = m_flag;
		}else if(aEl.attr("id") == "businessRisk"){
			saveObj.domainName = inputdrop.getText(el.find("#bussinessDomain"));
			saveObj.domaId = saveObj.bussinessDomain;
			var dayNum = daysBetween(startDate,endDate);
			var m_flag ;
			if (dayNum<=1000000){
				m_flag = "0";
			}else{
				m_flag = "1";
			}
			saveObj.m_flag = m_flag;
		}else if(aEl.attr("id") == "assetRisk"){
			var assetId = el.find("[data-id=asset]").val();
			var assetName = el.find("[data-id=asset]").select2("data");
			saveObj.assetId = assetId;
			saveObj.assetName = assetName;
			//计算日期差
			var dayNum = daysBetween(startDate,endDate);
			var m_flag ;
			if (dayNum<=1000000){
				m_flag = "0";
			}else{
				m_flag = "1";
			}
			saveObj.m_flag = m_flag;
		}
		var  flag ;
		flag = aEl.prop("id");
		current_flag = flag;
		current_para = saveObj;
		um_ajax_post({
			url : report_url,
			paramObj : { "para" : saveObj , flag : flag },
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

function difTime_init(aEl)
{
	var el_startIp = $("[data-id=startIp]");
	var el_endIp = $("[data-id=endIp]");
	var el_ipv6 = $("[data-id=ipv6]");
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=difTime_template]"),{
				width:"500px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var el_security = el.find("[id=security]");
		var el_bussiness = el.find("[id=bussiness]");
		var el_asset = el.find("[id=asset]");

		if(aEl.attr("id") == "sameSecurityDomainComp")
		{
			el_bussiness.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "sameBusinessDomainComp")
		{
			el_security.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "sameAssetComp")
		{
			el_security.remove();
			el_bussiness.remove();
			el.find("[id=query_btn]").click(function(){
			 	asset.queryDialog({
			 		saveclick : filterCallback,
			 		selfEl : el.find("[data-id=asset]")
			 	});
			});
		}
		else if(aEl.attr("id") == "sameBusinessSysComp"){//同业务域比较

		}

		if(el.find("[id=securityDomain]").size() != 0)
		{
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]") , enableChk : false });
		}
		if(el.find("[id=bussinessDomain]").size() != 0)
		{
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]") , enableChk : false });
		}

		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:00:00'); 
		var today = g_moment().format('YYYY-MM-DD HH:00:00'); 
		el.find("[data-id=timeOne]").val(lastday);
		el.find("[data-id=timeTwo]").val(today);
		g_validate.init(el);
	}

	function initAfter(el)
	{
		if(aEl.attr("id") == "sameAssetComp")
		{
			um_ajax_get({
				url : "asset/queryAsset",
				maskObj : el,
				paramObj : null,
				successCallBack : function (data){
					var selectData = new Array();
					for(var i=0;i<data.length;i++){
						data[i].id = data[i].edId;
						data[i].text = data[i].assetName;
					}
					el.find("[data-id=asset]").select2({
						data : data,
						width : "100%"
					})
				}
			});
		}
	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		if(saveObj.timeOne==saveObj.timeTwo){
			g_dialog.operateAlert(el,"对比时间不能相同！","error");
			return ;
		}
		saveObj.compareDate1 = saveObj.timeOne;
		saveObj.compareDate2 = saveObj.timeTwo;
		if(aEl.attr("id") == "sameSecurityDomainComp"){
			saveObj.domainName = inputdrop.getText(el.find("#securityDomain"));
			saveObj.domaId = saveObj.securityDomain;
		}else if(aEl.attr("id") == "sameBusinessDomainComp"){
			saveObj.domainName = inputdrop.getText(el.find("#bussinessDomain"));
			saveObj.domaId = saveObj.bussinessDomain;
		}else if(aEl.attr("id") == "sameAssetComp"){
			var assetEl = el.find("[data-id=asset]");
	 		var assetText = assetEl.select2("data");
	 		var assetId = assetEl.val();
	 		assetText = replaceComma(assetText);
			saveObj.assetId = assetId;
			saveObj.assetName = assetText;
		}else if(aEl.attr("id") == "sameBusinessSysComp"){
			saveObj.domainName = inputdrop.getText(el.find("#securityDomain"));
			saveObj.domaId = saveObj.securityDomain;
		}
		var  flag ;
 		flag = aEl.prop("id");
	 	current_flag = flag;
	 	current_para = saveObj;
	 	um_ajax_post({
	 		url : report_url,
	 		paramObj : { "para" : saveObj , flag : flag },
	 		maskObj : el,
	 		successCallBack : reportSuccessCallBack
	 	});
	}	
}

function eventTpl_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=event_template]"),{
				width:"700px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});
	var authority;

	function init(el)
	{
		
		if(aEl.attr("id") != "faultReport" && aEl.attr("id") != "perfReport")
		{
			el.find("[id=asset]").remove();
			el.find("[id=eventLevel]").remove();
		}

		var el_startIp = el.find("[data-id=startIp]");
		var el_endIp = el.find("[data-id=endIp]");
		var el_ipv6 = el.find("[data-id=ipv]");
		el.find("[name=ipType]").click(function(){
			if($(this).val() == "1")
			{
				el_startIp.removeAttr("disabled");
				el_endIp.removeAttr("disabled");
				el_ipv6.attr("disabled","disabled");
				el_ipv6.val("");
				g_validate.clear([el_ipv6]);
			}
			else
			{
				el_startIp.attr("disabled","disabled");
				el_endIp.attr("disabled","disabled");
				el_ipv6.removeAttr("disabled");
				el_startIp.val("");
				el_endIp.val("");
				g_validate.clear([el_startIp ,el_endIp]);
			}
		});

		el.find("[name=domainType]").click(function(){
			if($(this).val() == 1)
			{
				var otherEl = el.find("#bussinessDomain");
				var theEl = el.find("#securityDomain");
				inputdrop.clearSelect(otherEl);
				inputdrop.setDisable(otherEl)
				inputdrop.setEnable(theEl);

			}
			else
			{
				var otherEl = el.find("#securityDomain");
				var theEl = el.find("#bussinessDomain");
				inputdrop.clearSelect(otherEl);
				inputdrop.setDisable(otherEl)
				inputdrop.setEnable(theEl);
			}
		});

			
		
		if(el.find("[id=securityDomain]").size() != 0)
		{
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]"), enableChk : true });
			inputdrop.setEnable(el.find("[id=securityDomain]"));
		}
		if(el.find("[id=bussinessDomain]").size() != 0)
		{
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]"), enableChk : true });
			inputdrop.setDisable(el.find("[id=bussinessDomain]"));
		}
		if(el.find("[id=assetType]").size() != 0)
		{
			g_formel.sec_biz_render({assetTypeEl:el.find("[id=assetType]"), enableChk : true  , required : true});
		}

		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:mm:ss'); 
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss'); 
		el.find("[data-id=startDate]").val(lastday);
		el.find("[data-id=endDate]").val(today);

		var searchEl = el.find("[data-id=eventType]");
		var isMultiple = searchEl.attr("multiple");
		isMultiple = !!isMultiple;
		if(aEl.prop("id").toLowerCase().indexOf("deploy")!=-1){
			g_formel.code_list_render({
	   	   		key : "deplclass",
	   	   		isMultiple : isMultiple,
	   	   		deployEventTypeEl : searchEl
	   	    });
		}else if(aEl.prop("id").toLowerCase().indexOf("fault")!=-1){
			g_formel.code_list_render({
	   	   		key : "faultclass",
	   	   		isMultiple : isMultiple,
	   	   		faultEventTypeEl : searchEl
	   	    });
		}else if(aEl.prop("id").toLowerCase().indexOf("perf")!=-1){
			g_formel.code_list_render({
	   	   		key : "perfclass",
	   	   		isMultiple : isMultiple,
	   	   		performEventTypeEl : searchEl
	   	    });
		}
		g_validate.init(el);
	}

	function initAfter(el)
	{
		param_init();

		function param_init(){
			um_ajax_get({
				url : "queryAppBackConfigOption",
				paramObj : {key : "securitydomain.authority"},
				maskObj : el,
				successCallBack : function (data){
					authority = data["securitydomain.authority"];
				}
			})
		}
	}

	function save_click(el,saveObj)
	{
		var el_startIp = el.find("[data-id=startIp]");
		var el_endIp = el.find("[data-id=endIp]");
		if(!g_validate.validate(el)||!g_validate.ipValidate(el_startIp ,el_endIp))
		{
			return false;
		}
		if(el.find("[data-id=startDate]").val()>=el.find("[data-id=endDate]").val()){
			g_dialog.operateAlert(el,"开始时间应小于结束时间","error");
			return false;
		}

		if(aEl.prop("id").toLowerCase().indexOf("deploy")!=-1){
			saveObj = formatDeploySaveObj(el,saveObj);
		}else if(aEl.prop("id").toLowerCase().indexOf("fault")!=-1){
			saveObj = formatFaultSaveObj(el,saveObj);
		}else if(aEl.prop("id").toLowerCase().indexOf("perf")!=-1){
			saveObj = formatPreformSaveObj(el,saveObj);
		}
	}
	function formatDeploySaveObj(el,saveObj){
		var  eventName = saveObj.eventName;
		var defaultEventName;
	 	//事件名称为空，报表中查询项则默认显示'----'
	 	if(eventName==""||eventName==null) {
	 		defaultEventName = '---';
	 	} else {		
	 		defaultEventName = eventName;
	 	}
	 	saveObj.defaultEventName = defaultEventName;

	 	var eventTypeEl = el.find("[data-id=eventType]");
	 	var eventType = eventTypeEl.select2("data");
	 	var eventTypeId = eventTypeEl.val();

	 	if(eventType==""||eventType==null){
	 		// eventType = getOptionTextList(eventTypeEl);
	 		eventType = "全部";
	 	}
	 	eventType = replaceComma(eventType);

	 	if(eventTypeId == null || eventTypeId==""){
	    	eventTypeId = getOptionValueList(eventTypeEl);
	    }

	 	saveObj.eventType = eventType;
	 	saveObj.eventTypeId = eventTypeId;

	 	var deplStatusEl = el.find("[data-id=eventStatus]")
	 	var deplStatusText = deplStatusEl.select2("data");
	 	var deplStatusValue = deplStatusEl.val();

	 	if(deplStatusText==""||deplStatusText==null) {
    		// deplStatusText = getOptionTextList(deplStatusEl);
    		deplStatusText = "全部";
	    }
	    deplStatusText = replaceComma(deplStatusText);

	    if(deplStatusValue == null || deplStatusValue==""){
	    	deplStatusValue = getOptionValueList(deplStatusEl);
	    }

	    saveObj.deplStatusText = deplStatusText;
	    saveObj.deplStatusValue = deplStatusValue;
	    //资产IP范围
	 	var assetsIP;
		/* 改造IP查询规则:
  		 * 1.只输入起始IPV4 不输入终止IPV4，按IPV4=‘起始IPV4’精确查询 
  	     * 2.只输入终止IPV4 不输入起始IPV4，按IPV4=‘终止IPV4’精确查询 
  	     * 3.即输入起始IPV4 又输入终止IPV4，按‘IPV4 大于起始IPV4 且小于IPV4终止’查询 
  	     * 4.原IPV6查询规则不变 按输入IPV6 精确查询
  	    */
  	    var assetsIpv = saveObj.ipv;
  	    var assetsStartIP = saveObj.startIp;
  	    var assetsEndIP = saveObj.endIp;
  	    saveObj.mainIp = saveObj.ipv;
	 	if(assetsIpv == ""||assetsIpv == null){
	 		if(assetsStartIP == "" && assetsEndIP != ""){
	 			assetsIP = assetsEndIP;
	 			saveObj.startIp = saveObj.endIp;
	 		}else if(assetsStartIP != "" && assetsEndIP == ""){
	 			assetsIP = assetsStartIP;
	 			saveObj.endIp = saveObj.startIp;
	 		}else if(assetsStartIP != "" && assetsEndIP != ""){
	 			assetsIP = assetsStartIP+"-"+assetsEndIP;
	 		}else{
	 			assetsIP = "全部";	
	 		}
	 		
	 	}else{
	 		assetsIP = assetsIpv;
	 	}
	 	saveObj.assetsIP = assetsIP;

	 	if(!!saveObj.securityDomain){
	 		saveObj.securityDomain = valueToList(saveObj.securityDomain);
	 	}
	 	if(!!saveObj.bussinessDomain){
	 		saveObj.bussinessDomain = valueToList(saveObj.bussinessDomain);
	 	}
	 	//处理不填ip情况的问题进行的修改
	 	if(!saveObj.mainIp&&!saveObj.startIp&&!saveObj.endIp){
	 		saveObj.conStr = '1';
	 	}else {
	 		saveObj.conStr = '0';
	 	}

	 	var  flag ;
	 	// authority=1;
	 	if(authority==1){
	 		if(aEl.prop("id")=="faultReport"){
	 			flag = "faultAddReport";
	 		}else {
	 			flag = aEl.prop("id") + "Add";
	 		}
	 	}else{
	 		flag = aEl.prop("id");
	 	}
	 	// alert(flag);
	 	current_flag = flag;
	 	current_para = saveObj;
	 	um_ajax_post({
	 		url : report_url,
	 		paramObj : { "para" : saveObj , flag : flag },
	 		maskObj : el,
	 		successCallBack : reportSuccessCallBack
	 	});

	 	return saveObj;
	}
	function formatFaultSaveObj(el,saveObj){
		var  eventName = saveObj.eventName;
		var defaultFailureName;
	 	//事件名称为空，报表中查询项则默认显示'----'
	 	if(eventName==""||eventName==null) {
	 		defaultFailureName = '---';
	 	} else {		
	 		defaultFailureName = eventName;
	 	}
	 	saveObj.defaultFailureName = defaultFailureName;
	 	saveObj.failureName = eventName;

	 	var eventTypeEl = el.find("[data-id=eventType]");
	 	var eventType = eventTypeEl.select2("data");
	 	var eventTypeId = eventTypeEl.val();

	 	if(eventType==""||eventType==null){
	 		// eventType = getOptionTextList(eventTypeEl);
	 		eventType = "全部";
	 	}
	 	eventType = replaceComma(eventType);

	 	if(eventTypeId == null || eventTypeId==""){
	    	eventTypeId = getOptionValueList(eventTypeEl);
	    }

	 	saveObj.failureClassText = eventType;
	 	saveObj.failureClassValue = eventTypeId;


	 	var eventStatusEl = el.find("[data-id=eventStatus]")
	 	var eventStatusText = eventStatusEl.select2("data");
	 	var eventStatusValue = eventStatusEl.val();

	 	if(eventStatusText==""||eventStatusText==null) {
    		// eventStatusText = getOptionTextList(eventStatusEl);
    		eventStatusText = "全部";
	    }
	    eventStatusText = replaceComma(eventStatusText);

	    if(eventStatusValue == null || eventStatusValue==""){
	    	eventStatusValue = getOptionValueList(eventStatusEl);
	    }

	    saveObj.faultStatusText = eventStatusText;
	    saveObj.faultStatusValue = eventStatusValue;

	    var eventLevelEl = el.find("[data-id=eventLevel]");
	    var eventLevelText = eventLevelEl.select2("data");
	 	var eventLevelValue = eventLevelEl.val();

	 	if(eventLevelText==""||eventLevelText==null) {
    		// eventLevelText = getOptionTextList(eventLevelEl);
    		eventLevelText = "全部";
	    }
	    eventLevelText = replaceComma(eventLevelText);

	 	saveObj.levelName = eventLevelText;

	 	//设置后台vo属性
	 	// saveObj.eventClass = saveObj.eventType;
	 	saveObj.eventClass = el.find("[data-id=eventType]").val()?el.find("[data-id=eventType]").val().join(","):"";
	 	saveObj.ed_name = saveObj.assetName?saveObj.assetName:"---";
	 	saveObj.assetTypeId = saveObj.assetType;
	 	saveObj.mainIp = saveObj.ipv;
	 	saveObj.secDomain = inputdrop.getText(el.find("#securityDomain"))?inputdrop.getText(el.find("#securityDomain")):"全部";
	 	saveObj.busDomain = inputdrop.getText(el.find("#bussinessDomain"))?inputdrop.getText(el.find("#bussinessDomain")):"全部";
	 	saveObj.assetTypeName = inputdrop.getText(el.find("#assetType"));

	    //资产IP范围
	 	var assetsIP;
		/* 改造IP查询规则:
  		 * 1.只输入起始IPV4 不输入终止IPV4，按IPV4=‘起始IPV4’精确查询 
  	     * 2.只输入终止IPV4 不输入起始IPV4，按IPV4=‘终止IPV4’精确查询 
  	     * 3.即输入起始IPV4 又输入终止IPV4，按‘IPV4 大于起始IPV4 且小于IPV4终止’查询 
  	     * 4.原IPV6查询规则不变 按输入IPV6 精确查询
  	    */
  	    var assetsIpv = saveObj.ipv;
  	    var assetsStartIP = saveObj.startIp;
  	    var assetsEndIP = saveObj.endIp;
	 	if(assetsIpv == ""||assetsIpv == null){
	 		if(assetsStartIP == "" && assetsEndIP != ""){
	 			assetsIP = assetsEndIP;
	 			saveObj.startIp = saveObj.endIp;
	 		}else if(assetsStartIP != "" && assetsEndIP == ""){
	 			assetsIP = assetsStartIP;
	 			saveObj.endIp = saveObj.startIp;
	 		}else if(assetsStartIP != "" && assetsEndIP != ""){
	 			assetsIP = assetsStartIP+"-"+assetsEndIP;
	 		}else{
	 			assetsIP = "全部";	
	 		}
	 		
	 	}else{
	 		assetsIP = assetsIpv;
	 	}
	 	saveObj.srcIP = assetsIP;

	 	if(!saveObj.mainIp&&!saveObj.startIp&&!saveObj.endIp){
	 		saveObj.conStr = '1';
	 	}else {
	 		saveObj.conStr = '0';
	 	}

	 	var  flag ;
	 	if(authority==1){
	 		if(aEl.prop("id")=="faultReport"){
	 			flag = "faultAddReport";
	 		}else {
	 			flag = aEl.prop("id") + "Add";
	 		}
	 	}else{
	 		flag = aEl.prop("id");
	 	}
	 	current_flag = flag;
	 	current_para = saveObj;
	 	if(aEl.prop("id")== "faultReport"){
	 		var specialParam = specialParamFormat(saveObj);
		 	um_ajax_post({
		 		url : "Report/getFaultCon",
		 		paramObj : {faultStore : specialParam},
		 		successCallBack : function (data){
		 			saveObj.conStr = data.conStr;

				 	um_ajax_post({
				 		url : report_url,
				 		paramObj : { "para" : saveObj , flag : flag },
				 		maskObj : el,
				 		successCallBack : reportSuccessCallBack
				 	});
		 		}
		 	});
	 	}else {
	 		um_ajax_post({
	 			url : report_url,
	 			paramObj : { "para" : saveObj , flag : flag },
	 			maskObj : el,
	 			successCallBack : reportSuccessCallBack
	 		});
	 	}

	 	return saveObj;
	}
	function formatPreformSaveObj(el,saveObj){
		var  eventName = saveObj.eventName;
		var searchPerfName;
	 	//事件名称为空，报表中查询项则默认显示'----'
	 	if(eventName==""||eventName==null) {
	 		searchPerfName = '---';
	 	} else {		
	 		searchPerfName = eventName;
	 	}
	 	saveObj.searchPerfName = searchPerfName;
	 	saveObj.perfName = eventName;

	 	var eventTypeEl = el.find("[data-id=eventType]");
	 	var eventType = eventTypeEl.select2("data");
	 	var eventTypeId = eventTypeEl.val();

	 	if(eventType==""||eventType==null){
	 		// eventType = getOptionTextList(eventTypeEl);
	 		eventType = "全部";
	 	}
	 	eventType = replaceComma(eventType);

	 	if(eventTypeId == null || eventTypeId==""){
	    	eventTypeId = getOptionValueList(eventTypeEl);
	    }

	 	saveObj.perfClassNameText = eventType;
	 	saveObj.perfClassNameValue = eventTypeId;


	 	var eventStatusEl = el.find("[data-id=eventStatus]")
	 	var eventStatusText = eventStatusEl.select2("data");
	 	var eventStatusValue = eventStatusEl.val();

	 	if(eventStatusText==""||eventStatusText==null) {
    		// eventStatusText = getOptionTextList(eventStatusEl);
    		eventStatusText = "全部";
	    }
	    eventStatusText = replaceComma(eventStatusText);

	    if(eventStatusValue == null || eventStatusValue==""){
	    	eventStatusValue = getOptionValueList(eventStatusEl);
	    }

	    saveObj.perStatusText = eventStatusText;
	    saveObj.perStatusValue = eventStatusValue;

	    var eventLevelEl = el.find("[data-id=eventLevel]");
	    var eventLevelText = eventLevelEl.select2("data");
	 	var eventLevelValue = eventLevelEl.val();

	 	if(eventLevelText==""||eventLevelText==null) {
    		// eventLevelText = getOptionTextList(eventLevelEl);
    		eventLevelText = "全部";
	    }
	    eventLevelText = replaceComma(eventLevelText);

	 	saveObj.levelName = eventLevelText;

	 	//设置后台vo属性
	 	// saveObj.eventClass = saveObj.eventType;
	 	saveObj.eventClass = el.find("[data-id=eventType]").val()?el.find("[data-id=eventType]").val().join(","):"";
	 	saveObj.ed_name = saveObj.assetName?saveObj.assetName:"---";
	 	saveObj.assetTypeId = saveObj.assetType;
	 	saveObj.mainIp = saveObj.ipv;
	 	saveObj.secDomain = inputdrop.getText(el.find("#securityDomain"))?inputdrop.getText(el.find("#securityDomain")):"全部";
	 	saveObj.busDomain = inputdrop.getText(el.find("#bussinessDomain"))?inputdrop.getText(el.find("#bussinessDomain")):"全部";
	 	saveObj.assetTypeName = inputdrop.getText(el.find("#assetType"));

	    //资产IP范围
	 	var assetsIP;
		/* 改造IP查询规则:
  		 * 1.只输入起始IPV4 不输入终止IPV4，按IPV4=‘起始IPV4’精确查询 
  	     * 2.只输入终止IPV4 不输入起始IPV4，按IPV4=‘终止IPV4’精确查询 
  	     * 3.即输入起始IPV4 又输入终止IPV4，按‘IPV4 大于起始IPV4 且小于IPV4终止’查询 
  	     * 4.原IPV6查询规则不变 按输入IPV6 精确查询
  	    */
  	    var assetsIpv = saveObj.ipv;
  	    var assetsStartIP = saveObj.startIp;
  	    var assetsEndIP = saveObj.endIp;
	 	if(assetsIpv == ""||assetsIpv == null){
	 		if(assetsStartIP == "" && assetsEndIP != ""){
	 			assetsIP = assetsEndIP;
	 			saveObj.startIp = saveObj.endIp;
	 		}else if(assetsStartIP != "" && assetsEndIP == ""){
	 			assetsIP = assetsStartIP;
	 			saveObj.endIp = saveObj.startIp;
	 		}else if(assetsStartIP != "" && assetsEndIP != ""){
	 			assetsIP = assetsStartIP+"-"+assetsEndIP;
	 		}else{
	 			assetsIP = "全部";
	 		}
	 		
	 	}else{
	 		assetsIP = assetsIpv;
	 	}
	 	saveObj.srcIP = assetsIP;

 		if(!saveObj.mainIp&&!saveObj.startIp&&!saveObj.endIp){
 			saveObj.conStr = '1';
 		}else {
 			saveObj.conStr = '0';
 		}

	 	var  flag ;
	 	if(authority==1){
	 		if(aEl.prop("id")=="perfReport"){
	 			flag = "perfAddReport";
	 		}else {
	 			flag = aEl.prop("id") + "Add";
	 		}
	 	}else{
	 		flag = aEl.prop("id");
	 	}
	 	current_flag = flag;
	 	current_para = saveObj;
	 	if(aEl.prop("id")== "perfReport"){
	 		var specialParam = specialParamFormat(saveObj);
		 	um_ajax_post({
		 		url : "Report/getPerfCon",
		 		paramObj : {faultStore : specialParam},
		 		successCallBack : function (data){
		 			saveObj.conStr = data.conStr;

				 	um_ajax_post({
				 		url : report_url,
				 		paramObj : { "para" : saveObj , flag : flag },
				 		maskObj : el,
				 		successCallBack : reportSuccessCallBack
				 	});
		 		}
		 	});
	 	}else {
	 		um_ajax_post({
	 			url : report_url,
	 			paramObj : { "para" : saveObj , flag : flag },
	 			maskObj : el,
	 			successCallBack : reportSuccessCallBack
	 		});
	 	}

	 	return saveObj;
	}
}

// // 如果参数用于界面展示而非数据集，则需要把英文逗号替换成中文逗号
function replaceComma(paramObj){
	//查找英文逗号的简单正则
	var reg = new RegExp(",","g");
	var resultStr = "";
	var resultList = new Array();
	if((typeof paramObj)=="object"){
		for(var i=0;i<paramObj.length;i++){
			var obj = paramObj[i];
			if(obj.hasOwnProperty('text')){
				resultList.push(paramObj[i].text);
			}else {
				resultList.push(paramObj[i]);
			}
		}
 		resultStr = resultList.join(",");
 	}else if((typeof paramObj)=="string"){
 		return paramObj;
 	}else {
 		console.log(typeof paramObj);
 	}
 	resultStr =resultStr.replace(reg,"，");
 	return resultStr;
}
function getOptionTextList(el){
 	var resultList = new Array();
 	el.find("option").each(function (){
 		resultList.push($(this).text());
 	});
 	return resultList;
}
function getOptionValueList(el){
	var resultList = new  Array();
 	el.find("option").each(function (){
 		resultList.push($(this).attr("value"));
 	});
 	return resultList;
}
function valueToList(value){
	var resultList = new Array();
	var array = value.split(",");
	for(str in array){
		resultList.push(str);
	}
	return resultList;
}
function specialParamFormat(saveObj){
	console.log(saveObj)
	var returnObject = new Object();
	var keys = Object.keys(saveObj);
	for(var i=0;i<keys.length;i++){
		if((typeof saveObj[keys[i]])=="object"&&!!saveObj[keys[i]]){
			returnObject[keys[i]] = saveObj[keys[i]].join();
		}else {
			returnObject[keys[i]] = saveObj[keys[i]];
		}
	}
	return returnObject;
}

function sameTime_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=sameTime_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var el_security = el.find("[id=security]");
		var el_bussiness = el.find("[id=bussiness]");
		var el_asset = el.find("[id=asset]");
		if(aEl.attr("id") == "diffSecurityDomainComp")
		{
			el_bussiness.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "diffBusinessDomainComp")
		{
			el_security.remove();
			el_asset.remove();
		}
		else if(aEl.attr("id") == "diffBusinessSysComp"){//同业务域比较

		}
		else if(aEl.attr("id") == "diffAssetComp")
		{
			el_security.remove();
			el_bussiness.remove();
		}

		if(el.find("[data-type=securityDomain]").size() != 0)
		{
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomainOne]"), enableChk : false });
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomainTwo]"), enableChk : false });
		}
		if(el.find("[data-type=bussinessDomain]").size() != 0)
		{
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomainOne]"), enableChk : false });
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomainTwo]"), enableChk : false });
		}
		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:00:00'); 
		el.find("[data-id=time]").val(lastday);

	}

	function initAfter(el)
	{
		if(aEl.attr("id") == "diffAssetComp"){
			um_ajax_get({
				url : "asset/queryAsset",
				maskObj : el,
				successCallBack : function (data){
					var selectData = new Array();
					for(var i=0;i<data.length;i++){
						data[i].id = data[i].edId;
						data[i].text = data[i].assetName;
					}
					el.find("[data-id=assetOne]").select2({
						data : data,
						width : "100%"
					});
					el.find("[data-id=assetTwo]").select2({
						data : data,
						width : "100%"
					});
				}
			});
		}
		el.find("[id=query_btnO]").click(function(){
			asset.queryDialog({
				saveclick : filterCallback,
				selfEl : el.find("[data-id=assetOne]")
			});
		});
		el.find("[id=query_btnT]").click(function(){
			asset.queryDialog({
				saveclick : filterCallback,
				selfEl : el.find("[data-id=assetTwo]")
			});
		});
	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		saveObj.sameCompDate = saveObj.time;
		if(aEl.attr("id") == "diffSecurityDomainComp"){
			saveObj.dSecuDomaName1 = inputdrop.getText(el.find("#securityDomainOne"));
			saveObj.dSecuDomaId1 = saveObj.securityDomainOne;
			saveObj.dSecuDomaName2 = inputdrop.getText(el.find("#securityDomainTwo"));
			saveObj.dSecuDomaId2 = saveObj.securityDomainTwo;
			if(saveObj.securityDomainOne==saveObj.securityDomainTwo){
				g_dialog.operateAlert(el,"安全域不能相同！","error");
				return ;
			}
		}else if(aEl.attr("id") == "diffBusinessDomainComp"){
			saveObj.dSecuDomaName1 = inputdrop.getText(el.find("#bussinessDomainOne"));
			saveObj.dSecuDomaId1 = saveObj.bussinessDomainOne;
			saveObj.dSecuDomaName2 = inputdrop.getText(el.find("#bussinessDomainTwo"));
			saveObj.dSecuDomaId2 = saveObj.bussinessDomainTwo;
			if(saveObj.bussinessDomainOne==saveObj.bussinessDomainTwo){
				g_dialog.operateAlert(el,"业务域不能相同！","error");
				return ;
			}
		}else if(aEl.attr("id") == "diffAssetComp"){
			var assetEl1 = el.find("[data-id=assetOne]");
	 		var assetText1 = assetEl1.select2("data");
	 		var dAssetId1 = assetEl1.val();
	 		assetText1 = replaceComma(assetText1);
	 		var assetEl2 = el.find("[data-id=assetTwo]");
	 		var assetText2 = assetEl2.select2("data");
	 		var dAssetId2 = assetEl2.val();
	 		assetText2 = replaceComma(assetText2);
			saveObj.dSecuDomaId1 = dAssetId1;
			saveObj.dSecuDomaName1 = assetText1;
			saveObj.dSecuDomaId2 = dAssetId2;
			saveObj.dSecuDomaName2 = assetText2;
			if(saveObj.assetOne==saveObj.assetTwo){
				g_dialog.operateAlert(el,"资产不能相同！","error");
				return ;
			}
		}else if(aEl.attr("id") == "diffBusinessSysComp"){
			saveObj.dSecuDomaName1 = inputdrop.getText(el.find("#securityDomainOne"));
			saveObj.dSecuDomaId1 = saveObj.securityDomainOne;
			saveObj.dSecuDomaName2 = inputdrop.getText(el.find("#securityDomainTwo"));
			saveObj.dSecuDomaId2 = saveObj.securityDomainTwo;
			if(saveObj.securityDomainOne==saveObj.securityDomainTwo){
				g_dialog.operateAlert(el,"业务系统不能相同！","error");
				return ;
			}
		}
		var  flag ;
 		flag = aEl.prop("id");
	 	current_flag = flag;
	 	current_para = saveObj;
	 	um_ajax_post({
	 		url : report_url,
	 		paramObj : { "para" : saveObj , flag : flag },
	 		maskObj : el,
	 		successCallBack : reportSuccessCallBack
	 	});
	}	
}

function assetCount_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=assetCount_template]"),{
				width:"700px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var left_table = el.find("[id=left_table]");
		var right_table = el.find("[id=right_table]");

		g_grid.render(left_table,{
			url:"asset/queryAsset",
			header:[{text:'待选资产',name:"assetName"}],
			isLoad : true,
			maskObj : el,
			gridCss : "um-grid-style",
			hideSearch : true,
			paginator : false
		});

		g_grid.render(right_table,{
			url:"",
			header:[{text:'已选资产',name:"assetName"}],
			data:[],
			isLoad : true,
			maskObj : el,
			gridCss : "um-grid-style",
			hideSearch : true,
			paginator : false
		});

		el.find("[id=chevron-right]").click(function (){
			var data = g_grid.getData(left_table ,{chk:true});
			g_grid.removeData(left_table);
			g_grid.addData(right_table ,data);
		});

		el.find("[id=chevron-left]").click(function (){
			var data = g_grid.getData(right_table ,{chk:true});
			g_grid.removeData(right_table);
			g_grid.addData(left_table ,data);
		});

		$("[id=searchIcon]").click(function(){
			 asset.queryDialog({
			 	saveclick : function (saveObj){
			 		if(saveObj.securityDomain) saveObj.securityDomainId = saveObj.securityDomain;
			 		if(saveObj.bussinessDomain) saveObj.bussinessSystemId = saveObj.bussinessDomain;
			 		if(saveObj.assetType) saveObj.assetTypeId = saveObj.assetType;
			 		if(saveObj.ipRadioStatus) saveObj.mainIpType = saveObj.ipRadioStatus;
			 		if(saveObj.ipRadioStatusStartIp) saveObj.startIp = saveObj.ipRadioStatusStartIp;
			 		if(saveObj.ipRadioStatusEndIp) saveObj.endIp = saveObj.ipRadioStatusEndIp;
			 		if(saveObj.ipRadioStatusIpv6) saveObj.mainIp = saveObj.ipRadioStatusIpv6;
			 		g_grid.render(left_table,{
			 			url:"asset/queryAsset",
			 			header:[{text:'待选资产',name:"assetName"}],
			 			isLoad : true,
			 			maskObj : el,
			 			paramObj : saveObj,
			 			gridCss : "um-grid-style",
			 			hideSearch : true,
			 			paginator : false
			 		});
			 	}
			 });
		});
	}

	function initAfter(el)
	{
		
	}

	function save_click(el ,saveObj)
	{
		var save_url = "Report/getReport";
		
		if (!g_validate.validate(el))
		{
			return false;
		}
		if(g_grid.getData(el.find("[id=right_table]")).length==0){
			g_dialog.operateAlert(el,"请至少选择一条记录","error");
			return false;
		}
		var right_table = el.find("[id=right_table]");
		var assetIdArray = [];
		var data = g_grid.getData(right_table);
		for (var i = 0; i < data.length; i++) {
			assetIdArray.push(data[i].edId);
		}
		saveObj.para =  {assetIds : assetIdArray};
		saveObj.flag = $(aEl).closest("a").prop("id");
		current_flag = saveObj.flag;
		current_para = saveObj.para;
		um_ajax_post({
			url : save_url,
			paramObj : saveObj,
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

function workOrder_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=workOrder_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:mm:ss'); 
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss'); 
		el.find("[data-id=craetStartTime]").val(lastday);
		el.find("[data-id=creatEndTime]").val(today);
		el.find("[data-id=compStartTime]").val(lastday);
		el.find("[data-id=compEndTime]").val(today);
	}

	function initAfter(el)
	{

	}

	function save_click(el ,saveObj)
	{

	}
}

function securityEvent_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=securtyEvent_template]"),{
				width:"700px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var el_sourceStartIp = el.find("[id=sourceStartIp]");
		var el_sourceEndIp = el.find("[id=sourceEndIp]");
		var el_sourceIpv6 = el.find("[id=sourceIpv6]");
		var el_aimStartIp = el.find("[id=aimStartIp]");
		var el_aimEndIp = el.find("[id=aimEndIp]");
		var el_aimIpv6 = el.find("[id=aimIpv6]");
		var el_genSourceStartIp = el.find("[id=genSourceStartIp]");
		var el_genSourceEndIp = el.find("[id=genSourceEndIp]");
		var el_genSourceIpv6 = el.find("[id=genSourceIpv6]");

		el.find("[name=sourceIpType]").click(function(){
			if($(this).val() == "1")
			{
				el_sourceStartIp.removeAttr("disabled");
				el_sourceEndIp.removeAttr("disabled");
				el_sourceIpv6.attr("disabled","disabled");
				el_sourceIpv6.val("");
				g_validate.clear([el_sourceIpv6]);
			}
			else
			{
				el_sourceStartIp.attr("disabled","disabled");
				el_sourceEndIp.attr("disabled","disabled");
				el_sourceIpv6.removeAttr("disabled");
				el_sourceStartIp.val("");
				el_sourceEndIp.val("");
				g_validate.clear([el_sourceStartIp,el_sourceEndIp]);
			}
		});

		el.find("[name=aimIpType]").click(function(){
			if($(this).val() == "1")
			{
				el_aimStartIp.removeAttr("disabled");
				el_aimEndIp.removeAttr("disabled");
				el_aimIpv6.attr("disabled","disabled");
				el_aimIpv6.val("");
				g_validate.clear([el_aimIpv6]);
			}
			else
			{
				el_aimStartIp.attr("disabled","disabled");
				el_aimEndIp.attr("disabled","disabled");
				el_aimIpv6.removeAttr("disabled");
				el_aimStartIp.val("");
				el_aimEndIp.val("");
				g_validate.clear([el_aimStartIp,el_aimEndIp]);
			}
		});

		el.find("[name=genSourceIpType]").click(function(){
			if($(this).val() == "1")
			{
				el_genSourceStartIp.removeAttr("disabled");
				el_genSourceEndIp.removeAttr("disabled");
				el_genSourceIpv6.attr("disabled","disabled");
				el_genSourceIpv6.val("");
				g_validate.clear([el_genSourceIpv6]);
			}
			else
			{
				el_genSourceStartIp.attr("disabled","disabled");
				el_genSourceEndIp.attr("disabled","disabled");
				el_genSourceIpv6.removeAttr("disabled");
				el_genSourceStartIp.val("");
				el_genSourceEndIp.val("");
				g_validate.clear([el_genSourceStartIp,el_genSourceEndIp]);
			}
		});
		
		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:mm:ss'); 
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss'); 
		el.find("[data-id=startDate]").val(lastday);
		el.find("[data-id=endDate]").val(today);
	}

	function initAfter(el)
	{
		
	}

	function save_click(el,saveObj)
	{
		// var save_url = "Report/getReport";
		// saveObj.flag = $(aEl).closest("a").prop("id");
		// current_flag = saveObj.flag;
		// um_ajax_post({
		// 	url : save_url,
		// 	paramObj : saveObj,
		// 	isLoad : true,
		// 	successCallBack : function (data){
		// 		g_dialog.operateAlert();
		// 		g_dialog.hide(el);
		// 		$("#report_div").hide();
		// 		$("#report_detail_show_div").html(data);
		// 		$("#report_detail_div").show();
		// 	}
		// });
	}
}

function vulnerEvent_init(aEl)
{
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=repo_template]"),{
				width:"700px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var el_startIp = el.find("[data-id=startIp]");
		var el_endIp = el.find("[data-id=endIp]");
		var el_ipv6 = el.find("[data-id=ipv6]");
		el.find("[name=ipType]").click(function(){
			if($(this).val() == "1")
			{
				el_startIp.removeAttr("disabled");
				el_endIp.removeAttr("disabled");
				el_ipv6.attr("disabled","disabled");
				el_ipv6.val("");
				g_validate.clear([el_ipv6]);
			}
			else
			{
				el_startIp.attr("disabled","disabled");
				el_endIp.attr("disabled","disabled");
				el_ipv6.removeAttr("disabled");
				el_startIp.val("");
				el_endIp.val("");
				g_validate.clear([el_startIp ,el_endIp]);
			}
		});
	
		if(el.find("[id=assetType]").size() != 0)
		{
			g_formel.sec_biz_render({assetTypeEl:el.find("[id=assetType]"), enableChk : false });
		}
		if(el.find("[id=securityDomain]").size() != 0)
		{
			g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]"), enableChk : false });
		}
		if(el.find("[id=bussinessDomain]").size() != 0)
		{
			g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]"), enableChk : false });
		}
		var lastday = g_moment().add('days',-1).format('YYYY-MM-DD HH:mm:ss'); 
		var today = g_moment().format('YYYY-MM-DD HH:mm:ss'); 
		el.find("[data-id=startTime]").val(lastday);
		el.find("[data-id=endTime]").val(today);
	}

	function initAfter(el)
	{
		
	}

	function save_click(el)
	{
		if(!g_validate.ipValidate(el_startIp ,el_endIp))
		{
			return false;
		}
	}	
}

function dayReportTpl_init()
{	
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=day_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var date = g_moment().add('day',-1).format('YYYY-MM-DD');
		el.find("[data-id=timeRange]").val(date);
	}

	function initAfter(el)
	{

	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}

		saveObj.startDate = saveObj.timeRange + " 00:00:00";
		saveObj.endDate = saveObj.timeRange + " 23:59:59";

		saveObj.flag = "newDayReportAdd";
		current_flag = saveObj.flag;
	 	current_para = saveObj;
	 	um_ajax_post({
	 		url : report_url,
	 		paramObj : { "para" : saveObj , flag : saveObj.flag },
	 		maskObj : el,
	 		successCallBack : reportSuccessCallBack
	 	});
	}
}

function weekReportTpl_init()
{	
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=week_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		inputdrop.renderFlexoCalendar(el.find("[data-id=timeRange]"));
	}

	function initAfter(el)
	{

	}

	function save_click(el,saveObj)
	{

		if (!g_validate.validate(el))
		{
			return false;
		}
		
		var dayNum = daysBetween(saveObj.startDate,saveObj.endDate);
			
	    if(dayNum<=1000000){
		   saveObj.rflag = 0;
	    } else {
		   saveObj.rflag=1;
	    }

		saveObj.flag = "newWeekReportAdd";
		current_flag = saveObj.flag;
		current_para = saveObj;
		um_ajax_post({
			url : report_url,
			paramObj : { "para" : saveObj , flag : saveObj.flag },
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

function monthReportTpl_init()
{	
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=month_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var startDate = g_moment().add('month',-1).format('YYYY-MM');
		el.find("[data-id=startTime]").val(startDate);
	}

	function initAfter(el)
	{

	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		saveObj.startDate = saveObj.startTime+ "-01 00:00:00";
		var endDay = g_moment(saveObj.startTime, "YYYY-MM").daysInMonth();
		saveObj.endDate = saveObj.startTime + "-" + endDay+" 23:59:59";

		var startTime = saveObj.startDate.replace(/-/g,"/");
		startTime = new Date(startTime);
		var endTime = saveObj.endDate.replace(/-/g,"/");
		endTime = new Date(endTime);
		var msInterval = endTime.getTime()-startTime.getTime();
		var minutes = msInterval/(60*1000);
		saveObj.dayNum = Math.round(minutes/60/24);

		saveObj.flag = "newMonthReportAdd";
		current_flag = saveObj.flag;
		current_para = saveObj;
		um_ajax_post({
			url : report_url,
			paramObj : { "para" : saveObj , flag : saveObj.flag },
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

function quarterReportTpl_init(){
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=quarter_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var year = g_moment().format('YYYY');
		el.find("[data-id=year]").append('<option value="'+year+'">'+year+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-1)+'">'+(year-1)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-2)+'">'+(year-2)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-3)+'">'+(year-3)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-4)+'">'+(year-4)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-5)+'">'+(year-5)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-6)+'">'+(year-6)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-7)+'">'+(year-7)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-8)+'">'+(year-8)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-9)+'">'+(year-9)+'</option>');
		el.find("[data-id=quarter]").val(timepicker.getPrevQuarter()).trigger("change");
	}

	function initAfter(el)
	{

	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		var timeRange = timepicker.getQuarterRange(saveObj.quarter);

		saveObj.startDate = saveObj.year+ '-' + timeRange.startDate + " 00:00:00";
		saveObj.endDate = saveObj.year+ '-' + timeRange.endDate + " 23:59:59";
		var startTime = saveObj.startDate.replace(/-/g,"/");
		startTime = new Date(startTime);
		var endTime = saveObj.endDate.replace(/-/g,"/");
		endTime = new Date(endTime);
		var msInterval = endTime.getTime()-startTime.getTime();
		var minutes = msInterval/(60*1000);
		saveObj.dayNum = Math.round(minutes/60/24);

		saveObj.flag = "newQuarterReportAdd";
		current_flag = saveObj.flag;
		current_para = saveObj;
		um_ajax_post({
			url : report_url,
			paramObj : { "para" : saveObj , flag : saveObj.flag },
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

function yearReportTpl_init()
{	
	$.ajax({
		type: "GET",
		url: "module/stat_report/report_show_tpl.html",
		success :function(data)
		{
			g_dialog.dialog($(data).find("[id=year_template]"),{
				width:"450px",
				init:init,
				initAfter:initAfter,
				title:"报表查询",
				saveclick:save_click
			});
		}
	});

	function init(el)
	{
		var year = g_moment().format('YYYY');
		el.find("[data-id=year]").append('<option value="'+year+'">'+year+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-1)+'">'+(year-1)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-2)+'">'+(year-2)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-3)+'">'+(year-3)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-4)+'">'+(year-4)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-5)+'">'+(year-5)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-6)+'">'+(year-6)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-7)+'">'+(year-7)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-8)+'">'+(year-8)+'</option>');
		el.find("[data-id=year]").append('<option value="'+(year-9)+'">'+(year-9)+'</option>');

	}

	function initAfter(el)
	{

	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}

		saveObj.startDate = saveObj.year+ "-01-01 00:00:00";
		saveObj.endDate = saveObj.year+ "-12-31 23:59:59";

		var dayNum = daysBetween(saveObj.startDate,saveObj.endDate);
			
	    if(dayNum<=1000000){
		   saveObj.rflag = 0;
	    } else {
		   saveObj.rflag=1;
	    }

		saveObj.flag = "newYearReportAdd";
		current_flag = saveObj.flag;
		current_para = saveObj;
		um_ajax_post({
			url : report_url,
			paramObj : { "para" : saveObj , flag : saveObj.flag },
			maskObj : el,
			successCallBack : reportSuccessCallBack
		});
	}
}

});
});