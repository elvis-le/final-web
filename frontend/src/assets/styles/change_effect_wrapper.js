function handleEffectWrapperClick(wrapperId) {
    return function (e) {
        e.preventDefault();
        var dropdowns = document.getElementsByClassName("effect-list-option-wrapper");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = 'none';
        }
        document.getElementById(wrapperId).style.display = 'inline-flex';
    };
}

var effects = [
    { id: 'import-effect-list-wrapper', wrapper: 'effect-list-import-wrapper'},
    { id: 'audio-effect-list-wrapper', wrapper: 'effect-list-audio-wrapper'},
    { id: 'text-effect-list-wrapper', wrapper: 'effect-list-text-wrapper'},
    { id: 'sticker-effect-list-wrapper', wrapper: 'effect-list-sticker-wrapper'},
    { id: 'effect-effect-list-wrapper', wrapper: 'effect-list-effect-wrapper'},
    { id: 'filter-effect-list-wrapper', wrapper: 'effect-list-filter-wrapper'},
];

effects.forEach(function(effect) {
    document.getElementById(effect.id).addEventListener('click', handleEffectWrapperClick(effect.wrapper));
});
