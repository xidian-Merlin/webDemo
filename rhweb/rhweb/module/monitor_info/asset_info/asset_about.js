$(document).ready(function (){
require(['/js/plugin/plot/plot.js'] ,function (plot){
	plot.pieRender($("#sec_area") ,{
		data : [{data:1,label:"soc"},{data:1,label:"其他"},{data:1,label:"linux"}]
	});
	plot.pieRender($("#sec_type") ,{
		data : [{data:1,label:"test"},{data:5,label:"soc"}]
	});
	plot.pieRender($("#sec_sys") ,{
		data : [{data:1,label:"test"},{data:1,label:"oracle"},
				{data:1,label:"windows"},{data:1,label:"mysql"}]
	});
	plot.pieRender($("#sec_value") ,{
		data : [{data:1,label:"test"}]
	});

	$( "[class=row]" ).sortable({
      revert: true,
      helper: "clone",
      opacity: 0.5,
      tolerance: "intersect",
      handle: ".handle"
    });

	// $("[data-id=panel-body]").off("mousedown");

 //    $("[data-id=panel-body]").mousedown(function (e){
 //    	e.preventDefault();
 //    	return false;
 //    });


});
});