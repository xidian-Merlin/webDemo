$(document).ready(function(){
var url = {
	asset_list : "monitorConfig/queryNoMonitoreDeviceList",
}

var header = {
	asset_list : [
							{text:'资产名称'   ,name:"entityName"},
							{text:'IP地址'     ,name:"ipvAddress"},
							{text:'资产类型'   ,name:"entityType"},
							{text:'安全域简称' ,name:"securityName"},
							{text:'业务域简称' ,name:"businessName"},
							{text:'添加时间'   ,name:"assetCreateDate"},
						],

};
g_grid.render($("[data-id="+$("[data-id=temp_name]").val()+"]") ,{
			url : url.asset_list,
			header : header.asset_list,
			paramObj : {monitorType : $("[data-id=temp_type]").val(),queryTag : "query"},
			isLoad : false
});
});