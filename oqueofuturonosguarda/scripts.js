$(function() {
    //velocidade do video 
    var video = document.getElementById("remo-video_bg");
    video.playbackRate = 0.75;
    
    //botões quadrados
    var quadrado = $('.remo-quadrado').width();
    $('.remo-quadrado').css({'height':quadrado+'px'});
    
    //ripple
    var btns = document.querySelectorAll('.mdc-button');
    for (var i = 0, btn; btn = btns[i]; i++) {
        mdc.ripple.MDCRipple.attachTo(btn);
    }
});