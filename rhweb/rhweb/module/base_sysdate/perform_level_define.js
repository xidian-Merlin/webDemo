$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	// 性能等级定义列表URL
	var list_url = "PerfLevel/queryPerfLevel";
	var list_col = [
						{text:'事件名称',name:"name"},
						{text:'事件类型',name:"className",searchRender:function(el){
							var searchEl = $('<select class="form-control input-sm" search-data="className" data-id="className"></select>');
							el.append(searchEl);
							g_formel.code_list_render({
								key : "perfclass",
								performEventTypeEl : searchEl
							});
						}},	
						{text:'事件等级',name:"level",render:function (text ,data){
							var countColor;
							if (data.level == "0")
							{
								text = "很高";
								countColor = "#e74c3c"
							}
							else if (data.level == "1")
							{
								text = "高";
								countColor = "#fe8174";
							}
							else if (data.level == "2")
							{
								text = "中";
								countColor = "#ffb933";
							}
							else if (data.level == "3")
							{
								text = "低";
								countColor = "#62cb31";
							}
							else if (data.level == "4")
							{
								text = "很低";
								countColor = "#96e174";
							}
							else 
							{
								return "---";
							}
							return '<i style="font-size:20px"></i><span class="dib prel" style="padding:0 3px;width:3em; background-color:'+countColor+';color:#fff;border:none;top:-2px;margin-right:7px;margin-left:7px">'
										+text+'</span>';
						},searchRender:function (el){
							var data = [
											{text:"----" ,id:"-1"},
					  						{text:"很高" ,id:"0"},
					  						{text:"高" ,id:"1"},
					  						{text:"中" ,id:"2"},
					  						{text:"低" ,id:"3"},
					  						{text:"很低" ,id:"4"}
								  		];
							g_formel.select_render(el ,{
								data : data,
								name : "level"
							});
						}}
				  	];
	var list_oper = [{icon:"rh-icon rh-edit",text:"修改",aclick:perform_edit}];

	// 性能等级批量修改url
	var user_update_url = "PerfLevel/updPerfLevel";

	event_init();

	perform_level_list({paramObj:null,isLoad:true,maskObj:"body"});


	function event_init()
	{
		$("#update_btn").click(function (){
			update_template_init();
		});
	}

	function perform_level_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 oper:list_oper,
			 operWidth:"80px",
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
			 paginator : false,
			 showCount : true
		});
	}

	function update_template_init()
	{
		// 如果数据没有被勾选，则弹出错误提示
		var data = g_grid.getData($("#table_div") ,{chk:true});
		if (data.length == 0)
		{
			// 弹出提示
			g_dialog.operateAlert($("#table_div") ,"请至少选择一条记录！" ,"error");
			// 直接返回
			return false;
		}

		// 弹出修改框
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/perform_level_define_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=perform_level_update_template]"),{
					width:"550px",
					init:init,
					title:"性能事件等级定义",
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			g_validate.init(el);
		}

		function save_click(el ,saveObj)
		{
			// 校验等级定义是否已填
			var test = g_validate.validate(el);

			if (test == false){
				return false;
			}

			var data = g_grid.getData($("#table_div") ,{chk:true});

			// 组装id
			var buffer = [];

			for (var i = 0; i < data.length; i++) {
				buffer.push(data[i].id);
			}
			
			// saveObj.level    
			saveObj.id = buffer.join(",");
			
			um_ajax_post({
				url : user_update_url,
				paramObj : saveObj,
				maskObj : el,
				successCallBack : function (){
					// 关闭对话框
					g_dialog.hide(el);
					// 弹出成功提示
					g_dialog.operateAlert();
					// 重新刷新列表
					g_grid.refresh($("#table_div"));
				}
			});

		}
	}

	function perform_edit(rowData)
	{
		$.ajax({
			type: "GET",
			url: "module/base_sysdate/perform_level_define_tpl.html",
			success :function(data)
			{
				g_dialog.dialog($(data).find("[id=perform_level_edit_template]"),{
					width:"550px",
					init:init,
					title:"性能事件等级定义修改",
					saveclick:save_click
				});
			}
		});

		function init(el)
		{
			g_validate.init(el);
			el.umDataBind("render",rowData);
		}		

		function save_click(el ,saveObj)
		{
			
			// 校验等级定义是否已填
			var test = g_validate.validate(el);

			if (test == false){
				return false;
			}
			saveObj.eventDesc = saveObj.name;
			saveObj.id = rowData.id;
			//发送
			um_ajax_post({
				url : user_update_url,
				paramObj : saveObj,
				maskObj :el,
				successCallBack : function (){
					// 关闭对话框
					g_dialog.hide(el);
					// 弹出成功提示
					g_dialog.operateAlert();
					// 重新刷新列表
					perform_level_list({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}

	}


});
});