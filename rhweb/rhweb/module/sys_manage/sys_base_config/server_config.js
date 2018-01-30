$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	var list_url = "appconfig/queryAppServerInfo";
	var list_col = [
						{text:'服务器名称',name:"appName" ,render:function (txt ,data){
							if (data.pappId == "-1")
							{
								return '<i class="icon-folder-open" style="margin-right:5px;color:#000"> '+txt+'</i>';
							}
							else{
								return '<i class="icon-file-text" style="margin-left:10px;color:#000"> '+txt+'</i>';
							}
						}},
						{text:'服务器IP',name:"appIpv"},
						{text:'服务器类型',name:"typeText"},
						{text:'存活' ,name:""}
				   ];
	var list_oper = [
						{icon:"rh-icon rh-add" ,text:"添加代理服务器" ,aclick:agent_edit_template_init ,isShow:function (data){
							return (data.pappId == "-1");
						}},
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:function(data){
							if(data.pappId == "-1")
							{
								app_edit_template_init(data);
							}
							else
							{
								agent_edit_template_init(data);
							}
						}},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:server_config_delete,isShow:function (rowData){
					  		return !rowData.system;
					  	}}
					];

	var app_server_config_add_url = "appconfig/addAppServerInfo";

	var app_server_config_update_url = "appconfig/updAppServerInfo";

	var app_server_config_delete_url = "appconfig/delAppServerInfo";

	var agent_server_config_add_url = "appconfig/addAgentServerInfo";

	var agent_server_config_update_url = "appconfig/updAgentServerInfo";

	var agent_server_config_delete_url = "appconfig/delAgentServerInfo";

	var appQuery_url = "appconfig/queryInitInfo";

	var agentQuery_url = "appconfig/queryAgentInitInfo";

	var survive_url = "appconfig/getAppStatus";

	var server_config_delete_url = "role/delBatchRoles";

	var form_iplist_col_header = [
							 		 {text:'发生源IP',name:"showIp",width:40},
							 		 {text:'转发至IP',name:"aimIpv",width:30},
							  		 {text:'转发至端口',name:"aimPort",width:30}
								 ];
	view_init();

	event_init();

	server_config_list({maskObj:"body"});

	function view_init()
	{
		index_form_init($("#application_server_config_add_template"));
	}

	function event_init()
	{
		$("#add_btn").click(function (){
			app_edit_template_init();
		});
	}

	function server_config_list(option)
	{
		g_grid.render($("#table_div"),{
			 url:list_url,
			 header:list_col,
			 oper: list_oper,
			 operWidth:"150px",
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 allowCheckBox:false,
			 hideSearch : true,
			 hideSort : true,
			 cbf:function(){
			 	$("#table_div").find("tr").not("[class=um-grid-head-tr]").not("[class=um-grid-search-tr]").each(function(){
			 		var trEl = $(this);
			 		var tdEl = trEl.find("td").not("[data-id=chk]").eq(3);
			 		var pappId = trEl.data("data").pappId;
			 		var ip = trEl.data("data").appIpv;
			 		um_ajax_get({
						url : "appconfig/getAppStatus",
						paramObj : {ip:ip,pappId:pappId},
						isLoad : false,
						failTip: false,
						successCallBack : function (data1){
							var txt;
							var countColor;
							if(data1 == "1")
							{
								txt = "存活";
								countColor = "#1abc9c";
							}
							else if(data1 == "0")
							{
								txt = "不存活";
								countColor = "#E58308";
							}
							var tdtxt = '<span class="dib prel" style="padding:0 3px; background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'+txt+'</span>';
							tdEl.html(tdtxt);
						},
						failCallBack : function(){
							var tdtxt = '<span class="dib prel" style="padding:0 3px; background-color:#ec7063;color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">获取状态失败</span>';
							tdEl.html(tdtxt);
						}
					});
			 	});
			 }
		});
	}

	function agent_edit_template_init(rowData)
	{
		var title_msg = "代理服务器配置添加";
		if (rowData && rowData.pappId != -1)
		{
			title_msg = "代理服务器配置修改";
		}
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/server_config_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=proxy_server_config_add_template]"),{
					width:"900px",
					init:init,
					initAfter:initAfter,
					title:title_msg,
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			var el_sourceStartIp = el.find("[id=recordStartIp]");
			var el_sourceEndIp = el.find("[id=recordEndIp]");
			var el_sourceIpv6 = el.find("[id=srcipv6]");
			var el_forwardToIpv4 = el.find("[id=recordAimIp]");
			var el_forwardToIpv6 = el.find("[id=aimipv6]");
			var el_forwardToPort = el.find("[data-id=recordAimPort]");

			el.find("[data-id=appId]").val(rowData.appId);

			g_validate.init(el);
			// IP类型点击事件
			el.find("[name=source]").click(function (){
				if ($(this).val() == "1")
				{
					el_sourceStartIp.removeAttr("disabled");
					el_sourceEndIp.removeAttr("disabled");
					el_sourceIpv6.attr("disabled" ,"disabled");
					el_sourceIpv6.val("");
					g_validate.clear([el_sourceIpv6]);
				}
				else
				{
					el_sourceStartIp.attr("disabled" ,"disabled");
					el_sourceEndIp.attr("disabled" ,"disabled");
					el_sourceIpv6.removeAttr("disabled");
					el_sourceStartIp.val("");
					el_sourceEndIp.val("");
					g_validate.clear([el_sourceStartIp ,el_sourceEndIp]);
				}
			});

			el.find("[name=forwardTo]").click(function (){
				if ($(this).val() == "1")
				{
					el_forwardToIpv4.removeAttr("disabled");
					el_forwardToIpv6.attr("disabled" ,"disabled");
					el_forwardToIpv6.val("");
					g_validate.clear([el_forwardToIpv6]);
				}
				else
				{
					el_forwardToIpv4.attr("disabled" ,"disabled");
					el_forwardToIpv6.removeAttr("disabled");
					el_forwardToIpv4.val("");
					g_validate.clear([el_forwardToIpv4]);
				}
			});

			// 右移事件
			el.find("[id=chevron-right]").click(function (){
				var el_proxy_ipv4 = el.find("#proxy_ipv4");

				if (el.find("[name=source]:checked").val() == "1")
				{
					if (el_sourceStartIp.val() == "" || el_sourceEndIp.val() == "")
					{
						g_validate.setError(el_sourceEndIp ,"发生源起始IP与结束IP不能为空");
						return false;
					}
				}
				else
				{
					if (el_sourceIpv6.val() == "")
					{
						g_validate.setError(el_sourceIpv6 ,"发生源IP不能为空");
						return false;
					}
				}

				if (el.find("[name=forwardTo]:checked").val() == "1")
				{
					if (el_forwardToIpv4.val() == "")
					{
						g_validate.setError(el_forwardToIpv4 ,"转发IP不能为空");
						return false;
					}
				}
				else
				{
					if (el_forwardToIpv6.val() == "")
					{
						g_validate.setError(el_forwardToIpv6 ,"转发IP不能为空");
						return false;
					}
				}

				if(el_proxy_ipv4.val() != "" && el_proxy_ipv4.val()===el_forwardToIpv4.val()){
					g_validate.setError(el_forwardToIpv4,"代理服务器本身不能作为转发服务器");
					return false;
				}

				if (el.find("[name=forwardTo]:checked").val() == "1" && el_forwardToIpv4.val() != "")
				{
					if(!g_validate.ipIsNotBetween(el_forwardToIpv4 ,el_sourceStartIp ,el_sourceEndIp ,"发生源IP段不能包括转发服务器IP"))
					{
						return false;
					}
				}

				if (el_forwardToPort.val() == "")
				{
					g_validate.setError(el_forwardToPort ,"转发端口不能为空");
					return false;
				}
				

				if (!g_validate.validate(el.find("[id=left]")))
				{
					return false;
				}
				var ipList = [];
				var obj = new Object();

				if(el.find("[name=source]:checked").val() == 1)
				{	
					obj.startIpv = el_sourceStartIp.val();
	 				obj.endIpv = el_sourceEndIp.val();
	 				obj.startIp = ipToInt(obj.startIpv);
	 				obj.endIp = ipToInt(obj.endIpv);
	 				obj.showIp = obj.startIpv + "-" + obj.endIpv;

					var data = g_grid.getIdArray(el.find("#ipList_table") ,{attr:"showIp"});
	 				if (data.indexOf(obj.showIp) != -1)
					{
						var ip_error_msg = "同一目的IP地址下的IP区域不应有重复，请重新输入";
						g_validate.setError(el_sourceStartIp,ip_error_msg);
						g_validate.setError(el_sourceEndIp,ip_error_msg);
						return false;
					}

	 				if(!g_validate.ipValidate(el_sourceStartIp ,el_sourceEndIp))
	 				{
	 					return false;
	 				}
				} 				
				else 
				{
					obj.startIpv = el_sourceIpv6.val();
					obj.endIpv = obj.startIpv;
					obj.startIp = 9999999991;
					obj.endIp = obj.startIp;
					obj.showIp = obj.startIpv;
				}

				if(el.find("[name=forwardTo]:checked").val() == 1)

				{
					obj.aimIpv = el_forwardToIpv4.val();
					obj.aimIp = ipToInt(obj.aimIpv);
				}
				else 
				{
					obj.aimIpv = el_forwardToIpv6.val();
					obj.aimIp = 9999999991;
				}

				obj.aimPort = el_forwardToPort.val();

				ipList.push(obj);
				g_grid.addData(el.find("[id=ipList_table]") ,ipList);

				$("[id=left]").find("[type=text]").val("");
			});

			// 左移事件
			el.find("[id=chevron-left]").click(function (){
				var data = g_grid.getData(el.find("#ipList_table") ,{chk:true});
				if (data.length == 0)
				{
					g_dialog.operateAlert(el ,"请选择一条记录。" ,"error");
				}
				else if (data.length > 1)
				{
					g_dialog.operateAlert(el ,"只允许选择一条记录。" ,"error");
				}
				else 
				{
					el_forwardToPort.val(data[0].aimPort);
					var startType;
					var recordType;
					if(data[0].showIp.indexOf("-")>0)
					{
						startType = 1;
					}
					else
					{
						startType = 2;
					}

					if(data[0].aimIpv.indexOf(":")>0)
					{
						recordType = 2;
					}
					else
					{
						recordType = 1;
					}

					el.find("[name=source][value="+startType+"]").attr("checked","checked");
					el.find("[name=forwardTo][value="+recordType+"]").attr("checked","checked");
					el.find("[name=source][value="+startType+"]").click();
					el.find("[name=forwardTo][value="+recordType+"]").click();
					if(startType == 1)
					{	
						var array = data[0].showIp.split("-");
						el_sourceStartIp.val(array[0]);
						el_sourceEndIp.val(array[1]);
					}
					else if(startType == 2)
					{
						el_sourceIpv6.val(data[0].showIp);
					}

					if(recordType == 1)
					{
						el_forwardToIpv4.val(data[0].aimIpv);
					}
					else if(recordType == 2)
					{
						el_forwardToIpv6.val(data[0].aimIpv);
					}
					g_grid.removeData(el.find("[id=ipList_table]"));
				}
				
			});
		}

		function initAfter(el){
			g_formel.code_list_render({key:"vulScannerType_codelist",vulScannerTypeEl:el.find("[data-id=scannerType]")});

			var ipList_table = el.find("[id=ipList_table]");

			g_grid.render(ipList_table,{
				header:form_iplist_col_header,
				data:[],
				paginator:false,
				isLoad:false,
				hideSearch:true
			});

			if(rowData && rowData.pappId != -1)
			{
				um_ajax_post({
					url : agentQuery_url,
					paramObj : {appId:rowData.appId},
					maskObj : el,
					successCallBack : function (data){
						el.find("[data-id=agentStore_div]").umDataBind("render" ,data.agentStore);
						g_formel.code_list_render({key:"vulScannerType_codelist",vulScannerTypeEl:el.find("[data-id=scannerType]"),vulScannerTypeVal:data.agentStore.scannerType});
					}
				});

				um_ajax_get({
					url : agentQuery_url,
					paramObj : {appId:rowData.appId},
					successCallBack : function (data){
						if (data && data.logInfoStore && data.logInfoStore.length > 0)
						{
							g_grid.addData(ipList_table ,data.logInfoStore);
						}			
					}
				});
			}
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el.find('#agent_name_div')))
			{
				return false;
			}
			
			var flag_url = agent_server_config_add_url;
			if(rowData && rowData.pappId != -1)
			{
				flag_url = agent_server_config_update_url;
			}

			//封装参数
			var obj = new Object();

			obj.agentconfigstore = [];
			obj.agentconfigstore.push({nodeId:"",agentType:"2",scannerType:0});
			obj.agentconfigstore.push({nodeId:"",agentType:"3",scannerType:0});
			obj.agentconfigstore.push({nodeId:"",agentType:"5",scannerType:0});
			obj.agentconfigstore.push({nodeId:"",agentType:"4",scannerType:saveObj.scannerType});

			var data = g_grid.getData(el.find("[id=ipList_table]"));

			for (var i = 0; i < data.length; i++) {
				obj.agentconfigstore.push({
					nodeId:data[i].appId,
					agentType:"1",
					scannerType:0,
					startIp : data[i].startIp,
					endIp : data[i].endIp,
					aimIp : data[i].aimIp,
					scanZoneId :data[i].scanZoneId,
					aimPort : data[i].aimPort,
					startIpv : data[i].startIpv,
					endIpv : data[i].endIpv,
					aimIpv : data[i].aimIpv
				});
			}
			
			obj.proxybasestore = new Object();
			obj.proxybasestore.nodeName = saveObj.nodeName;
			obj.proxybasestore.nodeIpv = saveObj.nodeIpv;
			obj.proxybasestore.nodeDesc = saveObj.nodeDesc;
			obj.proxybasestore.appId = rowData.appId;
			obj.proxybasestore.scannerType = saveObj.scannerType;
			obj.proxybasestore.preNodeIpv = saveObj.preNodeIpv;

			um_ajax_post({
				url : flag_url,
				paramObj : obj,
				maskObj : el,
				successCallBack : function (data){
					g_dialog.operateAlert();
					g_dialog.hide(el);
					server_config_list({isLoad:true,maskObj:"body"});
				}
			});
		}
	}

	function app_edit_template_init(rowData)
	{
		var title_msg = "应用服务器配置添加";

		console.log(rowData);
		if (rowData && rowData.pappId == "-1")
		{
			title_msg = "应用服务器配置修改";
		}
		$.ajax({
			type: "GET",
			url: "module/sys_manage/sys_base_config/server_config_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=application_server_config_add_template]"),{
					width:"450px",
					init:init,
					saveclick:save_click,
					title:title_msg
				});
			}
		});

		function init(el)
		{
			g_validate.init(el);
			if(rowData)
			{
				um_ajax_post({
					url : appQuery_url,
					paramObj : {nodeId:rowData.appId},
					maskObj : el,
					successCallBack : function (data){
						el.umDataBind("render" ,data[0]);
					}
				});
			}
		}

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}
			var flag_url = app_server_config_add_url;

			if (rowData && rowData.pappId == -1)
			{
				flag_url = app_server_config_update_url;
				saveObj.preNodeIpv = rowData.appIpv;
			}
			um_ajax_post({
				url : flag_url,
				paramObj : saveObj,
				maskObj : el,
				successCallBack : function (data){
					g_dialog.operateAlert();
					g_dialog.hide(el);
					server_config_list({isLoad:true,maskObj:"body"});
				}
			});
		}
	}

	function server_config_delete(rowData)
	{		
		g_dialog.operateConfirm("是否进行删除操作？" ,{
			saveclick : function (){
				var delete_url = app_server_config_delete_url;
				if(rowData.pappId != "-1")
				{
					delete_url = agent_server_config_delete_url;
				}
				um_ajax_post({
					url : delete_url,
					paramObj : {id:rowData.appId},
					successCallBack : function (data){
						g_dialog.operateAlert();
						server_config_list({maskObj:$("#table_div")});
					}
				});
			}
		});		
	}

	function app_survive(rowData)
	{
		um_ajax_post({
			url : survive_url,
			paramObj : {ip:rowData.appIpv,pappId:rowData.pappId},
			successCallBack : function (data){
				console.log(data);
			}
		});
	}

	function ipToInt(IP) 
	{
		if(IP===null || IP==="") 
		{
			return 0;
		}

		var a = IP.split(".");

		for (var i=0; i<4; i++) 
		{
			a[i] = parseInt(a[i]);
		  	if (isNaN(a[i])) a[i] = 0;
		  	if (a[i] < 0) a[i] += 256;
		  	if (a[i] > 255) a[i] -= 256;
		}
		return ((a[0]<<16)*256)+((a[1]<<16)|(a[2]<<8)|a[3]);
	}

});
});