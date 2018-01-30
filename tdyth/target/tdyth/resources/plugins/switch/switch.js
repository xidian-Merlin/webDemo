/** 
	插件名称  :  switch
	插件功能  :  元素美化
*/
define(['bootstrap-switch'] ,function (){
	return {
		render : function (el){
			el.data("size" , "mini");
			el.bootstrapSwitch();
		}
	}
});