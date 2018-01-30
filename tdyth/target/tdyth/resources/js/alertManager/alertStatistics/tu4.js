$(function(){
	var nameList;
	var valueList;
	$.ajax({type: "POST",
		url: "alertManage/eventTypeStatistics",
		data: {},
		success: function(data){
			nameList = data.nameList;
			valueList = data.valueList;
			
			  var myChart = echarts.init(document.getElementById('tu4'));

		        // 指定图表的配置项和数据
		        var option = {
		            title : {
		                text: '事件类别统计'
		               /* subtext: '纯属虚构'*/
		            },
		            tooltip : {
		                trigger: 'axis'
		            },
		           /* legend: {
		                data:['蒸发量']
		            },*/
		            toolbox: {
		                show : true,
		                feature : {
		                    mark : {show: true},
		                    dataView : {show: true, readOnly: false},
		                    magicType : {show: true, type: ['line', 'bar']},
		                    restore : {show: true},
		                    saveAsImage : {show: true}
		                }
		            },
		            calculable : true,
		            xAxis : [
		                {
		                    type : 'category',
		                    data : nameList
		                }
		            ],
		            yAxis : [
		                {
		                    type : 'value'
		                }
		            ],
		            series : [
		                {
		                    name:'事件数量',
		                    type:'bar',
		                    data:valueList,
		                    markPoint : {
		                        data : [
		                            {type : 'max', name: '最大值'},
		                            {type : 'min', name: '最小值'}
		                        ]
		                    },
		                    markLine : {
		                        data : [
		                            {type : 'average', name: '平均值'}
		                        ]
		                    }
		                }
		            ]
		        };

		        // 使用刚指定的配置项和数据显示图表。
		        myChart.setOption(option);
			
		}
		
	});
	
	
	
      
});