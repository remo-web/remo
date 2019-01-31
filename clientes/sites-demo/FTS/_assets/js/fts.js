function fts(){
    $('.fts-header__home').slick({
        adaptiveHeight: true,
        arrows: false,
//        fade: true,
        autoplay: true,
        autoplaySpeed: 10000,
    });
    $('.fts-home__clientes--depoimento').slick({
        adaptiveHeight: true,
        arrows: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 6000,
    });
    
    window.onscroll = function() {stickyBar()};
    var header = document.getElementById("fts-menu");
    var logo = document.getElementById("fts-logo");
    var sticky = header.offsetTop;
    function stickyBar() {
        if (window.pageYOffset > sticky) {
            header.classList.add("fts-sticky");
            logo.classList.add("fts-logo--position");
        } else {
            header.classList.remove("fts-sticky");
            logo.classList.remove("fts-logo--position");
        }
    }
    
    //FORM MAX
    var text_max = 255
    $('#charcount').html(text_max + ' caractéres restantes');
    $('#mce-MESSAGE').keyup(function() {
        var text_length = $('#mce-MESSAGE').val().length;
        var text_remaining = text_max - text_length;
        $('#charcount').html(text_remaining + ' caractéres restantes');
    });
    
    var date = new Date();
    var year = date.getFullYear();
    document.getElementById("year").innerHTML = year;
};