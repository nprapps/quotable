var $text = $('.poster blockquote p, .source');

// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  return a
};

function process_text(){
    $text.each(function(){
        var raw_text = $(this).html();
        
        $(this).html(smarten(raw_text));
    });
}

$(function() {
    $('#save').on('click', function(){
        $('canvas').remove();

        html2canvas($('.poster'), {
          onrendered: function(canvas) {
            document.body.appendChild(canvas);
            window.oCanvas = document.getElementsByTagName("canvas");
            window.oCanvas = window.oCanvas[0];
            var strDataURI = window.oCanvas.toDataURL();

            var a = $("<a>").attr("href", strDataURI).attr("download", "quote.png").appendTo("body");

            a[0].click();

            a.remove();

            $('#download').attr('href', strDataURI);
            $('#download').trigger('click');
          }
        });
    });

    $('#news').on('click', function(){
        $(this).toggleClass('btn-primary btn-default');
        $('#music').toggleClass('btn-primary btn-default');
        $('.poster').toggleClass('music');
    });

    $('#music').on('click', function(){
        $(this).toggleClass('btn-primary btn-default');
        $('#news').toggleClass('btn-primary btn-default');
        $('.poster').toggleClass('music');
    });

    $('#quote').on('click', function(){
        $(this).find('button').toggleClass('btn-primary btn-default');
        $('.poster').toggleClass('quote');
    });

    $('#fontsize').on('change', function(){
        var font_size = $(this).val().toString() + 'px';
        $('.poster').css('font-size', font_size);
    });

    var editor = new MediumEditor('.poster blockquote, .source', {
        buttons: ['bold', 'italic']
    });

    $('.poster, .source').on('blur', _.debounce(process_text, 100));

   document.querySelector(".poster").addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, smarten(text));
    });
});
