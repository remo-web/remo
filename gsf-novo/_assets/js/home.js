$(function() {
    $( ".gsf-home" ).hover(function() {
        $(this).children( ".gsf-home--bg" ).toggleClass( "gsf-home--bg__mouseover" );
        $(this).children( ".gsf-home--text" ).toggleClass( "gsf-home--text__mouseover" );
    });
});