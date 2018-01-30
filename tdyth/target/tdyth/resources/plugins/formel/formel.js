
	var sec_biz_url = "AssetOperation/queryDialogTreeList";

	var code_list_url = "rpc/getCodeList";

	var g_formel = {
		sec_biz_render : function (opt){
			um_ajax_get({
	  			url : sec_biz_url,
	  			isLoad : false,
	  			successCallBack : function (data){
	  				// 渲染业务域
				    opt.bizEl && inputdrop.renderTree(opt.bizEl ,data.businessDomainTreeStore ,{enableChk:opt.enableChk,initVal:opt.bizVal});
				    // 渲染安全域
				    opt.secEl && inputdrop.renderTree(opt.secEl ,data.securityDomainTreeStore,{aCheckCb : opt.aCheckCb,enableChk:opt.enableChk ,initVal:opt.secVal});
				    // 渲染资产类型
				    opt.assetTypeEl && inputdrop.renderTree(opt.assetTypeEl ,data.assetTypeTreeStore ,{enableChk:opt.enableChk,initVal:opt.assetTypeVal});
	  			}
	  		});
		},

		code_list_render : function (opt){
			um_ajax_get({
	  			url : code_list_url,
	  			paramObj : {key : opt.key},
	  			isLoad : false,
	  			successCallBack : function (data1){
	  				// 渲染资产型号
	  				if (opt.assetModelEl)
	  				{
	  					var data = data1.deviceTypeCodeList;
			    		for (var i = 0; i < data.length; i++) {
			    			data[i].id = data[i].codevalue;
			    			data[i].text = data[i].codename;
			    		}
			    		opt.assetModelEl.select2({
			    			data:data,width:"100%"
			    		});

			    		if (opt.assetModelVal)
			    		{
			    			opt.assetModelEl.val(opt.assetModelVal);
			    			opt.assetModelEl.trigger("change");
			    		}
	  				}
	  				// 渲染操作系统类型
	  				if (opt.osCodeEl)
	  				{
						var data = data1.osCodeList;
			    		for (var i = 0; i < data.length; i++) {
			    			data[i].id = data[i].codevalue;
			    			data[i].text = data[i].codename;
			    		}
			    		opt.osCodeEl.select2({
			    			data:data,width:"100%"
			    		});

			    		if (opt.osCodeVal)
			    		{
			    			opt.osCodeEl.val(opt.osCodeVal);
			    			opt.osCodeEl.trigger("change");
			    		}
	  				}
	  				// 渲染供应商
	  				if (opt.supplierEl)
	  				{
						var data = data1.factoryManageList;
			    		for (var i = 0; i < data.length; i++) {
			    			data[i].id = data[i].supCode;
			    			data[i].text = data[i].supName;
			    		}
			    		opt.supplierEl.select2({
			    			data:data,width:"100%"
			    		});

			    		if (opt.supplierVal)
			    		{
			    			opt.supplierEl.val(opt.supplierVal);
			    			opt.supplierEl.trigger("change");
			    		}
	  				}
	  				// 渲染代理服务器(多选)
	  				if (opt.agentEl)
	  				{
	  					var data = data1.agentConfigList;
	  					for (var i = 0; i < data.length; i++) {
			    			data[i].id = data[i].appId;
			    			data[i].text = data[i].nodeName;
			    		}
	  					inputdrop.renderSelect(opt.agentEl ,{
	  						data : data
	  					});

	  					if (opt.agentVal)
			    		{
			    			opt.agentEl.val(opt.agentVal);
			    			opt.agentEl.trigger("change");
			    		}
	  				}
	  				// 渲染代理服务器(单选)
	  				if (opt.agentSelEl)
	  				{
	  					var data = data1.agentConfigList;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].appId;
			    			data[i].text = data[i].nodeName;
	  					};
	  					if (opt.agentSelAll) 
	  					{
	  						data.insert(0 ,{id:"-1" ,text:"---"});
	  					}
	  					opt.agentSelEl.select2({
									  data: data,
									  width:"100%"
									});

	  					if (opt.agentSelVal)
			    		{
			    			opt.agentSelEl.val(opt.agentSelVal);
			    			opt.agentSelEl.trigger("change");
			    		}
	  				}
	  				// 渲染扫描器(单选)
	  				if (opt.vulScannerTypeEl)
	  				{
						var data = data1.vulScannerType_codelist;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].scancfg_no;
			    			data[i].text = data[i].scancfg_name;
	  					};
	  					data.insert(0 ,{id:"-1" ,text:"---"});
	  					opt.vulScannerTypeEl.select2({
									  data: data,
									  width:"100%"
									});
	  					if (opt.vulScannerTypeVal)
			    		{
			    			opt.vulScannerTypeEl.val(opt.vulScannerTypeVal);
			    			opt.vulScannerTypeEl.trigger("change");
			    		}
	  				}
	  				// 漏洞扫描器
	  				if (opt.scanTaskPolicyEl)
	  				{
						var data = data1.scanTaskPolicyList;
	  					for (var i = 0; i < data.length; i++) {
			    			data[i].id = data[i].policyID;
			    			data[i].text = data[i].policyName;
			    		}
	  					inputdrop.renderSelect(opt.scanTaskPolicyEl ,{
	  						data : data
	  					});

	  					if (opt.scanTaskPolicyVal)
			    		{
			    			opt.scanTaskPolicyEl.val(opt.scanTaskPolicyVal);
			    			opt.scanTaskPolicyEl.trigger("change");
			    		}
	  				}
	  				// 渲染故障事件类型
	  				if (opt.faultEventTypeEl)
	  				{
	  					var data = data1.faultclass;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].codevalue;
			    			data[i].text = data[i].codename;
	  					};
	  					if(!!opt.isMultiple){

	  					}else {
	  						data.insert(0 ,{id:"-1" ,text:"---"});
	  					}
	  					if(opt.screen)
	  					{
	  						data[0] = {id:"-1",text:"使用事件类型筛选"};
	  					}
	  					opt.faultEventTypeEl.select2({
													  data: data,
													  width:"100%"
													});
	  				}
	  				// 渲染性能事件类型
	  				if (opt.performEventTypeEl)
	  				{
	  					var data = data1.perfclass;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].codevalue;
			    			data[i].text = data[i].codename;
	  					};
	  					if(!!opt.isMultiple){

	  					}else {
	  						data.insert(0 ,{id:"-1" ,text:"---"});
	  					}
	  					if(opt.screen)
	  					{
	  						data[0] = {id:"-1",text:"使用事件类型筛选"};
	  					}
	  					opt.performEventTypeEl.select2({
													  data: data,
													  width:"100%"
													});
	  				}

	  				// 渲染资产所属类别

	  				if (opt.equipmentEl)
	  				{
	  					var data = data1.equipmentClasslist;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].deviceClassSort;
			    			data[i].text = data[i].deviceClassName;
	  					};
	  					if(!!opt.isMultiple){

	  					}else {
	  						data.insert(0 ,{id:"-1" ,text:"---"});
	  					}
	  					opt.equipmentEl.select2({
												  data: data,
												  width:"100%"
												});
	  				}

	  				// 渲染配置事件类型
	  				if (opt.deployEventTypeEl)
	  				{
	  					var data = data1.deplclass;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].codevalue;
			    			data[i].text = data[i].codename;
	  					};
	  					if(!!opt.isMultiple){

	  					}else {
	  						data.insert(0 ,{id:"-1" ,text:"---"});
	  					}
	  					opt.deployEventTypeEl.select2({
													  data: data,
													  width:"100%"
													});
	  				}
	  				// 渲染用户列表
	  				if (opt.userListEl)
	  				{
	  					var data = data1.allUserList;
	  					for (var i = 0; i < data.length; i++) {
	  						data[i].id = data[i].id;
			    			data[i].text = data[i].userAccount;
	  					};
	  					data.insert(0 ,{id:"-1" ,text:"---"});
	  					opt.userListEl.select2({
												  data: data,
												  width:"100%"
												});
	  				}
	  			}
	  		});
		},
		// 渲染资产价值
		asset_value_render : function (el){
			var data = [
							{id: "-1",text: "---"},
				  			{id: "5",text: "很高"},
				  			{id: "4",text: "高"},
				  			{id: "3",text: "中"},
				  			{id: "2",text: "低"},
				  			{id: "1",text: "很低"}
				  		];
			el.oneTime(10 ,function (){
				el.select2({data:data,width:"100%"});
			});
		},

		// 渲染下拉列表
		select_render : function (el ,opt){
			var searchEl = $('<select class="form-control input-sm" search-data="'+opt.name+'" data-id="'+opt.name+'" initVal="'+opt.initVal+'"></select>');
			el.append(searchEl);
			searchEl.oneTime(10 ,function (){
				searchEl.select2({data:opt.data,width:"100%"});
			});
		},

		// 渲染下拉列表
		selectEl_render : function (selectEl ,opt)
		{
			var data = opt.data;
			var textName = opt.text;
			var IdName = opt.id;
			var val = opt.val;
			for (var i = 0; i < data.length; i++) {
				if (val == data[i][IdName])
				{
					selectEl.append('<option value="'+data[i][IdName]+'" selected>'+data[i][textName]+'</option>');
				}
				else
				{
					selectEl.append('<option value="'+data[i][IdName]+'">'+data[i][textName]+'</option>');
				}
				
			}
			selectEl.trigger("change");
		},

		// 渲染多选下列表
		multipleSelect_render : function (el ,opt){
			var inputdropEl = $('<div class="inputdrop"></div>');
			inputdropEl.attr("id" ,opt.name);
			opt.initVal && inputdropEl.attr("initVal" ,opt.initVal);
			el.append(inputdropEl);
			inputdrop.renderSelect(inputdropEl ,{
				data : opt.data,
				height : "175px",
				allowAll : opt.allowAll
			})
		},

		// 渲染附件上传(最大附件数限制)
		appendix_render : function (el ,opt)
		{
			if (opt.method == "getUploadStrArray")
			{
				getUploadStrArray();
				return false;
			}
			var appendix_limit_count = -1;
			var delStrArray = [];
			var uploadStrArray = [];
			el.data("delStrArray" ,delStrArray);
			el.data("uploadStrArray" ,uploadStrArray);
			// 获取最大附件数
			appendix_limit_count_get();
			// 渲染附件按钮
			el.append('<div id="appendix_add_btn"><i class="icon-plus"></i></div>');
			// 渲染已传附件
			el.append('<div id="has_appendix_div"></div>');
			// 渲染附件上传
			el.append('<div id="appendix_upload_div"></div>');
			var appendix_add_btn = el.find("[id=appendix_add_btn]");
			var el_has_appendix_div = el.find("[id=has_appendix_div]");
			var el_appendix_upload_div = el.find("[id=appendix_upload_div]");

			has_appendix_render();

			appendix_add_btn.click(function (){
				if (appendix_limit_count == -1)
				{
					return false;
				}
				if (adjust_appendix())
				{
					add_appendix_el();
				}
			});
			
			// 渲染已上传的附件
			function has_appendix_render()
			{
				var data = opt.data;
				if (!data)
				{
					return false;
				}
				var buffer = [];
				for (var i = 0; i < data.length; i++) {
					buffer = [];
					buffer.push('<div class="form-group">');
					if(opt.nodownload)
					{
						buffer.push('<div class="col-lg-10" id="'+data[i][opt.id]+'">'
								+data[i][opt.key]
								+'</div>');
					}
					else
					{
						buffer.push('<div class="col-lg-10">'
								+'<a href="javascript:void(0);" id="'+data[i][opt.url]+'" data-flag="appendix">'
								+data[i][opt.key]
								+'</a>'
								+'</div>');
					}
					buffer.push('<div class="col-lg-2"><i class="icon-trash" style="font-size:14px"></i></div>');
					buffer.push('</div>');
					el_has_appendix_div.append(buffer.join(""));
				}
				if(!opt.nodownload)
				{
					el_has_appendix_div.find("[data-flag='appendix']").click(function (){
						var url = $(this).attr("id");
						window.location.href = url;
					});
				}
				el_has_appendix_div.find("[class='icon-trash']").click(function (){
					var array = el.data("delStrArray");
					if(opt.nodownload)
					{
						array.push($(this).parent().prev().attr("id"));
					}
					else
					{
						array.push($(this).parent().prev().children().html());
					}
					el.data("delStrArray" ,array);
					$(this).closest("[class=form-group]").remove();
				});
			}

			// 新增一条附件上传的元素
			function add_appendix_el()
			{
				var id = new Date().getTime();
				var buffer = [];
				buffer.push('<div class="form-group" id="'+id+'">');
				buffer.push('<div class="col-lg-10"><div data-type="ptMap" id="'+id+'pt" name="'+id+'" class="upload"></div></div>');
				buffer.push('<div class="col-lg-2"><i class="icon-trash" style="line-height:36px;font-size:14px"></i></div>');
				buffer.push('</div>');
				el_appendix_upload_div.append(buffer.join(""));
				var tisEl = el_appendix_upload_div.find("[id="+id+"]");
				index_create_upload_el(tisEl.find("[data-type=ptMap]"));
				tisEl.find("[class=icon-trash]").click(function (){
					tisEl.remove();
				});
			}

			function adjust_appendix()
			{
				// 已有组件数
				var has_appendix_count = el_has_appendix_div.children().size();
				// 上传组件数
				var el_appendix_upload_count = el_appendix_upload_div.children().size();

				if ((has_appendix_count + el_appendix_upload_count) == appendix_limit_count)
				{
					return false;
				}
				else
				{
					return true;
				}
				
			}

			function appendix_limit_count_get()
			{
				var url = "GeneralController/queryAppendixInfo";
				var paramObj = {procInstID : opt.procInstID};
				if(opt.limitUrl)
				{
					url = opt.limitUrl;
					paramObj = {};
				}
				um_ajax_get({
					url : url,
					isLoad : false,
					paramObj : paramObj,
					successCallBack : function (data){
						appendix_limit_count = data.maxstore[0].maxUpLoadFileNum;
					}
				});
			}

			function getUploadStrArray()
			{
				var array = [];
				el.find("[data-id=up_name]").each(function (){
					array.push($(this).val());
				});
				el.data("uploadStrArray" ,array);
			}
		},

		// 渲染定时刷新按钮
		interval_refresh_render : function (el ,opt){
			var el_oper_col = el;
			el.addClass("oper-array");
			var elTable = opt.elTable;
			if (!opt.hideOption)
			{
				var buffer = [];
				buffer.push('<ul class="oper-ul tran" style="right:3px; width:83px;">');
				buffer.push('<li data-val="0">关闭<i class="r"></i></li>');
				buffer.push('<li data-val="1">1分<i class="r"></i></li>');
				buffer.push('<li data-val="5">5分<i class="r"></i></li>');
				buffer.push('<li data-val="10">10分<i class="r"></i></li>');
				buffer.push('<li data-val="30">30分<i class="r"></i></li>');
				buffer.push('</ul>');
				el_oper_col.append(buffer.join(""));
			}
			
			el.click(function (){
				g_grid.refresh(elTable);
				opt.cbf && opt.cbf();
			});
			el.find("li").click(function (){
				$("#index_timer_inp").stopTime();
				var interval = parseInt($(this).attr("data-val"));
				el_oper_col.find("i").removeClass("icon-ok");
				$(this).find("i").addClass("icon-ok");
				if(interval == 0)
				{
					g_dialog.operateAlert(elTable ,"已关闭自动刷新");
					return false;
				}
				else
				{
					g_dialog.operateAlert(elTable ,"已设置页面自动刷新时间为" + interval + "分钟");
				}
				$("#index_timer_inp").everyTime(interval * 1000 *60 ,function (){
					g_grid.refresh(elTable);
					opt.cbf && opt.cbf();
				});
				return false;
			});
		}
	
};