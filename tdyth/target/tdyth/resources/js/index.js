$(function() {
	/**
	 * 采集到的磁盘信息列表
	 */
	//第一次加载第一页的页面数据
	//这里由于是全局变量，由于ajax的异步性，必须把获得totalPages值的这个ajax请求设置为async:false(同步),才能赋值
	var totalPages;
	$.ajax({
	type : "POST",
	url : "list",
	dataType : "json",
	data : {
		date:"",
		pageIndex:"1",
	},
	async:false,
	success : function(data) {
		//alert(data.result);
		/*var objs = eval(data);
		totalPages=objs[1].totalPages;
		var trs;
		for ( var i = 0; i< objs.length; i++) {
			trs += "<tr class=\"cen\"><td>"
					+ objs[i].objectID
					+ "</td> <td style=\"color:blue;\">"
					
					+ objs[i].valueIndex
					+ "</td><td>"
					+ objs[i].collectTime
					+ "</td><td>"
					+ objs[i].ifDescr
					+ "</td> <td>"
					+ objs[i].ifType
					+ "</td><td style=\"color:red;\">"
					+ objs[i].ifSpeed
					+ "</td><td>"
					+ objs[i].ifOperStatus
					+"</td><td>"
					+ objs[i].ifInOctets
					+"</td><td>"
					+ objs[i].ifInErrors
					+"</td><td>"
					+ objs[i].ifOutOctets
					+"</td><td>"
					+ objs[i].ifOutErrors
					+"</td></tr>";
		}
		$("#disks_info_list").html(trs);*/
	}
});
		
	//这里由于要触发才会有调用，所以第一次ajax为打开页面自动请求，第二个ajax为手动请求
	$(".pagination").createPage({
        pageCount:20,
        current:1,
        backFn:function(){
        	$.ajax({
        		type : "POST",
        		url : "list",
        		dataType : "json",
        		data : {
        			date:"",
        			pageIndex:$(".current").text(),
        		},
        		success : function(data) {
        			//alert(data.result);
        			var objs = eval(data);
        			var trs;
        			for ( var i = 0; i< objs.length; i++) {
        				trs += "<tr class=\"cen\"><td>"
        						+ objs[i].objectID
        						+ "</td> <td style=\"color:blue;\">"
        						+ objs[i].valueIndex
        						+ "</td><td>"
        						+ objs[i].collectTime
        						+ "</td><td>"
        						+ objs[i].ifDescr
        						+ "</td> <td>"
        						+ objs[i].ifType
        						+ "</td><td style=\"color:red;\">"
        						+ objs[i].ifSpeed
        						+ "</td><td>"
        						+ objs[i].ifOperStatus
        						+"</td><td>"
        						+ objs[i].ifInOctets
        						+"</td><td>"
        						+ objs[i].ifInErrors
        						+"</td><td>"
        						+ objs[i].ifOutOctets
        						+"</td><td>"
        						+ objs[i].ifOutErrors
        						+"</td></tr>";
        			}
        			$("#disks_info_list").html(trs);
        		}
        	});
        }
    });
	
});
