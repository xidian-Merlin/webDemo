/** 
	插件名称  :  plot
	插件功能  :  各种图表生成，饼图，线图，晴雨表
*/
define(['/js/lib/charts/echarts.min.js'] ,function (echarts){

	var color_array = ['#23b7e5' ,'#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];

	return {
		/** 
			param:  name
					legend
					hideLegend
					data
					grid
					labelSetting
					roseType
		*/
		pieRender:function (el ,opt){
			var myChart = echarts.init(el[0]);

			option = {
			    tooltip: {
			        trigger: 'item',
			        formatter: "{a} <br/>{b}: {c} ({d}%)"
			    },
			    legend: {
			        orient: 'vertical',
			        x: 'left',
			        //data:['Test1','Test2']
			        data: opt.legend,
			        selectedMode:false
			    },
			    series: [
			        {
			            name:(opt.name?opt.name:""),
			            type:'pie',
			            //radius: ['50%', '70%'],
			            avoidLabelOverlap: false,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'left'
			                }
			                // emphasis: {
			                //     show: true,
			                //     textStyle: {
			                //         fontSize: '15',
			                //         fontWeight: 'bold'
			                //     }
			                // }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:opt.data,
				            	// [
				             //    	{value:335, name:'Test1'},
				             //    	{value:310, name:'Test2'}
				            	// ]
			        }
			    ],
			    color: color_array,
			    animation:true
			};

			if (opt.hideLegend)
			{
				delete option.legend;
			}

			if (opt.grid)
			{
				option.grid = opt.grid;
			}

			if (opt.labelSetting)
			{
				option.series[0].label = opt.labelSetting;
			}

			if (opt.labelLineSetting)
			{
				option.series[0].labelLine = opt.labelLineSetting;
			}

			if (opt.centerPosition)
			{
				option.series[0].center = opt.centerPosition;
			}

			if (opt.radius)
			{
				option.series[0].radius = opt.radius;
			}

			if (opt.legendArray)
			{
				option.legend = opt.legendArray;
			}

			if (opt.color_array)
			{
				option.color = opt.color_array;
			}

			if (opt.itemStyle)
			{
				option.series[0].label.normal.show = true;
				option.series[0].label.normal.position = "inner";
				//option.series[0].labelLine.normal.show = true;
				option.series[0].itemStyle = opt.itemStyle;
			}

			if (opt.roseType)
			{
				option.series[0].roseType = opt.roseType;
			}

			if (opt.hideAnimation)
			{
				option.animation = false;
			}

			myChart.setOption(option);

			if (!opt.resizeFlag)
			{
				el.data("chart" ,myChart);

				if (opt.click)
				{
					myChart.on('click', function (params) {
				    	opt.click(params);
					});
				}

				onWindowResize.add(function (){
					myChart.resize();
				});
			}

			return myChart;
		},

		/** 晴雨表 
			param: {color:""}
		*/
		skyRender: function (elId ,opt){
			index_sky_cons || (index_sky_cons = new Skycons({"color": opt.color}));

			// you can add a canvas by it's ID...
			index_sky_cons.add(elId, Skycons[opt.skyIcon]);

			index_sky_cons.play();
		},

		/** 
			线图
			参数 : category
				   series
				   legend
				   axisLabelRotate	int
				   tooltipFormatter function(){}
				   axisLabelFormatter function(){}
				   color_array []
				   hideYaxis boolean
				   xAxisLabelColor

		*/
		lineRender: function (el,opt){
			var myChart = echarts.init(el[0]);

			if (!opt.lineStyle)
			{
				for (var i = 0; i < opt.series.length; i++) {
					opt.series[i].areaStyle = {normal: {}};
				}
			}

			option = {
			    title: {
			        text: ''
			    },
			    tooltip : {
			        trigger: 'axis'
			    },
			    // legend: {
			    //     //data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎'],
			    //     data:opt.legend,
			    //     textStyle:{color:"#999"}
			    // },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    xAxis : [
			        {
			            type : 'category',
			            axisLabel : {textStyle:{color:"#999"}},
			            boundaryGap : false,
			            //data : ['周一','周二','周三','周四','周五','周六','周日']
			            data : opt.category
			        }
			    ],
			    yAxis : 
			    [
			        {
			            type : 'value',
			            axisLabel : {textStyle:{color:"#999"}},
			            minInterval: 1,
			        }
			    ],
			    series : opt.series,
			    color: color_array,
			    animation:true
						    // [
						    //     {
						    //         name:'邮件营销',
						    //         type:'line',
						    //         stack: '总量',
						    //         areaStyle: {normal: {}},
						    //         data:[120, 132, 101, 134, 90, 230, 210]
						    //     }
						    // ]
			};

			if (opt.legend)
			{
				option.legend = {
						          //data:['邮件营销','联盟广告']
						          data:opt.legend,
						          textStyle:{color:"#999"}
							    };
			}

			if (opt.axisLabelRotate)
			{
				option.xAxis[0].axisLabel.rotate = opt.axisLabelRotate;
			}

			if (opt.tooltipFormatter)
			{
				option.tooltip.formatter = opt.tooltipFormatter;
			}

			if (opt.axisLabelFormatter)
			{
				option.xAxis[0].axisLabel.formatter = opt.axisLabelFormatter;
			}

			if (opt.grid)
			{
				option.grid = opt.grid;
			}

			if (opt.title)
			{
				option.title.text = opt.title;
			}

			if (opt.color_array)
			{
				option.color = opt.color_array;
			}

			if (opt.hideYaxis)
			{
				option.yAxis[0].axisLine = {show: false};
				option.yAxis[0].axisLabel = {show: false};
				option.yAxis[0].axisTick = {show: false};
				option.yAxis[0].splitLine = {show: false};
			}
			
			if (opt.xAxisLabelColor)
			{
				option.xAxis[0].axisLabel = {textStyle:{color:opt.xAxisLabelColor}};
			}

			if (opt.hideAnimation)
			{
				option.animation = false;
			}
			
			opt.minInterval && (option.yAxis[0].minInterval = opt.minInterval);


			myChart.setOption(option);

			if (!opt.resizeFlag)
			{
				if (opt.click)
				{
					myChart.on('click', function (params) {
				    	opt.click(params);
					});
				}
				
				el.data("chart" ,myChart);

				onWindowResize.add(function (){
					if (opt.delay)
					{
						el.oneTime(500 ,function (){
							myChart.resize();
						});
					}
					else
					{
						myChart.resize();
					}
				});
			}

			return myChart;
		},
		/** 
			柱图
			参数 : category
				   series
				   rotate
				   legend
				   color
				   yAxisLineColor
				   xAxisLineColor
		*/
		barRender:function (el ,opt){
			var myChart = echarts.init(el[0]);
			var xAxis = [
					        {
					            type : 'category',
					            //data : ['周一','周二','周三','周四','周五','周六','周日']
					            data : opt.category,
					            nameRotate : 15,
					            axisLabel : {interval:0,textStyle:{fontSize:10},formatter:function (value){
					            	if (value && value.length > 8)
					            	{
					            		return value.substr(0,8) + "..";
					            	}
					            	return value;
					            }},
					            axisLine:{
					            	lineStyle:{
					            	}
					            }
					        }
					    ];
			var yAxis = [
					        {
					            type : 'value',
					            nameRotate : 15,
					            minInterval: 1,
					            axisLine:{
					            	lineStyle:{
					            	}
					            }
					        }
					    ];
			if (opt.rotate)
			{
				xAxis[0].axisLabel.rotate = opt.rotate;
			}
			option = {
			    tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    yAxis : yAxis,
			    xAxis : xAxis,
			    series : opt.series,
			    color: color_array,
			    animation: true
					    // [
					    //     {
					    //         name:'邮件营销',
					    //         type:'bar',
					    //         stack: '广告',
					    //         data:[120, 132, 101, 134, 90, 230, 210]
					    //     }
					    // ]

			};
			if (opt.legend)
			{
				option.legend = {
						          //data:['邮件营销','联盟广告']
						          data:opt.legend
							    };
			}
			if (opt.isVercital)
			{
				option.yAxis = xAxis;
				option.xAxis = yAxis;
			}
			if (opt.xFormater)
			{
				option.yAxis[0].axisLabel.formatter = opt.xFormater;
			}
			if (opt.tipFormater)
			{
				option.tooltip.formatter = opt.tipFormater;
			}
			if (opt.color)
			{
				option.color = opt.color; 
			}
			if (opt.xAxisLineColor)
			{
				option.xAxis[0].axisLine.lineStyle.color = opt.xAxisLineColor;
			}
			if (opt.yAxisLineColor)
			{
				option.yAxis[0].axisLine.lineStyle.color = opt.yAxisLineColor;
			}
			if (opt.splitLineColor)
			{
				option.yAxis[0].splitLine = {lineStyle:{color : opt.splitLineColor}};
			}
			if (opt.grid)
			{
				option.grid = opt.grid;
			}
			if (opt.hideAnimation)
			{
				option.animation = false;
			}

			if (!opt.barFreeWidth)
			{
				option.series[0].barMaxWidth = "32px";
			}
			
			myChart.setOption(option);

			if (!opt.resizeFlag)
			{
				if (opt.click)
				{
					myChart.on('click', function (params) {
				    	opt.click(params);
					});
				}

				onWindowResize.add(function (){
					myChart.resize();
				});
			}
			return myChart;
		},
		dashBoardRender : function (el ,opt){
			var myChart = echarts.init(el[0]);

			option = {
					    tooltip : {
					        formatter: "{a} <br/>{c} {b}"
					    },
					    series : opt.series
					};
			myChart.setOption(option);

			onWindowResize.add(function (){
				myChart.resize();
			});
		},
		circlifulRender : function (el ,opt){
			require(['/js/lib/charts/circliful/js/jquery.circliful.js',
					'css!/js/lib/charts/circliful/css/jquery.circliful.css'] ,function (){
						el.circliful({
				            animation: 1,
				            animationStep: 5,
				            foregroundBorderWidth: 20,
				            backgroundBorderWidth: 20,
				            percent: parseInt(opt.value),
				            textSize: 60,
				            textStyle: 'font-size: 32px;',
				            textColor: '#666',
				            multiPercentage: 1,
				            percentages: [10, 20, 30]
				        });
					});
		},
		circleCheckRender : function (el ,opt){
		  var circle = {
		    x : 25,
		    y : 25,
		    r : 24,
		    sA : 0,
		    pi : Math.PI,
		    lineWidth : opt.lineWidth || 6,
		    strokeStyle : opt.color || 'rgba(26,26,70,1)'
		  };
		  var line = {
		    x1 : 10,
		    y1 : 25,
		    delt : 10
		  };
		  var ex,ey;
		  var canvas = el;
		  var ctx = canvas.getContext('2d');
		  ctx.lineWidth = circle.lineWidth;
		  ctx.strokeStyle = circle.strokeStyle;
		  ctx.lineCap = 'round';
		  ctx.lineJoin = 'round';
		  ctx.imageSmoothingEnabled = true;
		  ctx.translate(0.5,0.5);
		  ctx.scale(opt.scale ? opt.scale : 1,opt.scale ? opt.scale : 1);
		  
		  function draw(k){
		    ctx.clearRect(0,0,canvas.width,canvas.height);
		    ctx.beginPath();
		    ctx.arc(circle.x,circle.y,circle.r,circle.sA,0.01*k*circle.pi,false);
		    ctx.stroke();
		    ctx.closePath();
		  }
		  var k = 0;
		  var int1 = setInterval(function(){
		    k+=3;
		    draw(k);
		    if(k>=200) 
		      {
		        clearInterval(int1);
		        drawCheck();
		      }
		  },3);

		  function drawC(l){
		    // ctx.restore();
		    ctx.beginPath();
		    ctx.moveTo(line.x1,line.y1);
		    ctx.lineTo(line.x1+l,line.y1+l);
		    ctx.stroke();
		  }

		  function drawD(ex,ey,m){
		    ctx.beginPath();
		    ctx.lineTo(ex+m,ey-m);
		    ctx.stroke();
		    ctx.closePath();
		  }

		  function drawCheck(){
		    var l = 0;
		    var int2 = setInterval(function(){ 
		      l++;
		      drawC(l);
		      if(l==line.delt) 
		        {
		          clearInterval(int2);
		          drawCheck2();
		        }
		    },3);
		  }
		  function drawCheck2(){
		    var m = 0;
		    var int3 = setInterval(function(){
		      m++;
		      drawD(line.x1+line.delt,line.y1+line.delt,m);
		      if(m==20) 
		        {
		          clearInterval(int3);
		        }
		    },3);  
		  }
		},
		circleErrorRender : function (el ,opt){
		  var canvas = el;
		  var ctx = canvas.getContext('2d');
		  var circle = {
		    x : 25,
		    y : 25,
		    r : 24,
		    sA : 0,
		    pi : Math.PI
		  };
		  var line1 = {
		    x1 : 15,
		    y1 : 15,
		    x2 : 35,
		    y2 : 15,
		    delt : 20
		  };
		  var ex,ey;
		  ctx.lineWidth = opt.lineWidth || 6;
		  ctx.strokeStyle = opt.color || 'rgba(26,26,70,1)';
		  ctx.lineCap = 'round';
		  ctx.lineJoin = 'round';
		  ctx.imageSmoothingEnabled = true;
		  ctx.translate(0.5,0.5);
		  ctx.scale(opt.scale ? opt.scale : 1,opt.scale ? opt.scale : 1);
		  
		  function draw(k){
		    ctx.clearRect(0,0,canvas.width,canvas.height);
		    ctx.beginPath();
		    ctx.arc(circle.x,circle.y,circle.r,circle.sA,0.01*k*circle.pi,false);
		    ctx.stroke();
		    ctx.closePath();
		  }
		  function line(l){
		    ctx.beginPath();
		    ctx.moveTo(line1.x1,line1.y1);
		    ctx.lineTo(line1.x1+l,line1.y1+l);
		    ctx.stroke();
		    ctx.closePath();
		  }
		  function line2(l){
		    ctx.beginPath();
		    ctx.moveTo(line1.x2,line1.y2);
		    ctx.lineTo(line1.x2-l,line1.y2+l);
		    ctx.stroke();
		    ctx.closePath();
		    ctx.rotate(90*circle.pi/180);
		  }
		  function drawLine(){
		    var l = 0;
		    var int2 = setInterval(function(){
		      l++;
		      line(l);
		      if(l>=line1.delt)
		        {
		          clearInterval(int2);
		          drawLine2();
		        }
		    },5);
		  }
		  function drawLine2(){
		    var l = line1.delt;
		    var int3 = setInterval(function(){
		      l--;
		      line2(l);
		      if(l<=0)
		        {
		          clearInterval(int3);
		        }
		    },5);
		  }
		  var k = 0;
		  var int1 = setInterval(function(){
		    k+=3;
		    draw(k);
		    if(k>=200) 
		      {
		        clearInterval(int1);
		        drawLine();
		      }
		  },3);
		},
		destroy:function (el){
			echarts.dispose(el);
		}

	}

});