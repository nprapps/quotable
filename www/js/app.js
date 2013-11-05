$(function() {
    $('#save').on('click', function(){
        html2canvas($('.poster'), {
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
        $('.poster').removeClass('music');
    });

    $('#music').on('click', function(){
        $(this)
            .addClass('btn-primary')
            .removeClass('btn-default');
        $('#news')
            .removeClass('btn-primary')
            .addClass('btn-default');

        $('.poster').addClass('music');
    });

    $('#quote').on('click', function(){
        $(this).toggleClass('btn-primary btn-default');
        $('.poster blockquote').toggleClass('quote');
    });

    $('#fontsize').on('change', function(){
        var font_size = $(this).val().toString() + 'px';
        $('.poster').css('font-size', font_size);
    });

    var editor = new MediumEditor('.poster', {
        buttons: ['bold', 'italic']
    });
});
