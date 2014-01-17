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
var $logo_wrapper = null;

var quotes = [
    {
        "quote": "I'd been drinking.",
        "source": "Dennis Rodman"
    },
    {
        "quote": "I've made a huge mistake.",
        "source": "G.O.B."
    },
    {
        "quote": "Yes, I have smoked crack cocaine",
        "source": "Toronto Mayor Rob Ford",
        "size": 65
    },
    {
        "quote": "Annyong.",
        "source": "Annyong",
        "size": 90
    },
    {
        "quote": "STEVE HOLT!",
        "source": "Steve Holt",
        "size": 65
    },
    {
        "quote": "Whoa, whoa, whoa. There's still plenty of meat on that bone. Now you take this home, throw it in a pot, add some broth, a potato. Baby, you've got a stew going.",
        "source": "Carl Weathers",
        "size": 40
    }
];


// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
  return a;
}

function convert_to_slug(text){
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function process_text(){
    $text = $('.poster blockquote p, .source');
    $text.each(function(){
        var raw_text = $.trim($(this).html());
        $(this).html(smarten(raw_text)).find('br').remove();
    });
}

function save_image(){
    // first check if the quote actually fits

    if (($source.offset().top + $source.height()) > $logo_wrapper.offset().top){
        alert("Your quote doesn't quite fit. Shorten the text or choose a smaller font-size.");
        return;
    }

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
    if ($font_size.val() !== size){
        $font_size.val(size);
    };
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
    $logo_wrapper = $('.logo-wrapper');

    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        adjust_font_size(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $source.html('&mdash;&thinsp;' + quote.source);
    process_text();

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
            adjust_font_size(32);
            $font_size.val(32);
        } else {
            adjust_font_size(90);
            $font_size.val(90);
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
            .append('<span>' + input_text + '</span>');
    });

    // // This event is interfering with the medium editor in some browsers
    // $('blockquote').on('keyup', function(){

    //     console.log($(this)[0].selectionStart);
    //     process_text();
    // });


    var editable = document.querySelectorAll('.poster blockquote, .source');
    var editor = new MediumEditor(editable, {
        disableToolbar: true
    });
});
