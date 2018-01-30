/** 
	插件名称  :  dialog对话框
	插件功能  :  dialog对话框，包含表单弹出，信息提示等。
	参数      :
				 width:"400px",
				 height:"auto",  设置具体的高度可以调价对话框相对于文档的位置
				 left:"30%",
				 btn_array:[],   {id: ,text:  ,aClick}
				 init:function (el){},
				 query_save_click:function (el){}
*/

/*define(['/tdyth/resources/js/mask.js' ,'/tdyth/resources/lib/bootstrap-sweetAlert/sweetalert-dev.js'] ,function (mask ,sweetAlert){
*/
	var el;
	var index_dialog_is_lock = false;
	var buffer = [];
	buffer.push('<div class="umDialog animated fadeInLeft" style="display:none">');
	buffer.push('<div class="modal-dialog w-all">');
	buffer.push('<div class="modal-content">');
	buffer.push('<div class="modal-header">');
	buffer.push('<button data-id="close" class="close" type="button"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>');
	buffer.push('<h5 class="modal-title" data-id="modal-title" style="padding:15px 0 0 40px;color:#58666e;font-weight:bold"></h5>');
	buffer.push('<i class="icon-png oper-edit pabs" data-flag="title-icon" style="top:15px;left:10px"></i>');
	buffer.push('</div>');
	buffer.push('<div class="modal-tip"><div class="modal-tip-msg">错误提示：<span></span></div></div>')
	buffer.push('<div class="modal-body" data-id="modal-body">');
	buffer.push('<div data-id="loading" class="loading"></div>');
	buffer.push('</div>');
	buffer.push('<div class="modal-footer" data-id="btn_div" style="display:none">');
	buffer.push('<button data-id="close" class="btn btn-default " type="button" style="padding-left:30px">关闭</button>');
	buffer.push('<button data-id="save" class="btn btn-primary " type="button" style="padding-left:30px">确认</button>');
	buffer.push('</div></div></div>');
	buffer.push('</div>');

	var dialogAlert = $(buffer.join(""));

	var operateAlert = $('<div class="umDialog-alert"></div>');

	var waitingAlert = '<div class="umDialog-waiting"><div class="umDialog-waiting-in-wrap"><div class="sk-rotating-plane" data-id="loading-icon"></div></div></div>';
	var confirmAlert = $(buffer.join(""));


	var g_dialog = {
		dialog:function (htmlContent ,opt){
			
			var defaults =
			{
				width:"400px",
				height:"auto",
				left:"30%",
				btn_array:[],
				init:function (){},
				title:"",
				query_save_click:function (){},
				top:""
			}

			if (index_dialog_is_lock)
			{
				return false;
			}

			index_dialog_is_lock = true;

			var opt = $.extend(defaults, opt); 

			var htmlContentEl = opt.isConfirmAlarm ? '<span>'+htmlContent+'</span>' : $(htmlContent);

			var self = this;
          
			mask.show(cbf);
		

			function cbf(){
				var dialog = self.createDialog(htmlContentEl ,opt);

				// 设置拖拽
				self.initDragEvent(dialog.find("[class=modal-header]") ,dialog);
				
				dialog.show();
				$("body").oneTime(50 ,function (){
					//g_validate.init(el);
					opt.initAfter && opt.initAfter(dialog);
					index_dialog_is_lock = false;
				});
			}	
		},
		dialogFullScreen : function (htmlContent ,opt){
			var defaults =
			{
				width:"400px",
				height:"auto",
				left:"30%",
				btn_array:[],
				init:function (){},
				title:"",
				query_save_click:function (){}
			}

			var opt = $.extend(defaults, opt); 

			var htmlContentEl = $(htmlContent);

			var self = this;

			mask.show(cbf);

			function cbf(){
				var dialog = self.createDialog(htmlContentEl ,opt);
				dialog.css("left" ,"10px");
				dialog.css("right" ,"10px");
				dialog.css("top" ,"10px");
				dialog.css("bottom" ,"10px");
				dialog.css("width" ,"auto");
				if (dialog.width() < 1230){
					dialog.width(1230);
				}
				dialog.find("[class*=modal-dialog]").addClass("h-all");
				dialog.find("[class*=modal-content]").addClass("h-all");
				dialog.find("[class*=modal-footer]").remove();
				dialog.show();
				$("body").oneTime(50 ,function (){
					g_validate.init(el);
					opt.initAfter && opt.initAfter(dialog);
					index_dialog_is_lock = false;
				});
			}
		},
		createDialog:function (htmlContentEl ,opt){
				var self = this;
				el = mask.get();

				var dialog_id = "umDialog" + new Date().getTime();

				el.append(dialogAlert.clone());

				var el_dialog = el.find("[class*=umDialog]");

				el_dialog.attr("data-id" ,dialog_id);

				el_dialog.css("height" ,opt.height);

				el_dialog.css("width" ,opt.width);

				el_dialog.css("left" ,opt.left);

				var el_modal_dialog = el_dialog.find("[class*=modal-dialog]");

				var el_modal_content = el_dialog.find("[class=modal-content]").eq(0);

				var el_modal_header = el_dialog.find("[class*=modal_header]");

				var el_modal_body = el_dialog.find("[data-id=modal-body]");

				var el_modal_title = el_dialog.find("[data-id=modal-title]");

				var el_modal_footer = el_dialog.find("[class*=modal-footer]");

				el_modal_title.html(opt.title);

				if (opt.isConfirmAlarm) 
				{
					el_modal_body.append('<div style="float: left; margin-left: 0; width: 20%; text-align: center; font-size: 42px; height: auto; min-height: 50px; line-height: 50px; color: #e74c3c;"><i class="icon-warning-sign"></i></div>');
					el_modal_body.append('<div style="float: right; margin-right: 0; width: 79%; padding-left: 10px; line-height: 50px;" data-name="confirmAlertRightPanel"></div>');
					el_modal_body.find("[data-name=confirmAlertRightPanel]").append(htmlContentEl);
				} 
				else 
				{
					el_modal_body.append(htmlContentEl);
				} 

				el_modal_body.find("[data-id=loading]").next().hide();

				// 渲染按钮
				var btn_array = opt.btn_array;
				var el_btn_div = el_dialog.find("[data-id=btn_div]");
				var btn_index;
				 if (btn_array.length > 0)
				 {
					for (var i=0;i<btn_array.length;i++)
					{
						btn_index = i;
						var el_btn = '<button data-type="custom" class="btn btn-default '+btn_array[i].class+'" type="button" style="padding-left:30px;">'
												+btn_array[i].text+'</button>';
						el_btn_div.append(el_btn);
					}
					el_btn_div.find("[data-type=custom]").each(function (i){
						$(this).click(function (){
							btn_array[i].aClick(htmlContentEl);
						});
					});
				 }
				 if (opt.isDetail)
				 {
				 	el.find("[data-flag=title-icon]").removeClass("oper-edit").addClass("oper-detail");
				 	el_btn_div.find("[data-id=save]").hide();
				 }
				 if (opt.isConfirmAlarm) 
				 {
				 	el.find("[data-flag=title-icon]").removeClass("oper-edit").addClass("oper-detail");
				 	el.find("[class=modal-header]").hide();
				 	el_btn_div.find("[data-id=close]").hide();
				 }

				// 绑定事件
				var dialog = el.find('div[data-id='+dialog_id+']');

				dialog.find("[data-id=close]").click(function (){
					self.hide(dialog_id);
					opt.closeCbf && opt.closeCbf();
				});

				dialog.find("[data-id=save]").click(function (){
					if (opt.isConfirmAlarm) 
					{
						opt.saveclick && opt.saveclick();
						self.hide(dialog_id);
					}
					var saveObj = {};
					var flag = opt.saveclick(el_dialog ,saveObj);
					if (flag)
					{
						self.hide(dialog_id);
					}
				});
				var left_top = self.getPosition(
									$('[data-id = '+dialog_id+']').width(),
									$('[data-id = '+dialog_id+']').height());

				$('[data-id='+dialog_id+']').css("left" ,left_top.left);

				el.find('div[data-id='+dialog_id+']').css("opacity" ,1);
				if (opt.top)
				{
					var windowHeight = $(window).height();
					var topVal;
					if (opt.top.indexOf("%") >= 0)
					{
						topVal = windowHeight * parseInt(opt.top.substr(0 ,opt.top.length-1))/100;
					}
					if (topVal < 20)
					{
						topVal = 20;
					}

					left_top.top = topVal + "px";
				}
				el.find('div[data-id='+dialog_id+']').css("top" ,left_top.top);

				if (opt.autoHeight)
				{
					el_dialog.addClass("pabs");
					el_dialog.css("top" ,"10px");
					el_dialog.css("bottom" ,"10px");
					el_dialog.data("autoHeight" ,"autoHeight");
					el_modal_dialog.addClass("w-all h-all");
					el_modal_content.addClass("h-all");
					el_modal_header.addClass("pabs w-all");
					el_modal_header.css({top: "0",left: "0"});
					el_modal_body.addClass("pabs w-all");
					el_modal_body.css({left: "0px", bottom: "60px", top: "44px"});
					el_modal_footer.addClass("pabs w-all");
					el_modal_footer.css({left: "0",bottom: "30px" ,height: "30px"});
				}

				// 添加进场动画
				// el.find('div[data-id='+dialog_id+']').animate({opacity:1,top:left_top.top} ,300,function (){
				// 初始化
				opt.init(el_dialog);
				//index_form_init(el_dialog);
				el_modal_body.find("[data-id=loading]").hide();
				el_modal_body.find("[data-id=loading]").next().show();
				el_btn_div.show();
				!opt.heigth && el_dialog.css("height" ,"auto");
				return dialog;
		},
		dialogTip:function (dialog ,opt){
			var el_modal_tip = dialog.find("[class*=modal-tip]");
			var el_modal_tip_height = el_modal_tip.height();
			el_modal_tip.height(0);
			el_modal_tip.find("span").text(opt.msg);
			el_modal_tip.animate({height:"50px"} ,"slow" ,function (){});
		},
		hide:function (dialog_id){
			if (typeof dialog_id == 'string')
			{
				mask.hide($("[data-id="+dialog_id+"]").closest("[class=um_mask]"));
			}
			else
			{
				mask.hide(dialog_id.closest("[class=um_mask]"));
			}
		},
		operateConfirm:function (htmlContent ,opt){
			var self = this;
			mask.show(function (){
				var el = mask.get();
				el.append(confirmAlert.clone());
				el.find("[data-flag=title-icon]").removeClass("oper-edit").addClass("oper-detail");
				//el.find("[data-flag=title-icon]").remove();
				var dialog_id = "umDialog" + new Date().getTime();
				var el_dialog = el.find("[class*=umDialog]");
				el_dialog.attr("data-id" ,dialog_id);
				el_dialog.find("[data-id=btn_div]").show();
				var el_modal_body = el_dialog.find("[data-id=modal-body]");
				el_dialog.find("[data-id=loading]").remove();
				
				el_modal_body.css("max-height" ,"100px");
				el_modal_body.html('<span>'+htmlContent+'<span>');

				var el_modal_title = el_dialog.find("[data-id=modal-title]");
				el_modal_title.html(opt.title);

				el_dialog.css("width" , opt.width || "300px");

				var left_top = self.getPosition(el_dialog.width(),el_dialog.height());

				el_dialog.css("left" ,left_top.left);

				el_dialog.css("top" ,left_top.top);

				el_dialog.css("opacity" ,1);

				el_dialog.show();

				el_dialog.find("[data-id=close]").click(function (){

					self.hide(dialog_id);
					opt.closeCbf && opt.closeCbf();
				});

				el_dialog.find("[data-id=save]").click(function (){
					opt.saveclick();
					self.hide(dialog_id);
				});
			});
		},
		operateAlert:function (el ,htmlContent ,type){
			//el = (el == undefined ? "body" : el);
			el = (el == undefined ? "#pg-content" : el);
			var spanIcon = '<i class="icon-ok mr5"></i>';
			
			htmlContent = (htmlContent == undefined ? "操作成功!" : htmlContent);

			var timeout = 2000;

			if (type == "error")
			{
				operateAlert.css("background-color" ,"rgba(208, 67, 67, 0.8)");
				spanIcon = '';
				timeout = 4500;
				operateAlert.css("font-size" ,"16px");
			}
			else
			{
				operateAlert.css("background-color" ,"rgba(0, 0, 0, 0.8)");
			}
 
			operateAlert.html(spanIcon + '<span style="word-wrap:break-word;">' +htmlContent + "</span>");

			// if (type == "error")
			// {
			// 	operateAlert.append('<i class="icon-remove mr5 r prel" data-type="title_remove" style="top:6px;font-size:16px;opacity:0.6"></i>');
			// 	operateAlert.find("[data-type=title_remove]").click(function (){
			// 		$("[class=umDialog-alert]").remove();
			// 	});
			// }

			$(el).append(operateAlert);

			var left_top = this.getPosition(operateAlert.width(),operateAlert.height(),el);

			operateAlert.css("left" ,left_top.left);
			$("[class=umDialog-alert]").css("opacity" ,0);

			operateAlert.animate({top:"0" ,opacity:"1"},500);

			$(this).stopTime();
			$(this).oneTime(timeout ,function (){
				$("[class=umDialog-alert]").animate({top:"-40px" ,"opacity":0},500,function (){
					$("[class=umDialog-alert]").remove();
				});
			});
		},
		waitingAlert:function (elDiv ,opt){
			elDiv = (elDiv == undefined ? "body" : elDiv);

			if ($(elDiv).data("autoHeight"))
			{
				$(elDiv).children().css("position" ,"relative");
			}
			else
			{
				$(elDiv).css("position" ,"relative");
			}
			
			var el_waitingAlert = $(waitingAlert);

			el_waitingAlert.hide();

			$(elDiv).append(el_waitingAlert);

			// 计算loading图标的大小
			var loading_icon = el_waitingAlert.find("[data-id=loading-icon]");

			loading_icon.css("width" ,(el_waitingAlert.height()/30) + "px");
			loading_icon.css("height" ,(el_waitingAlert.height()/30) + "px");
			
			// 设置背景色
			// el_waitingAlert.css("background-color" ,"inherit");
		
			var el_waitingAlert_p = el_waitingAlert.find("p");

			var left_top = this.getPosition(el_waitingAlert_p.width(),el_waitingAlert_p.height(),
											el_waitingAlert);
			el_waitingAlert_p.css({left:left_top.left});

			el_waitingAlert.show();

		},
		waitingAlertHide:function (elDiv){
			elDiv = (elDiv == undefined ? "body" : elDiv);
			$(elDiv).children("[class=umDialog-waiting]").remove();

		},
		btnHide:function (elDiv ,btnId){
			elDiv.closest('[class*=umDialog]').find('[data-id="'+btnId+'"]').hide();
		},
		getPosition : function (dialogWidth ,dialogHeight ,parentEl){
			if (!parentEl)
			{
				parentEl = window;
			}

			// 获取屏幕宽度
			var windowWidth = $(parentEl).width();
			// 获取屏幕高度
			var windowHeight = $(parentEl).height();
			
			var left = (windowWidth - dialogWidth)/2;

			var top =  (windowHeight - dialogHeight)/4;

			return {'left' : left ,'top' : top};
		},
		initDragEvent : function (dragHandleEl , dragEl)
		{
			var _x;
			var _y;

			var diff_x;
			var diff_y;

			var _left = parseInt(dragEl.css("left"));
			var _top = parseInt(dragEl.css("top"));

			dragHandleEl.mousedown(function (e){
				e.preventDefault();

				_x = e.pageX;
				_y = e.pageY;

				$(document).on('mousemove.module' ,function (e){
					diff_x = e.pageX - _x;
					diff_y = e.pageY - _y;
					if (_top + diff_y < 20)
					{
						return false;
					}
					dragEl.css("left" ,(_left + diff_x) + "px");
					dragEl.css("top" ,(_top + diff_y) + "px");
				});

				$(document).one('mouseup' ,function (e){
					$(document).off('mousemove.module');
					_left = parseInt(dragEl.css("left"));
					_top = parseInt(dragEl.css("top"));
				});
			});
		},
	/*	sweetAlert : function (msg){
			swal(msg);
		},*/
		/** 从页面右侧出现Dialog
			支持 模板渲染 和 指定字段渲染   
			param : opt{
					width
					render
			}
		*/
		rightDialog : function (opt){
			var self = this;
			var defaultOpt = {
				width: "500px"
			};
			var opt = $.extend(defaultOpt, opt);
			var el_dialog;
			var el_dialog_close;
			var el_form;
			var buffer = [];
			if ($("body").find("[class*=umDialog-right-outer]").size() > 0)
			{
				el_dialog = $("body").find("[class*=umDialog-right-outer]");
			}
			else
			{
				el_dialog = $('<div class="umDialog-right-outer tran5"><div class="umDialog-right">'
							+'<div class="umDialog-right-header-outer"><div class="umDialog-right-header">'
							+'信息详情<div class="umDialog-right-header-close"><i class="icon-remove"></i></div>'
							+'</div></div>'
							+'<div class="umDialog-right-content-outer"><div class="umDialog-right-content">'
							+'<form class="bs-example form-horizontal xs-form"></form><div class="mask">'
							+'<div class="pabs w-all tc" style="top:40%"><div class="loadinggif"></div></div></div>'
							+'</div></div>'
							+'</div></div>');	

				el_dialog_close = el_dialog.find("[class=icon-remove]");

				el_dialog.css("width" ,opt.width);
				el_dialog.css("right" ,"-" + opt.width);

				el_dialog.data("opt" ,opt);

				el_dialog_close.click(function (){
					el_dialog.css("right" ,"-" + opt.width);
				});

				$("body").append(el_dialog);
			}

			var delay_time = 500;

			var el_form = el_dialog.find("form");

			var el_mask = el_dialog.find("[class=mask]");

			el_form.html("");

			if (el_dialog.css("right") == "0px")
			{
				delay_time = 0;
			}

			el_mask.show();

			// 载入动画
			el_dialog.oneTime(10 ,function (){
				el_dialog.css("right" ,0);
			});
			// 延迟后加载数据
			el_dialog.oneTime(delay_time ,function (){
				opt.render && opt.render(el_form ,el_mask);
			});
		},
		rightDialogHide : function ()
		{
			var el_dialog;
			var el_dialog_close;

			if ($("body").find("[class*=umDialog-right-outer]").size() > 0)
			{
				el_dialog = $("body").find("[class*=umDialog-right-outer]");

				el_dialog_close = el_dialog.find("[class=icon-remove]");

				var opt = el_dialog.data("opt");

				el_dialog.css("right" ,"-" + opt.width);
			}
		}
};