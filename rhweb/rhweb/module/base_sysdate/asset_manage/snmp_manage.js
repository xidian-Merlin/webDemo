$(document).ready(function (){

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

	var list_url = "autoDiscover/querySnmpList";
	var list_col = [
						{text:'名称',name:"codename"},
						{text:'版本',name:"snmpVersion",searchRender:function(el){
							var data = [
											{text:"SNMP V1" ,id:"1"},
											{text:"SNMP V2c" ,id:"2"},
											{text:"SNMP V3" ,id:"3"}
										];
							g_formel.select_render(el ,{
								data : data,
								name : "snmpVersion"
							});
						} ,render : function (txt){return version_map.get(txt)}},
						{text:'端口',name:"snmpPort"},
						// {text:'读COMMUNITY',name:"snmpCommunity",render:function (txt){
						// 	return Encrypt(txt);
						// }},
						// {text:'写COMMUNITY',name:"snmpWCommunity",render:function (txt){
						// 	return Encrypt(txt);
						// }},
						// {text:'用户名',name:"snmpUserName",render:function (txt){
						// 	return Encrypt(txt);
						// }},
						// {text:'认证方式',name:"authWay",searchRender:function(el){
						// 	var data = [
						// 					{text:"----" ,id:"-1"},
						// 					{text:"SHA" ,id:"1"},
						// 					{text:"MD5" ,id:"2"}
						// 				];
						// 	g_formel.select_render(el ,{
						// 		data : data,
						// 		name : "authWay"
						// 	});
						// } ,render:function(txt){return authWay_map.get(txt)}},
						// {text:'加密方式',name:"encryptionWay",searchRender:function(el){
						// 	var data = [
						// 					{text:"----" ,id:"-1"},
						// 					{text:"3DES" ,id:"1"},
						// 					{text:"AES128" ,id:"2"},
						// 					{text:"AES192" ,id:"3"},
						// 					{text:"AES256" ,id:"4"},
						// 					{text:"DES" ,id:"5"}
						// 				];
						// 	g_formel.select_render(el ,{
						// 		data : data,
						// 		name : "encryptionWay"
						// 	});
						// } ,render:function (txt){return encryptionWay_map.get(txt)}}
				   ];
	var index_oper = [
						{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_template_init},
					  	{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
					 ];

	var snmp_manage_create_url = "autoDiscover/addSnmp";

	var snmp_manage_update_url = "autoDiscover/updateSnmp";

	var snmp_manage_delete_url = "autoDiscover/deleteSnmp";


	event_init();

	snmp_manage_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(snmp_manage_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function event_init()
	{
		index_form_init($("#snmp_manage_edit_template"));

		$("#add_btn").click(function (){
			edit_template_init();
		});

		$("#delete_btn").click(function (){
			index_list_batch_delete();
		});
	}

	function snmp_manage_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 oper: index_oper,
			 operWidth:"100px",
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 hideSearch : true,
			 dbClick : detail_template_init
		});
	}

	function index_list_delete(rowData)
	{
		g_dialog.operateConfirm("确认删除此记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : snmp_manage_delete_url,
					paramObj : {snmpNo : rowData.snmpNo},
					successCallBack : function(data){
						snmp_manage_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function index_list_batch_delete()
	{
		var target_attributed_id = [];

		target_attributed_id = g_grid.getIdArray($("#table_div") ,{chk:true,attr:"snmpNo"})

		if(target_attributed_id.length == 0){
			g_dialog.operateAlert(null ,index_select_one_at_least_msg ,"error");
			return false;
		}

		target_attributed_id = target_attributed_id.join(",");

		g_dialog.operateConfirm("确认删除选中的记录么" ,{
			saveclick : function()
			{
				um_ajax_post({
					url : snmp_manage_delete_url,
					paramObj : {snmpNo : target_attributed_id},
					successCallBack : function(data){
						snmp_manage_list({maskObj : $("#table_div")});
						g_dialog.operateAlert(null ,"操作成功！");
					}
				});
			}
		});
	}

	function edit_template_init(rowData)
	{
		var title = rowData ? "SNMP修改" : "SNMP新增";
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_manage/snmp_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=snmp_manage_edit_template]"),{
					width:"860px",
					title:title,
					init:init,
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			el.find("[data-id=snmpVersion]").change(function(){
				var tmp = $(this).val();
				if (tmp == "1" || tmp == "2")
				{
					el.find("[data-id=snmpUserName]").attr("disabled", "disabled");//用户名
					el.find("[data-id=snmpUserName]").val("");
					el.find("[data-id=authWay]").val("");
					el.find("[data-id=authWay]").attr("disabled", "disabled");//认证方式
					el.find("[data-id=authPwd]").attr("disabled", "disabled");//认证口令
					el.find("[data-id=encryptionWay]").attr("disabled", "disabled");//加密方式
					el.find("[data-id=encryptionPwd]").attr("disabled", "disabled");//加密口令
					el.find("[data-id=context]").attr("disabled", "disabled");//Context ID
					el.find("[data-id=context]").val("");
					el.find("[data-id=contextName]").attr("disabled", "disabled");//Context Name
					el.find("[data-id=contextName]").val("");
					el.find("[data-id=snmpCommunity]").removeAttr("disabled", "disabled");//读COMMUNITY
					el.find("[data-id=snmpWCommunity]").removeAttr("disabled", "disabled");//写COMMUNITY

					g_validate.clear([el.find("[data-id=snmpName]") ,el.find("[data-id=snmpPort]") ,
						el.find("[data-id=timeOut]") ,el.find("[data-id=tryTimes]") ,
						el.find("[data-id=context]") ,el.find("[data-id=contextName]") ,
						el.find("[data-id=snmpUserName]") ,el.find("[data-id=authWay]") ,
						el.find("[data-id=snmpCommunity]") ,el.find("[data-id=snmpWCommunity]") ,
						el.find("[data-id=authPwd]") ,el.find("[data-id=encryptionPwd]")]);

					el.find("[data-id=authWay]").val("");
					el.find("[data-id=encryptionWay]").val("");
				}
				
				else if (tmp == "3")
				{
					el.find("[data-id=snmpCommunity]").attr("disabled", "disabled");//读COMMUNITY
					el.find("[data-id=snmpWCommunity]").attr("disabled", "disabled");//写COMMUNITY
					el.find("[data-id=authPwd]").attr("disabled", "disabled");
					el.find("[data-id=encryptionWay]").attr("disabled", "disabled");
					el.find("[data-id=encryptionPwd]").attr("disabled", "disabled");

					el.find("[data-id=snmpUserName]").removeAttr("disabled");//用户名
					el.find("[data-id=authWay]").removeAttr("disabled");//认证方式
					el.find("[data-id=context]").removeAttr("disabled");//Context ID
					el.find("[data-id=contextName]").removeAttr("disabled");//Context Name

					
					g_validate.clear([el.find("[data-id=snmpName]") ,el.find("[data-id=snmpPort]") ,
						el.find("[data-id=timeOut]") ,el.find("[data-id=tryTimes]") ,
						el.find("[data-id=snmpCommunity]") ,el.find("[data-id=snmpWCommunity]")]);
					el.find("[data-id=snmpCommunity]").val("");//读COMMUNITY
					el.find("[data-id=snmpWCommunity]").val("");//写COMMUNITY
				}	

				el.find("select").not("[data-id=snmpVersion]").trigger("change");
			});

			el.find("[data-id=authWay]").change(function(){
				var tmp = $(this).val();
				if (tmp == "")
				{
					el.find("[data-id=authPwd]").attr("disabled", "disabled");//认证口令
					el.find("[data-id=encryptionWay]").attr("disabled", "disabled");//加密方式
					el.find("[data-id=encryptionPwd]").attr("disabled", "disabled");//加密口令

					el.find("[data-id=authPwd]").val("");//认证口令
					el.find("[data-id=encryptionWay]").val("");//加密方式
					el.find("[data-id=encryptionPwd]").val("");//加密口令
				}

				else
				{
					el.find("[data-id=authPwd]").removeAttr("disabled");//认证口令
					el.find("[data-id=encryptionWay]").removeAttr("disabled");//加密方式
				}
				el.find("[data-id=encryptionWay]").trigger("change");
			});

			el.find("[data-id=encryptionWay]").change(function(){
				var tmp = $(this).val();
				if (tmp == "")
				{
					el.find("[data-id=encryptionPwd]").attr("disabled", "disabled");//加密口令
					el.find("[data-id=encryptionPwd]").val("");
				}

				else
				{
					el.find("[data-id=encryptionPwd]").removeAttr("disabled");//加密口令													
				}
			});

			if (rowData)
			{
				el.umDataBind("render" ,rowData);
				el.find("[id=add_snmp_name_div]").remove();
				el.find("select").trigger("change");
			}
			else
			{
				el.find("[id=update_snmp_name_div]").remove();
			}

			
	    }

		function save_click(el ,saveObj)
		{
			if (!g_validate.validate($("#snmp_manage_edit_template")))
 			{
 				return false;
 			}

 			else
 			{
				var flag_url = snmp_manage_create_url;
				if (rowData)
				{
					flag_url = snmp_manage_update_url;
					saveObj.snmpNo = rowData.snmpNo;
					saveObj.snmpName = saveObj.codename;
				}
				um_ajax_post({
					url : flag_url,
					paramObj : saveObj,
					maskObj : el,
					successCallBack : function (data){
						g_dialog.operateAlert(null ,title+"成功！");
						g_dialog.hide(el);
						snmp_manage_list({paramObj:null,isLoad:true,maskObj:"body"});
					}
				});
			}
		}
	}

	function detail_template_init(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/asset_manage/snmp_manage_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=snmp_manage_detail_template]"),{
					width:"830px",
					title:"SNMP详细信息",
					isDetail:true,
					init:init
				});
			}
		});

		function init(el)
		{
			$(el).umDataBind("render" ,rowData);
			el.find("[data-id=authWay]").text(authWay_map.get(rowData.authWay));
			el.find("[data-id=encryptionWay]").text(encryptionWay_map.get(rowData.encryptionWay));
			if(rowData.authPwd && rowData.authPwd.length != 0)
			{
				el.find("[data-id=authPwd]").text(rowData.authPwd.replace(/.*/g ,"*"));
			}
			else
			{
				return;
			}
			
			if(rowData.encryptionPwd && rowData.encryptionPwd.length != 0)
			{
				el.find("[data-id=encryptionPwd]").text(rowData.encryptionPwd.replace(/.*/g ,"*"));
			}
			else
			{
				return;
			}
		}

	}


});