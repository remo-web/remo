$(function() {
    //caches a jQuery object containing the menu element
    var menu = $(".gsf--scroll");
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 200) {
            menu.removeClass('gsf--visibility__no').addClass("gsf--visibility__yes");
        } else {
            menu.removeClass("gsf--visibility__yes").addClass('gsf--visibility__no');
        }
    });
});