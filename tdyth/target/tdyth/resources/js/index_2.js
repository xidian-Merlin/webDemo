
var index_delete_confirm_msg = "确认删除此记录么？";

var index_batch_delete_confirm_msg = "确认删除选中记录么？";

var index_select_one_at_least_msg = "请至少选择一条记录";

var index_slimScroll_event_map = new HashMap();

var index_user_info;

var index_sky_cons;



// 防止dialog重复点击
var index_dialog_is_lock = false;

// 定时器池
index_interval_1 = null;
index_interval_2 = null;
index_interval_3 = null;
index_interval_4 = null;
index_interval_5 = null;
index_interval_6 = null;

var index_urlParamObj = index_query_param_get();

if (index_urlParamObj.hideMenu == "1")
{
	//$("[class=pg-header]").hide();
}




function index_initLayout(flag)
{
	var window_height = $(window).height();
	var pg_header = $("[class=pg-header]:visible").height();
	$("#pg-container").height(window_height - pg_header);
	$("#pg-content").height($("#pg-container").height() - index_getPadderMargin($("#pg-content")));
	$("#content_div").height(
								$("#pg-content").height()
											- index_getHeightWithPadderMargin($("#menu-index")) 
											- index_getPadderMargin($("#content_div"))
							);
	
	$("#table_div").height(
							$("#content_div").height()
								- index_getHeightWithPadderMargin($("#table_oper"))
								- index_getHeightWithPadderMargin($("ul[class=pagination]"))
								- index_getHeightWithPadderMargin($("div[class*=search-div]"))
								- index_getPadderMarginHeight($("#table_div_outer"))
								- index_getPadderMarginHeight($("#table_div"))
								- 0
						  );
}

function index_getPadderMargin(el){
	if (el.size() == 0)
	{
		return 0;
	}
	else
	{
		return parseInt(el.css("padding-top")) + parseInt(el.css("padding-bottom"))
		     + parseInt(el.css("margin-top")) + parseInt(el.css("margin-bottom"));
	}

}

function index_getHeightWithPadderMargin(el){
	if (el.size() == 0 || el.is(":hidden"))
	{
		return 0;
	}
	else
	{
		return el.height() + parseInt(el.css("padding-top")) + parseInt(el.css("padding-bottom"))
				+ parseInt(el.css("margin-top")) + parseInt(el.css("margin-bottom"));
	}

}

function index_getPadderMarginHeight(el)
{
	if (el.size() == 0 || el.is(":hidden"))
	{
		return 0;
	}
	else
	{
		return parseInt(el.css("padding-top")) + parseInt(el.css("padding-bottom"))
						+ parseInt(el.css("margin-top")) + parseInt(el.css("margin-bottom"));
	}
}

function um_ajax_get(options)
{
	options.type = 'GET';
	um_ajax(options);
}

function um_ajax_post(options)
{
	options.type = 'POST';

(options);
}

function um_ajax(options)
{
	var defaultOpt = {
		type : "GET",
		successCallBack : null,
		failCallBack : null,
		failTip : true,
		isAsync : true,
		isLoad : true,
		paramObj : null,
		maskObj : '#pg-container',
		//maskObj : 'body',
		server : null
	}

	var options = $.extend(defaultOpt, options);
	// 是否使用遮罩
	if (options.isLoad)
	{
		g_dialog.waitingAlert(options.maskObj);
	}

	if (!options.paramObj)
	{
		options.paramObj = new Object();
	}

	// currentPageNum pageSize  默认1 和 1000
	if (!options.paramObj.currentPageNum)
	{
		options.paramObj.currentPageNum = 1;
	}
	if (!options.paramObj.pageSize)
	{
		options.paramObj.pageSize = 1000;
	}

	var web_app = index_web_app;
	options.server && (web_app = options.server);

	$.ajax({
		async: options.isAsync,
		type: options.type,
		url: web_app + options.url,
		dataType: "json",
		timeout : 120000, //超时时间设置，单位毫秒
		data:{param:JsonTools.encode(options.paramObj)},
		xhrFields: {
			withCredentials: true
		},
		success :function(data)
		{
			if (data.resultCode == 0)
			{
				if (options.successCallBack)
				{
					options.successCallBack(data.resultObj);
				}
			}
			else
			{
				if (data.resultCode == "502")
				{
					window.location.href = "/login.html";
				}
				if (data.resultCode == "508")
				{
					window.location.href = "/index.html#/" + data.url;
				}
				if (options.failCallBack)
				{
					options.failCallBack();
				}
				var msg = (data.resultMsg?data.resultMsg:"操作失败");
				if (options.failTip)
				{
					g_dialog.operateAlert(options.maskObj,msg,"error");
				}
			}
			if (options.isLoad)
			{
				g_dialog.waitingAlertHide(options.maskObj);
			}
		},
		error :function(e){
			console.log(e);
			if (e.status == 200 && e.statusText == "OK")
			{
				options.successCallBack(e.responseText);
			}
			if (options.isLoad)
			{
				g_dialog.waitingAlertHide(options.maskObj);
			}
			if(e.statusText == "timeout")
			{
				g_dialog.operateAlert(options.maskObj,"响应超时!","error");
				g_dialog.waitingAlertHide(options.maskObj);
			}
		}
	});
}

function um_ajax_file(form ,opt)
{
	var defaultOpt = {
		successCallBack : null,
		failCallBack : null,
		isLoad : true,
		paramObj : null,
		maskObj : '#pg-container'
	}

	var opt = $.extend(defaultOpt, opt);

	if (opt.isLoad)
	{
		g_dialog.waitingAlert(opt.maskObj);
	}

	form.ajaxSubmit({
		url : index_web_app + opt.url,
		type : "post",
		dataType : "json",
		data : {param:JsonTools.encode(opt.paramObj)},
		xhrFields: {
			withCredentials: true
		},
		success : function (data){
			if (data.resultCode == 0)
			{
				if (opt.successCallBack)
				{
					opt.successCallBack(data.resultObj);
				}
			}
			else
			{
				if (opt.failCallBack)
				{
					opt.failCallBack();
				}
				g_dialog.operateAlert(opt.maskObj,data.resultMsg ,"error");
			}
			if (opt.isLoad)
			{
				g_dialog.waitingAlertHide(opt.maskObj);
			}
		},
		error : function (){
			if (opt.isLoad)
			{
				g_dialog.waitingAlertHide(opt.maskObj);
			}
			
		}
	});
}

function index_query_param_get()
{ 
	var url = window.location.hash.substr(1);
	var tmp = url.indexOf("?");
	url = url.substr(tmp);
	var theRequest = new Object(); 
	var tmpVal;
	if (url.indexOf("?") != -1)
	{ 
		var str = url.substr(1); 
		strs = str.split("&"); 
		for(var i = 0; i < strs.length; i ++)
		{
			tmpVal = unescape(strs[i].split("=")[1]);
			if (tmpVal == "undefined" || !tmpVal)
			{
				tmpVal = "";
			}
			theRequest[strs[i].split("=")[0]]=tmpVal;
		}
	}
	if ($("[data-id=monitorId]").val() != "" && $("[data-id=monitorId]").val() != undefined)
	{
		theRequest.monitorId = $("[data-id=monitorId]").val();
	}

	if ($("[data-id=param-assetId]").val() != "" && $("[data-id=param-assetId]").val() != undefined)
	{
		theRequest.assetId = $("[data-id=param-assetId]").val();
	}

	if ($("[data-id=param-monitorTypeId]").val() != "" && $("[data-id=param-monitorTypeId]").val() != undefined)
	{
		theRequest.monitorTypeId = $("[data-id=param-monitorTypeId]").val();
	}
	return theRequest;
}

function index_init(search_remove_cb)
{
	index_initLayout();
}

var onWindowResize = function(){
    //事件队列
    var queue = [],
 
    indexOf = Array.prototype.indexOf || function(){
        var i = 0, length = this.length;
        for( ; i < length; i++ ){
            if(this[i] === arguments[0]){
                return i;
            }
        }
        return -1;
    };
 
    var isResizing = {}, //标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中 window.onresize 事件多次执行的 bug
    lazy = true, //懒执行标记
 
    listener = function(e){ //事件监听器
        var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight,
            w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;
 
        if( h === isResizing.h && w === isResizing.w){
            return;
 
        }else{
            e = e || window.event;
         
            var i = 0, len = queue.length;
            for( ; i < len; i++){
                queue[i].call(this, e);
            }
 
            isResizing.h = h,
            isResizing.w = w;
        }
    }
 
    return {
        add: function(fn){
            if(typeof fn === 'function'){
                if(lazy){ //懒执行
                    if(window.addEventListener){
                        window.addEventListener('resize', listener, false);
                    }else{
                        window.attachEvent('onresize', listener);
                    }
 
                    lazy = false;
                }
 
                queue.push(fn);
            }else{  }
 
            return this;
        },
        remove: function(fn){
            if(typeof fn === 'undefined'){
                queue = [];
            }else if(typeof fn === 'function'){
                var i = indexOf.call(queue, fn);
 
                if(i > -1){
                    queue.splice(i, 1);
                }
            }
            return this;
        },
        execute: function (){
        	for (var i = 0; i < queue.length; i++) {
        		queue[i]();
        	}
        }
    };
}.call(this);

function index_form_init(el)
{
	el.find("[data-type=select]").each(function (){
    	/*var sel2 = $(this).select2({
    		width : "100%"
    	});*/
    	$(this).parent().append('<div class="select2-container-err"><input class="form-control input-sm" style="opacity:0"/></div>');
    	$(this).change(function (){
    		if ($(this).val() != "")
    		{
    			g_validate.clear([$(this)]);
    		}
    	});
    });

    if (el.find("[data-type=date]").size() > 0)
    {
    	var data_position = "bottom";
    	require(['/tdyth/resources/plugins/timepicker/timepicker.js'] ,function (timepicker){
    		el.find("[data-type=date]").each(function (){
    			var self = this;
    			var excute_mouseout_timeout;
    			var el_remove = $('<div class="pabs" style="right:40px;top:7px;z-index:3002;display:none"><i class="icon-remove"></i></div>');
    			$(this).after(el_remove)
    			$(this).mouseover(function (){
    				// 控制不执行mouseout
    				clearTimeout(excute_mouseout_timeout);
    				el_remove.show();
    			}).mouseout(function (){
    				excute_mouseout_timeout = setTimeout(function (){
    					el_remove.hide();
    				} ,500);
    			});
    			el_remove.click(function (){
    				$(self).val("");
    				el_remove.hide();
    				clearTimeout(excute_mouseout_timeout);
    			});
    			$(self).addClass("no-write");
				$(self).attr("readonly" ,"readonly");
				$(self).blur(function(){
					if($(self).val() == "")
					{
						$(self).val(g_moment().format('YYYY-MM-DD HH:mm:ss'));
					}
					else
					{
						return;
					}
				});
    			var tmp_data_position = $(this).attr("data-position");
    			var tmp_type = $(this).attr("format-type");
    			data_position = (tmp_data_position || data_position);
    			timepicker.time($(this) ,{
    				position : data_position,
    				type : tmp_type
    			});
    		});
    	});
    }

}

// 查询条件显示
function index_search_div_show(queryStr)
{
	if (queryStr == null || queryStr == "")
	{
		return false;
	}
	$("[data-id=search-div]").animate({opacity: 1}, 100, function() {
		$(this).show();
		$(this).find("[data-id=queryStr]").html(queryStr);		
		index_initLayout();
	});
}

// 查询条件关闭
function index_search_div_remove_click(cb ,cbParam)
{
	if ($("#search-remove-i").size() > 0)
	{
		$("#search-remove-i").unbind("click");
		$("#search-remove-i").click(function (){
			$(this).parent().animate({opacity: 0},300, function() {
				$(this).hide();
				index_initLayout();
				cb(cbParam);
			});
		});
	}
}

// 生成一个上传元素
function index_create_upload_el(el)
{
	var id = el.attr("id");
	var buffer= [];
		buffer.push('<input type="file" id="'+id+'" name="'+id+'" data-classinput="form-control inline v-middle input-s" data-classbutton="btn btn-default" data-icon="false"  id="t1" style="position: absolute; clip: rect(0px, 0px, 0px, 0px);" tabindex="-1">')		
		buffer.push('<div class="bootstrap-filestyle input-group">')            
		buffer.push('<input type="text" disabled="" class="form-control" data-id="up_name">')            
		buffer.push('<span class="group-span-filestyle input-group-btn" tabindex="0">')            
		buffer.push('<label class="btn btn-default " for="'+id+'">')            
		buffer.push('<span class="glyphicon glyphicon-folder-open"></span> 选择文件')            
		buffer.push('</label></span></div></div>');
	var new_el = $(buffer.join(""));
	el.after(new_el);
	el.remove();
	new_el.change(function (){
		new_el.find("[data-id=up_name]").val($(this).val());
	});
}

// 生成一个资产价值select元素
function index_create_asset_value_select_el(el)
{
	el.select2({
				  data: [
				  			{id: "1",text: "使用中"},
				  			{id: "0",text: "闲置"},
				  			{id: "2",text: "待维修"},
				  			{id: "3",text: "维修"},
				  			{id: "4",text: "送修"},
				  			{id: "5",text: "外借"},
				  			{id: "6",text: "分配"},
				  			{id: "7",text: "待报废"},
				  			{id: "8",text: "报废"},
				  			{id: "9",text: "库房"}
				  		],
				  width:"100%"
				});
	}

// 生成一个资产状态select元素
var index_asset_status_list = [
					  			{id: "1",text: "使用中"},
					  			{id: "0",text: "闲置"},
					  			{id: "2",text: "待维修"},
					  			{id: "3",text: "维修"},
					  			{id: "4",text: "送修"},
					  			{id: "5",text: "外借"},
					  			{id: "6",text: "分配"},
					  			{id: "7",text: "待报废"},
					  			{id: "8",text: "报废"},
					  			{id: "9",text: "库房"}
					  		  ];


// 生成codeList
// bdCodeList 业务域
// sdCodeList 安全域
// bsCodeList 业务系统
// deviceTypeCodeList 设备类型
// monitorNodeCodeList 监控节点
// assetModelCodeList 资产类型
// snmpCodelist snmp信息
// osCodeList 操作系统
// initFactoryManageList 厂商列表
// computerRoomLocationList 物理位置列表
function index_codeList_get(opt)
{
	um_ajax_get({
		url : "/rpc/getCodeList",
		paramObj : {key:opt.codeKey},
		isLoad : false,
		successCallBack : function (data){
			opt.successCallBack(data[opt.codeKey]);
		}
	});
}

function index_render_div(el ,opt)
{
	if (opt.type == "date")
	{
		index_dialog_time_pick(el ,opt);
	}
	if (opt.type == "ip")
	{
		index_dialog_ip_range(el ,opt);
	}
	if (opt.type == "select")
	{
		index_dialog_select(el ,opt);
	}
	if (opt.type == "range")
	{
		index_dialog_range(el ,opt);
	}
}

function index_dialog_time_pick(searchEl ,opt)
{
	searchEl.append('<input type="text" class="form-control input-sm search-data-date"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="'+opt.startKey+'"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="'+opt.endKey+'"/>');

	var searchInpEl = searchEl.find("input").not("[type=hidden]");
	var el_start_inp = searchEl.find("input").eq(1);
	var el_end_inp = searchEl.find("input").eq(2);

	searchInpEl.click(function (){
		g_dialog.dialog($("#index_template_tem").find("[id=index_time_pick_template]").html(),{
				width:"500px",
				title:"时间",
				init:init,
				saveclick:save_click
		});

		function init(el)
		{
			el.find("[data-id=modal-body]").css("overflow" ,"visible");
			if (searchInpEl.attr("title"))
			{
				el.find("[data-id=start_date]").val(searchInpEl.attr("title").split(" - ")[0]);
				el.find("[data-id=end_date]").val(searchInpEl.attr("title").split(" - ")[1]);
			}
			
		}
		function save_click(el ,saveObj)
		{
			if (saveObj.start_date && saveObj.end_date && (saveObj.start_date > saveObj.end_date))
			{
				g_dialog.dialogTip(el ,{
					msg : "开始时间不能大于结束时间"
				});
				return false;
			}
			searchInpEl.val(saveObj.start_date.substr(5,11) + " - " + saveObj.end_date.substr(5,11));
			searchInpEl.attr("title" ,saveObj.start_date + " - " + saveObj.end_date);
			el_start_inp.val(saveObj.start_date);
			el_end_inp.val(saveObj.end_date);
			g_dialog.hide(el);
		}
	});
	
}

function index_dialog_ip_range(searchEl ,opt)
{
	//searchEl.append('<div class="prel"><input type="text" class="form-control input-sm search-data-date"/></div>');
	searchEl.append('<div class="prel"><input type="text" class="form-control input-sm search-data-date" search-data="'+opt.id+'"/><i class="pabs icon-search" style="margin:0;right:5px;top:7px;font-size:15px"></i></div>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="startIp"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="endIp"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="ipv6Str"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-type/>');

	var searchInpEl = searchEl.find("input").not("[type=hidden]");
	var searchIconEl = searchEl.find("[class*=icon-search]");
	var el_start_inp = searchEl.find("input").eq(1);
	var el_end_inp = searchEl.find("input").eq(2);
	var el_ipV6 = searchEl.find("input").eq(3);
	var el_ipType = searchEl.find("input").eq(4);

	opt.startKey && el_start_inp.attr("search-data" ,opt.startKey);
	opt.endKey && el_end_inp.attr("search-data" ,opt.endKey);

	// searchInpEl.click(function (){
	// 	searchInpEl.attr("search-data" ,opt.id);
	// 	el_start_inp.val("");
	// 	el_end_inp.val("");
	// 	el_ipV6.val("");
	// 	el_ipType.val("");
	// });

	searchInpEl.bind('input propertychange', function() {
	    el_start_inp.val($(this).val());
		el_end_inp.val($(this).val());
	});

	searchIconEl.click(function (){
		g_dialog.dialog($("#index_template_tem").find("[id=index_ip_range_template]").html(),{
				width:"650px",
				init:init,
				initAfter:initAfter,
				saveclick:save_click,
				title:"IP范围"
		});

		function init(el)
		{
			g_validate.init(el);
			if (searchInpEl.attr("title"))
			{
				el.find("[data-id=start_ip]").val(searchInpEl.attr("title").split(" - ")[0]);
				el.find("[data-id=end_ip]").val(searchInpEl.attr("title").split(" - ")[1]);
			}
			el.find("[data-id=modal-body]").css("overflow" ,"visible");
			el.find("input[type=radio]").click(function (){
				el.find("[data-tval]").attr("disabled" ,"disabled");
				el.find("[data-tval]").val("");
				el.find("[data-tval="+el.find("input[type=radio]:checked").val()+"]").removeAttr("disabled");
				el.find("[data-id="+("0"===el.find("input[type=radio]:checked").val() ? 'start_ip' : 'ipV6')+"]").focus();
			});

			el.find("input[type=radio][value="+el_ipType.val()+"]").click();
			el.find("input[type=radio][value="+el_ipType.val()+"]").click();

			if (searchInpEl.val().indexOf(":") < 0)
			{
				el.find("[data-id=start_ip]").val(el_start_inp.val());
				el.find("[data-id=end_ip]").val(el_end_inp.val());
			}
			else
			{
				el.find("[data-id=ipV6]").val(el_ipV6.val());
			}

			
		}
		function initAfter(el) 
		{
			el.find("[data-id=start_ip]").focus();
		}
		function save_click(el ,saveObj)
		{
			if (!g_validate.validate(el))
			{
				return false;
			}
			
			if (el.find("input[type=radio]:checked").val() == 0)
			{
				if (!g_validate.ipValidate(el.find("[data-id=start_ip]") ,el.find("[data-id=end_ip]")))
				{
					return false;
				}
				searchInpEl.val(saveObj.start_ip + " - " + saveObj.end_ip);
				el_start_inp.val(saveObj.start_ip);
				el_end_inp.val(saveObj.end_ip);
				el_ipType.val("0");
			}
			else
			{
				searchInpEl.val(saveObj.ipV6);
				el_ipV6.val(saveObj.ipV6);
				el_ipType.val("1");
			}
			
			searchInpEl.removeAttr("search-data");
			g_dialog.hide(el);
		}
	});
}

function index_dialog_select(searchEl ,opt)
{
	searchEl.append('<select class="form-control input-sm" search-data="'+opt.name+'"></select>');
	var buffer = [];
	var dataList = opt.data;
	for (var i = 0; i < dataList.length; i++) {
		buffer.push('<option value="'+dataList[i].value+'">'+dataList[i].text+'</option>')
	}
	searchEl.find("select").append(buffer.join(","));
}

function index_dialog_range(searchEl ,opt)
{
	searchEl.append('<input type="text" class="form-control input-sm search-data-date" />');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="'+opt.startKey+'"/>');
	searchEl.append('<input type="hidden" class="form-control input-sm" search-data="'+opt.endKey+'"/>');

	var searchInpEl = searchEl.find("input").not("[type=hidden]");
	var el_start = searchEl.find("input").eq(1);
	var el_end = searchEl.find("input").eq(2);

	searchInpEl.click(function (){
		g_dialog.dialog($("#index_template_tem").find("[id=index_range_template]").html(),{
				width:"500px",
				init:init,
				title:"风险值",
				saveclick:save_click
		});

		function init(el)
		{
			g_validate.init(el);
			el.find("input").eq(0).val(el_start.val());
			el.find("input").eq(1).val(el_end.val());
		}

		function save_click(el)
		{
			var startVal = el.find("input").eq(0).val();
			var endVal = el.find("input").eq(1).val();
			if(startVal && endVal && (startVal > endVal))
			{
				g_dialog.dialogTip(el ,{
					msg : "最小风险值不能大于最大风险值。"
				})
				return false;
			}
			el_start.val(el.find("input").eq(0).val());
			el_end.val(el.find("input").eq(1).val());
			searchInpEl.val(el_start.val() + " 至 " + el_end.val());
			g_dialog.hide(el);
		}
	});
}

function index_ed_monitor_get(urlParamObj ,selElArray ,cb)
{
	g_dialog.waitingAlert();
	var ed_monitor_url = "monitorView/queryEdMonitor";
    urlParamObj.instStatus = 1;
    urlParamObj.monitorTypeNameLanguage = 1;
    urlParamObj.edId = urlParamObj.assetId;
    um_ajax_get({
        url : ed_monitor_url,
        paramObj : urlParamObj,
        isLoad : false,
        successCallBack : function (data){
           index_instance_type_get(data.edmonitorstore[1].monitorId ,selElArray ,cb);
        }
    });
}

function index_instance_type_get(monitorId ,selElArray ,cb)
{
	var instance_type_url = "monitorView/queryInstanceType";
    um_ajax_get({
        url : instance_type_url,
        paramObj : {monitorId:monitorId},
        isLoad : false,
        successCallBack : function (data){
            var selBuff = [];
            for (var i = 0; i < data.length; i++) {
                selBuff.push({id:data[i].codevalue ,text:data[i].codename});
            }
            for (var i = 0; i < selElArray.length; i++) {
            	selElArray[i].select2({
                  data: selBuff,
                  width:"100%"
	            });

	            selElArray[i].change();
            }
            g_dialog.waitingAlertHide();
        }
    });
}

function index_menuHide(param){
	if($(".pg-header-menu").css("overflow")=="hidden"){
		return false;
	}
	$(".pg-header-menu").css("overflow","hidden");
	$(".pg-header-menu").animate({
		height:"0px"
	},"normal","swing",function (){
		index_initLayout();
		$("#menu-toggle").addClass("menu-toggle-rotate");
		$("#menu-toggle").prop("title","显示菜单");
		$(window).resize();
		index_initLayout_outHeight();
		param && param.cbf && param.cbf();
	});
	$(".menu-toggle").hide();
	$("#icon_menu_hf").parent().hide();

}
function index_menuShow(){
	if($(".pg-header-menu").css("overflow")!="hidden"){
		return false;
	}
	$(".pg-header-menu").animate({
		height:"70px"
	},"normal","swing",function (){
		index_initLayout();
		$(".pg-header-menu").css("overflow","visible");
		$("#menu-toggle").removeClass("menu-toggle-rotate");
		$("#menu-toggle").prop("title","隐藏菜单");
		$(".menu-toggle").show();
		$(window).resize();
		index_initLayout_outHeight();
	});
	$("#icon_menu_hf").parent().show();
}
function index_initLayout_outHeight(){
	var window_height = $(window).outerHeight();
	var pg_header = $("[class=pg-header]:visible").outerHeight();
	$("#pg-container").outerHeight(window_height - pg_header);
	$("#pg-content").outerHeight($("#pg-container").outerHeight() - index_getPadderMargin($("#pg-content")));
	$("#content_div").outerHeight(
		$("#pg-content").outerHeight()
		- index_getHeightWithPadderMargin($("#menu-index")) 
		- index_getPadderMargin($("#content_div"))
		);
	$("#table_div1").outerHeight(
		$("#content_div").outerHeight()
		- index_getHeightWithPadderMargin($("#table_oper"))
		- index_getHeightWithPadderMargin($("ul[class=pagination]"))
		- index_getHeightWithPadderMargin($("div[class*=search-div]"))
		- index_getPadderMarginHeight($("#table_div_outer"))
		- index_getPadderMarginHeight($("#table_div1"))
		- 0
		);
}
function index_menuToggle_init(){

	$("#menu-toggle").bind("click",function (){
		if($(".pg-header-menu").css("overflow")=="hidden"){
			index_menuShow();
		}else {
			index_menuHide();
		}
	});
}

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

$(document).keydown(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
    var key = e.which; //e.which是按键的值
    if (key == 13) {
        return false;
    }
});

function Encrypt(str)
{
	var monyer = new Array();
	var i, s, str;
	var key = "socsoc"
	var t;
	var j;
	for (i = 0; i < str.length; i++)
	{
		j = i % 6;
		monyer += String.fromCharCode(str.charCodeAt(i)^key.charCodeAt(j));
	}
	return monyer;
}