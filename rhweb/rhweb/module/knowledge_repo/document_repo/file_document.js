$(document).ready(function (){
require(['tree'] ,function (tree){
$("#content_div").addClass("appbgf");

var list_header = [{text:"",name:"appendixCnt",width:5,render:function(txt,data){
						if(data.appendixCnt != 0)
						{
							return '<i class="icon-paperclip" title="有附件" style="color:#000;font-size:16px"></i>';
						}
					}},
					{text:"资料标题",name:"title",width:19},
					{text:"创建时间",name:"createDate",width:19,searchRender:function(el){
						index_render_div(el ,{
							type : "date",
							startKey : "createStartDate",
							endKey : "createEndDate"
						});
					}},
					{text:"文档分类",name:"docTypeName",width:19,hideSearch:true},
					{text:"资料来源",name:"source",width:19,hideSearch:true},
					{text:"内容简介",name:"desc",width:19,hideSearch:true}];
var list_oper = [{icon:"rh-icon rh-edit" ,text:"修改" ,aclick:edit_init},
				 {icon:"rh-icon rh-delete" ,text:"删除" ,aclick:delete_init}];					

var list_url = "DocInfoController/queryData";
var list_detail_url = "DocInfoController/queryDetailInfo";
var left_tree_url = "DataWordStructureController/queryDataWordStructureData";
var left_tree_delete_node_url = "DataWordStructureController/delDataWordStructure";
var left_tree_delete_updnode_url = "DataWordStructureController/delAndUpdDataWordStructure";
var left_tree_add_node_url = "DataWordStructureController/addDataWordStructureSave";
var right_form_preupdate_url = "DataWordStructureController/preUpdateDataWordStructure";
var right_form_update_url = "DataWordStructureController/updDataWordStructureSave";
var doc_add_url = "DocInfoController/addDocInfo";
var doc_update_url = "DocInfoController/updDocInfo";
var batch_delete_url = "DocInfoController/doBatchDel";

var el_table = $("#table_div1");

view_init();

event_init();

tree_get();

list_init();

list_render();

function view_init()
{
	$("#content_div").css("padding" ,"0");
	$("#pg-content").css("padding" ,"0");
}

function event_init()
{
	g_validate.init($("#form"));

	$("#save_btn").click(function (){
		if (g_validate.validate($("#form")))
		{
			form_update();
		}
	});

	$("#add_btn").click(function(){
		if($("[data-id=docType]").val() == "")
		{
			g_dialog.operateAlert($("#left_div") ,"请在资料文档结构树上选择一个文档类型。" ,"error");
			return false;
		}
		edit_init();	
	});

	$("#delete_btn").click(function (){
		delete_init();
	});
}

function list_init()
{
	g_grid.render(el_table,{
		 header:list_header,
		 data:[],
		 oper : list_oper,
		 operWidth:"80px",
		 hideSearch :true,
		 dbClick : detail_init,
		 dbIndex : 1
	});
}

function list_render(opt)
{
	var paramObj = new Object();
	paramObj.queryTag = "query"; 
	paramObj.docType = "";
	if(opt)
	{
		paramObj.docType = opt;
	}
	um_ajax_get({
		url:list_url,
		paramObj:paramObj,
		isLoad :true,
		maskObj:"body",
		successCallBack:function(data){
			g_grid.removeData(el_table,{});
			g_grid.addData(el_table ,data.docinfostore);
		}
	});
}

var add_btn_click_flag = false;
var el_tree = $("#left_tree");

function tree_get(expandId)
{
	um_ajax_get({
		url : left_tree_url,
		paramObj:{isContainUnknown:"1"},
		maskObj : "body",
		successCallBack : function (data){
			for (var i = 0; i < data.length; i++)
			{
				data[i].id = data[i].docType;
				data[i].parent = data[i].pdocType;
				data[i].title = data[i].dtName
			}
			data.push({id:null ,parent:"root1" ,title:"资料文档结构树",docType:""});
			tree.render($("#left_tree") ,{
				edit : true,
				showRemoveBtn : true,
				showAddBtn : true,
				pId:"parent",
				label:"title",
				id:"id",
				zNodes : data,
				zTreeOnClick : function (event, treeId, treeNode){
					g_validate.reset($("#form"));
					if (treeNode.docType == "" || treeNode.docType == "-1")
					{
						$("[data-id=docType]").val(treeNode.id);
						g_validate.clear([$("[data-id=dtName]")]);
						$("[data-id=dtName]").val("");
						$("[data-id=docTypeDescription]").val("");
						$("#mask").show();
						list_render(treeNode.docType);
						add_btn_click_flag = false;
						return;
					}
					if (!add_btn_click_flag)
					{
						um_ajax_get({
							url : right_form_preupdate_url,
							paramObj:{docType:treeNode.id},
							isLoad:false,
							maskObj:"body",
							successCallBack : function (data){
								$("#form").umDataBind("render" ,data[0]);
								$("#mask").hide();
							}
						});
						list_render(treeNode.docType);
					}
					$("#reset_btn").click(function (){
						$("#panel").umDataBind("render" ,treeNode);
					});
					add_btn_click_flag = false;   
				},
				beforeRemove : function (treeId, treeNode){
					if ((treeNode.children && treeNode.children.length > 0) || treeNode.id == "-1")
					{
						g_dialog.operateAlert($("#left_div") ,"此节点不允许删除。" ,"error");
						return false;
					}
					g_dialog.operateConfirm("确定执行删除操作么?" ,{
						saveclick : function (){
							um_ajax_post({
								url : left_tree_delete_node_url,
								paramObj : {docType : treeNode.docType,pdocType:treeNode.pdocType},
								failTip: false,
								successCallBack : function (data){
									remove_node();
								},
								failCallBack : function(){
									g_dialog.operateConfirm("存在该类型的文档，如果删除，对应文档的类型将变为未知，是否删除？",{
										saveclick : function (){
											um_ajax_post({
												url : left_tree_delete_updnode_url,
												paramObj : {docType : treeNode.docType,pdocType:treeNode.pdocType},
												successCallBack : function (data){
													remove_node();
												}
											});
										}
									});
								}
							});
						}
					});

					function remove_node()
					{
						el_tree.data("tree").removeNode(treeNode);
						g_dialog.operateAlert($("#left_div"));
						g_validate.clear([$("[data-id=dtName]")]);
						$("[data-id=dtName]").val("");
						$("[data-id=docTypeDescription]").val("");
						$("[data-id=docType]").val(treeNode.pdocType);
						$("#mask").show();
						// 父节点选中
						tree.selectNode(el_tree ,{
							key : "id",
							value : treeNode.pdocType
						});
						list_render(treeNode.pdocType);
					}	
					return false;
				},
				zTreeOnAdd:function (treeId, treeNode ,newNode){
					if (treeNode.id == "-1")
					{
						g_dialog.operateAlert($("#left_div") ,"此节点不允许添加节点。" ,"error");
						return false;
					}
					else
					{
						g_dialog.waitingAlert();
						um_ajax_post({
							url : left_tree_add_node_url,
							isLoad : false,
							paramObj : {"pdocType":treeNode.id ,"dtName":"*新节点","docTypeDescription":""},
							successCallBack : function (data){
								g_dialog.waitingAlertHide();
								g_dialog.operateAlert($("#left_div"));
								adddt_init();
								
							},
							failCallBack : function(){
								g_dialog.waitingAlertHide();
								adddt_init();
							}
						});

						function adddt_init()
						{
							tree_get(treeNode.id);
							tree.selectNode(el_tree ,{
								key : "id",
								value : treeNode.docType
							});
							g_validate.clear([$("[data-id=dtName]")]);
							$("[data-id=dtName]").val("");
							$("[data-id=docTypeDescription]").val("");
							$("[data-id=docType]").val("");
							$("#mask").show();
							list_init();
						}
					}
					add_btn_click_flag = true;
					return false;
				}
			});

			// 默认展开第一级
			var treeObj = el_tree.data("tree");
			if (expandId)
			{
				var nodes = treeObj.getNodesByParam("id",expandId, null);
				treeObj.expandNode(nodes[0] ,true ,false);
			}
			else
			{
				treeObj.expandNode(treeObj.getNodes()[0] ,true ,false);
			}
		}
	});
}

function form_update()
{
	g_dialog.waitingAlert();
	var saveObj = $("#form").umDataBind("serialize");
	um_ajax_post({
		url : right_form_update_url,
		isLoad : false,
		paramObj : saveObj,
		successCallBack : function (){
			g_dialog.waitingAlertHide();
			g_dialog.operateAlert();
			tree_get(saveObj.pdocType);
		}
	});
}

function detail_init(rowDate)
{
	$.ajax({
		type: "GET",
		url: "/module/knowledge_repo/document_repo/file_document_tpl.html",
		success: function(data) {
			g_dialog.dialog($(data).find("[id=detail_template]"), {
				width: "450px",
				init: init,
				top:"16%",
				title : "资料文档详细信息",
				isDetail:true
			});
		}
	});

	function init(el)
	{
		um_ajax_get({
			url : list_detail_url,
			paramObj : {docId:rowDate.docId,docType:rowDate.docType},
			isLoad : true,
			maskObj :"body",
			successCallBack : function(data){
				el.umDataBind("render",data[0]);
				var appendixstore = data[0].appendixList;
	 			for (var i = 0; i < appendixstore.length; i++) {
	 				var app_div = '<div class="form-group">'
	 							+'<label class="col-lg-12 control-label tl">'
	 							+'<a href="javascript:void(0);" id="'+appendixstore[i].appendixPath+'" data-flag="appendix">'
	 							+appendixstore[i].appendixName
	 							+'</a>'
	 							+'</label>'
	 							+'</div>';
	 				el.find("[id=appendixgroup]").append(app_div);

 					el.find("[data-flag=appendix]").click(function(){
						var url = $(this).attr("id");
						window.location.href = url;
					});
	 			}
			}
		});
	}

}

function search_init()
{
	$.ajax({
		type: "GET",
		url: "/module/knowledge_repo/document_repo/file_document_tpl.html",
		success: function(data) {
			g_dialog.dialog($(data).find("[id=search_template]"), {
				width: "450px",
				init: init,
				top:"16%",
				title : "上级资料文档信息查询",
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
	}

	function save_click(el,saveObj)
	{
		if (!g_validate.validate(el))
		{
			return false;
		}
		um_ajax_post({
			url : "",
			paramObj : saveObj,
			isLoad : true,
			maskObj :"body",
			successCallBack : function(data){
				list_init();
			}
		});
	}
}

function edit_init(rowDate)
{
	var docType = $("[data-id=docType]").val();
	var title = "资料文档添加";
	if(rowDate)
	{
		title = "资料文档修改";
		docType = rowDate.docType;
	}
	$.ajax({
		type: "GET",
		url: "/module/knowledge_repo/document_repo/file_document_tpl.html",
		success: function(data) {
			g_dialog.dialog($(data).find("[id=edit_template]"), {
				width: "600px",
				init: init,
				title : title,
				saveclick : save_click
			});
		}
	});

	function init(el)
	{
		var paramObj = new Object;
		paramObj.queryTag = "query";
		paramObj.docType = docType;
		paramObj.docId = "";
		if(rowDate)
		{
			paramObj.queryTag = "preUpd";
			paramObj.docId = rowDate.docId;
		}
		um_ajax_get({
			url:list_url,
			paramObj:paramObj,
			isLoad : true,
			maskObj:"body",
			successCallBack:function(data){
				el.umDataBind("render",data.maxstore[0]);
				if(rowDate)
				{
					el.find("[name=maxUploadSize]").val(data.maxstore[0].maxUpLoadFileSize);
					el.umDataBind("render",rowDate);
				}
				el.find("[name=docType]").val(docType);
				g_formel.appendix_render(el.find("[id=appendixgroup]") ,{
					data : data.appendixstore,
					key : "appendixName",
					id:"appendixId",
					limitUrl :list_url,
					nodownload :true
				});
			}
		});	
	}

	function save_click(el,saveObj)
	{
		var url;
		var docType = el.find("[name=docType]").val();
		g_formel.appendix_render($("[id=appendixgroup]") ,{
			method : "getUploadStrArray"
		});

		var uploadStr = $("[id=appendixgroup]").data("uploadStrArray").join("|");
		el.find("[name=uploadStr]").val(uploadStr);

		if(rowDate)
		{
			var delAppendixIdStr = $("[id=appendixgroup]").data("delStrArray" ).join("|");
			el.find("[name=delAppendixIdStr]").val(delAppendixIdStr);
			saveObj.docType = docType;
			el.find("[name=jsonString]").val(JsonTools.encode(saveObj));
			url = doc_update_url;
		}
		else
		{
			el.find("[name=docinfostorejson]").val(JsonTools.encode(saveObj));
			var obj = new Object();
			obj.maxUpLoadFileNum = saveObj.maxUpLoadFileNum;
			obj.maxUpLoadFileSize = saveObj.maxUpLoadFileSize;
			obj.docType = docType;
			el.find("[name=maxdsjson]").val(JsonTools.encode(obj));
			url = doc_add_url;
		}

		um_ajax_file(el.find("form") ,{
			url:url,
			paramObj : {},
			isLoad : true,
			maskObj : "body",
			successCallBack:function (data){
				g_dialog.operateAlert();
				g_dialog.hide(el);
				list_render($("[data-id=docType]").val());
			}
		});
	}

}

function delete_init(rowDate)
{
	if(rowDate)
	{
		g_dialog.operateConfirm("确认删除此文档吗？",{
			saveclick:function (){
				var delStore = [{"docId":rowDate.docId}]; 
				delete_post(delStore);
			}
		});
	}
	else
	{
		var array = g_grid.getIdArray(el_table,{chk:true,attr:"docId"});
		if(array.length == 0)
		{
			g_dialog.operateAlert(el_table ,index_select_one_at_least_msg,"error");
			return false;
		}
		g_dialog.operateConfirm("确认删除选中文档吗？",{
			saveclick:function (){
				var delStore = [];
				for (var i = 0; i < array.length; i++) {
					delStore[i] = {"docId":array[i]};
				}
				delete_post(delStore);
			}
		});
	}
	
	function delete_post(delStore)
	{
		var obj = JsonTools.encode({delStore:delStore});
		um_ajax_get({
			url : batch_delete_url+"?jsonString="+obj,
			isLoad : true,
			maskObj :"body",
			successCallBack : function(data){
				list_render($("[data-id=docType]").val());
			}
		});
	}
}

})
});