$(document).ready(function (){


var index_list_col_header = [
	 				  {text : "编号" ,name : "id"},
					];

var index_list_col_oper = [
		  			  {icon : "rh-icon rh-edit" ,text : "修改" ,aclick :edit_template_init},
		  			  {icon : "rh-icon rh-delete" ,text : "删除" ,aclick :index_list_delete ,isShow : function(rowData){
		  			  		//根据传入参数判断是否显示删除按钮，true显示，false隐藏
		  			  		return true;
		  			  }}
	   			  ];


var el_table_div = $("#table_div1");

var current_selected_node_id = -1;

var current_selected_node_name = "资产类别";

view_init();

event_init(); 

initLayout();

/*asset_class_tree();*/

index_list_get({paramObj :null ,isLoad : false ,maskObj : "body"});

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
}

function event_init()
{
	$(window).on("resize.module" ,function (){
		initLayout();
	});
	$("#add_btn").click(function (){
		edit_template_init();
	});

	$("#remove_btn").click(function (){
		index_list_batch_delete();
	});
}

function initLayout()
{
	index_initLayout();
$("#table_div1").oneTime(500 ,function (){
		
		$("#table_div1").height(
						$("#right-panel").height()
							- index_getHeightWithPadderMargin($("#table_oper"))
							- index_getHeightWithPadderMargin($("ul[class=pagination]"))
							- index_getHeightWithPadderMargin($("div[class*=search-div]"))
							
				
					  );
	});
}


function index_list_get(option)
{
	g_grid.render($("#table_div1") ,{
 		header : index_list_col_header,
 		oper : index_list_col_oper,
 		operWidth : "100px",
 		url : "alertManage/alertInfoList",
 		paramObj : option.paramObj,
 		isLoad : option.isLoad,
 		maskObj : option.maskObj
	});
	
}

function index_list_delete(rowData)
{   console.log(rowData.id);
	g_dialog.operateConfirm("确认删除此记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: "alertManage/alertTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpTypeIdList:rowData.id},
				success :function(data)
			{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
					
				}
			});
		}
	});
}

function index_list_batch_delete()
{

	var target_attributed_id = [];
	var rowData = g_grid.getData($("#table_div1") ,{
		chk : true
	});
	var eqpTypeIdList = "";
	for(var i=0 ,len = rowData.length ;i<len ;i++){
		eqpTypeIdList += rowData[i].id ;
		if (i != (len-1)){
			eqpTypeIdList += ","
		}
	}
	g_dialog.operateConfirm("确认删除选中的记录么" ,{
		saveclick : function()
		{
			$.ajax({
				type: "POST",
				url: " alertManage/alertTypeModify",
				dataType: "json",
				timeout : 120000, //超时时间设置，单位毫秒
				data:{operateType:3,eqpTypeIdList:eqpTypeIdList},
				success :function(data)
			{
					g_dialog.operateAlert(null ,"操作成功！");
					index_list_get({paramObj : null ,isLoad : false ,maskObj : "body"});
					
				}
			});
		}
	});
}

function edit_template_init(rowData)
{
	var target_title = rowData ? "修改包过滤规则" : "添加包过滤规则";
	var url = rowData? "/tdyth/resources/js/eqpManager/packageParameters.html" : "/tdyth/resources/js/eqpManager/packageParameters.html"
 
	$.ajax({
		type: "GET",
		url: url,
		success : function(data){
			g_dialog.dialog($(data).find("[id=edit_template]") ,{
				width : "650px",
				init : init,
				initAfter : initAfter,
				title : target_title,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		
	}

	function initAfter(el)
	{
		
		el.find("[name=action]").select2({
			data : [{id:1,text:'accept'},{id:2,text:'reject'}],
			width : "100%"
		});
		el.find("[name=log]").select2({
			data : [{id:1,text:'yes'},{id:2,text:'no'}],
			width : "100%"
		});
		el.find("[name=direction]").select2({
			data : [{id:1,text:'inbound'},{id:2,text:'outbound'}],
			width : "100%"
		});
		
		el.find("[name=year-star-data]").prop("readonly", true).datepicker({
			changeMonth: true,
			dateFormat: "yy-mm-dd",
			onClose: function(selectedDate) {
			}
		});
		el.find("[name=hour-star-time]").prop("readonly", true).timepicker({
			timeText: '时间',
			hourText: '小时',
			minuteText: '分钟',
			secondText: '秒',
			currentText: '现在',
			closeText: '完成',
			showSecond: true, //显示秒  
			timeFormat: 'HH:mm:ss' //格式化时间  
		});
		
		el.find("[name=year-end-data]").prop("readonly", true).datepicker({
			changeMonth: true,
			dateFormat: "yy-mm-dd",
			onClose: function(selectedDate) {
			}
		});
		el.find("[name=hour-end-time]").prop("readonly", true).timepicker({
			timeText: '时间',
			hourText: '小时',
			minuteText: '分钟',
			secondText: '秒',
			currentText: '现在',
			closeText: '完成',
			showSecond: true, //显示秒  
			timeFormat: 'HH:mm:ss' //格式化时间  
		});
		
	}
/*/protocol/sendMsg */      
	function save_click(el ,saveObj)
	{
		if(rowData){
			if(current_selected_node_id != -1)
			{
				current_selected_node_id = el.find("[data-id=deviceClass]").val();
			}
		}
		
		if(rowData){
		el.find("[data-id=eqpTypeId]").val(rowData.id);
		}
		
		//包头
		var header = new HashMap();
		header.put("version",1);
		header.put("classfication",3);
		header.put("type",1);
		
		//不变区域
		var stableList = new HashMap();
		stableList.put("configSenderID",1234);
		stableList.put("userID",12);
		stableList.put("time",new Date().getTime());
		stableList.put("command",5);
		stableList.put("subcommand",1);
		stableList.put("targetSize",1);
		stableList.put("targetID","0001-00001");
	
		//可变区域
	   var varList = new Array();
	 
	   el.find("[data-id=loop]").each(function(i){
		   if(i==1 || i==2 || i==3 || i==4){
			   var mac = ""
			  $(this).children().each(function(){
				  mac += $(this).val()  
			  })
			 varList.push({type:i+1,value:mac})
		   }
		   else if(i==5 || i==6 || i==7 || i==8){
			   var ip = ""
			  $(this).children().each(function(){
				  ip += $(this).val()  
			  })
			 varList.push({type:i+1,value:ip})
		   }
		   
		   else varList.push({type:i+1,value:$(this).val()})
	   }) 
	
	  
	
	   
	   $.ajax({
			type: "POST",
			url: "http://localhost:8080/tdyth/protocol/sendMsg",
			dataType : "json",
			data:{info:JSON.stringify({headerMsg:header.entry(),fixedBodyMsg:stableList.entry(),unFixedBodyMsg:varList})},
			success: function(data){
			
			}
		});
		
		
		
	}
}


});