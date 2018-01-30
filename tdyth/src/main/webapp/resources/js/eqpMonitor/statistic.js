var  showStatistic =  function(url,options) {
	var statisticsDataName;
	var statisticsDataValues;
  $.ajax({
	  type: "POST",
	  url:/* "eqpMonitor/memTimeStatistics"*/url,
		data: {eqpNo:options.eqpNo},
		success: function(data){
			statisticsDataName = data.statisticsDataName;
			statisticsDataValues = data.statisticsDataValues;

echarts.init(document.getElementById('chart_div')).setOption({
    title : {
        text: '基于时间的统计',
       /* subtext: '纯属虚构'*/
    },
    tooltip : {
        trigger: 'axis'
    },
    /*legend: {
        data:['最高气温','最低气温']
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
            boundaryGap : false,
            data : statisticsDataName,
            
        }
    ],
    yAxis : [
        {
            type : 'value',
            axisLabel : {
                formatter: '{value}'
            }
        }
    ],
    series : [
        {
            name:'告警数量',
            type:'line',
            data:statisticsDataValues,
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
});
		}

  })
};