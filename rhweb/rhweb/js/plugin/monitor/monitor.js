/** 
	插件名称  :  monitor
	插件功能  :  监控器自定义插件
*/
define(['timepicker' ,'tree' ,'monitorTool'] ,function (timepicker ,tree ,monitorTool){

	return {
		render : function (el ,opt) 
		{
			$.ajax({
				type: "GET",
				url: "js/plugin/monitor/monitor.html",
				success: function (data){
					var monitorEl = $(data);
					el.empty();
					el.append(monitorEl);
					timepicker.time(el.find($("#startDate")),{});

					um_ajax_get({
						url: "/data/asset/sec_tree.json",
						server:"http://127.0.0.1:8080/",
						isLoad: false,
						successCallBack:function (data){
							tree.render(el.find("ul") ,data ,function (event, treeId, treeNode){
								$.ajax({
									type: "GET",
									url: "module/monitor/monitor_list/user_access_info.html",
									success: function (data){
										var monitor_container = el.find("[id=monitor_container]");
										monitor_container.html($(data));
									}
								});
							});
						}
					});
				}
			});
		},
		monitorDialog : function (opt) 
		{
			var templateHtml,monitor_type,monitored_asset_list,monitor_param,step5_flag = 1,step3_inited = false;
			/*标题中的指标项，mT_tit为标题包裹,*_t 控制样式,*_v 控制内容值*/
			var mT_tit,mT_monitorType_k,mT_monitorType_v,mT_assetName_k,mT_assetName_v,mT_assetIp_k,mT_assetIp_v;
			var assetChanged=false,assetOld;
			/*修改时，控制提交按钮可用性的标志位,与成立*/
			var allowSubmmitStep1 = false,allowSubmmitStep2 = true, allowSubmmitStep4 = true;
			/*第四步和第五步之间有联动的监控器*/
			var comMonitorList = ["LINUX","WINDOWS","WEBLOGIC","AIX"];
			var firstStepedInstep2 = true,checkedInStep2 = false;
			var paramDetailData = opt.detailData;
			
			$.ajax({
				type : "GET",
				url : "js/plugin/monitor/monitor_config.html",
				success : function(data)
				{
					templateHtml = data;
					renderDialog(data);
				}
			});

			function renderDialog(data) 
			{
				g_dialog.dialogFullScreen($(data).find("[id=sfxxdj_div]"),{
					title : opt.title,
					init : init,
					initAfter : initAfter,
					saveclick : save
				});
			}

			function init(el){
				mT_tit = el.find("[data-name=monitorTitle]");
				mT_monitorType_k = mT_tit.find("[data-key=monitorType]");
				mT_monitorType_v = mT_tit.find("[data-value=monitorType]");
				mT_monitorName_k = mT_tit.find("[data-key=monitorName]");
				mT_monitorName_v = mT_tit.find("[data-value=monitorName]");
				mT_assetName_k = mT_tit.find("[data-key=assetName]");
				mT_assetName_v = mT_tit.find("[data-value=assetName]");
				mT_assetIp_k = mT_tit.find("[data-key=assetIp]");
				mT_assetIp_v = mT_tit.find("[data-value=assetIp]");
				// 修改时，前三步的数据提前渲染好
				if (paramDetailData)
				{
					monitor_type = paramDetailData.monitorStore[0].monitorType;
					el.find("[data-id=temp_type]").val(paramDetailData.monitorStore[0].monitorType);
					el.find("[data-id=temp_monitored_asset_ip]").val(paramDetailData.monitorStore[0].ipvAddress);
					el.find("[data-id=temp_monitored_asset]").val(paramDetailData.monitorDeviceStore[0].edId);
					var eData = paramDetailData.monitorStore[0];
					$("[data-id=groupName]").val(eData.monitorName);
					$("[data-id=temp_agent]").val(eData.monitorAgent);
					//$("[data-id=monitorAgent]").val(eData.monitorAgent);
					$("[data-id=monitorAgent]").append('<option value="'+eData.monitorAgent+'">'+eData.monitorAgentName+'</option>')
					el.find("[id=base_info]").umDataBind("render" ,eData);
					el.find("[data-id=remark]").val(eData.monitorMemo);
					mT_tit.show();
					mT_monitorType_v.text(paramDetailData.monitorStore[0].monitorType);
					mT_monitorType_k.show();
					mT_monitorName_v.text(paramDetailData.monitorStore[0].monitorName);
					mT_monitorName_k.show();
					mT_assetName_v.text(paramDetailData.monitorStore[0].entityName);
					mT_assetIp_v.text(paramDetailData.monitorStore[0].ipvAddress);
					mT_assetIp_k.show();
					mT_assetName_k.show();
				}
			}

			function initAfter(el)
			{
				el.find("[id=sfxxdj_div]").smartWizard({
					keyNavigation : false,
					labelPrevious : "上一步",
					labelNext : "下一步",
					labelFinish : "提交",
					isMonitorDetail : paramDetailData?true:false,
					selected : paramDetailData?3:0,
					onLeaveStep : function (step,selStep) /*离开某一步时触发*/
					{
						var lastStep = step[0].id.substring(5,step[0].id.length); /*当前步骤数*/
						var nextStep = $(selStep)[0].id.substring(5,$(selStep)[0].id.length); /*目标步骤数*/
						/*lastStep < nextStep ：离开本步去往下一步时，进行一些校验限制，离开本步返回上一步时，不做校验*/
						switch (lastStep)
						{
							case "1": /*离开第一步*/
								if(lastStep < nextStep && monitor_type == undefined)
								{
									g_dialog.operateAlert(el ,"请选择监控器类型" ,"error");
									return false;
								}
								/*新增监控器时，如果重新选择了监控器类型，则对后面的步骤进行重置*/
								if (el.find("[data-id=temp_type]").val() !== "" && el.find("[data-id=temp_type]").val() !== monitor_type) 
								{
									el.find("#monitored_asset").empty();
									step3_inited = false;
									opt.step_1_edit || el.find("#um_step_3").umDataBind("render" ,{groupName:"",status:"0",pollUnit:"1",pollDate:"5",monitorAgent:"",remark:""});
									el.find("[data-id=monitorAgent]").trigger("change");
									el.find(el.find("[data-id=data-list]")?"#um_step_4":"[data-id=data-list]").empty();
									el.find("#um_step_5").empty();
								}
								/*缓存监控器类型*/
								el.find("[data-id=temp_type]").val(monitor_type);
								/*显示dialog标题上的监控器类型*/
								mT_tit.show();
								mT_monitorType_v.text(el.find("#"+monitor_type).text().slice(0,-1));
								mT_monitorType_k.show();
								break;
							case "2":
								/*获取被选中资产*/
								monitored_asset_list = g_grid.getData(el.find("[id=monitored_asset]") ,{chk:true});
								var paramData = [],paramIp = [];
								for (var i = 0; i < monitored_asset_list.length; i++) {
									paramData.push(monitored_asset_list[i].edId);
									paramIp.push(monitored_asset_list[i].ipvAddress);
								}
								/*被选中资产id和ip，string类型 逗号分隔*/
								paramData = paramData.join(",");
								paramIp = paramIp.join(",");
								if (lastStep < nextStep && monitored_asset_list.length === 0) 
								{
									g_dialog.operateAlert(el ,"请选择被监控资产" ,"error");
									return;
								}
								/*缓存被选资产ip*/
								$("[data-id=temp_monitored_asset_ip]").val(paramIp);
								/*缓存被选资产id*/
								if (el.find("[data-id=temp_type]").val()=="ORACLERAC") 
								{
									$("[data-id=temp_monitored_asset]").val(paramData);
								} 
								else 
								{
									(!opt.step_2_edit && el.find("[data-id=temp_monitored_asset]").val() != "" && paramData != el.find("[data-id=temp_monitored_asset]").val()) && el.find("[data-id=data-list]").empty();
									$("[data-id=temp_monitored_asset]").val(paramData);
								}
								assetOld = el.find("[data-id=temp_monitored_asset]").val();
								/*显示dialog标题上的资产信息*/
								if (lastStep < nextStep)
								{
									var assetNameStr = [],assetIpStr = [];
									for (var i = monitored_asset_list.length - 1; i >= 0; i--) {
										assetNameStr.push(monitored_asset_list[i].entityName);
										assetIpStr.push(monitored_asset_list[i].ipvAddress);
									}
									assetNameStr = assetNameStr.toString();
									assetIpStr = assetIpStr.toString();
									mT_assetName_v.text(assetNameStr);
									mT_assetIp_v.text(assetIpStr);
									mT_assetIp_k.show();
									mT_assetName_k.show();
								}
								break;
							case "3":
								if ((opt.step_3_edit || lastStep < nextStep) && !g_validate.validate(el.find("#um_step_3")))
								{
									g_dialog.operateAlert(el ,"请完善信息" ,"error");
									return false;
								}
								mT_monitorName_v.text($("[data-id=groupName]").val());
								mT_monitorName_k.show();
								break;
							case "4":
								if ((opt.step_4_edit || lastStep < nextStep))
								{
									if ($("[data-flag=col-div]").find("div[class*=active]").attr("data-getter") == "snmp"
										&& el.find("[data-id=snmpVersion]").val() == "")
									{
									}
									else if (!g_validate.validate($("[data-flag=col-div]").find("div[class*=active]")))
									{
										g_dialog.operateAlert(el,"请完善信息。","error");
										return false;
									}
								}
								break;
							case "5":
								if (opt.step_5_edit && !g_validate.validate(el.find("[id=detail_store_form]")))
								{
									g_dialog.operateAlert(el,"请完善信息。","error");
									return false;
								}
								break;
						}
						return true;
					},
					onShowStep : function(step) /*展示到某一步时触发*/
					{
						var index = Number(step[0].rel);/*步骤索引*/
						var type = el.find("[data-id=temp_type]").val();/*当前监控器类型*/
						switch(index)
						{
							case 1:
								/*如果监控器类型未被选中过，则渲染监控器类型列表，否则返回false*/
								//return el.find("[data-id=temp_type]").val() == "" ? step1_init(el) : false;
								return step1_init(el);
							case 2:
								/*资产列表如果没渲染过则进行渲染，否则进行resize操作*/
								allowSubmmitStep1 = true;
								// g_grid.getData($("[id=monitored_asset]")).length == 0 ? step2_init(el ,{type:type}) : g_grid.resize($("[id=monitored_asset]"));
								g_grid.getData($("[id=monitored_asset]")).length == 0 && step2_init(el ,{type:type});
								//opt.step_2_edit && allowSubmmitStep1 && allowSubmmitStep2 && allowSubmmitStep4 && $(".buttonFinish").removeClass("buttonDisabled");
								break;
							case 3:
								/*如果代理服务器下拉框没有渲染过，则对第三部进行渲染*/
								//opt.step_3_edit && allowSubmmitStep1 && allowSubmmitStep2 && allowSubmmitStep4 && $(".buttonFinish").removeClass("buttonDisabled");
								return el.find("[data-id=monitorAgent] option").length <= 1 && step3_init(el);
							case 4:
								//opt.step_4_edit && allowSubmmitStep1 && allowSubmmitStep2 && allowSubmmitStep4 && $(".buttonFinish").removeClass("buttonDisabled");
								/*显示第四步的时候，如果是多资产监控器，则每次进入第四步都重新渲染一遍，其他的单资产监控器如果没有渲染过则进行第四步的渲染，否则进行resize操作*/
								(["ORACLERAC"].indexOf(type)!=-1 || true==assetChanged || el.find("[data-id=data-list]").length == 0 ) ? step4_init(el) : g_grid.resize(el.find("[data-id=data-list]"));
								allowSubmmitStep2 = true;
								/*凭证信息连接方式发生变化，关联第五步表单重新渲染*/
								el.find("[data-id=temp_certificate_type]").change(function(){
									step5_flag = 1;
									if (comMonitorList.indexOf(type)!=-1) 
									{
										allowSubmmitStep4 = false;
									}
								});
								el.find("[data-id=temp_certificate_type]").trigger('change');
								break;
							case 5:
								var currentType = $("[data-id=temp_type]").val();/*监控器类型*/
								var connectType = $("[data-store=connectType]") && $("[data-store=connectType]").val();/*凭证信息连接方式*/
								allowSubmmitStep4 = true;
								/*一些监控器在不同的连接方式下，指标信息表单显示发生变化*/
								if (currentType == "LINUX")
								{
									$("[data-name=block1]").show();
									$("[data-name=block2]")[connectType=="SNMP"?"hide":"show"]();
									$("[data-name=block3]")[connectType=="SNMP"?"hide":"show"]();
								}
								if (currentType=="WINDOWS")
								{
									$("[data-name=block1]").show();
									$("[data-name=block2]")[connectType == "TRAY"?"show":"hide"]();
									$("[data-name=block3]")[connectType == "SNMP"?"hide":"show"]();
								}
								if (currentType=="WEBLOGIC") 
								{
									$("[data-name=for_open]")[$("[data-name=open]").is(":checked")?"show":"hide"]();
								}
								if (currentType=="AIX")
								{
									$("[data-view=hide_when_SNMP]")[connectType == "SNMP"?"hide":"show"]();
								}
								/*如果第五步没有渲染过，则进行第五步初始化*/
								el.find("#um_step_5").children().length <= 0  && step5_init(el); 
								break;
						}
					},
					onFinish : function ()
					{ 
						/*提交前校验第五步的指标信息*/
						if (el.find("[id=detail_store_form]") && !g_validate.validate(el.find("[id=detail_store_form]"))) 
						{
							g_dialog.operateAlert(el,"请完善信息。","error");
							return;
						}
						/**
						 * @param [基本]参数说明:
						 * 第一步、第二步、第三步：
						 * 		monitorGroupStore: 监控器类型、被监控资产、基本信息
						 * 			 DB2,ORACLE,DB2_HA,SQLSERVER,SYBASE支持多实例的监控器的instStatus=1, 其余的instStatus=0
						 * 第四步：
						 * 		certStore: 凭证信息
						 * 第五步：
						 * 		monitorDetailStorer: 指标(实例)信息 一般表单信息
						 */ 

						/*拼接字符串 (监控器类型  被监控资产(逗号分隔)  基本信息 凭证信息 指标信息)*/
						var instanceData = $("[data-id=temp_database_instance]").val().split("~");
						var detailData = [];
						var urlStore = {};
						var param = {};
						var urlList = [];
						var ele = $("#um_step_4");
						for (var i = 0; i < g_grid.getData(el.find("#grid-he")).length; i++) {
							var obj = {urlAddress:g_grid.getData(el.find("#grid-he"))[i].urlAddress,_t:"1",_s:"false"};
							urlList.push(obj);
						}

						urlStore = g_grid.getData(el.find("[id=grid-he]"));
						for (var i = 0; i < urlStore.length; i++) {
							urlStore[i]._s = false;
							urlStore[i]._t = "1";
						}

						/*封装monitorGroupStore*/
						var monitorGroupStore = el.find("[data-id=base_info]").umDataBind("serialize");
						monitorGroupStore.groupName = el.find("[data-id=groupName]").val();
						monitorGroupStore.monitorType = el.find("[data-id=temp_type]").val();
						monitorGroupStore.monitorMemo = monitorGroupStore.remark;
						monitorGroupStore.pollDateText = el.find("[data-id=pollDate]").val();
						monitorGroupStore.notMonitoredEntityDevice = el.find("[data-id=temp_monitored_asset]").val();
						monitorGroupStore.groupId = opt.step_5_edit ? opt.step_5_edit().monitorStore[0].monitorId : "";
						opt.step_5_edit && (monitorGroupStore.groupId = opt.step_5_edit().monitorStore[0].monitorId);
						opt.step_5_edit && (monitorGroupStore.monitorAgent = $("[data-id=temp_agent]").val());
						// opt.step_5_edit && (monitorGroupStore.notMonitoredEntityDevice = opt.step_5_edit().monitorDeviceStore[0].edId);
						opt.step_5_edit && (monitorGroupStore.deviceSource = opt.step_5_edit().monitorDeviceStore[0].deviceSource);

						/*封装第五步表单信息*/
						var monitorDetailStore = el.find("[id=detail_store_form]") && el.find("[id=detail_store_form]").umDataBind("serialize");
						monitorDetailStore.connectType = el.find("[data-store=connectType]").val() || el.find("[data-store=scCmd]").val() || el.find("[data-id=connectType]").val();
						monitorDetailStore.opFlag = opt.step_5_edit ? "upd" : "add";
						monitorDetailStore.monitorId = opt.step_5_edit ? opt.step_5_edit().monitorStore[0].monitorId : "";

						/*不同监控器的参数封装*/
						switch (monitor_type)
						{
							case "ORACLE":
								var certStore = monitorTool.ORACLE_leave_step4(ele);
								var dStore = g_grid.getData(el.find("[data-id=database-nu]"));
								if (dStore.length == 0) 
								{
									g_dialog.operateAlert(el ,"	请至少配置一个实例信息。" ,"error");
									return false;
								}
								for (var i = 0; i < dStore.length; i++) {
									dStore[i].opFlag = opt.step_5_edit ? "upd" : "add";
									dStore[i].currentType = "-1";
									dStore[i].configStatus = "2";
									if (dStore[i].openAlarm == 0) 
									{
										dStore[i].connectType = -1;
									}
									delete dStore[i].openAlarm;
									// dStore[i].tsvalues = $("[data-id=temp_table_space]").val();
									// dStore[i].unTsvalues = $("[data-id=temp_not_table_space]").val();
									dStore[i].hostFileBaseLineDataStore = $("[data-btn=setFileBaseLineHidden]").eq(i).data("data");
								}
								monitorGroupStore.instStatus = 1;
								param = {
									monitorGroupStore:monitorGroupStore,
									certStore:certStore,
									monitorDetailStore:dStore
								};
								break;
							case "TOMCAT":
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore:monitorGroupStore,
									monitorDetailStore:monitorDetailStore,
									urlStore:urlList
								};
								break;
							case "LINUX":
								var monitorFaultGridStore = g_grid.getData(el.find("[id=grid-u]"));
								var monitorScriptGridStore = g_grid.getData(el.find("[id=grid-i]")); 
								var monitorPerformGridStore = g_grid.getData(el.find("[id=grid-al]"));
								var monitorUnPerformGridStore = g_grid.getData(el.find("[id=grid-ar]"));
								certStore = monitorTool.LINUX_leave_step4(ele);
								// return;
								for (var h = 0; h < monitorFaultGridStore.length; h++) {
									monitorFaultGridStore[h]._s = false;
									monitorFaultGridStore[h]._t = 1;
									monitorFaultGridStore[h].faultId = "1202003";
								}
								for (var j = 0; j < monitorScriptGridStore.length; j++) {
									monitorScriptGridStore[j]._s = true;
									monitorScriptGridStore[j]._t = 1;
								} 
								for (var k = 0; k < monitorPerformGridStore.length; k++) {
									monitorPerformGridStore[k].lastTime = "3992";
									monitorPerformGridStore[k].performId = "1102003";
								}
								for (var l = 0; l < monitorUnPerformGridStore.length; l++) {
									monitorUnPerformGridStore[l].lastTime = "100";
									monitorUnPerformGridStore[l].performId = "1102003";
								}
								monitorGroupStore.instStatus = 0;
								param = 
									{
										"monitorDetailStore": monitorDetailStore,
										"monitorFaultGridStore": monitorFaultGridStore,
										"monitorGroupStore": monitorGroupStore,
										"certStore":certStore,
										"monitorPerformGridStore": monitorPerformGridStore,
										"monitorScriptGridStore": monitorScriptGridStore,
										"monitorUnPerformGridStore": monitorUnPerformGridStore,
										"hostProcessBaseLineDataStore": $("[data-btn=setProcessBaseLine]").data("data"),
										"hostPortBaseLineDataStore": $("[data-btn=setPortBaseLine]").data("data"),
										"hostDiskBaseLineDataStore": $("[data-btn=setDiskBaseLine]").data("data")
									};
								break;
							case "MYSQL":
								monitorGroupStore.instStatus = 0;
								param = 
									{
										"monitorDetailStore" : monitorDetailStore,
										"monitorGroupStore" : monitorGroupStore
									};
								break;
							case "COMMONTCP":
								monitorGroupStore.instStatus = 0;
								param = 
									{
										"monitorDetailStore" : monitorDetailStore,
										"monitorGroupStore" : monitorGroupStore
									};
								break;
							case "APACHE":
								urlStore = g_grid.getData(el.find("[id=grid-he]"));
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"urlStore" : urlStore
								};
								break;
							case "ARRAY":
								certStore = monitorTool.ARRAY_leave_step4(ele);
								monitorDetailStore.monitorDatabaseName = "compatible";
								monitorDetailStore.rcCmd = "0";
								monitorDetailStore.scCmd = "0";
								monitorDetailStore.temperRate = "";
								monitorDetailStore.unifyThreshold = "80";
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "H3C": /*空指针 创建不成功*/
								certStore = monitorTool.H3C_leave_step4(ele);
								monitorDetailStore.arpFlag = el.find("[data-id=arpFlag]:checked").length > 0 ? "1" :"0";
								for (var i = 0; i < certStore.length; i++) {
									certStore[i].connectType = certStore[i].connectType.split(",")[0];
								}
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "NE_HUAWEI":
								certStore = monitorTool.NE_HUAWEI_leave_step4(ele);
								monitorDetailStore.arpFlag = el.find("[data-id=arpFlag]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.rcCmd = el.find("[data-id=rcCmd]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.scCmd = el.find("[data-id=scCmd]:checked").length > 0 ? "1" :"0";
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "MAIPU":
								var certStore = monitorTool.MAIPU_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "RUIJIE_RSR":
								var certStore = monitorTool.RUIJIE_RSR_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "NE_CISCO": /*(思科)后台有问题 没做*/
								monitorGroupStore.instStatus = 0;

								break;
							case  "ZTE":
								var certStore = monitorTool.ZTE_leave_step4(ele);
								monitorDetailStore.arpFlag = el.find("[data-id=arpFlag]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.rcCmd = el.find("[data-id=rcCmd]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.scCmd = el.find("[data-id=scCmd]:checked").length > 0 ? "1" :"0";
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "JUNIPER":
								monitorGroupStore.instStatus = 0;

								break;
							case "NETKEEPER": 
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore
								};
								break;
							case "DBAPP_USM":
								var certStore = monitorTool.DBAPP_USM_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "DBAPPWEB_FW":/*安恒web防火墙*/
								var certStore = monitorTool.DBAPPWEB_FW_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "ANCHIVA_WAF":/*安信华web防火墙*/ 
								var certStore = monitorTool.ANCHIVA_WAF_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "ANCHIVA_SWG":/*安信华web网关*/ 
								var certStore = monitorTool.ANCHIVA_SWG_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "DPTECH_IPS":/*迪普IPS监控器*/
								var certStore = monitorTool.DPTECH_IPS_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "DPTECH_FW":/*迪普防火墙*/
								var certStore = monitorTool.DPTECH_FW_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "NETEYE_FIREWALL": /*东软防火墙*/
								var certStore = monitorTool.NETEYE_FIREWALL_leave_step4(ele);
								certStore.monitorPort = certStore.consolePort;
								for (var i = 0; i < certStore.length; i++) {
									certStore[i].connectType = certStore[i].connectType.split(",")[0];
								}
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "COMMONSCRIPT":
								var certStore = monitorTool.COMMONSCRIPT_leave_step4(ele);
								var instancestore = g_grid.getData($("[id=script_list_div]"));
								for (var i = 0; i < instancestore.length; i++) {
									instancestore[i]._t = 1;
									instancestore[i].flag = opt.step_5_edit ? "upd" : "add";
									instancestore[i].monitorId = opt.step_5_edit ? instancestore[i].monitorId : "";
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : instancestore,
									monitorGroupStore : monitorGroupStore,
									certStore :certStore
								};
								break;
							case "WEBSERVICE":
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore :monitorDetailStore,
									monitorGroupStore :monitorGroupStore
								};
								break;
							case "COMMON_SNMP":  /*后台有问题*/
								var certStore = monitorTool.COMMON_SNMP_leave_step4(ele);
								var monitorPerformGridStore = g_grid.getData($("[id=oid_info_list_div]"));
								for (var i = 0; i < monitorPerformGridStore.length; i++) {
									monitorPerformGridStore[i].showMode = monitorPerformGridStore[i].oidFieldType;
									monitorPerformGridStore[i]._t = "1";
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorPerformGridStore : monitorPerformGridStore,
									certStore : certStore
								};
								break;
							case "COMMON_JMX":
								var monitorPerformGridStore = g_grid.getData(el.find("[id=grid-mbean]"));
								for (var i = 0; i < monitorPerformGridStore.length; i++) {
									monitorPerformGridStore[i]._s = false;
									monitorPerformGridStore[i]._t = "1";
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore,
									monitorPerformGridStore : monitorPerformGridStore
								};
								break;
							case "PING":
								var pingUrlStore = g_grid.getData($("[id=grid-ping]"));
								var tracerouteUrlStore = g_grid.getData($("[id=grid-traceroute]"));
								for (var i = 0; i < pingUrlStore.length; i++) {
									pingUrlStore[i]._s = false;
									pingUrlStore[i]._t = "1";
								}
								for (var i = 0; i < tracerouteUrlStore.length; i++) {
									tracerouteUrlStore[i]._s = false;
									tracerouteUrlStore[i]._t = "1";
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore :monitorGroupStore,
									pingUrlStore : pingUrlStore,
									tracerouteUrlStore : tracerouteUrlStore,
									monitorDetailStore : monitorDetailStore
								};
								break;
							case "COMMON_URL":
								var el_url_table = el.find("[data-id=url_table]");
								var trObjArray = g_grid.getTrObj(el_url_table);

								var monitorDetailStore = [];
								var monitorPerformGridStore = [];
								var monitorFaultGridStore = [];
								var monitorParamGridStore = [];


								trObjArray.each(function (){
									monitorDetailStore.push($(this).data("monitorDetailStore"));
									monitorPerformGridStore.push($(this).data("monitorPerformGridStore"));
									monitorFaultGridStore.push($(this).data("monitorFaultGridStore"));
									monitorParamGridStore.push($(this).data("monitorParamGridStore"));
								});

								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore,
									monitorPerformGridStore : monitorPerformGridStore,
									monitorFaultGridStore : monitorFaultGridStore,
									monitorParamGridStore : monitorParamGridStore,
									monitorDeleteUrlStore : el_url_table.data("deleteArray").join(","),
									proofId:el_url_table.data("proofId")
								};
								break;
							case "WEBSPHERE":
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore,
									urlStore : urlStore
								};
								break; 
							case "PORT_MONITOR":
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore
								};
								break;
							case "COMMONDB": /*SQL监控器*/
								instancestore = g_grid.getData($("[id=sql_list_div]"));
								var cT = monitorDetailStore.monitorCycleType;
								for (var i = 0; i < instancestore.length; i++) {
									instancestore[i].opFlag = opt.step_5_edit ? "upd" : "add";
								}
								monitorDetailStore.cycleDay = cT == 1 
									? "2" 
									: cT == 2 
										? "21" 
										: monitorDetailStore.period;
								monitorDetailStore.cycleWeek = cT == 1
									? "1"
									: cT == 2
										? monitorDetailStore.period
										: "1";
								delete monitorDetailStore.period;
								monitorGroupStore.instStatus = 0;
								param = {
									databaseStore : monitorDetailStore,
									instancestore : instancestore,
									monitorGroupStore : monitorGroupStore
								};
								break;
							case "WINDOWS":
								certStore = monitorTool.WINDOWS_leave_step4(ele);
								monitorScriptGridStore = g_grid.getData(el.find("[id=grid-i]"));
								monitorFaultGridStore = g_grid.getData(el.find("[id=grid-u]"));
								monitorPerformGridStore = g_grid.getData(el.find("[id=grid-al]"));
								monitorUnPerformGridStore = g_grid.getData(el.find("[id=grid-ar]"));
								for (var i = 0; i < monitorScriptGridStore.length; i++) {
									monitorScriptGridStore[i]["_s"] = false;
									monitorScriptGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorFaultGridStore.length; i++) {
									monitorFaultGridStore[i]["_s"] = false;
									monitorFaultGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorPerformGridStore.length; i++) {
									monitorPerformGridStore[i]["_s"] = false;
									monitorPerformGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorUnPerformGridStore.length; i++) {
									monitorUnPerformGridStore[i]["_s"] = false;
									monitorUnPerformGridStore[i]["_t"] = 1;
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									certStore : certStore,
									monitorGroupStore : monitorGroupStore,
									monitorScriptGridStore : monitorScriptGridStore,
									monitorFaultGridStore : monitorFaultGridStore,
									monitorPerformGridStore : monitorPerformGridStore,
									monitorUnPerformGridStore : monitorUnPerformGridStore,
									"hostProcessBaseLineDataStore": $("[data-btn=setProcessBaseLine]").data("data"),
									"hostPortBaseLineDataStore": $("[data-btn=setPortBaseLine]").data("data"),
									"hostDiskBaseLineDataStore": $("[data-btn=setDiskBaseLine]").data("data")
								};
								break;
							case "AIX": 
								certStore = monitorTool.AIX_leave_step4(ele);
								monitorDetailStore.rcCmd = monitorDetailStore.rcCmd==null ? "" : monitorDetailStore.rcCmd.join(";");
								monitorDetailStore.scCmd = monitorDetailStore.scCmd==null ? "" : monitorDetailStore.scCmd.join(";");
								monitorScriptGridStore = g_grid.getData(el.find("[id=grid-i]"));
								monitorFaultGridStore = g_grid.getData(el.find("[id=grid-u]"));
								monitorPerformGridStore = g_grid.getData(el.find("[id=grid-al]"));
								monitorUnPerformGridStore = g_grid.getData(el.find("[id=grid-ar]"));
								monitorServerGridStore = g_grid.getData(el.find("[id=grid-server]"));
								for (var i = 0; i < monitorScriptGridStore.length; i++) {
									monitorScriptGridStore[i]["_s"] = false;
									monitorScriptGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorFaultGridStore.length; i++) {
									monitorFaultGridStore[i]["_s"] = false;
									monitorFaultGridStore[i]["_t"] = 1;
								} 
								for (var i = 0; i < monitorPerformGridStore.length; i++) {
									monitorPerformGridStore[i]["_s"] = false;
									monitorPerformGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorUnPerformGridStore.length; i++) {
									monitorUnPerformGridStore[i]["_s"] = false;
									monitorUnPerformGridStore[i]["_t"] = 1;
								}
								for (var i = 0; i < monitorServerGridStore.length; i++) {
									monitorServerGridStore[i]["_s"] = false;
									monitorServerGridStore[i]["_t"] = 1;
								}
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									certStore : certStore,
									monitorGroupStore : monitorGroupStore,
									monitorScriptGridStore : monitorScriptGridStore,
									monitorFaultGridStore : monitorFaultGridStore,
									monitorPerformGridStore : monitorPerformGridStore,
									monitorUnPerformGridStore : monitorUnPerformGridStore,
									monitorServerGridStore : monitorServerGridStore,
									"hostProcessBaseLineDataStore": $("[data-btn=setProcessBaseLine]").data("data"),
									"hostPortBaseLineDataStore": $("[data-btn=setPortBaseLine]").data("data"),
									"hostDiskBaseLineDataStore": $("[data-btn=setDiskBaseLine]").data("data")
								};
								break;
							case "WEBLOGIC":
								certStore = monitorTool.WEBLOGIC_leave_step4(ele);
								//monitorServerGridStore = g_grid.getData(el.find("[id=grid-server-left]"));
								monitorDetailStore.connectType = el.find("[data-id=connectType]").val();
								// for (var i = 0; i < monitorServerGridStore.length; i++) {
								// 	monitorServerGridStore[i]["_s"] = false;
								// 	monitorServerGridStore[i]["_t"] = 1;
								// }
								monitorServerGridStore = [];
								monitorServerGridStore.push({
									"_s" : false,
									"-t" : 1,
									"srcIpOrInterface" : el.find("[id=grid-server-left]").data("data")
								});
								monitorDetailStore.monitorType = "WEBLOGIC";
								monitorGroupStore.instStatus = 0;
								param = {
									certStore : certStore,
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									urlStore : urlStore,
									monitorServerGridStore : monitorServerGridStore,
									"webBaseLineDataStore": $("[data-btn=setWebBaseLine]").data("data")
								};
								break;
							case "DB2":
								var dStore = g_grid.getData(el.find("[data-id=database-nu]"));
								if (dStore.length == 0) 
								{
									g_dialog.operateAlert(el ,"	请至少配置一个实例信息。" ,"error");
									return false;
								}
								for (var i = 0; i < dStore.length; i++) {
									dStore[i].opFlag = opt.step_5_edit ? "upd" : "add";
									dStore[i].currentType = "-1";
									dStore[i].configStatus = "2";
									if (dStore[i].openAlarm == 0) 
									{
										dStore[i].connectType = -1;
									}
									dStore[i].tsvalues = $("[data-id=temp_table_space]").val();
									dStore[i].unTsvalues = $("[data-id=temp_not_table_space]").val();
								} 
								monitorGroupStore.instStatus = 1;
								param = {
									monitorDetailStore : dStore,
									monitorGroupStore : monitorGroupStore
								};
								break;
							case "NETAPP":
								certStore = monitorTool.NETAPP_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore,
									certStore : certStore
								};
								break;
							case "HW_OCEANSTOR":/*瑞星*/
								certStore = monitorTool.NETAPP_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								var opFlag = "add";
								var monitorId = "";
								if (opt.detailData)
								{
									opFlag = "upd";
									monitorId = opt.detailData.monitorStore[0].monitorId;
								}
								param = {
									monitorGroupStore : monitorGroupStore,
									certStore : certStore,
									monitorDetailStore : {opFlag:opFlag ,monitorId:monitorId}
								};
								break;
							case "VENUS_LOAD":/*启明负载均衡*/
								certStore = monitorTool.NETAPP_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								var opFlag = "add";
								var monitorId = "";
								if (opt.detailData)
								{
									opFlag = "upd";
									monitorId = opt.detailData.monitorStore[0].monitorId;
								}
								param = {
									monitorGroupStore : monitorGroupStore,
									certStore : certStore,
									monitorDetailStore : {opFlag:opFlag ,monitorId:monitorId}
								};
								break;
							case "SQLSERVER":
								var dStore = g_grid.getData(el.find("[data-id=database-nu]"));
								if (dStore.length == 0) 
								{
									g_dialog.operateAlert(el ,"请至少配置一个实例信息。" ,"error");
									return false;
								}
								for (var i = 0; i < dStore.length; i++) {
									dStore[i].opFlag = opt.step_5_edit ? "upd" : "add";
									dStore[i].connectType = -1;
									dStore[i]["_t"] = "1";
									dStore[i].version = $("[data-id=version]").val();
									delete dStore[i].check_all;
									delete dStore[i].check_inp;
								} 
								monitorGroupStore.instStatus = 1;
								monitorGroupStore.monitorName = monitorGroupStore.groupName;
								monitorGroupStore.monitorManageStatus = monitorGroupStore.status;
								param = {
									monitorDetailStore : dStore,
									monitorGroupStore : monitorGroupStore
								};
								break;
							case "IIS6":
								var userStatus = el.find("[name=userConfigStatus]:checked").val();
								var noUserStatus = el.find("[name=noConfigStatus]:checked").val();
								var linkStatus = el.find("[name=linkConfigStatus]:checked").val();
								var userUseGridStore = g_grid.getData(el.find("[id=grid-1]"));
								var noUserUseGridStore = g_grid.getData(el.find("[id=grid-2]"));
								var linkGridStore = g_grid.getData(el.find("[id=grid-3]"));
								var certStore = monitorTool.IIS6_leave_step4(ele);
								for (var i = 0; i < userUseGridStore.length; i++) {
									userUseGridStore[i]._s = false;
									userUseGridStore[i]._t = "1";
									userUseGridStore[i].performId = "1104016";
								}
								for (var i = 0; i < noUserUseGridStore.length; i++) {
									noUserUseGridStore[i]._s = false;
									noUserUseGridStore[i]._t = "1";
									noUserUseGridStore[i].performId = "1104015";
								}
								for (var i = 0; i < linkGridStore.length; i++) {
									linkGridStore[i]._s = false;
									linkGridStore[i]._t = "1";
									linkGridStore[i].performId = "1104014";
								}
								if (userStatus == "1") 
								{
									userUseGridStore = [];
									monitorDetailStore.userConfigStatus = "1";
									monitorDetailStore.userRateCfgBox = "1";
								} 
								else 
								{
									monitorDetailStore.userConfigStatus = "2";
									monitorDetailStore.userRateCfgBox = "2";
								}
								if (noUserStatus == "1") 
								{
									noUserUseGridStore = [];
									monitorDetailStore.noConfigStatus = "1";
									monitorDetailStore.noUserRateCfgBox = "1";
								} 
								else 
								{
									monitorDetailStore.noConfigStatus = "2";
									monitorDetailStore.noUserRateCfgBox = "2";
								}
								if (linkStatus == "1") 
								{
									linkGridStore = [];
									monitorDetailStore.linkConfigStatus = "1";
									monitorDetailStore.linkRateCfgBox = "1";
								} 
								else 
								{
									monitorDetailStore.linkConfigStatus = "2";
									monitorDetailStore.linkRateCfgBox = "2";
								}
								monitorDetailStore.singleUserUseRate = el.find("[data-id=singleUserUseRate]").val();
								monitorDetailStore.singleNoUserUseRate = el.find("[data-id=singleNoUserUseRate]").val();
								monitorDetailStore.linkRate = el.find("[data-id=linkRate]").val();
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									userUseGridStore : userUseGridStore,
									noUserUseGridStore : noUserUseGridStore,
									linkGridStore : linkGridStore,
									urlStore : urlStore,
									certStore : certStore
								};
								break;
							case "VENUS_FW":/*启明防火墙*/
								certStore = monitorTool.VENUS_FW_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									certStore : certStore
								};
								break;
							case "VENUS_UTM":/*启明星辰抗DDoS(ADM)*/
								certStore = monitorTool.VENUS_UTM_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									certStore : certStore
								};
								break;
							case "VENUS_WAF":/*启明星辰Web应用防火墙(WAF)*/
								certStore = monitorTool.VENUS_WAF_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									certStore : certStore
								};
								break;
							case "VENUS_ADM_DDOS":/*启明星辰抗DDoS(ADM)*/
								certStore = monitorTool.VENUS_ADM_DDOS_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									certStore : certStore
								};
								break;
							case "VENUS":/*启明星辰入侵检测设备IDS*/
								certStore = monitorTool.VENUS_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								monitorDetailStore.arpFlag = 0;
								monitorDetailStore.monitorDatabaseName = "compatible";
								monitorDetailStore.rcCmd = 0;
								monitorDetailStore.scCmd = 0;
								monitorDetailStore.temperRate = "";
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore,
									certStore : certStore
								};
								break;
							case "IBM_STORAGE":
								var certStore = monitorTool.IBM_STORAGE_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									certStore : certStore,
									monitorGroupStore : monitorGroupStore
								};
								break;
							case "IBM_STORAGE_DS5020":
								monitorGroupStore.instStatus = 0;
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore
								};
								break;
							case "NSFOCUS":/*绿盟入侵检测系统*/
								var certStore = monitorTool.NSFOCUS_leave_step4(ele);
								monitorDetailStore.monitorDatabaseName = "compatible";
								monitorDetailStore.rcCmd = "0";
								monitorDetailStore.scCmd = "0";
								monitorGroupStore.instStatus = 0;
								param = {
									certStore : certStore,
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore
								};
								break;
							case "IBM_FC_SWITCH":/*ibm光纤交换机*/
								var certStore = monitorTool.IBM_FC_SWITCH_leave_step4(ele);
								monitorDetailStore.scCmd = el.find("[data-id=scCmd]:checked").length > 0 ? "1" :"0";
								monitorGroupStore.instStatus = 0;
								param = {
									"monitorDetailStore" : monitorDetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "BROCADE":/*博科交换机*/
								var certStore = monitorTool.BROCADE_leave_step4(ele);
								monitorDetailStore.arpFlag = el.find("[data-id=arpFlag]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.rcCmd = el.find("[data-id=rcCmd]:checked").length > 0 ? "1" :"0";
								monitorDetailStore.scCmd = el.find("[data-id=scCmd]:checked").length > 0 ? "1" :"0";
								monitorGroupStore.instStatus = 0;
								var DetailStore = {
									opFlag : (opt.step_5_edit ? "upd" : "add"),
									monitorId : (opt.step_5_edit ? opt.step_5_edit().monitorStore[0].monitorId : "")
								};
								param = {
									"monitorDetailStore" : DetailStore,
									"monitorGroupStore" : monitorGroupStore,
									"certStore" : certStore
								};
								break;
							case "APUSIC_SERVER":/*金蝶应用服务器*/
								monitorDetailStore.monitorMemo = monitorGroupStore.monitorMemo;
								monitorDetailStore.pollDateFlag = "false";
								monitorGroupStore.monitorAgent = el.find("[data-id=monitorAgent]").val();
								monitorGroupStore.instStatus = 0;
								param = {
									monitorGroupStore : monitorGroupStore,
									monitorDetailStore : monitorDetailStore
								};
								break;
							case "ORACLERAC":
								certStore = monitorTool.ORACLERAC_leave_step4(ele);
								monitorGroupStore.instStatus = 0;
								monitorDetailStore.configStatus = el.find("[name=configStatus]:checked").val();
								if (monitorDetailStore.configStatus==1) 
								{
									monitorDetailStore.unifyThreshold = el.find("[data-id=unifyThreshold]").val();
								} 
								else 
								{
									monitorDetailStore.unifyThreshold = "";
								}
								var monitorPerformGridStore = g_grid.getData(el.find("[id=monitorPerformGrid]"));
								for (var i = 0; i < monitorPerformGridStore.length; i++) {
									monitorPerformGridStore[i]._s = false;
									monitorPerformGridStore[i]._t = "1";
									monitorPerformGridStore[i].performId = "1103004";
								}
								param = {
									monitorDetailStore : monitorDetailStore,
									monitorGroupStore : monitorGroupStore,
									certStore : certStore,
									monitorPerformGridStore : monitorPerformGridStore
								};
								break;
							case "RISING":/*瑞星*/

								break;
							case "JUNIPER":/*juniper防火墙*/

								break;
							case "LENOVOVPN":/*联想VPN*/

								break;
							case "LENOVOIDS":/*联想网御入侵检测系统*/

								break;
							case "LEADSEC":/*联想网御星云*/

								break;
							case "NSFOCUS_SAS":/*绿盟安全审计系统*/

								break;
							case "NSFOCUS":/*绿盟入侵检测系统*/

								break;
							case "NSFOCUS_RSAS":/*绿盟远程安全评估系统*/

								break;
							case "RUIJIE_FIREWALL":/*锐捷防火墙*/

								break;
							case "CISCO_ASA":/*思科ASA防火墙*/

								break;
							case "VENUS_NSAS":/*天玥网络安全审计系统*/

								break;
							case "TOPSECAV":/*天融信防病毒网关*/

								break;
							case "TOPSECFW":/*天融信防火墙*/

								break;
							case "TOPSEC_IDS":/*天融信入侵检测系统*/

								break;
							case "VENUST_IDS":/*天阗网络入侵检测与管理系统*/

								break;
							case "SECWORLD":/*网御神州安全设备*/

								break;
							case "MICRPATCH":/*微软补丁服务器*/

								break;
							case "APC_UPS":/*APC UPS*/

								break;
							case "SYMAN_NBU":/*赛门铁克NBU存储设备*/

								break;
							case "HDS_RAID":/*日立HDS磁盘阵列*/

								break;
							case "EMC_VMAX":/*EMC-VMAX10k*/

								break;
						}
						um_ajax_post({
							url : opt.step_5_edit ? "monitorConfig/updMonitorGroup" : "monitorConfig/addMonitorGroup",
							paramObj : param,
							maskObj : "body",
							successCallBack : function(data) 
							{
								g_dialog.operateAlert(null ,"数据提交成功!");
								el.find("[data-id=close]").click();
								opt.submitCbf && opt.submitCbf();
							}
						});
					}
				});
				/*兼容IE9*/
				el.find("[id=monitor_edit_div]").css("opacity" ,"1");
			}

			function step1_init(el) 
			{
				um_ajax_get({
					url : opt.monitorType,
					maskObj : "body",
					successCallBack : function(data) 
					{
						var background_data = data;
						um_ajax_get({
							url : "data/monitor_type.json",
							server : "/",
							successCallBack : function(data) 
							{
								/*渲染监控器类型列表*/
								monitor_param = data[0].monitorType;
								for (var m = 0; m < monitor_param.length; m++) {
									for (var n = 0; n < monitor_param[m].length; n++) {
										for (var i = 0; i < background_data.length; i++) {
											for (var j = 0; j < background_data[i].length; j++) {
												var tar = background_data[i][j];
												var tit = "<div class='col-lg-10'><h2 id='"+tar.id+"'>"+tar.label+"</h2></div>";
												var con = "<div class='col-lg-3 selectBan'><label id='"+tar.id+"' name='"+tar.id+"' class='monitor_config_line_height' data-type='monitor_type_list' style='cursor:pointer;padding:5px'>"+tar.label+"<div id='sele_clo' class='sele_clo' style='float:right;display:none;cursor:pointer;'>x</div></label></div>";
												background_data[i][j].id === monitor_param[m][n]["1"] && el.find("[id=um_step_1]").append(j === 0 ? tit : con);
											}
										}
									}
								}

								el.find(".sele_clo").on("click" ,function(e){
									el.find("[data-id=close]").click();
									renderDialog(templateHtml);
								});

								el.find("[class=monitor_config_line_height]").delegate(el.find("[class=monitor_config_line_height]") ,"click" ,function(e){
									selectType(e);
								});

								opt.step_1_edit && (opt.step_1_edit(),g_mask.mask(el.find("[id=um_step_1]")));
			 					
								function selectType(e) 
								{ 
									if (monitor_type !== undefined && el.find("[data-id=temp_type]").val() !== ""
											&& monitor_type != el.find("[data-id=temp_type]").val()) 
									{
										var alertMsg = "变更监控器类型会重置后面的表单，确定变更吗？";
										g_dialog.operateConfirm(alertMsg ,{
											width : "350px",
											saveclick : function() 
											{
												el.find("[class=buttonFinish]").addClass("buttonDisabled");
												el.find("[data-id=wizard_ul]>li:first-child").siblings().find("a").attr("class" ,"disabled");
												monitor_type = e.currentTarget.id;
												el.find(e.currentTarget).addClass("monitor_config_label_selected").parent().siblings().children().removeClass("monitor_config_label_selected");
												el.find("[class=sele_clo]").hide();
												el.find(e.currentTarget).children().show();
												step5_flag = 1;
												mT_monitorType_v.text("");
												mT_assetIp_v.text("");
												mT_assetName_v.text("");
												mT_monitorType_k.hide();
												mT_assetName_k.hide();
												mT_assetIp_k.hide();
												mT_tit.hide();
											}
										});
									} 
									else 
									{
										monitor_type = e.currentTarget.id;
										el.find(e.currentTarget).addClass("monitor_config_label_selected").parent().siblings().children().removeClass("monitor_config_label_selected");
										el.find("[class=sele_clo]").hide();
										el.find(e.currentTarget).children().show();
									}
									
								}

								function unselectType(e)
								{
									monitor_type = e.currentTarget.parentNode.id;
									el.find("[data-id=temp_type]").val("");
									el.find(monitor_type).removeClass("monitor_config_label_selected");
									el.find("[class=sele_clo]").hide();
								}

							}
						});
					}
				});
			}

			function step2_init(el ,option) 
			{
				var height = el.find(".actionBar").offset().top-el.find("[data-id=wizard_ul]").offset().top+el.find("[data-id=wizard_ul]").height()-170;
				el.find("[id=monitored_asset]").height(height);
				var assetTypeEl,bizEl,secEl;
				var header = [	{text:'资产名称',name:"entityName",searchRender : function(el){
									el.append('<input type="text" search-data="entityName" class="form-control input-sm" />');
									el.append('<input type="hidden" search-data="monitorType" searchCache/>');
									el.find("[search-data=monitorType]").val($("[data-id=temp_type]").val());
								}},
								{text:'IP地址',name:"ipvAddress" ,searchRender:function (el){
								  		index_render_div(el ,{type:"ip"});
								   }},
								{text:'资产类型',name:"entityType" ,searchRender : function (el){
								   	   assetTypeEl = $('<div class="inputdrop" id="entityType"></div>');
								   	   g_formel.sec_biz_render({
								   	   		assetTypeEl : assetTypeEl
								   	   });
								   	   el.append(assetTypeEl);
								   }},
								{text:'操作系统类型',name:"osName" ,searchRender : function (el){
											var osEl = $('<select class="form-control input-sm" search-data="osCode"></select>');
								  		el.append(osEl);
								   	    g_formel.code_list_render({
								   	   		key : "osCodeList",
								   	   		osCodeEl : osEl
								   	    });
								}},
								{text:'安全域简称',name:"securityName" ,searchRender : function (el){
								   	   secEl = $('<div class="inputdrop" id="securityName"></div>');
								   	   g_formel.sec_biz_render({
								   	   		secEl : secEl
								   	   });
								   	   el.append(secEl);
								   }},
								{text:'业务域简称',name:"businessName" ,searchRender : function (el){
								   	   bizEl = $('<div class="inputdrop" id="businessName"></div>');
								   	   g_formel.sec_biz_render({
								   	   		bizEl : bizEl
								   	   });
								   	   el.append(bizEl);
								   }},
								{text:'添加时间',name:opt.step_2_edit ? "createDate" : "assetCreateDate" ,hideSearch:true}
							];

				/*新增，修改时，资产列表不同的渲染（包括单资产与多资产）*/
				if (opt.step_2_edit) /*修正参数edId*/
				{
				var eData = opt.step_2_edit().monitorStore[0];
				eData.edId = opt.step_2_edit().monitorDeviceStore[0].edId;
				if ($("[data-id=temp_type]").val()=="ORACLERAC") 
				{
					eData = opt.step_2_edit().monitorStore;
					for (var i = eData.length - 1; i >= 0; i--) {
						eData[i].edId = opt.step_2_edit().monitorDeviceStore[i].edId;
					}
				}
				}
				opt.step_2_edit
				?	g_grid.render(el.find("[id=monitored_asset]"),{
						header : header,
						data : ($("[data-id=temp_type]").val()=="ORACLERAC" ? opt.step_2_edit().monitorStore : [eData]),
						maskObj : "body",
						paginator : false,
						hideSearch : true,
						hideSort : true,
						isLoad : true,
						cbf : function(){
							el.find("[id=monitored_asset]").find("[data-id=check_inp]").click();
							um_ajax_get({
								url : "monitorConfig/queryNoMonitoreDeviceList",
								maskObj : "body",
								paramObj : {monitorType : el.find("[data-id=temp_type]").val(),queryTag : "query"},
								successCallBack : function(data){
									var tmpData = [];
									for (var i = 0; i < data.length; i++) {
										if (!(eData && (eData.edId == data[i].edId)))
										{
											data[i].createDate = data[i].assetCreateDate;
											tmpData.push(data[i]);
										}
									}
									g_grid.addData(el.find("[id=monitored_asset]"), tmpData);
									if ($("[data-id=temp_type]").val()!="ORACLERAC") 
									{
										var ele = el.find("[id=monitored_asset]");
										ele.find("[data-id=check_all]").next().hide();
										ele.find(".i-checks").addClass("radioStyle");
										ele.find("[type=checkbox]").change(function(){
											ele.find("[type=checkbox]").not(this).attr("checked" ,false); 
											assetChanged = true;
											allowSubmmitStep2 = false;
										});
									}
								}
							});
						}
					})
				:	g_grid.render(el.find("[id=monitored_asset]"),{
						url : "monitorConfig/queryNoMonitoreDeviceList",
						header : header,
						maskObj : "body",
						paramObj : {monitorType : el.find("[data-id=temp_type]").val(),queryTag : "query"},
						isLoad : true,
						hideSort : true,
						cbf : function(){
							if ($("[data-id=temp_type]").val()!="ORACLERAC") 
							{
								var ele = el.find("[id=monitored_asset]"); 
								ele.find("[data-id=check_all]").next().hide();
								ele.find(".i-checks").addClass("radioStyle");
								ele.find("[type=checkbox]").change(function(){
									ele.find("[type=checkbox]").not(this).attr("checked" ,false); 
									assetChanged = true;
								});
							}
						}
					}); 
			}

			function step3_init(el) 
			{
				if (false == step3_inited) {
				el.find("[data-id="+el.find("[data-id=temp_name]").val()+"]").one(function(){
					$(this).append(data);
				});
				um_ajax_get({
					url : "monitorConfig/queryMonitorAgent",
					maskObj : "body",
					successCallBack : function (data) 
					{
						for (var i = 0; i < data.length; i++) {
							el.find("[data-id=monitorAgent]").append('<option name="monitorAgent" value="'+data[i].agentId+'">'+data[i].agentName+'</option>');
						}
						/*修改时，第三步渲染*/
						if (opt.step_3_edit) 
						{
							var eData = opt.step_3_edit().monitorStore[0];
							eData.status = eData.monitorManageStatus;
							$("[data-id=groupName]").val(eData.monitorName);
							$("[data-id=temp_agent]").val(eData.monitorAgent);
							el.find("[data-id=monitorAgent]").attr("disabled","disabled");
							el.find("[id=base_info]").umDataBind("render" ,eData);
							el.find("select").trigger("change");
							el.find("[data-id=remark]").val(eData.monitorMemo);
						} 
						else 
						{
							$("[data-id=monitorAgent]").val(data[0].agentId).trigger("change");
						}
						/*根据不同的轮询单位，设置不同的轮询时间校验*/
						el.find("[data-id=pollUnit]").change(function(){
							if($(this).val() == "1") 
							{
								el.find("[data-id=pollDate]").attr("validate" ,"required,between3~59");
							} 
							else if ($(this).val() == "2") 
							{
								el.find("[data-id=pollDate]").attr("validate" ,"required,between1~24");
							} 
							else 
							{
								el.find("[data-id=pollDate]").attr("validate" ,"required,between1~24");
							}
						});
					}
				});
				step3_inited = true;
				}
			}
			function step4_init(el) 
			{
				var moniType = el.find("[data-id=temp_type]").val();
				var no_step4_list = ["NETKEEPER","COMMON_JMX","DB2","DB2_HA","MYSQL","ORACLE_ASM",
														"SQLSERVER","SYBASE","APACHE","TOMCAT","TOMCAT_HA",
														"COMMONTCP","WEBSERVICE","PING","COMMON_URL","WINDOWS_HA",
														"WEBSPHERE","COMMONDB","PORT_MONITOR","APUSIC_SERVER","IBM_STORAGE_DS5020","MICRPATCH"];
				var certUrl = no_step4_list.indexOf(moniType) > -1 ? "tpl/monitor_config/404_step4.html" : "tpl/monitor_config/step4.html";
	      el.find("#um_step_4").empty();
				$.ajax({
					type : "GET",
					url : certUrl,
					success : function(data) 
					{
						el.find("#um_step_4").html(data);
						var height = el.find(".actionBar").offset().top-el.find("[data-id=wizard_ul]").offset().top+el.find("[data-id=wizard_ul]").height()-90;
						el.find("[data-id=data-list]").height(height);
						return false;
					}
				});
				if (no_step4_list.indexOf(moniType) == -1) 
				{
			  	var monitored_asset_id = (opt.step_4_edit && ""===assetOld) ? opt.step_4_edit().deviceSourceTypeStore[0].edId : el.find("[data-id=temp_monitored_asset]").val().split(",");
				} 
				else  
				{
					return false;
				}
			  el.find("[data-id=edit_box]").hide();
		  	var edIds = (opt.step_4_edit && ""===assetOld) ? monitored_asset_id : monitored_asset_id.join("");
			  um_ajax_post({
			    url : "AssetOperation/queryAssetTelnetAndSSHAndSnmp",
			    paramObj : {edIds:edIds},
			    maskObj : "body",
			    successCallBack : function(data) 
			    {
			    	var certVos = data;
						var header = [
							{text:'',name:"",width:10,render:function (){
								return '<i class="icon-plus" data-flag="col-expand" style="color:#000;width:30px;height:30px;line-height:30px;"></i>';
							},searchRender: function (){return ""}},
							{text:'被监控资产IP',name:"edIp",width:90,hideSearch:true}
						 ];
						var listData = [];
						var tempData = $("[data-id=temp_monitored_asset_ip]").val().split(",");
						for (var i = 0; i < tempData.length; i++) {
							listData.push({"edIp" : tempData[i]});
						}
						if (opt.isEdit && ""===assetOld) 
						{
							var detailData = opt.step_4_edit && opt.step_4_edit().monitorStore[0].ipvAddress;
							listData = [{"edIp" : detailData}];
							if (opt.step_4_edit().monitorStore[0].monitorType=="ORACLERAC") 
							{
								listData = [];
								for (var i = 0; i < opt.step_4_edit().monitorStore.length; i++) {
									listData.push({"edIp":opt.step_4_edit().monitorStore[i].ipvAddress});
								}
							}
						}
						g_grid.render(el.find("[data-id=data-list]"),{
							header:header,
							data:listData,
							allowCheckBox:false,
							hideSearch:true,
							hasExpand:true,
							paginator:false,
							hideSort:true,
							cbf:function(){
								el.find("[data-flag=col-expand]").each(function(i){
									var trEl = $(this).closest("tr");
									var buffer = [];
									buffer.push('<tr class="expand-tr cert_form" style="display:none;"><td colSpan="10"><div style="padding:10px 10px 50px 10px" data-flag="col-div">');
									buffer.push("</div><td></tr>");
									trEl.after(buffer.join(""));
									var el_next_tr_div = trEl.next().find("[data-flag=col-div]");
									/*引入凭证模板*/
									var tempUrl = "tpl/monitor_config/step4/"+moniType+".html";
									$.ajax({
										url:tempUrl, 
										success:function(data) 
										{ 
											trEl.next().find("[data-flag=col-div]").append(data);
											/*第四步凭证信息回显数据*/
											if (moniType=="ORACLERAC") 
											{
												el = trEl.next().find("[data-flag=col-div]");
											}
											monitorTool[moniType+"_step4"] && monitorTool[moniType+"_step4"](el ,{"detail":opt.step_4_edit && opt.step_4_edit() || {},"Vos":certVos,"flag":(opt.isEdit ? "upd" : "add"),"index":i});
											trEl.next().hide();
											if (moniType!="ORACLERAC")  
											{
												$("[data-id=data-list]").find("[data-flag=col-expand]").eq(0).click();
											}
											index_form_init(el);
											g_validate.init(el);
											assetChanged = false;
										}
									});
								}); 
							}
						});

						$("[data-id=data-list]").on("click" ,"[data-flag=col-expand]" ,function (){
							$(this).toggleClass("icon-minus");
							var trEl = $(this).closest("tr");
							var rowData = trEl.data("data");
							/*展开*/
							if ($(this).hasClass("icon-minus"))
							{
								$("[data-id=data-list]").find("[class*=expand-tr]").hide();
								$("[data-id=data-list]").find("[data-flag=col-expand]").not(this).attr("class" ,"icon-plus");
								if (trEl.next().hasClass("expand-tr"))
								{
									trEl.next().show();
								} 
								/*获取vlan信息*/
								$(this).find("[data-type=vlan_btn]").click(function(){
									var obj = {
										monitorType : el.find("[data-id=temp_type]").val(),
										assetIds : el.find("[data-id=temp_monitored_asset]").val(),
										agentId : el.find("[data-id=monitorAgent]").val(),
										loginPrompt : $("[data-id=loginPrompt]").val(),
										commandPrompt : $("[data-id=commandPrompt]").val(),
										passwordPrompt : $("[data-id=passwordPrompt]").val(),
										monitorUserName : $("[data-id=monitorUserName]").val(),
										monitorPassWord : $("[data-id=monitorPassWord]").val(),
										trustPassWord : $("[data-id=trustPassWord]").val()
									};
									um_ajax_get({
										url : "monitorConfig/doVlan",
										paramObj : obj,
										maskObj : "body",
										successCallBack : function (data){
											g_dialog.operateAlert(el ,data);
										}
									});
								});
							}
							/*收起*/
							else
							{
								trEl.next().hide();
							}
						});
			    }
			  });
			  }

			function step5_init(el) 
			{
				var monType = el.find("[data-id=temp_type]").val();
				um_ajax_get({
					url : "data/monitor_config/monitor_config.json",
					server : "/",
					maskObj : "body",
					successCallBack : function(data) 
					{
						$.ajax({
							type : "GET",
							url : data[monType].url,
							success : function(data) 
							{
								if (step5_flag == 1) 
								{
									el.find("#um_step_5").empty();
									el.find("[id=um_step_5]").html(data);
									var detailData = opt.step_5_edit && opt.step_5_edit();
									opt.step_5_edit ? monitorTool[monType + "_init"](el.find("#um_step_5") ,{detail:detailData}) : monitorTool[monType + "_init"](el);
									index_form_init(el);
									g_validate.init(el);
								} 
								step5_flag = 0;
								/*第五步中的测试配置按钮*/
								$("[data-type=test_btn_in_step5]").click(function(){
									var obj = monitorTool[monType+"_step5_test"] && monitorTool[monType+"_step5_test"]($("#sfxxdj_div"));
									um_ajax_post({
										url : "monitorConfig/doTest",
										paramObj : obj,
										maskObj : "body",
										successCallBack : function (data){
											g_dialog.dialog('<div class="p10" id="test_alert"></div>' ,{
												width : "400px",
												title : "测试结果",
												isDetail : true,
												init : function(el){
													el.find("[id=test_alert]").html(data.teststore && data.teststore.length > 0 && data.teststore[0].result);
												}
											});
										}
									});
								});
							}
						});
					}
				});
			}

			function save(el ,saveObj)
			{

			}
		},
		monitorStatusChart : function (el ,opt)
		{
			var time = opt.time;
			var data = opt.data;
			var statusMap = new HashMap();
			statusMap.put("-2" ,"bggrey");
			statusMap.put("-1" ,"bggrey");
			statusMap.put("0" ,"bggreen");
			statusMap.put("1" ,"bggrey");
			statusMap.put("2" ,"bgdeepblue");
			statusMap.put("3" ,"bgorange");
			statusMap.put("4" ,"bgred");
			el.append("<span>名称："+opt.name+"</span>");
			//var hourInt = parseInt(g_moment(time).format("HH"));
			for (var i = 24; i >= 1; i--) {
				el.append('<div><div></div><p>'+g_moment(time).subtract((i-1) ,"hours").format("HH")+'</p></div>');
			}
			if (data)
			{
				for (var i=0;i<data.length;i++)
				{
					for (var j = 0; j < data[i].length; j++) {
						el.append('<div class="scale-unit '+statusMap.get(data[i][j])+'"></div>');
					}
				}
			}
		}
	};

});


