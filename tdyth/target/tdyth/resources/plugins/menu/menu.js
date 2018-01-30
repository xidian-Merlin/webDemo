/** 
	插件名称  :  menu
	插件功能  :  横向导航栏
	参数      :  {
					url:getMenu.do
				 }
*/
 define(['/tdyth/resources/plugins/usercenter/usercenter.js'],function (usercenter){
 	// 菜单json格式
 	var menuDataArray = [];
 	var menuMap = new HashMap();
 	var menuIdMap = new HashMap();
 	var winWidth = window.innerWidth;
 	var firstMenuMap = new HashMap();

 	return {
 		render : function (el ,opt){
 			var buffer = [];
 			var menuObj;
 			var submenu;
 			var subsubmenu;
 			var urlArray = [];
 			var fistName = "";
 			var secondName = "";
 			var thirdName = "";
 			buffer.push('<div class="hor-menu" style="margin-right:100px;">');
 			buffer.push('<ul class="hor-ul" style="height:70px">');

 			um_ajax_get({
 				url : opt.url,
 				maskObj : "body",
 				//isLoad : false,
 				//server : "/",
 				successCallBack : function(data)
 				{
 					menuDataArray = data;
		 			for (var i=0;i<menuDataArray.length;i++)
		 			{
		 				menuObj = menuDataArray[i];
		 				firstMenuMap.put(menuObj.icon ,i);
		 				menuIdMap.put(menuObj.name ,menuObj);
		 				buffer.push('<li menu_id="'+menuObj.name+'"><a href="javascript:void(0);">'
		 								+'<div class="first-menu-icon '+menuObj.icon+'"></div><div class="first-menu-name">'+menuObj.label+'</div></a>');
		 				fistName = menuObj.label;
		 				if (menuObj.children)
		 				{
		 					buffer.push('<div class="sub-menu">');
			 				for (var j=0;j<menuObj.children.length;j++)
			 				{
			 					submenu = menuObj.children[j];
			 					
								secondName = submenu.label;

			 					if (submenu.href)
			 					{
			 						urlArray.push(submenu.href);

			 						menuMap.put(submenu.href ,fistName + "|" + secondName);
			 					}

			 					for (var k=0;k<submenu.children.length;k++)
			 					{
			 						subsubmenu = submenu.children[k];
			 						urlArray.push(subsubmenu.href);

			 						thirdName = subsubmenu.label;
			 						menuMap.put(subsubmenu.href ,fistName + "|" + secondName + "|" + thirdName);
			 					}

			 				}
			 				buffer.push('</div>');
		 				}

		 				buffer.push('</li>');
		 			}
		 			buffer.push('</ul>');
		 			buffer.push('</div>');
		 			buffer.push('<div id="response_menu_btn" style="display:none;">');
		 			buffer.push('<i class="icon-reorder"></i>');
		 			buffer.push('</div>');
		 			buffer.push('<div id="user_btn" class="prel">');
		 			//buffer.push('<span id="user_name" class="pabs"></span>');
		 			buffer.push('<div id="user_icon">');
		 			buffer.push('<i style="display:none;"></i>');
		 			buffer.push('</div>');
		 			buffer.push('</div>');
		 			el.after(buffer.join(''));
		 			el.remove();
 					menuOffsetLeft = $(".hor-ul").width();

 					// 一级菜单的点击事件
 					$("[class=hor-ul]").find("li").click(function (){
 						$("[class=hor-ul]").find("li").removeClass("active");
 						$(this).addClass("active");
 						createMenu($(this).attr("menu_id") ,"autoClick");
 					});
 					// 根据当前url判断选中了第几个一级标题
 					var current_li = $("[class=hor-ul]").find("li").eq(firstMenuMap.get(getUrl().split("/")[1]));
 					$("[class=hor-ul]").find("li").removeClass("active");
					current_li.addClass("active");
					createMenu(current_li.attr("menu_id") ,"autoSelect");

 					// 是否隐藏菜单
					if (index_urlParamObj.hideMenu == "1")
					{
						$("#menu-toggle").click();
						$("[class=hor-menu]").hide();
						$("#menu-toggle").hide();
						//$(".pg-header-menu").css("overflow","visible");
					}

 					// 获取用户信息
					um_ajax_get({
						url : "querySessionUser",
						isLoad : false,
						successCallBack : function(data){
							usercenter.render();
							// user_init();
							if (!data.user)
							{
								window.location.href = "/login.html";
							}

							index_user_info = data.user;
							data.webRuntimeConfigOption && (index_itsm_url = data.webRuntimeConfigOption.itsmcontext);

							$("#user_name").text(data.user.userAccount);

							// 添加不在菜单中显示的映射
				 			menuMap.put("/monitor_info/monitor_obj/monitor_info" ,"监控信息|监控对象|监控器 ");
				 			urlArray.push("/monitor_info/monitor_obj/monitor_info");
				 			
				 			menuMap.put("/oper_workorder/workorder_handle/workorder_detail" ,"运维工单|工单处理|工单申请");
				 			urlArray.push("/oper_workorder/workorder_handle/workorder_detail");

				 			menuMap.put("/monitor_info/app_monitor_topo" ,"监控信息|应用监控|拓扑展示");
				 			urlArray.push("/monitor_info/app_monitor_topo");
				 			
				 			menuMap.put("/sys_manage/monitor_config/app_monitor_config_topo" ,"系统管理|监控配置|应用监控配置");
				 			urlArray.push("/sys_manage/monitor_config/app_monitor_config_topo");
				 			/*
				 			 * huyuehai add 2016-12-20
				 			 */
				 			menuMap.put("/sys_manage/monitor_config/app_monitor_config_topo1" ,"系统管理|监控配置|应用监控配置");
				 			urlArray.push("/sys_manage/monitor_config/app_monitor_config_topo1");

				 			menuMap.put("/monitor_info/topo_manage_topo" ,"监控信息|拓扑管理|拓扑展示");
				 			urlArray.push("/monitor_info/topo_manage_topo");

				 			menuMap.put("/monitor_info/new_topo_manage_topo" ,"监控信息|拓扑管理|新拓扑展示");
				 			urlArray.push("/monitor_info/new_topo_manage_topo");

				 			menuMap.put("/monitor_info/topo_manage_topo1" ,"监控信息|拓扑管理|js拓扑展示");
				 			urlArray.push("/monitor_info/topo_manage_topo1");

				 			menuMap.put("/monitor_info/app_monitor_topo1" ,"监控信息|应用监控|js拓扑展示");
				 			urlArray.push("/monitor_info/app_monitor_topo1");

				 			menuMap.put("/sys_manage/sys_base_config/system_health_logic_topo" ,"系统管理|系统基础配置|系统健康度逻辑图");
				 			urlArray.push("/sys_manage/sys_base_config/system_health_logic_topo");

				 			menuMap.put("/monitor_info/monitor_obj/interface_info" ,"接口详情");
				 			urlArray.push("/monitor_info/monitor_obj/interface_info");

				 			menuMap.put("/monitor_info/big_screen" ,"大屏展示");
				 			urlArray.push("/monitor_info/big_screen");

				 			// url哈希值改变事件
						    $(window).hashchange(function() {
								 goToPage();
						     });

						    // 初始化跳转
						    goToPage();
						    response();
						}
					});
 				}
 			});
			index_menuToggle_init();

			$("#menu_col_exp").click(function (){
				$("[class*=pg-left-menu-outer]").toggleClass("icon");
				onWindowResize.execute();
			});

			function goToPage(){
				var url = getUrl();
				if (urlArray.indexOf(url) == -1)
				{
					url = index_user_info.menuId;
					if (!index_user_info.menuId)
					{
			 			for (var i=0;i<menuDataArray.length;i++)
			 			{
			 				menuObj = menuDataArray[i];
			 				fistName = menuObj.label;
			 				if (menuObj.children)
			 				{
				 				for (var j=0;j<menuObj.children.length;j++)
				 				{
				 					submenu = menuObj.children[j];
				 					
									secondName = submenu.label;
				 					if (submenu.href)
				 					{
				 						index_user_info.menuId = submenu.href;
				 						url = index_user_info.menuId.substr(1);
				 						break;
				 					}

				 					for (var k=0;k<submenu.children.length;k++)
				 					{
				 						subsubmenu = submenu.children[k];
				 						index_user_info.menuId = subsubmenu.href;
				 						url = index_user_info.menuId.substr(1);
				 						break;
				 					}
				 				}
			 				}
				 		}
					}
					window.history.pushState("","", "#" + index_user_info.menuId.substr(1));
				}
				var menuNameArray = menuMap.get(url).split("|");
				$("#menu_first").html(menuNameArray[0]);
				$("#menu_second").html(menuNameArray[1]);
				if (menuNameArray[2])
				{
					$("#menu_third").show();
					$("#menu_third").html(menuNameArray[2]);
				}
				else
				{
					$("#menu_third").hide();
				}
				if (index_urlParamObj.hideMenu != "1")
				{
					index_menuShow();
				}
				
				//设置为透明并移出进场动画
				$("#content_div").css("opacity" ,"0");
				$("#content_div").removeClass("fadeInUp");
				$.ajax({
					type: "GET",
					url: "module" + url + ".html",
					dataType: "html",
					success :function(data)
					{
						// 移除之前的绑定事件
						$("#pg-header").show();
						$("#pg-left-menu-outer").show();
						$("#pg-content").css("padding" ,"0 0 15px");
						$("#content_div").removeClass("appbgf");
						$("#content_div").addClass("contentbg");
						$("#content_div").css("padding" ,"0");
						$("#content_div").css("overflow-x" ,"hidden");
						$(window).off('.module');
						$(document).off(".module");
						$(document).off(".fd");
						$("body").off(".inputdrop");
						$("body").off(".grid");
						$("body").off(".fd");
						$("#menu_right_oper_div").html("");
						onWindowResize.remove();
						$(window).slimscroll({} ,true);
						$("#index_timer_inp").stopTime();
						// 渲染页面并添加进场动画
						$("#content_div").html(data);

						// 关闭天气
						if (index_sky_cons)
						{
							index_sky_cons.pause();
							index_sky_cons = null;
						}

						// IE9浏览器需要执行下面这句话
						if (index_is_IE9) 
						{
							$("#content_div").css("opacity" ,"1");
						}

						$("title").html("监控运维管控平台");

						// 清理定时器
						window.clearInterval(index_interval_1);
						window.clearInterval(index_interval_2);
						window.clearInterval(index_interval_3);
						window.clearInterval(index_interval_4);
						window.clearInterval(index_interval_5);
						window.clearInterval(index_interval_6);

						// 清除dialog
						$("[class*=um_mask]").remove();

						// 清除waiting
						$("[class*=umDialog-waiting]").remove();
						
						$("body").oneTime(100 ,function (){
							$("#content_div").addClass("fadeInUp");
						});

						// 动画结束了，再执行初始化方法
						$("body").oneTime(500 ,function (){
							// 页面公共初始化方法
							index_init();
						});
					}
				});
			}

			function getUrl(){
				var url = window.location.hash.substr(1);
				var tmp = url.indexOf("?");
				if (tmp == -1)
				{
					return url;
				}
				else
				{
					return url.substr(0,tmp);
				}
			}
	 		function response(){
	 				var btn = $("#response_menu_btn");
	 				var pop_menu_btn = $("#pop_menu_btn");
	 				pop_menu_btn.click(function(){
	 					//btn.click();
	 				});
	 				btn.click(function(){
	 					var buf = [];
	 					var menu;
	 					var submenu;
	 					var trimenu;
	 					var iconList = ["qwfxqs","aqyfxqs","ywyfxqs","zcfxqs","zxpzsj","pzsjmc","qwfxqs","aqyfxqs","ywyfxqs","zcfxqs","zxpzsj","pzsjmc","qwfxqs","aqyfxqs","ywyfxqs","qwfxqs","aqyfxqs","ywyfxqs","zcfxqs","zxpzsj","pzsjmc","zcfxqs","zxpzsj","pzsjmc","qwfxqs","aqyfxqs","ywyfxqs","zcfxqs","zxpzsj","pzsjmc","taqybtsjfxdb","tywybtsjfxdb","tzcbtsjfxdb","gzsjtjbb","zxgzsj","gzsjmcsl","btaqytsjfxdb","btywytsjfxdb","btzctsjfxdb","xnsjtjbb","zxxnsj","xnsjmcsl","zcfbtj","zcgzrqtj","zcwbdqqktj","zcxxtj","zxgd","sjclgdfltj","sjclgddjtj","aqsjlxsl","aqsjdjmcsl","aqsjdjsl","rbb","zbb","ybb","nbb","qwfxqs","aqyfxqs","ywyfxqs","zcfxqs","zxpzsj","pzsjmc","taqybtsjfxdb","tywybtsjfxdb","tzcbtsjfxdb","gzsjtjbb","zxgzsj","gzsjmcsl","btaqytsjfxdb","btywytsjfxdb","btzctsjfxdb","xnsjtjbb"];
	 					var menuObjList = [];
	 					var win_menuObjList = [];
	 					var show_mode = "android";
	 					buf.push('<div id="full_screen_menu_choose_btn" class="dn"><i class="icon-th" title="Android风格" data-click="android"></i> <span></span> <i class="icon-table" title="Metro风格" data-click="windows"></i><a href="javascript:void(0);" data-click="close">关闭</a></div>');
	 					$("body").append(buf.join(""));
	 					buf = [];
	 					// mask
	 					buf.push('<div id="full_screen_menu_mask" style="display:none;"></div>');
	 					buf.push('<div id="full_screen_menu" style="display:none;">');
	 					// android mode
	 					buf.push('<ul class="float-ul dn" data-mode="android">');
	 					var menu_list = $("#user_pop_div div");
	 					for (var i = 0; i < menu_list.length; i++) {
	 						var mEl = $(menu_list[i]);
	 						var d_aclick = mEl.data("aclick");
	 						var d_text = mEl.data("text").replace(/<[^>]+>/g,"");
	 						var d_name = mEl.data("name");
	 						buf.push('<li class="full_screen_menu_li" title='+d_text+' data-i="'+i+'" data-aclcik="'+d_aclick+'"><a href="javascript:void(0);" onclick="javascript:$(\'[data-aclick='+d_aclick+']\').click();">');
	 						buf.push('<div class="rp-icon rp-'+iconList[2*i]+'"></div>');
	 						buf.push('<div class="label">'+d_text+'</div>');
	 						buf.push('</a></li>');
	 					}
	 					for (var i = 0; i < menuDataArray.length; i++) {
	 						menu = menuDataArray[i];
	 						if (menu.children) 
	 						{
	 							for (var j = 0; j < menu.children.length; j++) {
	 								submenu = menu.children[j];
	 								if (submenu.children.length != 0) 
	 								{
	 									for (var k = 0; k < submenu.children.length; k++) {
	 										trimenu = submenu.children[k];
	 										menuObjList.push({label:trimenu.label,href:"#"+trimenu.href});
	 									}
	 								}
	 								else 
	 								{
	 									menuObjList.push({label:submenu.label,href:"#"+submenu.href});
	 								}
	 							}
	 						}
	 					}
	 					for (var l = 0; l < menuObjList.length; l++) {
	 						buf.push('<li class="full_screen_menu_li" title='+menuObjList[l].label+'><a href="'+menuObjList[l].href+'">');
	 						buf.push('<div class="rp-icon rp-'+iconList[l]+'"></div>');
	 						buf.push('<div class="label">'+menuObjList[l].label+'</div>');
	 						buf.push('</a></li>');
	 					}
	 					menuObjList = [];
	 					buf.push('</ul>');
	 					// windows mode 
	 					buf.push('<div class="float-ul" id="full_screen_menu_win_container" data-mode="windows">');
 						buf.push('<div class="full_screen_menu_win_block_area">');
 						buf.push('<label class="full_screen_menu_win_block_area_tit">个人中心</label>');
	 					for (var i = 0; i < menu_list.length; i++) {
	 						var cmEl = $(menu_list[i]);
	 						var c_aclick = cmEl.data("aclick");
	 						var c_text = cmEl.data("text").replace(/<[^>]+>/g,"");
	 						var c_name = cmEl.data("name");
							if (
									(menu_list===1 && i===0) || 
									(menu_list===2 && i===1) || 
									(menu_list===4 && i===1) || 
									(menu_list===5 && (i===0 || i===2)) || 
									((menu_list===7 || menu_list===6) && (i===1 || i===5)) || 
									(menu_list===8 && i===3) || 
									(menu_list===10 && (i===0 || i===6)) || 
									(menu_list===11 && i===4)
								) 
							{
 							buf.push('<div class="full_screen_menu_win_block_wide dib" title='+c_text+'>');
							} 
							else
							{
 							buf.push('<div class="full_screen_menu_win_block_narrow dib" title='+c_text+'>');
							}
							buf.push('<a href="javascript:void(0);" onclick="javascript:$(\'[data-aclick='+c_aclick+']\').click();">');
 							buf.push('<div class="rp-icon rp-'+iconList[2*i]+' full_screen_menu_win_block_icon"></div>');
 							buf.push('<div class="label">'+c_text+'</div>');
 							buf.push('</a>');
 							buf.push('</div>');
						}
 						buf.push('</div>');
	 					for (var i = 0; i < menuDataArray.length; i++) {
	 						win_menu = menuDataArray[i];
	 						buf.push('<div class="full_screen_menu_win_block_area">');
	 						buf.push('<label class="full_screen_menu_win_block_area_tit">'+win_menu.label+'</label>');
	 						if (win_menu.children) 
	 						{
	 							for (var j = 0; j < win_menu.children.length; j++) {
	 								win_submenu = win_menu.children[j];
	 								win_menuObjList.push(win_submenu);
	 								if (win_submenu.children.length != 0) 
	 								{
	 									for (var k = 0; k < win_submenu.children.length; k++) {
	 										win_trimenu = win_submenu.children[k];
	 										win_menuObjList.push(win_trimenu);
	 									}
	 								}
	 							}
		 						var sub_menu_len = win_menuObjList.length;
	 							// 根据菜单数量，采用不同的菜单显示方案
	 							if (sub_menu_len >= 12) // 多于12个子菜单，全部采用小块
	 							{
	 								for (var l = 0; l < sub_menu_len; l++) 
	 								{
	 									if (win_menuObjList[l].href)
	 									{
	 										buf.push('<div class="full_screen_menu_win_block dib" title='+win_menuObjList[l].label+'><a href="#'+win_menuObjList[l].href+'">');
				 							buf.push('<div class="rp-icon rp-'+iconList[l]+' full_screen_menu_win_block_icon"></div>');
				 							buf.push('<div class="label">'+win_menuObjList[l].label+'</div>');
				 							buf.push('</a>');
				 							buf.push('</div>');
	 									}
			 							
	 								}
	 							}
	 							else 
	 							{ 
	 								for (var l = 0; l < sub_menu_len; l++) 
	 								{
	 									if (
		 										(sub_menu_len===1 && l===0) || 
		 										(sub_menu_len===2 && l===1) || 
		 										(sub_menu_len===4 && l===1) || 
		 										(sub_menu_len===5 && (l===0 || l===2)) || 
		 										((sub_menu_len===7 || sub_menu_len===6) && (l===1 || l===5)) || 
		 										(sub_menu_len===8 && l===3) || 
		 										(sub_menu_len===10 && (l===0 || l===6)) || 
		 										(sub_menu_len===11 && l===4)
	 										) 
	 									{
				 							buf.push('<div class="full_screen_menu_win_block_wide dib" title='+win_menuObjList[l].label+'>');
	 									} 
	 									else
	 									{
				 							buf.push('<div class="full_screen_menu_win_block_narrow dib" title='+win_menuObjList[l].label+'>');
	 									}
	 									buf.push('<a href="'+win_menuObjList[l].href+'">');
			 							buf.push('<div class="rp-icon rp-'+iconList[l]+' full_screen_menu_win_block_icon"></div>');
			 							buf.push('<div class="label">'+win_menuObjList[l].label+'</div>');
			 							buf.push('</a>');
			 							buf.push('</div>');
	 								}
	 							} 
		 						win_menuObjList = [];
	 						}
	 						buf.push('</div>');
	 					}
	 					buf.push('</div>');
	 					buf.push('</div>');
	 					$("body").append(buf.join(""));
	 					buf = [];
		 				$("#full_screen_menu_mask").fadeIn();
		 				$("#full_screen_menu_choose_btn").fadeIn("slow");
		 				$("#full_screen_menu").fadeIn();
		 				$("#full_screen_menu_win").fadeIn();
		 				$("[data-click=windows]").css({"color":"#34BAFF"});

		 				$("#full_screen_menu").click(function(){
		 					$("#full_screen_menu_choose_btn").fadeOut();
		 					$("#full_screen_menu").fadeOut();
		 					$("#full_screen_menu_win").fadeOut();
		 					$("#full_screen_menu").remove();
		 					$("#full_screen_menu_mask").remove();
		 					$("#full_screen_menu_choose_btn").remove();
		 				});

		 				$("[data-click=close]").click(function(){
		 					$("#full_screen_menu").click();
		 				});

		 				$("[data-click=android]").click(function(){
		 					$("[data-mode=android]").fadeIn();
		 					$("[data-mode=windows]").fadeOut();
		 					$("[data-click=android]").css({"color":"#34BAFF"});
		 					$("[data-click=windows]").css({"color":"#ffffff"});
		 				});

		 				$("[data-click=windows]").click(function(){
		 					$("[data-mode=windows]").fadeIn();
		 					$("[data-mode=android]").fadeOut();
		 					$("[data-click=windows]").css({"color":"#34BAFF"});
		 					$("[data-click=android]").css({"color":"#ffffff"});
		 				});
	 				});
	 		}
	 		// 生成二级与三级
	 		function createMenu(menuId ,flag)
	 		{
	 			var el_pg_left_menu = $("#pg_left_menu");
	 			var el_pg_left_menu_ul = $("#pg_left_menu_ul");
	 			var secondMenuArray = menuIdMap.get(menuId).children;
	 			el_pg_left_menu_ul.html("");
	 			var buffer = [];
	 			for (var i = 0; i < secondMenuArray.length; i++) {
	 				buffer.push('<li><a class="tran" href="#'+secondMenuArray[i].href+'"><i class="icon-png menu-icon '+secondMenuArray[i].icon+'" title="'+secondMenuArray[i].label+'"></i>');
	 				buffer.push('<span>'+secondMenuArray[i].label+'</span>');
	 				if (secondMenuArray[i].children && secondMenuArray[i].children.length > 0)
	 				{
	 					buffer.push('<span class="fold-bold r"><i class="icon-chevron-right"></i><i class="icon-chevron-down" style="display:none"></i></span>');
	 				}
	 				buffer.push('</a>');
	 				if (secondMenuArray[i].children && secondMenuArray[i].children.length > 0)
	 				{
	 					buffer.push('<ul class="thd-menu-ul animated fadeInLeft">');
	 					for (var j = 0; j < secondMenuArray[i].children.length; j++) {
	 						buffer.push('<li><a href="#'+secondMenuArray[i].children[j].href+'"><i class="menu-icon-thd"></i>'+secondMenuArray[i].children[j].label+'</a></li>');
	 					}
	 					buffer.push('</ul>');
	 				}
	 				buffer.push('</li>');
	 			}
	 			el_pg_left_menu_ul.append(buffer.join(""));
	 			// 菜单点击事件
	 			$("#pg_left_menu_ul > li > a").click(function (){
	 				var hasThdMenu = ($(this).parent().find("ul").size() > 0 ? true : false);
	 				// 选到带三级菜单的，应该只把也带三级菜单的隐藏掉
	 				if (hasThdMenu)
	 				{
	 					$("#pg_left_menu_ul > li").each(function (){
	 						if ($(this).find("ul").size() > 0)
	 						{
	 							$(this).removeClass("active");
	 						}
	 					});
	 				}
	 				else
	 				{
	 					$("#pg_left_menu_ul > li").removeClass("active");
	 					$("#pg_left_menu_ul > li > ul > li").removeClass("active");
	 				}
	 				
	 				$(this).parent().addClass("active");

	 				if (hasThdMenu)
	 				{
	 					return false;
	 				}
	 				window.location = $(this).attr("href") + "?time=" + new Date().getTime();
	 				return false;
	 			});

	 			var el_thd_menu = el_pg_left_menu_ul.find("[class*=thd-menu-ul]");
	 			el_thd_menu.find("a").click(function (){
	 				$("#pg_left_menu_ul > li").each(function (){
 						if ($(this).find("ul").size() == 0)
 						{
 							$(this).removeClass("active");
 						}
 					});
	 				el_thd_menu.find("li").removeClass("active");
	 				$(this).parent().addClass("active");
	 				window.location = $(this).attr("href") + "?time=" + new Date().getTime();
	 				return false;
	 			});

	 			if (index_urlParamObj.hideMenu != "1" && flag == "autoClick")
	 			{
	 				if ($("#pg_left_menu_ul > li:first > a").attr("href") == "#null")
		 			{
		 				$("#pg_left_menu_ul > li:first > a").click();
		 				$("#pg_left_menu_ul > li:first > ul > li:first > a").click();
		 				//window.location = $("#pg_left_menu_ul > li:first > ul > li:first > a").attr("href");
		 			}
		 			else
		 			{
		 				$("#pg_left_menu_ul > li:first > a").click();
		 				//window.location = $("#pg_left_menu_ul > li:first > a").attr("href");
		 			}
	 			}
	 			if (index_urlParamObj.hideMenu != "1" && flag == "autoSelect")
	 			{
	 				// 找到选中的二级或三级节点
	 			}
	 		}
 		}
 	};

 });