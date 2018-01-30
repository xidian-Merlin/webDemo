$(function(){
	var typeList;
	var dataList;
	var resultList = new Array();
	$.ajax({
		url: "alertManage/alertUrgentStatistics",
		data: {},
		success: function(data){
			typeList = data.typeList;
			dataList = data.dataList;
			for(i=0;i<typeList.length;i++){
			for(j=0;j<dataList.length;j++){
				if (typeList[i] == dataList[j].name){
					resultList.push(dataList[j]);
				}
			}
			}
			

  echarts.init(document.getElementById('tu2')).setOption({
    title : {
        text: '告警紧急程度统计',
       /* subtext: '纯属虚构',*/
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        data:typeList
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:resultList
        }
    ],
    color: ['rgb(121,200,230)','rgb(110,162,230)','rgb(66,96,230)','rgb(164,47,105)','rgb(152,13,1)']
});
		}
	});
  
});