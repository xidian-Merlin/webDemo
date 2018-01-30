/** 
	插件名称  :  timepicker
	插件功能  :  时间选择器
*/
define(['bootstrap-datetimepicker.cn'],function (){
	return {
		time:function (el ,opt){
			el.after('<span class="input-group-btn"><button class="btn btn-default btn-date" type="button"><i class="glyphicon glyphicon-calendar"></i></button></span>');

			// 默认时间格式
			var time_param = {
				startView : 2,
				minView : 1,
				format : "yyyy-mm-dd hh:00:00",
				container : el.parent()
			}

			if (opt && opt.type)
			{
				if (opt.type == "ymd")
				{
					time_param.minView = 2;
					time_param.format = "yyyy-mm-dd";
				}

				if (opt.type == "day")
				{
					time_param.minView = 2;
					time_param.format = "yyyy-mm-dd 00:00:00";
				}

				if (opt.type == "minute")
				{
					time_param.minView = 0;
					time_param.format = "yyyy-mm-dd hh:ii:00";
				}

				if (opt.type == "year")
				{
					time_param.minView = 3;
					time_param.startView = 3;
					time_param.format = "yyyy-mm";
				}
			}
			if (opt && opt.bodyContainer)
			{
				time_param.container = "body";
			}
			if (el.attr("container") == "body")
			{
				time_param.container = "body";
			}

			el.datetimepicker({
				language: 'fr',
				autoclose: 1,
				startView: time_param.startView,
				minView: time_param.minView,
				forceParse: 0,
				format: time_param.format,
				container: time_param.container,
				position: opt.position,
				todayBtn: true
		    });

			if (el.next())
			{
			    el.next().click(function (){
			    	el.datetimepicker("show");
			    });
			}

		},
		// 获取上个季度的时间范围
		getPrevQuarterDay : function (){
			var date =  new Date();
			var year = new Date().getFullYear();
			var nowMonth = new Date().getMonth() + 1;
			var quarterStartMonth;
			var quarterEndMonth;
			if(nowMonth<=3)
			{ 
				year = year-1;
				quarterStartMonth = 10;
				quarterEndMonth = 12;
			} 
			if(3<nowMonth && nowMonth<=6)
			{ 
				quarterStartMonth = 1;
				quarterEndMonth = 3;
			} 
			if(6<nowMonth && nowMonth<=9)
			{ 
				quarterStartMonth = 4;
				quarterEndMonth = 6;
			} 
			if(nowMonth>9)
			{ 
				quarterStartMonth = 7;
				quarterEndMonth = 9;
			}
			var endDay = g_moment(year + "-" + quarterEndMonth, "YYYY-MM").daysInMonth();
			return {
					  start : year + "-" + quarterStartMonth + "-01",
					  end : year + "-" + quarterEndMonth + "-" + endDay,
				   }

		},

		getPrevQuarter : function (){
			var date =  new Date();
			var year = new Date().getFullYear();
			var nowMonth = new Date().getMonth() + 1;
			var quarterStartMonth;
			var quarterEndMonth;
			if(nowMonth<=3)
			{ 
				return 4;
			} 
			if(3<nowMonth && nowMonth<=6)
			{ 
				return 1;
			} 
			if(6<nowMonth && nowMonth<=9)
			{ 
				return 2;
			} 
			if(nowMonth>9)
			{ 
				return 3;
			}
		},
		getQuarterRange : function (quarter){
			if(quarter==1){
				return {
					startDate : "01-01",
					endDate : "03-31"
				};
			}else if(quarter==2){
				return {
					startDate : "04-01",
					endDate : "06-30"
				};
			}else if(quarter==3){
				return {
					startDate : "07-01",
					endDate : "09-30"
				};
			}else if(quarter==4){
				return {
					startDate : "10-01",
					endDate : "12-31"
				};
			}else {
				return undefined;
			}
		}

	}
});