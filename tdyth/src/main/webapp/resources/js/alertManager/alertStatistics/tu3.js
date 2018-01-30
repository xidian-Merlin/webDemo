$(function(){
	var statisticsDataName;
	var statisticsDataValues;
  $.ajax({
	  url: "alertManage/alertTimeStatistics",
		data: {},
		success: function(data){
			statisticsDataName = data.statisticsDataName;
			statisticsDataValues = data.statisticsDataValues;

echarts.init(document.getElementById('tu3')).setOption({
    title : {
        text: '基于时间的告警统计',
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
});