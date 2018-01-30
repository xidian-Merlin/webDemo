$(document).ready(function (){
require(['/js/plugin/inputdrop/inputdrop.js'] ,function (inputdrop){

	//样式设置
	{
		$("#content_div").addClass("appbgf");
	}
	var list_url = "dataBaseMaintain/queryDataBaseMaintainLog";
	var list_col = [
						{text:'',name:"t",width:3,hideSearch:"hide"},
						{text:'原始事件名称',width:13,name:"logTime"},
						{text:'类型',width:11,name:"logDesc"},
						{text:'等级',width:10,name:"level" ,searchRender:function (el){
							var data = [
					  						{text:"很高" ,id:"1"},
					  						{text:"高" ,id:"2"},
					  						{text:"中" ,id:"3"},
					  						{text:"低" ,id:"4"},
					  						{text:"很低" ,id:"5"}
								  		];
							g_formel.multipleSelect_render(el ,{
								data : data,
								name : "level",
								allowAll : true
							});
						}},
						{text:'源IP',width:10,name:"logTime",searchRender:function (el){
					  		index_render_div(el ,{type:"ip"});
					    }},
						{text:'目的IP',width:10,name:"logDesc",searchRender:function (el){
					  		index_render_div(el ,{type:"ip"});
					    }},
						{text:'数量',width:10,name:"logResult"},
						{text:'事件设备',width:12,name:"logTime"},
						{text:'事件设备IP',width:10,name:"logDesc",searchRender:function (el){
					  		index_render_div(el ,{type:"ip"});
					    }},
						{text:'时间',width:12,name:"date",searchRender:function (el){
							index_render_div(el ,{type:"date",startKey:"dateStart" ,endKey:"dateEnd"});
						}}
				   ];

	var log_query_detail_url = "";
	
	view_init();

	log_list();
	
	log_query_detail();

	function view_init()
	{
		layout_init();
		$(window).on("resize.module" ,function (){
			$(this).stopTime();
			$(this).oneTime(100 ,function (){
				layout_init();
			});
		});
	}

	function log_query_detail()
	{
		 //调用后台查询详情
		um_ajax_get({
			url : log_query_detail_url,
			isLoad : false,
			successCallBack : function(data){
				$("#dataform").umDataBind("render",data);
			}
		});
	}
	
	function log_list()
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 isLoad : true,
			 maskObj : "body",
			 // dbClick : detail_template_init,
			 // dbIndex:1,
			 allowCheckBox:false
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