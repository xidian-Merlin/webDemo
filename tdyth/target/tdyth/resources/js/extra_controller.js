$(function(){
	$.ajax({
		type: "POST",
		url: "index/init",
		data: {},
		success: function(data){
			$("#mainContainer").html(data);
		}
	});
	
	//数据概况
	$("#index-init").click(function(){
		$.ajax({
			type: "POST",
			url: "index/init",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	//拓扑展示
	$("#topo_v2").click(function(){
		$.ajax({
			type: "POST",
			url: "topo/topoV2",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	
	//监控器
	$("#monitor").click(function(){
		$.ajax({
			type: "POST",
			url: "eqpMonitor/monitorManage",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	//资产监控
	$("#asset_monitor").click(function(){
		$.ajax({
			type:"POST",
			url: "eqpMonitor/eqpMonitor",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	});
	
	
	//设备类型
	$("#eqpType").click(function(){
		$.ajax({
			type: "POST",
			url: "eqpManage/eqpTypeInit",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	
	//设备安全域
	$("#eqpSecDom").click(function(){
		$.ajax({
			type: "POST",
			url: "eqpManage/eqpSecDomInit",
			data: {},
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
});