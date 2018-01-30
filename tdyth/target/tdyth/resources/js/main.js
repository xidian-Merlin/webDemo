/*入口脚本*/
require.config({
    baseUrl: "/tdyth/resources/",
    paths: {
     /*   // 遮罩
        "mask":"plugins/mask/mask",*/
       /* // 弹出框
        "dialog":"plugins/dialog/dialog",*/
        // tablegrid
        "tablegrid":"plugins/tablegrid/tablegrid",
        // grid
        "grid":"plugins/grid/grid",
        // asset
        "asset":"plugins/asset/asset",
        // validate
        "validate":"plugins/validate/validate",
        // accordion
        "accordion":"plugins/accordion/accordion",
        // inputdrop
        "inputdrop":"plugins/inputdrop/inputdrop",
        // monitorTool
        "monitorTool":"plugins/monitor/monitor_config_tool",
        // usercenter
        "usercenter":"plugins/usercenter/usercenter",
        // chart-plot
        "jquery.flot.pie":"lib/charts/flot/jquery.flot.pie.min",
        "plot":"plugins/plot/plot",
        // 日期选择空间
        "bootstrap-datetimepicker.cn":"lib/bootstrap-datetimepicker/bootstrap-datetimepicker.cn",
        "timepicker":"plugins/timepicker/timepicker",
        // checkbox美化插件
        "bootstrap-switch":"lib/bootstrap-switch/bootstrap-switch",
        // 下拉菜单
        "dropdown": "plugins/dropdown/dropdown",
        //树控件
        "ztree.core":"lib/ztree/jquery.ztree.core",
        "ztree.excheck":"lib/ztree/jquery.ztree.excheck",
        "ztree.exedit":"lib/ztree/jquery.ztree.exedit",
        "tree": "plugins/tree/tree",
        "sweetAlert": "lib/bootstrap-sweetAlert/sweetalert-dev.js",
        "moment": "lib/fullcalendar/js/moment.min"
    },
    waitSeconds: 15,
    shim : {
        "bootstrap-datetimepicker.cn":
                        ["/tdyth/resources/lib/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
                         'css!lib/bootstrap-datetimepicker/bootstrap-datetimepicker.css'],
        "bootstrap-switch":
                        ['css!lib/bootstrap-switch/bootstrap-switch.css'],
        "sweetAlert": ['css!lib/bootstrap-sweetAlert/sweetalert.css']
    }
});