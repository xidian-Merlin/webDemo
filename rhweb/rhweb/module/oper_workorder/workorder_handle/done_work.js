$(document).ready(function(){
	require(['/js/plugin/tab/tab.js',
		'js/plugin/workorder/workorder.js'],function(tab ,workorder){

	var list_url ="workflow/queryHisWorkItemData";
	var list_col = [
						{text:'任务名称',name:"workItemName"},
						{text:'工单名称',name:"processInstanceName"},
						{text:'工单编号',name:"procCode"},
						{text:'模板名称',name:"processTemplateName"},
						{text:'工单申请人',name:"processInstanceCreator" ,searchRender:function(el){
							um_ajax_get({
								url:"workflow/queryUserCodeList",
								paramObj:{status : "2"},
								isLoad : false,
								successCallBack : function(data){
									var buffer = [];
									for (var i = 0; i < data.length; i++) {
										buffer.push({text:data[i].codename ,id:data[i].codevalue});
									}
									buffer.insert(0 ,{id:"-1" ,text:"---"});
									g_formel.select_render(el ,{data:buffer,name:"processInstanceCreator"});
								}
							});
						}},
						{text:'任务创建时间',name:"createTime" ,searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startCreateTime",
								endKey : "endCreateTime"
							});
						}},
						{text:'任务完成时间',name:"completeTime" ,searchRender:function(el){
							index_render_div(el ,{
								type : "date",
								startKey : "startCompleteTime",
								endKey : "endCompleteTime"
							});
						}},
						{text:'当前节点',name:"currentNodeName",hideSearch:true}
				   ];

	done_work_list({paramObj:null,isLoad:true,maskObj:"body"});

	index_search_div_remove_click(done_work_list ,{paramObj:null,isLoad:true,maskObj:"body"});

	function done_work_list(option)
	{
		g_grid.render($("#table_div"),{
			 header:list_col,
			 url:list_url,
			 paramObj : option.paramObj,
			 isLoad : option.isLoad,
			 allowCheckBox:false,
			 maskObj : option.maskObj,
			 dbClick : done_work_detail_init
		});
	}

	function done_work_detail_init(rowData)
	{	
		var id = rowData.actTmpId;
		var processTemplateName = rowData.processTemplateName;
		var tplName;
		if(id.split("_")[0] == "socsjczlc")
		{
			tplName = processTemplateName.split("(")[1].split(")")[0];
		}
		workorder.done_workorder({
									id:id ,
									tplName:tplName,
									processInstanceID:rowData.processInstanceID
								});
	}

});	
});
