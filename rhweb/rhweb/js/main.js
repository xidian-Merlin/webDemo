/*入口脚本*/
require.config({
    baseUrl: "js/",
    paths: {
        // 遮罩
        "mask":"plugin/mask/mask",
        // 弹出框
        "dialog":"plugin/dialog/dialog",
        // tablegrid
        "tablegrid":"plugin/tablegrid/tablegrid",
        // grid
        "grid":"plugin/grid/grid",
        // asset
        "asset":"plugin/asset/asset",
        // validate
        "validate":"plugin/validate/validate",
        // accordion
        "accordion":"plugin/accordion/accordion",
        // inputdrop
        "inputdrop":"plugin/inputdrop/inputdrop",
        // monitorTool
        "monitorTool":"plugin/monitor/monitor_config_tool",
        // usercenter
        "usercenter":"plugin/usercenter/usercenter",
        // chart-plot
        "jquery.flot.pie":"lib/charts/flot/jquery.flot.pie.min",
        "plot":"plugin/plot/plot",
        // 日期选择空间
        "bootstrap-datetimepicker.cn":"lib/bootstrap-datetimepicker/bootstrap-datetimepicker.cn",
        "timepicker":"plugin/timepicker/timepicker",
        // checkbox美化插件
        "bootstrap-switch":"lib/bootstrap-switch/bootstrap-switch",
        // 下拉菜单
        "dropdown": "plugin/dropdown/dropdown",
        //树控件
        "ztree.core":"lib/ztree/jquery.ztree.core",
        "ztree.excheck":"lib/ztree/jquery.ztree.excheck",
        "ztree.exedit":"lib/ztree/jquery.ztree.exedit",
        "tree": "plugin/tree/tree",
        "sweetAlert": "lib/bootstrap-sweetAlert/sweetalert-dev",
        "moment": "lib/fullcalendar/js/moment.min"
    },
    waitSeconds: 15,
    shim : {
        "bootstrap-datetimepicker.cn":
                        ["js/lib/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
                         'css!lib/bootstrap-datetimepicker/bootstrap-datetimepicker.css'],
        "bootstrap-switch":
                        ['css!lib/bootstrap-switch/bootstrap-switch.css'],
        "sweetAlert": ['css!lib/bootstrap-sweetAlert/sweetalert.css']
    }
});