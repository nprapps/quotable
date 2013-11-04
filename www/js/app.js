$(function() {
    $('#save').on('click', function(){
        html2canvas($('.quote'), {
          onrendered: function(canvas) {
            document.body.appendChild(canvas);
            window.oCanvas = document.getElementsByTagName("canvas");
            window.oCanvas = window.oCanvas[0];
            var strDataURI = window.oCanvas.toDataURL("image/jpeg"); 
            Canvas2Image.saveAsPNG(oCanvas);
          }
        });
    });

    $('#news').on('click', function(){
        $(this)
            .addClass('btn-primary')
            .removeClass('btn-default');
        $('#music')
            .removeClass('btn-primary')
            .addClass('btn-default');
        $('.quote').removeClass('music');
    });

    $('#music').on('click', function(){
        $(this)
            .addClass('btn-primary')
            .removeClass('btn-default');
        $('#news')
            .removeClass('btn-primary')
            .addClass('btn-default');

        $('.quote').addClass('music');
    });

    var editor = new MediumEditor('.quote', {
        buttons: ['bold', 'italic']
    });
});
