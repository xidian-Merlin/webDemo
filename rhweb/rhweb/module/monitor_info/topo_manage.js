$(document).ready(function (){
require([],function (){

var index_list_col_header = [
							  {text:'拓扑名称',name:"topoName",width:15,render:function(text){
							  	return "<a href='javascript:void(0)'>"+text+"<a>";
							  },click:function (data){
							  }},
							  {text:'备注',name:"remark",width:25},
							  {text:'创建时间',name:"creDate",width:15},
							  {text:'创建人',name:"creUser",width:15},
							  {text:'修改时间',name:"lastModDate",width:15},
							  {text:'修改人',name:"lastModUser",width:15}
							];
var index_list_col_oper = [
				  			  /*{icon:"icon-angle-up" ,text:"上移" ,aclick:grid_upper ,style:"square-oper green"},
				  			  {icon:"icon-angle-down" ,text:"下移" ,aclick:grid_lower ,style:"square-oper green"},*/
				  			  {icon:"rh-icon rh-edit" ,text:"修改" ,aclick:grid_edit },
				  			  {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:grid_delete}
			   			  ];
var url = {
	index_list : "topoManage/getTopoList",
	delete_url : "topoManage/delTopo",
	move_topo : "topoManage/moveTopo"
};
function gotoShow(data){
	var topoId = !data.topoId?"":data.topoId;
  	var image = !data.topoBackground?"":data.topoBackground;
  	var taskId = !data.taskId?"":data.taskId;
	window.open("#/monitor_info/topo_manage_topo?topoId="+topoId+"&topoType=1&defaultShow&image="+image+"&flag&taskId="+taskId+"&topoDiscoverIcon&hideMenu=1");
}
function gotoEdit(data){
	var topoId = !data.topoId?"":data.topoId;
  	var image = !data.topoBackground?"":data.topoBackground;
  	var taskId = !data.taskId?"":data.taskId;
	window.open("#/monitor_info/topo_manage_topo?topoId="+topoId+"&topoType=0&defaultShow=0&image="+image+"&flag=&taskId="+taskId+"&topoDiscoverIcon=1&hideMenu=1");
}
var topo_create_url = "topoManage/addTopoProfile";
var topo_update_url = "topoManage/updTopoProfile";
initLayout();
event_init();
thumbnail_table_init();

function initLayout(){
	// index_initLayout();
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

function event_init(){
	$('#searchButton').click(function (){
		refresh();
	});
	$("#searchInput").on('input',function (){
		if($(this).val()!="" && $("#searchClear").is(':hidden')){
			$("#searchClear").show();
		}
		if($(this).val()==""){
			$("#searchClear").hide();
		}
	});
	$("#searchClear").click(function (){
		refresh(true);
		$(this).hide();
	});
	$(window).on("resize.module" ,function (){
		initLayout();
	});
	$("#add_btn").click(function (){
		//添加弹出框

		var  rowData;

		topo_common_edit(rowData);

	});
	$("#grid_btn").click(function (){
		//切换到列表展示
		grid_table_init({paramObj:{isEditeFlag : 1},isLoad:true,maskObj:"body"});
		$(this).toggle();
		$("#thumbnail_btn").toggle();
	});
	$("#thumbnail_btn").click(function (){
		//切换到缩略图展示
		thumbnail_table_init();
		$(this).toggle();
		$("#grid_btn").toggle();
	});
}
function grid_table_init(option){
	var isEditeFlag = 1;//权限过滤，1：拓扑编辑;0：拓扑监控、网络拓扑
	if(!option.paramObj){
		option.paramObj = {
			isEditeFlag : isEditeFlag
		};
	}else if(!option.paramObj.isEditeFlag){
		option.paramObj.isEditeFlag = isEditeFlag;
	}
	g_grid.render($("#table_div1"),{
		header:index_list_col_header,
		oper: index_list_col_oper,
		operWidth:"100px",
		url:url.index_list,
		paramObj : option.paramObj,
		hideSearch : true,
		isLoad : option.isLoad,
		maskObj : option.maskObj,
		dbClick : detail_template_init,
		tdClick : true
	});
}
function detail_template_init(data){
	gotoShow(data);
}

function grid_upper(rowData){
	rowData.isMoveFlag = "up";
	topo_common_move(rowData);
	return false;
}
function grid_lower(rowData){
	rowData.isMoveFlag = "down";
	topo_common_move(rowData);
	return false;
}
function grid_edit(rowData){
	topo_common_edit(rowData);
	return false;
}
function grid_delete(rowData){
	topo_common_delete(rowData);
	return false;
}
function thumbnail_table_init(param){
	var isEditeFlag = 1;//权限过滤，1：拓扑编辑;0：拓扑监控、网络拓扑
	var locale = {isEditeFlag : isEditeFlag};
	param = $.extend(locale,param);
	um_ajax_get({
			url : url.index_list,
			paramObj : param,
			successCallBack : function (data) 
			{
				$("#table_div1").html("");

				if(data.length==0){
					var $p = $('<p></p>');
					$p.css("text-align","center").css("display","table-cell").css("vertical-align","middle").css("font-size","24px").css("color","gray");
					$p.append("暂无数据！");
					if(!$('#searchInput').val()){
						var $a = $('<a href="javascript:void(0)">请添加</a>');
						$a.click(function (){
							var  rowData;
							topo_common_edit(rowData);
						});
						$p.append($a);
					}
					var $div = $('<div></div>');
					$div.css("height","100%").css("width","100%").css("display","table");
					$div.append($p);
					$("#table_div1").append($div);
				}
				
				for(var i=0;i<data.length ;i++){
					if(data[i].topoThumbnail.indexOf('soc')==0)
						data[i].topoThumbnail = 'img/'+data[i].topoThumbnail;
					
					// var htmlstr = "<figure class=\"effect-sadie\" id=\""+data[i].topoId+"\">"+
					// // "<img alt=\"图片加载失败\" src=\""+index_web_app+data[i].topoThumbnail+"\">"+
					// '<figcaption class="tran5" style="background:url('+index_web_app+data[i].topoThumbnail+'),url('+index_web_app+'/img/soc/Resources/Thumbnail/topo/defaulttopo.png'+');">'+
					// "<h2>"+data[i].topoName+"<span></span></h2>"+
					// "<p>"+
					// // "<button data-id=\"upperRecord\" class=\"btn btn-default btn-sm ml1\">左移</button>"+
					// // "<button data-id=\"lowerRecord\" class=\"btn btn-default btn-sm ml1\">右移</button>"+
					// "<button data-id=\"editRecord\" class=\"btn btn-warning btn-sm ml1\">修改</button>"+
					// "<button data-id=\"deleteRecord\" class=\"btn btn-danger btn-sm ml1\">删除</button>"+
					// //"<button data-id=\"jsRecord\" class=\"btn btn-danger btn-sm ml1\">js展示</button>"+
					// "</p>"+
					// // "<a href=\"javascript:void(0)\">view more</a>"+
					// "</figcaption>"+
					// "</figure>";
					var htmlstr = '<div id="'+data[i].topoId+'" class="figure tran5 topo-div" style="width:19.5%;margin-left:0.25%;margin-right:0.25%;margin-top:0.5%; border: 1px solid #c0c0c0;display:inline-block;background-color:#fff;overflow:hidden">'+
					    '<div class="title" style="width:100%;text-align:center;height:42px;line-height:42px;">'+
					     '   <span style="font-size:18px;">'+data[i].topoName+'</span>'+
					    '</div>'+
					    '<div style="background:url('+index_web_app+data[i].topoThumbnail+'),url('+index_web_app+'/img/soc/Resources/Thumbnail/topo/defaulttopo.png'+');height:145px;margin-left:10px;margin-right:10px;background-size:100% 100%;cursor:pointer;">'+
					    '    '+
					    '</div>'+
					    '<div style="width:100%;height:34px;text-align:center;line-height:34px;margin-top:12px;">'+
					        '<div class="topo-modify" data-id="editRecord" style="cursor:pointer;"><i class="rh-icon topo-edit"></i> 修改</div>'+
					        '<div class="topo-delete" data-id="deleteRecord" style="cursor:pointer;"><i class="rh-icon topo-remove"></i> 删除</div>'+
					    '</div>'+
					'</div>';

					var  htmlObj = $(htmlstr);
					htmlObj.data(data[i]);

					$("#table_div1").append(htmlObj);

					// $("#"+data[i].topoId+"").data(data[i]);
				}
				$("#table_div1").find("[data-id=upperRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					rowData.isMoveFlag = "up";
					topo_common_move(rowData);
					return false;
				});
				$("#table_div1").find("[data-id=lowerRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					rowData.isMoveFlag = "down";
					topo_common_move(rowData);
					return false;
				});
				$("#table_div1").find("[data-id=editRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					topo_common_edit(rowData);
					return false;
				});
				$("#table_div1").find("[data-id=deleteRecord]").click(function (){
					var rowData = $(this).closest(".figure").data();
					topo_common_delete(rowData);
					return false;
				});
				$(".figure").click(function (){
					//view 视图
					var data = $(this).data();
					gotoShow(data);
					return false;
				});
			}
				
		});	
}
function topo_common_edit(rowData){
	var title = rowData ? "拓扑图修改" : "拓扑图添加";
	$.ajax({
		tyle : "GET",
		url : "module/monitor_info/topo_manage_tpl.html",
		server : "/",
		success : function (data){
			g_dialog.dialog($(data).find("#add_dialog"),{
				title : title,
				width:"630px",
				inti : init,
				initAfter:initAfter,
				saveclick:save_click
			});
			function init(el){
			}
			function initAfter(el){
				if(rowData){
					el.umDataBind("render" ,rowData);
					el.data(rowData);
				}
			}
			function save_click(el ,saveObj){
				var url = topo_create_url;
				rowData && (url = topo_update_url);
				if (g_validate.validate(el))
				{
					um_ajax_post({
						url : url,
						paramObj : saveObj,
						maskObj : el,
						successCallBack : function (data){
							if(data.flag==false){
								g_dialog.operateAlert(el,data.msg,"error")
							}else {
								g_dialog.operateAlert();
								g_dialog.hide(el);
								gotoEdit(data);
								refresh();
							}
						}
					});
				}
			}
		}
	});
}
function topo_common_delete(rowData){
	var  topoId = rowData.topoId;
	g_dialog.operateConfirm("确认删除此记录吗？",{saveclick : function (){
		um_ajax_post({
			url : url.delete_url,
			paramObj : {'topoId' : topoId},
			successCallBack : function (data){
				refresh();
			}
		});
	}});
}
function topo_common_move(rowData){
	um_ajax_post({
		url : url.move_topo,
		paramObj : rowData,
		successCallBack : function (data){
			if(data.flag==false){
				g_dialog.operateAlert(null,data.msg,"error");
				return false;
			}else {
				g_dialog.operateAlert(null,data.msg);
			}
			refresh();
		}
	});
}
function refresh(clearSearch){
	if(clearSearch==true)$('#searchInput').val("");
	var value = $('#searchInput').val();
	if($("#thumbnail_btn").is(":hidden")){
		thumbnail_table_init({topoName : value});
	}else {
		grid_table_init({paramObj:{isEditeFlag : 1,topoName : value},isLoad:true,maskObj:"body"});
	}
}

});
});