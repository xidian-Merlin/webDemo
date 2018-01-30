$(document).ready(function (){
require(['/js/plugin/tree/tree.js',
		'/js/plugin/tab/tab.js',
		'/js/plugin/wizard/wizard.js',
		'/js/plugin/monitor/monitor.js'],
		function (tree ,tab ,wizard ,monitor){

	var this_params = index_query_param_get();
	var fromType = this_params.fromType?this_params.fromType:'thumb';

	var index_list_col_header = [
								  {text:'应用系统名称',name:"appName",render:function (text){
								  	return '<a href="javascript:void(0)">'+text+'</a>';
								  },click:function (data){
								  }},
								  {text:'应用系统描述',name:"desc"},
								  {text : '创建时间',name : "creDate"},
								  {text : '创建人',name : 'creUser'},
								  {text : '修改时间',name : 'updDate'},
								  {text : '修改人',name : 'updUser'}
								];
	var index_list_col_oper = [
					  			/*{icon:"icon-angle-up" ,text:"上移" ,aclick:grid_upper ,style:"square-oper green"},
								{icon:"icon-angle-down" ,text:"下移" ,aclick:grid_lower ,style:"square-oper green"},*/
								{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:index_list_edit },
								{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
				   			];

	var url = {
		index_list : "appMonitor/queryAppSystemThumbnail",
		move_topo : "appMonitor/moveTopo"
	};
	function gotoShow(appId){
		!appId && (appId = "");
		window.open("#/monitor_info/app_monitor_topo1?appId="+appId+"&fromType="+fromType+"&hideMenu=1");
	}
	function gotoEdit(appId){
		!appId && (appId = "");
		window.open("#/sys_manage/monitor_config/app_monitor_config_topo1?appId="+appId+"&fromType="+fromType+"&hideMenu=1");
	}
	// index_initLayout();
	// initLayout();
	$(window).oneTime(500,function (){
		initLayout();
	});
	function initLayout(){
		// index_initLayout();
		var window_height = $(window).outerHeight();
		var pg_header = $("[class=pg-header]:visible").outerHeight();
		$("#pg-container").outerHeight(window_height - pg_header);
		$("#pg-content").outerHeight($("#pg-container").outerHeight() - index_getPadderMargin($("#pg-content")));
		$("#content_div").outerHeight(
									$("#pg-content").outerHeight()
												- index_getHeightWithPadderMargin($("#menu-index")) 
												- index_getPadderMargin($("#content_div"))
								);
		$("#table_div1").outerHeight(
								$("#content_div").outerHeight()
									- index_getHeightWithPadderMargin($("#table_oper"))
									- index_getHeightWithPadderMargin($("ul[class=pagination]"))
									- index_getHeightWithPadderMargin($("div[class*=search-div]"))
									- index_getPadderMarginHeight($("#table_div_outer"))
									- index_getPadderMarginHeight($("#table_div1"))
									- 0
							  );
	}
	function refresh(clearSearch){
		if(clearSearch==true)$('#searchInput').val("");
		var searchName = $("#searchInput").val();
		if(fromType=='grid'){
			app_monitor_grid({paramObj:{appName : searchName},isLoad:true,maskObj:"body"});
		}else {
			app_monitor_list({appName : searchName});
		}
	}
	
	refresh();
	event_init();
	function event_init(){
		$("#searchButton").click(function (){
			refresh();
		});
		$("#searchInput").on('input',function (){
			if($(this).val()!="" && $("#searchClear").is(':hidden')){
				$("#searchClear").show();
			}
			if($(this).val()==""){
				$("#searchClear").hide();
			}
		});
		$("#searchClear").click(function (){
			refresh(true);
			$("#searchClear").hide();
		});
		$("#add_btn").click(function (){
			gotoEdit();
		});
		$("#grid_btn").click(function (){
			app_monitor_grid({paramObj:{appName : $('#searchInput').val()},isLoad:true,maskObj:"body"});
			$("#thumbnail_btn").show();
			$("#grid_btn").hide();
			fromType='grid';
		});
		$("#thumbnail_btn").click(function (){
			app_monitor_list({appName : $('#searchInput').val()});
			$("#grid_btn").show();
			$("#thumbnail_btn").hide();
			fromType='thumb';
		});
		$("#show_config_btn").click(function (){
			$.ajax({
				type : "GET",
				url : "module/sys_manage/monitor_config/app_monitor_config_tpl.html",
				server : "/",
				success : function(data){
					g_dialog.dialog($(data).find("[id=focusConfig]"),{
						title : "关注度配置",
						width:"630px",
						initAfter:initAfter,
						saveclick:save_click
					});

					function initAfter(el){
						um_ajax_get({
							url : "appMonitor/queryFocusConfigList",
							maskObj : el,
							successCallBack : function (data){
								init_focusConfig_div(data,el);
							}
						});
					}
					function save_click(el,saveObj)
					{
						// var idArray = saveObj.ids.split(",");
						var idArray = new Array();
						var isChecked = false;
						$(el).find("[name=ids]").each(function (){
							if($(this).prop("checked")){
								isChecked = true;
							}else {
								idArray.push($(this).val());
							}
						});
						var ids = idArray.join();
						if (!isChecked) {
							g_dialog.operateAlert(el, "请至少选择一项。", "error");
							return false;
						}
						um_ajax_post({
							url : "appMonitor/updFocusConfig",
							paramObj:  {ids : ids},
							maskObj: el,
							successCallBack : function (data){
								g_dialog.hide(el);
								g_dialog.operateAlert(null, "操作成功");

								refresh();
							}
						});
					}
				}
			});
			
		});
	}
	function init_focusConfig_div(data,el){
		for(var i=0;i<data.length;i++){
			if(i==0){
				var checkbox_html_str = "<div class=\"col-lg-4\">"+
											"<div class=\"checkbox\">"+
												"<label class=\"i-checks\">"+
													"<input type=\"checkbox\" name=\"ids\" data-id=\"ids\" value=\""+data[i].codename+"\" "+data[i].ext+"><i></i> "+data[i].codevalue+" "+
												"</label>"+
											"</div>"+
										"</div>";
				$(el).find("#focusConfig_form_group").append(checkbox_html_str);

			}else {
				var checkbox_html_str = "<div class=\"col-lg-4\">"+
											"<div class=\"checkbox\">"+
												"<label class=\"i-checks\">"+
													"<input type=\"checkbox\" name=\"ids\" value=\""+data[i].codename+"\" "+data[i].ext+"><i></i> "+data[i].codevalue+" "+
												"</label>"+
											"</div>"+
										"</div>";
				$(el).find("#focusConfig_form_group").append(checkbox_html_str);
			}
		}
	}
	function app_monitor_grid(option){
		$("#table_div1").html("");
		g_grid.render($("#table_div1"),{
			header:index_list_col_header,
			oper: index_list_col_oper,
			operWidth:"100px",
			url:url.index_list,
			paramObj : option.paramObj,
			hideSearch : true,
			isLoad : option.isLoad,
			maskObj : option.maskObj,
			dbClick : detail_template_init,
			tdClick : true
		});
	}
	function index_list_edit(rowData){
		var appId = rowData.appId;
		gotoEdit(rowData.appId);
	}
	function index_list_delete(rowData){
		g_dialog.operateConfirm("确认删除此记录吗？",{
			saveclick : function (){
			var appId = rowData.appId;
			um_ajax_post({
				url : "appMonitor/delAppSystem",
				paramObj : {'appId' : appId},
				successCallBack : function (data){
					app_monitor_grid({paramObj:{appName : $('#searchInput').val()},isLoad:true,maskObj:"body"});
				}
			});
		}});
	}
	function detail_template_init(rowData){
		gotoShow(rowData.appId)
	}
	function grid_upper(rowData){
		rowData.isMoveFlag = "up";
		topo_common_move(rowData);
		return false;
	}
	function grid_lower(rowData){
		rowData.isMoveFlag = "down";
		topo_common_move(rowData);
		return false;
	}
	function app_monitor_list(paramObj){
		!paramObj && (paramObj = null);
		um_ajax_get({
			url : url.index_list,
			paramObj : paramObj,
			successCallBack : function (data) 
			{
				$("#table_div1").html("");

				if(data.length==0){
					var $p = $('<p></p>');
					$p.css("text-align","center").css("display","table-cell").css("vertical-align","middle").css("font-size","24px").css("color","gray");
					$p.append("暂无数据！");
					if(!$('#searchInput').val()){
						var $a = $('<a href="javascript:void(0)">请添加</a>');
						$a.click(function (){
							window.location.href = "#/sys_manage/monitor_config/app_monitor_config_topo"+"?fromType="+fromType;
						});
						$p.append($a);
					}
					var $div = $('<div></div>');
					$div.css("height","100%").css("width","100%").css("display","table");
					$div.append($p);
					$("#table_div1").append($div);
				}

				for(var i=0;i<data.length ;i++){
					
					var htmlstr = '<div id="'+data[i].appId+'" class="figure tran5 topo-div" style="width:19.5%;margin-left:0.5%;margin-top:0.5%;border: 1px solid #c0c0c0;display:inline-block;background-color:#fff;">'+
					    '<div class="title" style="width:100%;text-align:center;height:76px;line-height:76px;">'+
					     '   <span style="font-size:18px;">'+data[i].appName+'</span>'+
					    '</div>'+
					    // '<div style="background:url('+index_web_app+data[i].thumbnail+'),url('+index_web_app+'/img/soc/Resources/Thumbnail/topo/defaulttopo.png'+');height:130px;margin-left:10px;margin-right:10px;background-size:100% 100%;">'+
					    // '    '+
					    // '</div>'+
					    '<div style="height:108px;text-align:center;">'+
					    ' <div data-id="status" style="height:50px;line-height:50px;font-size:36px;color:green;cursor:pointer;"></div> <span>(业务状态)</span>  '+
					    '</div>'+
					    '<div style="width:100%;height:34px;text-align:center;line-height:34px;margin-top:12px;">'+
					        '<div class="topo-modify" data-id="editRecord" style="cursor:pointer;"><i class="rh-icon topo-edit"></i> 编辑</div>'+
					        '<div class="topo-delete" data-id="deleteFlag" style="cursor:pointer;"><i class="rh-icon topo-remove"></i> 删除</div>'+
					    '</div>'+
					'</div>';

					var  htmlObj = $(htmlstr);
					htmlObj.data(data[i]);
					var status = data[i].thumbStatus;
					if(status==0){
						htmlObj.find("[data-id=status]").append("故障");
						htmlObj.find("[data-id=status]").css("color","#e74c3c");
					}else if(status==1){
						htmlObj.find("[data-id=status]").append("性能");
						htmlObj.find("[data-id=status]").css("color","#ffb933");
					}else if(status==2){
						htmlObj.find("[data-id=status]").append("正常");
						htmlObj.find("[data-id=status]").css("color","#64cc34");
					}else {
						htmlObj.find("[data-id=status]").append("未知");
						htmlObj.find("[data-id=status]").css("color","#969593");
					}

					$("#table_div1").append(htmlObj);

					// $("#table_div1").append(htmlstr);
				}
				$("#table_div1").find("[data-id=deleteFlag]").click(function (){
					var appId = $(this).closest(".figure").prop("id");
					g_dialog.operateConfirm("确认删除此记录吗？",{saveclick : function (){
						um_ajax_post({
							url : "appMonitor/delAppSystem",
							paramObj : {'appId' : appId},
							successCallBack : function (data){
								app_monitor_list({appName : $('#searchInput').val()});
							}
						});
					}});
					return false;
				});
				$("#table_div1").find("[data-id=editRecord]").click(function (){
					var appId = $(this).closest(".figure").prop("id");
					gotoEdit(appId)
					return false;
				});
				$("#table_div1").find("[data-id=upperRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					rowData.isMoveFlag = "up";
					topo_common_move(rowData);
					return false;
				});
				$("#table_div1").find("[data-id=lowerRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					rowData.isMoveFlag = "down";
					topo_common_move(rowData);
					return false;
				});
				$(".figure").click(function (){
					var appId = $(this).prop("id");
					gotoShow(appId);
					return false;
				});
			}
				
		});	

	}
	function topo_common_move(rowData){
		um_ajax_post({
			url : url.move_topo,
			paramObj : rowData,
			successCallBack : function (data){
				if(data.flag==false){
					g_dialog.operateAlert(null,data.msg,"error");
					return false;
				}else {
					g_dialog.operateAlert(null,data.msg);
				}
				refresh();
			}
		});
	}

});
});