define(['/js/plugin/tab/tab.js' ,'inputdrop' ,
		'/js/plugin/wizard/wizard.js'] ,function (tab ,inputdrop ,wizard){

	var version_map = new HashMap();
	version_map.put("1" ,"SNMP V1");
	version_map.put("2" ,"SNMP V2c");
	version_map.put("3" ,"SNMP V3");

	var authWay_map = new HashMap();
	authWay_map.put("" ,"");
	authWay_map.put("1" ,"SHA");
	authWay_map.put("2" ,"MD5");

	var encryptionWay_map = new HashMap();
	encryptionWay_map.put("" ,"");
	encryptionWay_map.put("1" ,"3DES");
	encryptionWay_map.put("2" ,"AES128");
	encryptionWay_map.put("3" ,"AES192");
	encryptionWay_map.put("4" ,"AES256");
	encryptionWay_map.put("5" ,"DES");

	// 资产详情url
	var right_asset_detail_url = "AssetOperation/queryAssetDetail";
	// 表单树类型
	var form_tree_url = "AssetOperation/queryDialogTreeList";
	// codeList
	var form_codeList_url = "rpc/getCodeList";
	// 自定义属性
	var form_custom_attr_url = "AssetOperation/queryCustomProperty";
	// 获取IP列表
	var form_asset_ip_conflict_url = "AssetOperation/doBatchAssetIpConflict";
	// 资产批量修改
	var asset_batch_UpdAsset_url = "AssetOperation/batchUpdAsset";

	return {
		detailDialog : function (opt)
		{
			$.ajax({
				type: "GET",
				url: "js/plugin/asset/asset.html",
				success :function(data)
				{
					g_dialog.dialog(data,{
						width:"900px",
						init:init,
						initAfter:initAfter,
						title : "资产详细信息",
						isDetail:true,
						top:"6%"
						//autoHeight : "autoHeight"
					});

					function init(el){
						tab.tab(el.find("[id=tab]"),{oper : [null,null,null,function (){
							change_record_list(el ,opt.id);
						}]});						

						el.find("[data-id=snmpVersion]").change(function (){
							var id = $(this).val();
							if (id == "1" || id == "2")
							{
								el.find("[id=snmp_v1]").show();
								el.find("[id=snmp_v3]").hide();
							}
							else
							{
								el.find("[id=snmp_v1]").hide();
								el.find("[id=snmp_v3]").show();
							}
						});
					}

					function initAfter(el){
						um_ajax_get({
							url : "AssetOperation/queryAssetDetail",
							paramObj : {edId : opt.id ,mainIp : opt.mainIp},
							successCallBack : function (data){
								$("#asset_div").umDataBind("render" ,data.assetStore);
								el.find("[data-id=cpu]").html(data.assetStore.cpu);
								$("#asset_append_div").umDataBind("render" ,data.assetAppendStore);
								$("#tab_snmp").umDataBind("render" ,data.assetSnmpStore);
								if (data.assetSnmpStore.snmpCommunity && data.assetSnmpStore.snmpCommunity.length != 0)
								{
									el.find("[data-id=snmpCommunity]").text(data.assetSnmpStore.snmpCommunity.replace(/./g ,"*"));
								}
								if (data.assetSnmpStore.snmpWCommunity && data.assetSnmpStore.snmpWCommunity.length != 0)
								{
									el.find("[data-id=snmpWCommunity]").text(data.assetSnmpStore.snmpWCommunity.replace(/./g ,"*"));
								}
								el.find("[data-id=authWay]").text(authWay_map.get(data.assetSnmpStore.authWay));
								el.find("[data-id=encryptionWay]").text(encryptionWay_map.get(data.assetSnmpStore.encryptionWay));
								if(data.assetSnmpStore.authPwd && data.assetSnmpStore.authPwd.length != 0)
								{
									el.find("[data-id=authPwd]").text(data.assetSnmpStore.authPwd.replace(/.*/g ,"*"));
								}
								
								if(data.assetSnmpStore.encryptionPwd && data.assetSnmpStore.encryptionPwd.length != 0)
								{
									el.find("[data-id=encryptionPwd]").text(data.assetSnmpStore.encryptionPwd.replace(/.*/g ,"*"));
								}
								$("#tab_telnet").umDataBind("render" ,data.telnetStore);
								$("#tab_ssh").umDataBind("render" ,data.sshStore);
								$("#lend_out_div").umDataBind("render" ,data.borrowStore);
								//$("#custom_div").umDataBind("render" ,data.costomPropertyStore);
								custom_div_render();
								function custom_div_render(){
									var el_form_custom_attr = $("#custom_div").find("form");
				    		 		var tmpObj;
				    		 		var isRequired = "";
				    		 		data.propertyStore = data.costomPropertyStore;
				    		 		for (i = 0; i < data.propertyStore.length; i++)
				    		 		{
				    		 			
				    		 			tmpObj = data.propertyStore[i];
				    		 			isRequired = (tmpObj.nullable == "1" ? "" : "required");
				    		 			 //第0行 2行
				    		 			 if (i%2 == 0)
				    		 			 {
											el_form_custom_attr.append('<div class="form-group" data-group="'+i+'">'
												+'<label class="col-lg-3 control-label tr">'+tmpObj.columnName+'：</label>'
												+'<label class="col-lg-3 control-label tl">'+tmpObj.dataValue+'</label></div>');
											
				    		 			 }
				    		 			 if ((i+1)%2 == 0)
				    		 			 {
				    		 			 	el_form_custom_attr.find("[data-group="+(i-1)+"]").append('<label class="col-lg-2 control-label tr">'+tmpObj.columnName+'：</label>'
												+'<label class="col-lg-3 control-label tl">'+tmpObj.dataValue+'</label>');
				    		 			 }
				    		 			isRequired = "";
				    		 		}
								}
								
			    		 		el.find("[data-id=snmpVersion]").change();
								el.find("[data-id=snmpVersion]").attr("disabled" ,"disabled");
								el.find("[data-id=snmp]").css("margin-top" ,"6px");
								el.find("[data-id=snmp]").html(el.find("[data-id=snmpVersion]").find("option:selected").text());
							}
						});

					}
				}
			});
		},
		queryDialog : function (opt){
			$.ajax({
				type: "GET",
				url: "js/plugin/asset/asset_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=query_template]"),{
						width:"1000px",
						init:init,
						initAfter:initAfter,
						saveclick:save_click,
						title:"资产查询"
					});
				}
			});
			function init(el)
			{
				el.find("[name=ipRadioStatus]").click(function (){
					if ($(this).val() == "0")
					{
						el.find("[id=ipRadioStatusStartIp]").removeAttr("disabled");
						el.find("#ipRadioStatusEndIp").removeAttr("disabled");
						el.find("#ipRadioStatusIpv6").attr("disabled" ,"disabled");
						el.find("#ipRadioStatusIpv6").val("");
					}
					else
					{
						el.find("#ipRadioStatusStartIp").attr("disabled" ,"disabled");
						el.find("#ipRadioStatusEndIp").attr("disabled" ,"disabled");
						el.find("#ipRadioStatusIpv6").removeAttr("disabled");
						el.find("#ipRadioStatusStartIp").val("");
						el.find("#ipRadioStatusEndIp").val("");
					}
				});
			}
			function initAfter(el)
			{
				g_formel.sec_biz_render({secEl:el.find("[id=securityDomain]")});
		    	g_formel.sec_biz_render({bizEl:el.find("[id=bussinessDomain]")});
		    	g_formel.sec_biz_render({assetTypeEl:el.find("[id=assetType]")});

		    	g_formel.code_list_render({
									   	   		key : "osCodeList",
									   	   		osCodeEl : el.find("[data-id=osType]")
									   	    });

			}
			function save_click(el ,saveObj)
			{
				opt.saveclick && opt.saveclick(saveObj,opt.selfEl);
				g_dialog.hide(el);
			}
		},
		editDialog : function (opt){
			var rowData = opt.rowData;
			var type = opt.type;
			var cbf = opt.cbf;
			var snmpMap = new HashMap();
			if (opt.detailUrl)
			{
				right_asset_detail_url = opt.detailUrl;
			}

			$.ajax({
				type: "GET",
				url: "module/monitor_info/asset_info/oper_asset_tpl.html",
				success :function(data)
				{
					g_dialog.dialogFullScreen($(data).find("[id=asset_add]"),{
						 width:"950px",
						 height:"500px",
						 init:init,
						 initAfter:initAfter,
						 title:"资产编辑"
					});
				}
			});

			function init(el)
			{
				if (type == "batch")
				{
					step0_init(el);
					el.find("[id=step_1]").parent().toggleClass("first-child");
					el.find("[id=um_step_1]").find("[data-type=area_div]").remove();
					el.find("[id=um_step_1]").find("[data-type=ip_mac_add]").remove();
					el.find("[id=step_4]").remove();
					el.find("[id=um_step_4]").remove();
					el.find("[id=step_1]").find("label").html("2");
					el.find("[id=step_2]").find("label").html("3");
					el.find("[id=step_3]").find("label").html("4");
				}
				else if (type == "backup"){
					el.find("[id=step_0]").remove();
					el.find("[id=um_step_0]").remove();
					el.find("[id=step_4]").remove();
					el.find("[id=um_step_4]").remove();
					el.find("[id=step_5]").find("label").html("4");
				}
				else
				{
					el.find("[id=step_0]").remove();
					el.find("[id=um_step_0]").remove();
				}
				el.find("[id=sfxxdj_div]").css("opacity" ,"0");
				index_create_asset_status_select_el(el.find("[data-id=edTempStatus]"));
				el.find("[data-id=snmpVersion]").change(function (){
					var id = $(this).val();
					el.find("[id=snmp_info]").show();
					if (id == "1" || id == "2")
					{
						el.find("[id=snmp_v1]").show();
						el.find("[id=snmp_v3]").hide();
					}
					else if (id == "")
					{
						el.find("[id=snmp_info]").hide();
					}
					else
					{
						el.find("[id=snmp_v1]").hide();
						el.find("[id=snmp_v3]").show();
					}
				});

				el.find("[data-type=test_btn]").click(function (){
					snmp_telnet_ssh2_test(el ,$(this).attr("data-url") ,$(this).attr("data-tab"));
				});

				el.find("[data-id=assetValue]").change(function (){
					if ($(this).val() != "")
					{
						g_validate.clear([$(this)]);
					}
				});
			}

			function initAfter(el)
			{
				g_dialog.waitingAlert();

				el.find('[id=sfxxdj_div]').smartWizard({
			  	  labelPrevious : "上一步",
			  	  labelNext : "下一步",
			  	  labelFinish:"提交",
			  	  onLeaveStep: function (step ,selStep){
			  		  var form_el = el.find("[id=um_"+step[0].id+"]");
			  		  if (selStep[0].id > step[0].id)
			  		  {
			  		  	  if (step[0].id == "step_0")
				  		  {
				  		  	  form_el.find("[data-id=batchIpRange]").val(ip_range_create(form_el));
				  		  	  if (!form_el.find("[data-id=batchIpRange]").val())
				  		  	  {
				  		  	  	  g_dialog.operateAlert(form_el ,"请选择IP" ,"error");
				  		  	  }
				  		  	  else
				  		  	  {
				  		  	  	return true;
				  		  	  }
				  		  }
				  		  else
				  		  {
				  		  	  return g_validate.validate(form_el);
				  		  }
			  		  }
			  		  else
			  		  {
			  		  	  return true;
			  		  }
			  	  },
			  	  onShowStep: function (step){
			  	  	if (step[0].id == "step_3")
			  	  	{
			  	  		var el_form_base_info = el.find("[id=um_step_1]").find("form");
			  	  		var ip_info = ip_mac_data_get(el_form_base_info);
			  	  		if (el_form_base_info.find("[data-id=osType]").val() == "107")
			  	  		{
			  	  			el.find("[data-id=tab-ul]").find("li").eq(1).hide();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(2).hide();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(3).show();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(4).hide();
			  	  		}
			  	  		else
			  	  		{
			  	  			el.find("[data-id=tab-ul]").find("li").eq(1).show();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(2).show();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(3).hide();
			  	  			el.find("[data-id=tab-ul]").find("li").eq(4).hide();
			  	  		}
			  	  		if (ip_info.mainIp)
			  	  		{
			  	  			el.find("[data-val*=test_ip]").find("option").remove();
			  	  			testIpSelRender(el ,"test_ip1" ,ip_info.mainIp);
			  	  			testIpSelRender(el ,"test_ip2" ,ip_info.mainIp);
			  	  			testIpSelRender(el ,"test_ip3" ,ip_info.mainIp);
			  	  			testIpSelRender(el ,"test_ip4" ,ip_info.mainIp);
			  	  			testIpSelRender(el ,"test_ip5" ,ip_info.mainIp);
			  	  		}
			  	  	}
			  	  },
			  	  onFinish:function (){
					oper_asset_save(el ,cbf ,opt.updateUrl);
			  	  }
			    });

			    el.find("[id=sfxxdj_div]").css("opacity" ,"1");

				// 第一层
			    um_ajax_get({
			 	    url: form_tree_url,
				    isLoad: false,
				    successCallBack:function (data){
				        // 渲染业务域
					    inputdrop.renderTree(el.find('[id=bussinessDomainId]') ,data.businessDomainTreeStore);
					    // 渲染安全域
					    inputdrop.renderTree(el.find('[id=securityDomainId]') ,data.securityDomainTreeStore);
					    // 渲染资产类型
					    inputdrop.renderTree(el.find('[id=assetTypeId]') ,data.assetTypeTreeStore ,{enableChk:false});
					    tab.tab(el.find("[id=tab]") ,{
					    	oper:[]
					    });

					    // 第二层
					    um_ajax_get({
					    	url: form_codeList_url,
					    	isLoad: false,
					    	paramObj : {key:"assetModelCodeList,osCodeList,factoryManageList,snmpCodelist,computerRoomLocationList"},
					    	successCallBack:function (data){
					    		var data2 = data.assetModelCodeList;
					    		for (var i = 0; i < data2.length; i++) {
					    			data2[i].id = data2[i].codevalue;
					    			data2[i].text = data2[i].codename;
					    		}
					    		el.find("[data-id=assetModel]").select2({
					    			data:data2,width:"100%"
					    		});

					    		var data1 = data.osCodeList;
					    		for (var i = 0; i < data1.length; i++) {
					    			data1[i].id = data1[i].codevalue;
					    			data1[i].text = data1[i].codename;
					    		}
					    		el.find("[data-id=osType]").select2({
					    			data:data1,width:"100%"
					    		});

					    		var data3 = (data.factoryManageList?data.factoryManageList:[]);
					    		for (var i = 0; i < data3.length; i++) {
					    			data3[i].id = data3[i].supCode;
					    			data3[i].text = data3[i].supName;
					    		}
					    		data3.insert(0 ,{id:"-1" ,text:"---"});
					    		el.find("[data-id=supplierId]").select2({
					    			data:data3,width:"100%"
					    		});

					    		var data4 = data.snmpCodelist;
					    		for (var i = 0; i < data4.length; i++) {
					    			data4[i].id = data4[i].codevalue;
					    			data4[i].text = data4[i].codename;
					    			snmpMap.put(data4[i].id ,data4[i]);
					    		}
					    		data4.insert(0 ,{id:"-1",text:"---"});
					    		el.find("[data-id=snmpName]").select2({
					    			data:data4,width:"100%"
					    		});

					    		initSnmpEvent(el ,rowData ,snmpMap);

					    		inputdrop.renderTree(el.find('[id=locationCb]') ,data.computerRoomLocationList ,{
					    									pId:"pldNo",
					    									label:"ldName",
					    									id:"ldNo",
					    									enableChk:false
					    							});

					    		 //第三层
					    		 um_ajax_get({
					    		 	url : form_custom_attr_url,
					    		 	isLoad : false,
					    		 	successCallBack:function (data){
					    		 		var el_form_custom_attr = el.find("[id=um_step_5]").find("form");
					    		 		var tmpObj;
					    		 		var isRequired = "";
					    		 		for (var i = 0; i < data.propertyStore.length; i++)
					    		 		{
					    		 			tmpObj = data.propertyStore[i];
					    		 			isRequired = (tmpObj.nullable == "1" ? "" : "required");
					    		 			 //第0行 2行
					    		 			 if (parseInt(i%2) == 0)
					    		 			 {
												el_form_custom_attr.append('<div class="form-group">');
					    		 			 }
					    		 			
					    		 			el_form_custom_attr.append('<label class="col-lg-2 control-label '+isRequired+'">'+tmpObj.columnName+'</label>');
					    		 			el_form_custom_attr.append('<div class="col-lg-3"><input type="text" class="form-control input-sm" validate="'+isRequired+'"></div>');

					    		 			//第1行 3行
					    		 			if (parseInt((i+1)%2) == 0)
					    		 			{
					    		 				el_form_custom_attr.append('</div>');
					    		 			}
					    		 			
					    		 			isRequired = "";
					    		 		}
					    		 		form_custom_attr_list = data.propertyStore;
					    		 		// 第四层
					    		 		if (rowData)
										{
											um_ajax_get({
												url : right_asset_detail_url,
												paramObj : {edId : rowData.edId ,mainIp:rowData.mainIp},
												isLoad : false,
												successCallBack : function (data){
													oper_asset_render(el ,data);
													g_dialog.waitingAlertHide();
												}
											});
										}
										if (!rowData)
										{
											g_dialog.waitingAlertHide();
										}
										
					    		 	}
					    		 });			    		
					    	}
					    });
					    //添加的时候获取责任人列表
					    um_ajax_get({
							url: "AssetOperation/queryResponsePerson",
					    	isLoad: false,
					    	successCallBack:function (data){
					    		for (var i = 0; i < data.length; i++) {
									el.find("[data-id=liablePersonId]").append('<option value="'+data[i].userId+'">'+data[i].userName+'</option>');
								}
								// el.find("[data-id=liablePersonId]").on('select2:selecting', function (evt) {
								//   	if (el.find("[data-id=liablePersonId]").val() && el.find("[data-id=liablePersonId]").val().length >= 2)
								//   	{
								//   		return false;
								//   	}
								// });
					    	}
					    });
				    }
			    });

				// 资产价值开关
		  		el.find("[name=isComputeRisk]").click(function (){
					var tmp = $(this).val();
					if (tmp == "1"){
						el.find("[data-id=assetValue]").removeAttr("disabled");
					}
					else if (tmp == "0"){
						el.find("[data-id=assetValue]").attr("disabled","disabled");
						g_validate.clear([$("[data-id=assetValue]")]);
					}
				});

			    el.find("[id=ip_mac_add_i]").click(function (){
					ip_mac_add(el.find("[id=ip_mac_table]"));
			    });

			    el.find("[id=asset_find]").click(function (){
			    	var ip_info = ip_mac_data_get(el.find("[id=um_step_1]").find("form"));
			    	var bussinessDomainId = el.find("[data-id=bussinessDomainId]").val();
			    	var securityDomainId = el.find("[data-id=securityDomainId]").val();
			    	if (!ip_info.mainIp)
			    	{
			    		g_dialog.operateAlert(el ,"请选择主IP" ,"error")
			    		return false;
			    	}
					um_ajax_get({
						url : "AssetOperation/findAssetByIp",
						paramObj : {bussinessDomainId:bussinessDomainId,
									securityDomainId:securityDomainId,
									mainIp:ip_info.mainIp},
						maskObj : "body",
						successCallBack : function (data){
							if (data.assetStore && data.assetStore.osType)
							{
								el.find("[data-id=osType]").val(data.assetStore.osType);
								el.find("[data-id=osType]").trigger("change");
							}
							if (data.assetStore && data.assetStore.assetTypeId)
							{
								inputdrop.setDataTree(el.find("[id=assetTypeId]") ,data.assetStore.assetTypeId);
							}
							if (data.assetStore && data.assetStore.mainMac)
							{
								$("[class*=icon-star]").not("[class*=gc]")
														.closest('tr').find("td").eq(1).html(data.assetStore.mainMac);
							}
						}
					});
			    });

			    //validate.init($("#form"));
			}
		},
		batchEditDialog : function (opt){
			var title = "资产批量修改";
			if(opt.title)
			{
				title = opt.title;
			}
			$.ajax({
					type: "GET",
					url: "module/monitor_info/asset_info/oper_asset_tpl.html",
					success :function(data)
					{
						g_dialog.dialog($(data).find("[id=asset_batch_update]"),{
							width:"550px",
							init:init,
							initAfter:initAfter,
							saveclick:save_click,
							title:title
						});
						function init(el)
						{	
							g_validate.init($("#asset_batch_update"));
							el.find("[name=check_all]").click(function(){
								if($(this).is(":checked"))
						   		{
						   			el.find("[type=checkbox]").not("[name=check_all]").prop("checked","checked");
						   			el.find("[data-id=assetValue]").attr("validate","required");
						   			el.find("[id=assetTypeId]").find("input").eq(0).attr("validate","required");
						   			el.find("[id=securityDomainId]").find("input").eq(0).attr("validate","required");
						   			el.find("[id=bussinessDomainId]").find("input").eq(0).attr("validate","required");
						   			el.find("[data-id=osType]").attr("validate","required");
									el.find("[data-id=liablePersonId]").attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[type=checkbox]").not("[name=check_all]").removeAttr("checked");
						   			el.find("[data-id=assetValue]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=assetValue]")]);
									el.find("[id=assetTypeId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=assetTypeId]")]);
									el.find("[id=securityDomainId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=securityDomainId]")]);
									el.find("[id=bussinessDomainId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=bussinessDomainId]")]);
									el.find("[data-id=osType]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=osType]")]);
									el.find("[data-id=liablePersonId]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=liablePersonId]")]);
						   		}
							});

					  		el.find("[name=isComputeRisk]").click(function (){
								var tmp = $(this).val();
								if (tmp == "1"){
									el.find("[data-id=assetValue]").removeAttr("disabled");
								}
								else if (tmp == "0"){
									el.find("[data-id=assetValue]").attr("disabled","disabled");
									g_validate.clear([$("[data-id=assetValue]")]);
								}
							});

							el.find("[data-flag*=assetValue]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[data-id=assetValue]").attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[data-id=assetValue]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=assetValue]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });
							
						   el.find("[data-flag=assetTypeId]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[id=assetTypeId]").find("input").eq(0).attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[id=assetTypeId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=assetTypeId]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });

						   el.find("[data-flag=securityDomainId]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[id=securityDomainId]").find("input").eq(0).attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[id=securityDomainId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=securityDomainId]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });

						   el.find("[data-flag=bussinessDomainId]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[id=bussinessDomainId]").find("input").eq(0).attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[id=bussinessDomainId]").find("input").eq(0).removeAttr("validate");
						   			g_validate.clear([$("[id=bussinessDomainId]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });

						   el.find("[data-flag=osType]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[data-id=osType]").attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[data-id=osType]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=osType]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });

						   el.find("[data-flag=liablePersonId]").click(function(){
						   		if($(this).is(":checked"))
						   		{
						   			el.find("[data-id=liablePersonId]").attr("validate","required");
						   		}
						   		else
						   		{
						   			el.find("[data-id=liablePersonId]").removeAttr("validate");
						   			g_validate.clear([$("[data-id=liablePersonId]")]);
						   			el.find("[name=check_all]").removeAttr("checked");
						   		}
						   });

						   el.find("[data-id=assetValue]").change(function (){
						   });

						   opt.init && opt.init(el);
						}

						function initAfter(el)
						{
							g_dialog.waitingAlert(el);
							// 资产类型
					  		um_ajax_get({
					  			url : form_tree_url,
					  			isLoad : false,
					  			successCallBack : function (data){
					  				inputdrop.renderTree(el.find("[id=assetTypeId]"),data.assetTypeTreeStore ,{enableChk:false});
					  				// 安全域
							  		um_ajax_get({
							  			url : form_tree_url,
							  			isLoad : false,
							  			successCallBack : function (data){
							  				inputdrop.renderTree(el.find("[id=securityDomainId]"),data.securityDomainTreeStore);
							  				// 业务域
									  		um_ajax_get({
									  			url : form_tree_url,
									  			isLoad : false,
									  			successCallBack : function (data){
									  				inputdrop.renderTree(el.find("[id=bussinessDomainId]"),data.businessDomainTreeStore);
									  				// 操作系统类型
													um_ajax_get({
											  			url : form_codeList_url,
											  			paramObj : {key : "osCodeList"},
											  			isLoad : false,
											  			successCallBack : function (data){
											  				var dataList = data.osCodeList;
												    		for (var i = 0; i < dataList.length; i++) {
												    			el.find("[data-id=osType]").append('<option value="'+dataList[i].codevalue+'">'+dataList[i].codename+'</option>');
												    		}
												    		el.find("[data-id=osType]").trigger("change");
												    		//批量修改渲染责任人列表
												    		um_ajax_get({
																url: "AssetOperation/queryResponsePerson",
														    	isLoad: false,
														    	successCallBack:function (data){
														    		for (var i = 0; i < data.length; i++) {
																		el.find("[data-id=liablePersonId]").append('<option value="'+data[i].userId+'">'+data[i].userName+'</option>');
																	}
														    	}
														    });
												    		g_dialog.waitingAlertHide(el);
											  			}
											  		});

									  			}
									  		});
							  			}
							  		});
					  			}
					  		});	
						}

						function save_click(el,saveObj)
						{
							var data = el.find("[data-flag]:checked").length;
							if (data == 0)
							{
								g_dialog.operateAlert(el ,"请至少选择一项修改!" ,"error");
								return false;
							}

							var el_table = opt.elTable?opt.elTable:$("#table_div");

							var data = g_grid.getData(el_table ,{chk:true});

							el.find("[data-flag]:checked").each(function ()
							{
								var attrStr = $(this).attr("data-flag");
								var attrArray = attrStr.split(",");
								for (var i = 0; i < attrArray.length; i++) {
									for (var j = 0; j < data.length; j++){
										data[j][attrArray[i]] = saveObj[attrArray[i]];
									}
								}
							});
						     
						    // // 是否计算风险选否时，资产价值不传
						    // if((el.find("[data-flag*=assetValue]").is(":checked")) && (el.find("[name=isComputeRisk]").val() == 0))
						    // {
						    //  	//obj.assetValue = undefined;
						    // }
						    
							// 校验
							if (!g_validate.validate(el))
							{
							 	return false;
							}

							// 组装edid
							var buffer = [];

							for (var i = 0; i < data.length; i++) {
								buffer.push(data[i].edId);
								
								//组装责任人
								if(el.find("[data-flag=liablePersonId]").is(":checked"))
								{
									data[i].liablePersonId = el.find("[data-id=liablePersonId]").val().join(",");
								}
								
							}
							
							var flag_url = asset_batch_UpdAsset_url;
							if (opt.url)
							{
								flag_url = opt.url;
							}

							um_ajax_post({
								url : flag_url,
								paramObj : {assetStore:data,monitorIdVsEdId:buffer.join(",")},
								maskObj : el,
								successCallBack : function (){
									g_dialog.hide(el);
									// 弹出成功提示
									g_dialog.operateAlert();
									opt && opt.cbf && opt.cbf();
								}
							});

					    }
					}
					
				});
		},
		/** 资产接口流量 */
		assetFlowDialog : function (opt){
			opt.autoHeight = false;
			$.ajax({
				type: "GET",
				url: "js/plugin/asset/asset_tpl.html",
				success :function(data)
				{
					g_dialog.dialog($(data).find("[id=flow_template]"),{
						width:"960px",
						initAfter:initAfter,
						title : "接口面板详细信息",
						isDetail:true,
						top:"6%"
					});
					function initAfter(el)
					{
						assetFlowRender(el ,opt);
					}
				}
			});
		},
		/**
			assetFlowDiv
			param : el
					opt {mainIp:"" ,assetId:"" ,monitorId:""}
		*/
		assetFlowDiv : function (el ,opt){
			opt.autoHeight = true;
			$.ajax({
				type: "GET",
				url: "js/plugin/asset/asset_tpl.html",
				success : function (data){
					el.html("");
					el.append($(data).find("[id=flow_template]").html());
					el.find("[id=table_flow_div]").parent().css("width" ,"100%");
					el.find("[id=port_div]").prev().remove();
					assetFlowRender(el ,opt);
				}
			});
		}
	}

	
	function oper_asset_save(el ,cbf ,updateUrl)
	{
		// if (!g_validate.validate(el.find("[id=um_step_5]")))
		// {
		// 	return false;
		// }
		// 资产创建
		var index_oper_asset_create_url = "AssetOperation/addAsset";
		// 资产更新
		var index_oper_asset_update_url = "AssetOperation/updAsset";
		// 资产批量创建
		var index_oper_asset_batch_create_url = "AssetOperation/batchAddAsset";

		var flag_url = index_oper_asset_create_url;

		var el_ip_range_info = el.find("[id=um_step_0]");
		var el_form_base_info = el.find("[id=um_step_1]").find("form");
		var el_form_expand_info = el.find("[id=um_step_2]").find("form");
		var el_form_test_info = el.find("[id=um_step_3]");
		var el_form_borrow_info = el.find("[id=um_step_4]").find("form");
		var el_form_custom_attr = el.find("[id=um_step_5]").find("form");

		// 封装基本信息
		var form_obj1 = el_form_base_info.umDataBind("serialize");

		var ip_info = ip_mac_data_get(el_form_base_info);
		form_obj1.ipAdrStr = ip_info.ipStr;
		form_obj1.mainIp = ip_info.mainIp;

		//step0存在则为批量增加
		if (el_ip_range_info.size() > 0)
		{
			flag_url = index_oper_asset_batch_create_url;
			var form_obj0 = el_ip_range_info.find("form").umDataBind("serialize");
			form_obj1.bussinessDomainId = form_obj0.bussinessDomainId;
			form_obj1.securityDomainId = form_obj0.securityDomainId;
			form_obj1.batchIpRange = form_obj0.batchIpRange;
		}
		//edId值不为空则为更新操作
		if (el.find("[data-id=edId]").val() != "")
		{
			flag_url = index_oper_asset_update_url;
		}

		// 封装扩展信息
		var form_obj2 = el_form_expand_info.umDataBind("serialize");

		// 封装snmp测试信息
		var assetSnmpStore = el_form_test_info.find("[id=tab_snmp]").umDataBind("serialize");
		// 封装TELNET测试信息
		var telnetStore = el_form_test_info.find("[id=tab_telnet]").umDataBind("serialize");
		// 封装SSH2测试信息
		var sshStore = el_form_test_info.find("[id=tab_ssh]").umDataBind("serialize");
		// 封装WMI信息
		var wmiStore = el_form_test_info.find("[id=tab_WMI]").umDataBind("serialize");
		// 封装托盘信息
		var trayStore = el_form_test_info.find("[id=tab_tpcx]").umDataBind("serialize");

		// 封装外借信息
		var form_obj4 = el_form_borrow_info.umDataBind("serialize");

		// 封装自定义属性
		var costomPropertyList = [];
		var tmpObj;
		for (var i = 0; i < form_custom_attr_list.length; i++)
		{
			tmpObj = new Object();
			tmpObj.columnId = form_custom_attr_list[i].columnId;
			tmpObj.edId = form_custom_attr_list[i].edId;
			if (form_custom_attr_list[i].dataType == "数值类型")
			{
				tmpObj.dataType = 0;
			}
			else
			{
				tmpObj.dataType = 1;
			}
			tmpObj.dataValue = el_form_custom_attr.find("input").eq(i).val();
			costomPropertyList.push(tmpObj);
		}

		if (updateUrl)
		{
			flag_url = updateUrl;
		}

		// form_obj1.responsiblePerson = $("[data-id=userId]").find("option:selected").text();
		if(form_obj1.liablePersonId)
		{
			form_obj1.liablePersonId = form_obj1.liablePersonId.join(",");
		}
		um_ajax_post({
			url : flag_url,
			paramObj : {
						  assetStore : form_obj1,
						  assetAppendStore : form_obj2,
						  assetSnmpStore : assetSnmpStore,
						  telnetStore : telnetStore,
						  sshStore : sshStore,
						  wmiStore : wmiStore,
						  trayStore : trayStore,
						  borrowStore : form_obj4,
						  costomPropertyStore : costomPropertyList
						},
			maskObj : "body",
			successCallBack : function (data){
				g_dialog.operateAlert();
				g_dialog.hide(el);
				cbf && cbf();
			}
		})
	}

	function oper_asset_render(el ,data)
	{
		el.data("snmpData" ,data.assetSnmpStore);
		var el_form_base_info = el.find("[id=um_step_1]").find("form");
		var el_form_expand_info = el.find("[id=um_step_2]").find("form");
		var el_form_test_info = el.find("[id=um_step_3]");
		var el_form_borrow_info = el.find("[id=um_step_4]").find("form");
		var el_form_custom_attr = el.find("[id=um_step_5]").find("form");
		// 渲染基本信息
		el_form_base_info.umDataBind("render" ,data.assetStore);
		if (data.assetStore.bussinessDomainId)
		{
			inputdrop.setDataTree(el_form_base_info.find("[id=bussinessDomainId]") ,data.assetStore.bussinessDomainId);
		}
		if (data.assetStore.securityDomainId)
		{
			inputdrop.setDataTree(el_form_base_info.find("[id=securityDomainId]") ,data.assetStore.securityDomainId);
		}
		if (data.assetStore.assetTypeId)
		{
			inputdrop.setDataTree(el_form_base_info.find("[id=assetTypeId]") ,data.assetStore.assetTypeId);
		}

		if (data.assetStore.locationCb)
		{
			inputdrop.setDataTree(el_form_base_info.find("[id=locationCb]") ,data.assetStore.locationCb);
		}
		
		for (var i = 0; i < data.ipStore.length; i++)
		{
			ip_mac_add(el.find("[id=ip_mac_table]") ,data.ipStore[i]);
		}

		//渲染责任人
		if (data.assetStore.liablePersonId){
			el.find("[data-id=liablePersonId]").val(data.assetStore.liablePersonId.split(","));
		}

		el.find("[data-type=select]").trigger('change');
		// 渲染资产扩展信息
		el_form_expand_info.umDataBind("render" ,data.assetAppendStore);

		// 渲染凭证信息 snmp
		el_form_test_info.find("[data-id=snmpVersion]").val(data.assetSnmpStore.snmpVersion);
		el_form_test_info.find("[data-id=snmpVersion]").trigger("change");
		el_form_test_info.find("[data-id=securityLevel]").val(data.assetSnmpStore.securityLevel);
		el_form_test_info.find("[data-id=securityLevel]").trigger("change");
		el_form_test_info.find("[id=snmp_info]").umDataBind("render" ,data.assetSnmpStore);	
		el_form_test_info.find("[id=tab_telnet]").umDataBind("render" ,data.telnetStore);
		el_form_test_info.find("[id=tab_ssh]").umDataBind("render" ,data.sshStore);
		el_form_test_info.find("[id=tab_WMI]").umDataBind("render" ,data.wmiStore);
		el_form_test_info.find("[id=tab_tpcx]").umDataBind("render" ,data.trayStore);

		//资产价值开关
		if(data.assetStore.isComputeRisk==0){
			el.find("[name=isComputeRisk]").click();
		}
		
		// 渲染外借信息
		el_form_borrow_info.umDataBind("render" ,data.borrowStore);

		// 渲染自定义属性
		el_form_custom_attr.find("input").each(function (i){
			$(this).val(data.costomPropertyStore[i].dataValue);
		});
	}

	function step0_init(el)
	{
		var el_ip_range_div = el.find("[id=ip_range_div]");
		var el_start_ip = el.find("[id=step0_startIp]");
		var el_end_ip = el.find("[id=step0_endIp]");
		var el_um_step_0 = el.find("[id=um_step_0]");
		var el_um_step_form_0 = el.find("[id=um_step_form_0]");
		var el_step0_ipList = el.find("[id=step0_ipList]");
		el.find("[id=ip_get_btn]").click(function (){
			if (g_validate.validate(el_um_step_form_0))
			{
				var startIPArray = el_start_ip.val().split(".");
				var endIPArray = el_end_ip.val().split(".");
				if (startIPArray[0] == endIPArray[0]
						&& startIPArray[1] == endIPArray[1]
							&& startIPArray[2] == endIPArray[2])
				{
					var startIp = parseInt(startIPArray[3]);
					var endIp = parseInt(endIPArray[3]);

					if (startIp > endIp)
					{
						g_dialog.operateAlert(el_um_step_0 ,"起始IP不能大于结束IP" ,"error");
						return false;
					}
					else
					{
						el.find("[id=step0_ipInfo_span]")
								.text(startIPArray[0] + "." + startIPArray[1] + "." + startIPArray[2]);
						var count = endIp - startIp;
						el_step0_ipList.html("");
						for (var i=0;i<=count;i++)
						{
							el_step0_ipList.append('<li>'+(startIp+i)+'</li>');
						}
					}
					var saveObj = el_um_step_0.umDataBind("serialize");
					var obj = new Object();
					um_ajax_get({
						url : form_asset_ip_conflict_url,
						paramObj : saveObj,
						successCallBack : function (data){
							for (var i = 0; i < data.length; i++) {
								(data[i].conflict == 1) && el_step0_ipList.find("li").eq(i).addClass("disable");
							}
						}
					});
				}
				else
				{
					g_dialog.operateAlert(el_um_step_0 ,"请输入同一网段" ,"error");
				}
			}
		});
		el.delegate("[id=step0_ipList] li" ,"click" ,function (){
			if (!$(this).hasClass("disable"))
			{
				$(this).toggleClass("nochk");
			}
		});
	}

	function ip_range_create(el)
	{
		var el_ipList = el.find("[id=step0_ipList]").find("li").not("[class*=disable]").not("[class*=nochk]");
		if (el_ipList.size() == 0)
		{
			return "";
		}
		var buffer = [];
		var ip_three = el.find("[id=step0_ipInfo_span]").text();
		el_ipList.each(function (){
			buffer.push(ip_three + "." + $(this).html());
		});
		return buffer.join(",");
	}

	function ip_mac_add(el ,data)
	{	
		var buffer = [];
		var id = new Date().getTime();
		buffer.push('<tr id="'+id+'">');
		buffer.push('<td class="prel" style="text-align:center">');
		buffer.push('<input type="text" class="form-control input-sm" validate="required,IP"/>');
		buffer.push('</td>');
		buffer.push('<td class="prel" style="text-align:center">');
		buffer.push('<input type="text" class="form-control input-sm" validate="mac"/>');
		buffer.push('</td>');
		buffer.push('<td style="vertical-align: middle">');
		buffer.push('<i class="icon-ok pull-left icon-animate ml10" title="确认"></i>');
		buffer.push('<i class="icon-remove pull-left icon-animate ml10" title="删除"></i>');
		buffer.push('</td>');
		buffer.push('</tr>');
		el.append(buffer.join(""));

		if (data)
		{
			var trObj = el.find("[id="+id+"]");
			trObj.find("td").eq(0).html(data.ip);
			trObj.find("td").eq(1).html(data.mac);
			var icon = trObj.find("[class*=icon-ok]");
			icon.removeClass("icon-ok");
			icon.removeClass("icon-animate");
			icon.addClass("icon-star");
			icon.addClass("gc");
			icon.attr("title" ,"设置为主IP");
			if (data.keyIp == "1")
			{
				icon.removeClass("gc");
				icon.attr("title" ,"已设置为主IP");
			}
			trObj.find("[class*=icon-star]").unbind("click");
			trObj.find("[class*=icon-star]").click(function (){
				var msg = "";
				if (!$(this).hasClass('gc'))
				{
					return false;
				}
				else
				{
					msg = "已更改主IP";
				}
				el.find("[class*=icon-star]").addClass("gc");
				$(this).toggleClass('gc');
				g_dialog.operateAlert($("[class*=modal-dialog]") ,msg);
			});
		}

		el.find('[id='+id+']').find("[class*=icon-ok]").click(function (){
			var form = $(this).closest('tr');
			if (g_validate.validate(form))
			{
				g_dialog.operateAlert($("[class*=modal-dialog]"));
				form.find("input").each(function (){

					$(this).after($(this).val());
					$(this).remove();
					var icon = form.find("[class*=icon-ok]");
					icon.removeClass("icon-ok");
					icon.removeClass("icon-animate");
					icon.addClass("icon-star");
					icon.addClass("gc");
					icon.attr("title" ,"设置为主IP");
				});
				// 如果只有一条记录，默认为主IP
				if (el.find("[class*=icon-star]").size() == 1)
				{
					el.find("[class*=icon-star]").eq(0).removeClass("gc");
					el.find("[class*=icon-star]").eq(0).attr("title" ,"已设置为主IP");
				}

				form.find("[class*=icon-star]").unbind("click");
				form.find("[class*=icon-star]").click(function (){
					var msg = "";
					if (!$(this).hasClass('gc'))
					{
						return false;
					}
					else
					{
						msg = "已更改主IP";
					}
					el.find("[class*=icon-star]").addClass("gc");
					el.find("[class*=icon-star]").attr("title" ,"设置为主IP");
					$(this).toggleClass('gc');
					$(this).attr("title" ,"已设置为主IP");
					g_dialog.operateAlert($("[class*=modal-dialog]") ,msg);
				});
			}
		});

		el.find('[id='+id+']').find("[class*=icon-remove]").click(function (){
			$(this).closest('tr').remove();
		});

		el.find('[id='+id+']').find("input").each(function (){
			g_validate.initEvent($(this));
		});
	}

	function ip_mac_data_get(el)
	{
		if ($("#step0_ipList").size() > 0)
		{
			var ip_info = $("#step0_ipInfo_span").text();
			var ipArray = [];
			$("#step0_ipList").find("li").each(function (){
				ipArray.push(ip_info+"."+$(this).html());
			})
			return {mainIp:ipArray.join(",") ,ipStr:"" ,ipv4:""};
		}
		else
		{
			var ipInfo = [];
			var buffer = [];
			var ipv4 = [];
			var mainIp = el.find("[class*=icon-star]").not("[class*=gc]").closest("tr").find("td").eq(0).html();
			el.find("[class*=icon-star]").each(function (){
				ipInfo = [];
				$(this).hasClass("gc")?ipInfo.push("0"):ipInfo.push("1");
				ipInfo.push($(this).closest("tr").find("td").eq(0).html());
				ipInfo.push($(this).closest("tr").find("td").eq(1).html());
				buffer.push(ipInfo.join("-"));
				ipv4.push($(this).closest("tr").find("td").eq(0).html());
			});
			return {mainIp:mainIp ,ipStr:buffer.join(",") ,ipv4:ipv4};
		}
		
	}

	function snmp_telnet_ssh2_test(el ,url ,tabId)
	{
		var el_form_test_info = el.find("[id=um_step_3]");
		// 封装snmp测试信息
		var obj = el_form_test_info.find("[id="+tabId+"]").umDataBind("serialize");

		if (!g_validate.validate(el_form_test_info.find("[id="+tabId+"]")))
		{
			return false;
		}

		obj.bussinessDomainId = el.find("[data-id=bussinessDomainId]").val();
		obj.securityDomainId = el.find("[data-id=securityDomainId]").val();

		um_ajax_get({
			url : url,
			paramObj : obj,
			maskObj : "body",
			successCallBack : function (data){
				g_dialog.dialog('<div>'+data+'</div>',{
					width:"300px",
					title:"测试结果",
					isDetail:true
				});
			}
		});
	}

	function assetFlowRender(el ,opt)
	{
		if (opt.autoHeight)
		{
			el.find("[id=table_flow_div_outer]").css("height" ,"auto");
			el.find("[id=table_flow_search_inp]").show();
		}
		el.find("[data-id=assetIp]").text(opt.mainIp);
		var port_div = el.find("[id=port_div]");
		var color;
		var header = [
						{text:"接口索引",name:"interfaceInd"},
						{text:"接口名称",name:"interfaceName"},
						{text:"接口状态",name:"currentStatusName"},
						{text:"管理状态",name:"adminStatusName"},
						{text:"入口流速",name:"portalFlux"},
						{text:"出口流速",name:"exportFlux"},
						{text:"入口<br>错包数",name:"portalError"},
						{text:"出口<br>错包数",name:"exportError"},
						{text:"入口<br>丢包数",name:"portalLoss"},
						{text:"出口<br>丢包数",name:"exportLoss"},
						{text:"入口流量",name:"fluxIn"},
						{text:"出口流量",name:"fluxOut"},
						{text:"总流量",name:"totalFlux"},
						{text:"所属vlan",name:"vlanName",render:function (txt){
							return (txt ? txt : "---");
						}}
					 ];
		um_ajax_get({
			url : "interfaceInfo/queryMonitorInterface",
			paramObj : {edId : opt.assetId ,interfaceFlag : 0 ,monitorId:opt.monitorId},
			successCallBack : function (data){
				g_grid.render(el.find("[id=table_flow_div]"),{
					header:header,
					data:data.list,
					//data:[{interfaceName:"test"}],
					allowCheckBox:false,
					hideSearch:true,
					paginator:false,
					dbThLine:true,
					autoHeight:opt.autoHeight,
					gridCss : "um-grid-style",
					hasBorder : false,
					showCount : true,
					wholly : true,
					cacheSearch : true,
					searchInp : el.find("[id=table_flow_search_inp]"),
					searchKey : ['interfaceInd','interfaceName']
				});
				var data = data.list;
				// var data = [];
				// for (var i = 0; i < 150; i++) {
				// 	data.push({});
				// }
				data && data[0] && $("#interface_panel_head").text('接口面板(资产IP：'+data[0].interfaceIp+')');
				var id_list = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].currentStatus == "1" && data[i].adminStatus == "1")
					{
						color = "green";
					}
					else
					{
						color = "red";
					}
					id_list.push(data[i].interfaceInd);
					port_div.append('<div class="icon-png flow-'+color+' l prel" id="'+data[i].interfaceInd+'" data-flag="port" style="margin: 5px 9px" title="点击进入端口详细信息"></div>');
				}

				var tip = el.find("[data-name=interfaceTip]");
				el.find("[data-flag=port]").hover(function(){
					var index = id_list.indexOf($(this).attr("id"));
					tip.umDataBind("render",data[index]);
					tip.appendTo(this);
					tip.show();
				},function(){
					tip.hide();
					return false;
				});

				el.find("[data-flag=port]").click(function(){
					var id = $(this).attr("id");
					window.open("#/monitor_info/monitor_obj/interface_info?hideMenu=1&&assetId="+opt.assetId+"&interfaceId="+id+"&monitorId="+opt.monitorId);
				});
			}
		});
	}

	/** 
		工具函数
	*/
	function change_record_list(el ,edId)
	{

		var change_record_url = "AssetOperation/queryAssetChangeLog";
		var change_record_header = [
						{text:'变更项目',name:"changeProperty"},
						{text:'变更类型',name:"changeType"},
						{text:'原始内容',name:"oldValue"},
						{text:'变更内容',name:"newValue"},
						{text:'修改人',name:"persion"},
						{text:'修改日期',name:"updateDate"}
				   ];
		g_grid.render(el.find("[id=change_record_div]"),{
			url:change_record_url,
			header:change_record_header, 
	 		paramObj : {edId : edId},
			dbClick : detail_template_init,
			allowCheckBox:false
		});
	}

	/** 
		工具函数
	*/
	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "/js/plugin/asset/asset_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=change_record_detail_template]"),{
					width:"450px",
					init:init,
					saveclick:save_click,
					isDetail:true,
					title:"变更记录详细信息"
				});
			}
		});

		function init(el)
		{
			el.umDataBind("render" ,rowData);
		}

		function save_click(el)
		{
			g_dialog.hide(el);
		}
	}

	function initSnmpEvent(el ,rowData ,snmpMap)
	{
		var el_form_test_info = el.find("[id=um_step_3]");
		el.find("[data-id=snmpName]").change(function (){
			if ($(this).val() == "-1")
			{
				if (rowData)
				{
				}
				else
				{
				}
			}
			else
			{
				var obj = snmpMap.get($(this).val());
				el_form_test_info.find("[data-id=snmpVersion]").val(obj.snmpVersion);
				el_form_test_info.find("[data-id=snmpVersion]").trigger("change");
				el_form_test_info.find("[id=snmp_info]").umDataBind("render" ,obj);
			}
		});
	}

	function testIpSelRender(el ,str ,mainIp)
	{
		var ipArray = mainIp.split(",");
		var data = [];
		for (var i = 0; i < ipArray.length; i++) {
			data.push({id:ipArray[i] ,text:ipArray[i]});
		}
		el.find("[data-val="+str+"]").select2({
		  data: data,
		  width:"100%"
		});
	}
});







	




