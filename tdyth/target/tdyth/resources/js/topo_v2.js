$(function () {
    var $body    = $('body'),
        preview  = document.getElementById('preview'),
        $preview = $('#preview'),
        $divide  = $('#divide');

    $divide.bind('mousedown', function (e) {
        //按下元素后，计算当前鼠标与对象计算后的坐标
        var x = e.clientX - preview.offsetWidth;

        $body.bind('mousemove', function (e1) {
            $preview.css('width', e1.clientX - x + 'px');
        });
    });
    $body.bind('mouseup', function () {
        $body.unbind('mousemove');
    });
});