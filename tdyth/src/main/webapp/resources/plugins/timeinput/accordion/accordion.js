/** 
	插件名称  :  可折叠下拉列表
	功能描述  :  可折叠下拉列表
	参数      :  
				 accordionData ： [
								    {name:"安全域" ,render:function (){

								 	}},
								 	{name:"业务域" ,render:function (){

								 	}},
								 	{name:"资产类型" ,render:function (){

								 	}}
								  ]
*/
define(function (){
	return {
		render : function (el ,accordionData ,accordionVal){
			var buffer = [];
			buffer.push('<ul class="accordion">');
			for (var i=0;i<accordionData.length;i++)
			{
				buffer.push('<li data-id="'+accordionData[i].id+'"><span>' + accordionData[i].name
								     + '</span><i class="icon-chevron-down ml5"></i></li>');
				// 添加子元素
				buffer.push('<div class="submenu"></div>');
			}
			buffer.push('</ul>');
			el.append(buffer.join(''));
 			var elDiv = el.find("ul").eq(0);

 			// 渲染子元素
 			elDiv.find("[class=submenu]").each(function (i){
				accordionData[i].render(this);
 			});

 			// 事件初始化
			var $submenu = $('.submenu');
			var $mainmenu = $('.accordion');

			$submenu.hide();


			$submenu.on('click','li', function() {
				$submenu.siblings().find('li').removeClass('chosen');
				$(this).addClass('chosen');
			});
			$mainmenu.on('click', 'li', function() {
				$(this).next('.submenu').slideToggle().siblings('.submenu').slideUp();
			});
			$mainmenu.children('li:last-child').on('click', function() {
				$mainmenu.fadeOut().delay(100).fadeIn();
			});

			if (accordionVal)
			{
				el.oneTime(100 ,function (){
					el.find("li[data-id="+accordionVal+"]").click();
				});
			}
			else
			{
				$submenu.first().delay(400).slideDown(700);
			}
			
			
		},
		getSelectedLiId:function (el){
			return el.find("div").not(":hidden").prev().attr("data-id");
		}
	}
});