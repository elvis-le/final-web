function handleEffectWrapperClick(wrapperId, wrapId, optionId) {
    return function (e) {
        e.preventDefault();
        var option_wrap = document.getElementsByClassName("detail-option-wrap");
        for (var i = 0; i < option_wrap.length; i++) {
            option_wrap[i].style.display = 'none';
        }
        var parameters_option = document.getElementsByClassName("edit-parameters-option");
        for (var m = 0; m < parameters_option.length; m++) {
            parameters_option[m].classList.remove("active");
        }
        var parameters_wrap = document.getElementsByClassName("edit-parameters-wrap");
        for (var n = 0; n < parameters_wrap.length; n++) {
            parameters_wrap[n].style.display = 'none';
        }
        document.getElementById(wrapperId).style.display = 'inline-flex';
        document.getElementById(wrapId).style.display = 'block';
        document.getElementById(optionId).classList.add("active");
    };
}

var effects = [
    { id: 'video-video', wrapper: 'detail-option-video-video', wrap: 'video-video-basic-option', option: 'video-video-basic'},
    { id: 'video-audio', wrapper: 'detail-option-video-audio', wrap: 'video-audio-basic-option', option: 'video-audio-basic'},
    { id: 'video-speed', wrapper: 'detail-option-video-speed', wrap: 'video-speed-standard-option', option: 'video-speed-standard'},
    { id: 'video-animation', wrapper: 'detail-option-video-animation', wrap: 'video-animation-in-option', option: 'video-animation-in'},
    { id: 'video-adjustment', wrapper: 'detail-option-video-adjustment', wrap: 'video-adjustment-basic-option', option: 'video-adjustment-basic'},
];

effects.forEach(function(effect) {
    document.getElementById(effect.id).addEventListener('click', handleEffectWrapperClick(effect.wrapper, effect.wrap, effect.option));
});
