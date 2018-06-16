$('#processos-scroll').click(function() {
    $('body').animate({
        scrollTop: $('#nossos-processos').offset().top
    }, 1000);
});
$('#servicos-btn-impressao').click(function() {
    $('.ed-servicos').animate({
        scrollTop: $('#servicos-card-impressao').offset().top
    }, 1000);
});
$('#servicos-btn-recorte').click(function() {
    $('.ed-servicos').animate({
        scrollTop: $('#servicos-card-recorte').offset().top
    }, 1000);
});
$('#servicos-btn-instalacao').click(function() {
    $('.ed-servicos').animate({
        scrollTop: $('#servicos-card-instalacao').offset().top
    }, 1000);
});
$('#fizemos-scroll').click(function() {
    $('.ed-fizemos').animate({
        scrollTop: $('#fizemos-portifolio').offset().top
    }, 1000);
});