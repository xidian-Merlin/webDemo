$(function(){
	var valueList;
	var nameList;
	var resultList = new Array();
	$.ajax({
		url: "alertManage/eventRankStatistics",
		data: {},
		success: function(data){
			nameList = data.nameList;
			valueList = data.valueList;
			for(i=0;i<nameList.length;i++){
			for(j=0;j<valueList.length;j++){
				if (nameList[i] == valueList[j].name){
					resultList.push(valueList[j]);
				}
			}
			}


  echarts.init(document.getElementById('tu5')).setOption({
    title : {
        text: '事件级别统计',
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
        data:nameList
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