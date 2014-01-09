var $text = null;
var $save = null;
var $poster = null;
var $theme_buttons = null;
var $aspect_ratio_buttons = null;
var $quote = null;
var $font_size = null;
var $show = null;
var $source = null;
var $quote = null;

// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  return a;
}

function convert_to_slug(text){
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function process_text(){
    $text.each(function(){
        var raw_text = $.trim($(this).html());
        
        $(this).html(smarten(raw_text)).find('br').remove();
    });
}

function save_image(){
    $('canvas').remove();
    process_text();

    html2canvas($poster, {
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var quote = $('blockquote').text().split(' ', 5);
        var filename = convert_to_slug(quote.join(' '));

        var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
      }
    });
}

function adjust_font_size(size){
    var font_size = size.toString() + 'px';
    $poster.css('font-size', font_size);
}

$(function(){
    $text = $('.poster blockquote p, .source');
    $save = $('#save');
    $poster = $('.poster');
    $theme_buttons = $('#theme .btn');
    $aspect_ratio_buttons = $('#aspect-ratio .btn');
    $font_size = $('#fontsize');
    $show = $('#show');
    $source = $('.source');
    $quote = $('#quote');

    $save.on('click', save_image);

    $theme_buttons.on('click', function(){
        $theme_buttons.removeClass().addClass('btn btn-default');
        $(this).addClass('btn-primary');
        $poster.removeClass('poster-news poster-music poster-fresh-air poster-snap-judgement')
                    .addClass('poster-' + $(this).attr('id'));
    });

    $aspect_ratio_buttons.on('click', function(){
        $aspect_ratio_buttons.removeClass().addClass('btn btn-default');
        $(this).addClass('btn-primary');
        $poster.removeClass('square two-to-one').addClass($(this).attr('id'));

        if ($poster.hasClass('two-to-one')){
            adjust_font_size(36);
            $font_size.val(36);
        } else {
            adjust_font_size(72);
            $font_size.val(72);
        }
    });

    $quote.on('click', function(){
        $(this).find('button').toggleClass('btn-primary btn-default');
        $poster.toggleClass('quote');
    });

    $font_size.on('change', function(){
        adjust_font_size($(this).val());
    });

    $show.on('keyup', function(){
        var input_text = $(this).val();
        $source.find('em, span').remove();
        $source
            .text($.trim($('.source').text()))
            .append('<span>,</span> <em>' + input_text + '</em>');
    });

    // This event is interfering with the medium editor in some browsers
    // $('h1').on('keyup', function(){
    //         process_text();
    // });


    var editable = document.querySelectorAll('.poster blockquote, .source');
    var editor = new MediumEditor(editable, {
        buttons: ['italic']
    });
});
