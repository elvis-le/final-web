function handleEffectWrapperClick(optionId, wrapId) {
    return function (e) {
        e.preventDefault();
        var parameters_option = document.getElementsByClassName("edit-parameters-option");
        for (var i = 0; i < parameters_option.length; i++) {
            parameters_option[i].classList.remove("active");
        }
        var parameters_wrap = document.getElementsByClassName("edit-parameters-wrap");
        for (var n = 0; n < parameters_wrap.length; n++) {
            parameters_wrap[n].style.display = 'none';
        }
        document.getElementById(optionId).classList.add("active");
        document.getElementById(wrapId).style.display = 'block';
    };
}

var effects = [
    { id: 'video-video-basic', wrap: 'video-video-basic-option'},
    { id: 'video-video-removeBG', wrap: 'video-video-removeBG-option'},
    { id: 'video-video-mask', wrap: 'video-video-mask-option'},
    { id: 'video-video-retouch', wrap: 'video-video-retouch-option'},

    { id: 'video-audio-basic', wrap: 'video-audio-basic-option'},
    { id: 'video-audio-voiceChanger', wrap: 'video-audio-voiceChanger-option'},

    { id: 'video-speed-standard', wrap: 'video-speed-standard-option'},
    { id: 'video-speed-curve', wrap: 'video-speed-curve-option'},

    { id: 'video-animation-in', wrap: 'video-animation-in-option'},
    { id: 'video-animation-out', wrap: 'video-animation-out-option'},
    { id: 'video-animation-combo', wrap: 'video-animation-combo-option'},

    { id: 'video-adjustment-basic', wrap: 'video-adjustment-basic-option'},
    { id: 'video-adjustment-hls', wrap: 'video-adjustment-hls-option'},
    { id: 'video-adjustment-curves', wrap: 'video-adjustment-curves-option'},
    { id: 'video-adjustment-colorWheel', wrap: 'video-adjustment-colorWheel-option'},
];

effects.forEach(function(effect) {
    document.getElementById(effect.id).addEventListener('click', handleEffectWrapperClick(effect.id, effect.wrap));
});
