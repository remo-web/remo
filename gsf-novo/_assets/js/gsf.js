    // Processos | Quadrados
    var cw = $('.gsf--square').width();
    $('.gsf--square').css({'height':cw+'px'});

// RUNNING INSIDE INCLUDE.JS

    // Form | data a partir de hoje
//    function load() {
//        document.querySelector('#gsf-visita-data').valueAsDate = new Date();
//    }

    // Scroll
    $('#top-scroll').click(function() {
        $('html').animate({
            scrollTop: $('#top').offset().top -0
        }, 1000);
    });
    $('#processos-scroll').click(function() {
        $('html').animate({
            scrollTop: $('#nossos-processos').offset().top -100
        }, 1000);
    });
    $('#cobranca-scroll').click(function() {
        $('html').animate({
            scrollTop: $('#metodo-de-cobranca').offset().top -100
        }, 1000);
    });
    $('#agende-scroll').click(function() {
        $('html').animate({
            scrollTop: $('#agende-uma-visita').offset().top -100
        }, 1000);
    });