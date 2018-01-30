
define(['plot'] ,function (plot){

	return {
		// 渲染磁盘空间信息
		disk_used_chart : function (el ,opt)
		{
			var disk_used_url = "monitorview/os/windows/queryDiskDynamicInfo";
			um_ajax_get({
		        url : disk_used_url,
		        paramObj : opt.paramObj,
		        isLoad : false,
		        successCallBack : function (data){
		            var buffer = [];
		            var freeSize;
		            var usedSize;
		            var totalSize;
		            for (var i = 0; i < data.length; i++) {
		                freeSize = parseFloat(data[i].freeSize);
		                usedSize = parseFloat(data[i].usedSize);
		                totalSize = (freeSize + usedSize).toFixed(2);
		                buffer.push('<div class="col-lg-4">');
		                buffer.push('<div class="disk-info">');
		                buffer.push('<span>'+data[i].mountName+'</span>');
		                buffer.push('<span class="disk-chart"><div style="width:'
		                                    +(usedSize/totalSize)*100+'%"></div></span>');
		                buffer.push('<span>'+freeSize+'G可用，共'+totalSize+'G</span>');
		                buffer.push('</div></div>');
		            }
		            el.html(buffer.join(""));
		        }
		    });
		},
		//cpu使用率（圆盘）
		cpu_memo_use_rate_radio : function (opt){
			um_ajax_get({
		        url : opt.url,
		        paramObj : opt.paramObj,
		        isLoad : false,
		        successCallBack : function (data){
		            var cpuData = data.Cpu;
		            var physicalMemData = data.PhysicalMem;
		            var swapMenData = data.SwapMen;
		            plot.dashBoardRender(opt.use_chart ,{label:"CPU使用率",
		                series:
		                    [
		                        {
		                            name: 'CPU使用率',
		                            type: 'gauge',
		                            z: 3,
		                            min:0,
		                            max:100,
		                            splitNumber: 10,
		                            radius: '95%',
		                            axisLine: {            // 坐标轴线
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    width: 5
		                                }
		                            },
		                            axisTick: {            // 坐标轴小标记
		                                length: 15,        // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            splitLine: {           // 分隔线
		                                length: 20,         // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            title : {
		                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                                    fontWeight: 'bolder',
		                                    fontSize: 20,
		                                    fontStyle: 'italic'
		                                }
		                            },
		                            detail : {
		                            	formatter:'{value}%',
		                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                                    fontWeight: 'bolder'
		                                }
		                            },
		                            pointer: {
		                                width:3
		                            },
		                            data:[{value: cpuData.cpuUsage ? cpuData.cpuUsage : 0, name: 'CPU'}]
		                        },
		                        {
		                            name: '物理内存使用率',
		                            type: 'gauge',
		                            center: ['25%', '55%'],    // 默认全局居中
		                            radius: '85%',
		                            endAngle:-50,
		                            min:0,
		                            max:100,
		                            splitNumber:10,
		                            axisLine: {            // 坐标轴线
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    width: 5
		                                }
		                            },
		                            axisTick: {            // 坐标轴小标记
		                                length:12,        // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            splitLine: {           // 分隔线
		                                length:20,         // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            pointer: {
		                                width:3
		                            },
		                            title: {
		                                offsetCenter: [0, '-30%'],       // x, y，单位px
		                            },
		                            detail: {
		                            	formatter:'{value}%',
		                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                                    fontWeight: 'bolder'
		                                }
		                            },
		                            data:[{value: physicalMemData.memoryUsage ? physicalMemData.memoryUsage : 0, name: '物理内存'}]
		                        },
		                        {
		                            name: '虚拟内存使用率',
		                            type: 'gauge',
		                            center: ['75%', '55%'],    // 默认全局居中
		                            radius: '85%',
		                            min:0,
		                            max:100,
		                            endAngle:-50,
		                            splitNumber:10,
		                            axisLine: {            // 坐标轴线
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    width: 5
		                                }
		                            },
		                            axisTick: {            // 坐标轴小标记
		                                length:12,        // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            splitLine: {           // 分隔线
		                                length:20,         // 属性length控制线长
		                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
		                                    color: 'auto'
		                                }
		                            },
		                            pointer: {
		                                width:3
		                            },
		                            title: {
		                                offsetCenter: [0, '-30%'],       // x, y，单位px
		                            },
		                            detail: {
		                            	formatter:'{value}%',
		                                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
		                                    fontWeight: 'bolder'
		                                }
		                            },
		                            data:[{value: swapMenData.swapUsage?swapMenData.swapUsage:0, name: '虚拟内存'}]
		                        },
		                    ]
		                });
					//渲染系统负载
					if(opt.one_secend){
						opt.one_secend.text(cpuData.oneuse);
						opt.five_secend.text(cpuData.fiveuse);
						opt.fifteen_secend.text(cpuData.fifteenuse);
					}
		        }
			});
		},
		// CPU、内存使用率
		cpu_memo_use_rate : function (opt){
			um_ajax_get({
			        url : opt.url,
			        paramObj : opt.paramObj,
			        successCallBack : function (data){
			            var cpuData = data.Cpu;
			            var physicalMemData = data.PhysicalMem;
			            var swapMenData = data.SwapMen;
			            var legendArray = ['CPU使用率(%)' ,'物理内存使用率(%)' ,'虚拟内存使用率(%)'];
			            var categoryArray = [];
			            var seriesArray = [];
			            var seriesCpuObj = new Object();
			            seriesCpuObj.name = 'CPU使用率(%)';
			            seriesCpuObj.type = "line";
			            seriesCpuObj.data = [];
			            for (var i = 0; i < cpuData.length; i++) {
			                categoryArray.push(cpuData[i].lable);
			                seriesCpuObj.data.push(cpuData[i].value);
			            }
			            seriesArray.push(seriesCpuObj);

			            var seriesphysicalMemObj = new Object();
			            seriesphysicalMemObj.name = '物理内存使用率(%)';
			            seriesphysicalMemObj.type = "line";
			            seriesphysicalMemObj.data = [];
			            for (var i = 0; i < physicalMemData.length; i++) {
			                seriesphysicalMemObj.data.push(physicalMemData[i].value);
			            }
			            seriesArray.push(seriesphysicalMemObj);

			            var seriesswapMenObj = new Object();
			            seriesswapMenObj.name = '虚拟内存使用率(%)';
			            seriesswapMenObj.type = "line";
			            seriesswapMenObj.data = [];
			            for (var i = 0; i < swapMenData.length; i++) {
			                seriesswapMenObj.data.push(swapMenData[i].value);
			            }
			            seriesArray.push(seriesswapMenObj);


			            plot.lineRender(opt.line_chart ,{
			                legend : legendArray,
			                category :categoryArray,
			                series : seriesArray,
			                lineStyle : true,
			                color_array : ['#62cb31' ,'#23b7e5' ,'#f4bc37']
			            });

			        }
			    });
		},
		// 渲染内存信息
		memory_info_render : function (el ,opt){
			var not_used_val = parseFloat(opt.not_used_val);
			var used_val = parseFloat(opt.used_val);
			var total = not_used_val+used_val;
			var used_rate = (not_used_val + used_val==0) ? 0 : (used_val / (not_used_val + used_val));
			var jug_val = 20 - Math.round(used_rate * 20);
			var el_ul = $('<ul style="width:30%;height:160px;margin:0 auto"></ul>');
			el.append(el_ul);
			el.append('<div class="tc" style="height:40px"><p style="margin-bottom:5px">'+opt.title+'：'+total.toFixed(2)+'G</p><p style="margin:0">使用率：'+(used_rate*100).toFixed(2)+'%</p></div>')
			var color;
			for (var i = 0; i < 20; i++) {
				if (i > jug_val || i==19 && used_val > 0)
				{
					color = "#2380a6";
				}
				else
				{
					color = "#c8c6c6";
				}
				el_ul.append('<li class="mt5" style="height:3px;background-color:'+color+';"></li>');
			}
		}

	}

});