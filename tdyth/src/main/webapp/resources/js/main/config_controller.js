$(function(){
	$.ajax({
		type: "GET",
		url: "/tdyth/resources/js/eqpManager/packageFilterConfig.html",
		success: function(data){
			$("#mainContainer").html(data);
		}
	});

	//包过滤
	$("#packageFilter").click(function(){
		alert("包过滤");
		$.ajax({
			type: "GET",
			url: "/tdyth/resources/js/eqpManager/packageFilterConfig.html",
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	
	//接口
	$("#alertInfo").click(function(){
		$.ajax({
			type: "GET",
			url: "/tdyth/resources/js/eqpManager/alertInfo/interfaceConfig.html",
			success: function(data){
				$("#mainContainer").html(data);
			}
		});
	
	});
	
	
	
});