$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	//样式设置
	{
		$("#content_div").addClass("appbgf");
	}
	var list_url = "dataBaseMaintain/queryDataBaseMaintainLog";
	var list_col = [
						{text:'时间',name:"logTime",searchRender:function (el){
				  			el.append('<input type="text" class="form-control input-sm" search-data="userName">');
				  		}},
						{text:'描述',name:"logDesc"},
						{text:'结果',name:"logResult"},
				   ];

	var database_config_url = "dataBaseMaintain/queryDataBaseMaintain";
	var database_update_url = "dataBaseMaintain/updDataBaseMaintainTask";
	
	view_init();
	event_init();
	
	databaseConfig();

	function view_init()
	{
		layout_init();
		$(window).on("resize.module" ,function (){
			$(this).stopTime();
			$(this).oneTime(100 ,function (){
				layout_init();
			});
		});
		database_list({paramObj:null,isLoad:true,maskObj:"body"});
		g_validate.init($("#dataform"));
	}

	function databaseConfig()
	{
		 //调用后台查询详情
		um_ajax_get({
			url : database_config_url,
			isLoad : false,
			successCallBack : function(data){
				var index = 0;
				try
				{
					index = parseInt(data.type);
		            $("input[name='type']").eq(index).attr("checked","checked");
	            	$("input[name='type']").eq((index-1<0?1:0)).removeAttr("checked");
					$("input[name='diskUsage']").val(data.diskUsage);
					$("input[name='saveData']").val(data.saveData);
				}catch(e){}
				$("input[name='type']").each(function(){
					$(this).click(function(){
						$("input[custom-radio='custom-radio']").attr("disabled","disabled");
						$("input[custom-radio-vaule='"+$(this).val()+"']").attr("disabled",false);
					});
				});
				
				$("input[name='type']").eq(index).click();
			}
		});
	}
	
	function database_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 maskObj : option.maskObj,
//			 dbClick : detail_template_init,
			 hideSearch:true,
			 allowCheckBox:false
		});
	}

	function database_updateconfig(el)
	{
		if (g_validate.validate(el))
		{
			var type=$('input[name="type"]:checked').val();
			var saveData=el.find("input[name='saveData']").val();
			var diskUsage=el.find("input[name='diskUsage']").val();
			var param = {
					type : type,
					saveData : saveData,
					diskUsage : diskUsage
			};
			um_ajax_post({
							url : database_update_url,
							maskObj : "body",
							paramObj : param,
							successCallBack : function (data){
								//刷新配置
								databaseConfig();
								g_dialog.operateAlert();
							}
						});
		}
	}
	
	function event_init()
	{
		$("#dataBaseConfigSubmit").click(function()
		{
			g_validate.init($("#dataform"));
			database_updateconfig($("#dataform"));
		});
	}

	function layout_init() 
	{
		index_initLayout();
		var tarH = $("#content_div").height() - 35;
		$("#table_div").height(tarH-30);
	}

});
});