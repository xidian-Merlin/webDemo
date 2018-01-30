$(document).ready(function (){
require(['/js/plugin/tree/tree.js',
		'/js/plugin/tab/tab.js',
		'/js/plugin/wizard/wizard.js',
		'/js/plugin/monitor/monitor.js'],
		function (tree ,tab ,wizard ,monitor){

	var index_list_col_header = [
								  {text:'应用系统名称',name:"appName",render:function (text){
								  	return '<a href="javascript:void(0)">'+text+'</a>';
								  },click:function (data){
								  	window.location.href = "#/monitor_info/app_monitor_topo?appId="+data.appId;
								  }},
								  {text:'联系人',name:"contact"},
								  {text:'电话',name:"phone"},
								  {text:'Email',name:"email"},
								  {text:'应用系统描述',name:"desc"}
								];
	var index_list_col_oper = [
								{icon:"rh-icon rh-up" ,text:"上移" ,aclick:grid_upper },
								{icon:"rh-icon rh-down" ,text:"下移" ,aclick:grid_lower},
								{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:index_list_edit},
								{icon:"rh-icon rh-delete" ,text:"删除" ,aclick:index_list_delete}
							];

	var url = {
		index_list : "appMonitor/queryAppSystemThumbnail",
		move_topo : "appMonitor/moveTopo"
	};
	index_initLayout();
	app_monitor_list();
	event_init();
	function event_init(){
		$("#add_btn").click(function (){
			window.location.href = "#/sys_manage/monitor_config/app_monitor_config_topo";
		});
		$("#grid_btn").click(function (){
			app_monitor_grid({paramObj:null,isLoad:true,maskObj:"body"});
			$("#thumbnail_btn").show();
			$("#grid_btn").hide();
		});
		$("#thumbnail_btn").click(function (){
			app_monitor_list();
			$("#grid_btn").show();
			$("#thumbnail_btn").hide();
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

								if($("#thumbnail_btn").is(":hidden")){
									app_monitor_list();
								}else {
									app_monitor_grid({paramObj:null,isLoad:true,maskObj:"body"});
								}
							}
						});
					}
				}
			});
			
		});
	}
	function app_monitor_grid(option){
		$("#table_div").html("");
		g_grid.render($("#table_div"),{
			header:index_list_col_header,
			oper: index_list_col_oper,
			operWidth:"150px",
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
		window.location.href = "#/sys_manage/monitor_config/app_monitor_config_topo?appId="+appId+"";
	}
	function index_list_delete(rowData){
		g_dialog.operateConfirm("确认删除此记录吗？",{
			saveclick : function (){
			var appId = rowData.appId;
			um_ajax_post({
				url : "appMonitor/delAppSystem",
				paramObj : {'appId' : appId},
				successCallBack : function (data){
					app_monitor_grid({paramObj:null,isLoad:true,maskObj:"body"});
				}
			});
		}});
	}
	function detail_template_init(rowData){
		window.location.href = "#/monitor_info/app_monitor_topo?appId="+rowData.appId;
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
	function app_monitor_list(){
		um_ajax_get({
			url : url.index_list,
			paramObj : null,
			successCallBack : function (data) 
			{
				$("#table_div").html("");

				if(data.length==0){
					var $p = $('<p></p>');
					$p.css("text-align","center").css("display","table-cell").css("vertical-align","middle").css("font-size","24px").css("color","gray");
					$p.append("暂无数据！");
					var $a = $('<a href="javascript:void(0)">请添加</a>');
					$a.click(function (){
						window.location.href = "#/sys_manage/monitor_config/app_monitor_config_topo";
					});
					$p.append($a);
					var $div = $('<div></div>');
					$div.css("height","100%").css("width","100%").css("display","table");
					$div.append($p);
					$("#table_div").append($div);
				}

				for(var i=0;i<data.length ;i++){
					
					var htmlstr = "<figure class=\"effect-sadie\" id=\""+data[i].appId+"\">"+
					// "<img alt=\"图片加载失败\" src=\""+index_web_app+data[i].thumbnail+"\" width=\"100%\" height=\"100%\">"+
					'<figcaption class="tran5" style="background: url('+index_web_app+data[i].thumbnail+'),url('+index_web_app+'/img/soc/Resources/Thumbnail/topo/defaulttopo.png'+');">'+
					"<h2>"+data[i].appName+"<span></span></h2>"+
					"<p></p>"+
					"<p>"+
					"<button data-id=\"upperRecord\" class=\"btn btn-default btn-sm ml1\">左移</button>"+
					"<button data-id=\"lowerRecord\" class=\"btn btn-default btn-sm ml1\">右移</button>"+
					"<button data-id=\"deleteFlag\" class=\"btn btn-danger btn-sm\">删除</button>"+
					"</p>"+
					// "<a href=\"javascript:void(0)\">view more</a>"+
					"</figcaption>"+
					"</figure>";

					var  htmlObj = $(htmlstr);
					htmlObj.data(data[i]);

					$("#table_div").append(htmlObj);

					// $("#table_div").append(htmlstr);
				}
				$("#table_div").find("[data-id=deleteFlag]").click(function (){
					var appId = $(this).closest("figure").prop("id");
					g_dialog.operateConfirm("确认删除此记录吗？",{saveclick : function (){
						console.log(appId);
						um_ajax_post({
							url : "appMonitor/delAppSystem",
							paramObj : {'appId' : appId},
							successCallBack : function (data){
								app_monitor_list();
							}
						});
					}});
					return false;
				});
				$("#table_div").find("[data-id=upperRecord]").click(function (){
					var rowData = $(this).closest("figure").data();
					rowData.isMoveFlag = "up";
					topo_common_move(rowData);
					return false;
				});
				$("#table_div").find("[data-id=lowerRecord]").click(function (){
					var rowData = $(this).closest("figure").data();
					rowData.isMoveFlag = "down";
					topo_common_move(rowData);
					return false;
				});
				$("figure").click(function (){
						var appId = $(this).prop("id");
						window.location.href = "#/sys_manage/monitor_config/app_monitor_config_topo?appId="+appId+"";
				});
			}
				
		});	

	}
	function init_focusConfig_div(data,el){
		console.log(data);
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
		 // el.umDataBind("serialize");
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
				if($("#thumbnail_btn").is(":hidden")){
					app_monitor_list();
				}else {
					app_monitor_grid({paramObj:null,isLoad:true,maskObj:"body"});
				}
			}
		});
	}


});
});