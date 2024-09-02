function handleEffectClick(wrapperId, importSortDisplay) {
    return function (e) {
        e.preventDefault();
        var dropdowns = document.getElementsByClassName("effect-option");
        for (var i = 0; i < dropdowns.length; i++) {
            dropdowns[i].style.display = 'none';
        }
        document.getElementById(wrapperId).style.display = 'inline-flex';
        var importSortVideo = document.getElementById('import-sort-video');
        importSortVideo.style.display = importSortDisplay;

        // Adjust height of effect-option elements based on importSortDisplay
        var effectOptions = document.getElementsByClassName("effect-option");
        for (var j = 0; j < effectOptions.length; j++) {
            if (importSortDisplay === 'none') {
                effectOptions[j].style.height = '85%';
            } else {
                effectOptions[j].style.height = ''; // Reset to default
            }
        }
    };
}

var effects = [
    { id: 'import-device', wrapper: 'video-import-wrapper', importSortDisplay: 'inline-flex' },
    { id: 'trending-stock-material', wrapper: 'trending-stock-material-wrapper', importSortDisplay: 'none' },
    { id: 'christmas&NewYear-stock-material', wrapper: 'christmas&NewYear-stock-material-wrapper', importSortDisplay: 'none' },
    { id: 'greenScreen-stock-material', wrapper: 'greenScreen-stock-material-wrapper', importSortDisplay: 'none' },
    { id: 'background-stock-material', wrapper: 'background-stock-material-wrapper', importSortDisplay: 'none' },
    { id: 'intro&End-stock-material', wrapper: 'intro&End-stock-material-wrapper', importSortDisplay: 'none' },
    { id: 'vlog-music', wrapper: 'vlog-music-wrapper', importSortDisplay: 'none' },
    { id: 'tourism-music', wrapper: 'tourism-music-wrapper', importSortDisplay: 'none' },
    { id: 'spring-music', wrapper: 'spring-music-wrapper', importSortDisplay: 'none' },
    { id: 'love-music', wrapper: 'love-music-wrapper', importSortDisplay: 'none' },
    { id: 'beat-music', wrapper: 'beat-music-wrapper', importSortDisplay: 'none' },
    { id: 'heal-music', wrapper: 'heal-music-wrapper', importSortDisplay: 'none' },
    { id: 'warm-music', wrapper: 'warm-music-wrapper', importSortDisplay: 'none' },
    { id: 'trend-sound-effect', wrapper: 'trend-sound-effect-wrapper', importSortDisplay: 'none' },
    { id: 'revenue-sound-effect', wrapper: 'revenue-sound-effect-wrapper', importSortDisplay: 'none' },
    { id: 'horrified-sound-effect', wrapper: 'horrified-sound-effect-wrapper', importSortDisplay: 'none' },
    { id: 'laugh-sound-effect', wrapper: 'laugh-sound-effect-wrapper', importSortDisplay: 'none' },
    { id: 'default-text', wrapper: 'default-text-wrapper', importSortDisplay: 'none' },
    { id: 'trending-effect', wrapper: 'trending-effect-wrapper', importSortDisplay: 'none' },
    { id: 'pro-effect', wrapper: 'pro-effect-wrapper', importSortDisplay: 'none' },
    { id: 'basic-effect', wrapper: 'basic-effect-wrapper', importSortDisplay: 'none' },
    { id: 'multicolor-effect', wrapper: 'multicolor-effect-wrapper', importSortDisplay: 'none' },
    { id: 'trending-sticker', wrapper: 'trending-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'easter-holiday-sticker', wrapper: 'easter-holiday-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'fun-sticker', wrapper: 'fun-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'troll-face-sticker', wrapper: 'troll-face-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'gaming-sticker', wrapper: 'gaming-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'emoji-sticker', wrapper: 'emoji-sticker-wrapper', importSortDisplay: 'none' },
    { id: 'trending-video-effect', wrapper: 'trending-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'pro-video-effect', wrapper: 'pro-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'nightclub-video-effect', wrapper: 'nightclub-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'lens-video-effect', wrapper: 'lens-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'retro-video-effect', wrapper: 'retro-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'tv-video-effect', wrapper: 'tv-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'star-video-effect', wrapper: 'star-video-effect-wrapper', importSortDisplay: 'none' },
    { id: 'trending-body-effect', wrapper: 'trending-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'pro-body-effect', wrapper: 'pro-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'mood-body-effect', wrapper: 'mood-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'mask-body-effect', wrapper: 'mask-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'selfie-body-effect', wrapper: 'selfie-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'dark-body-effect', wrapper: 'dark-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'image-body-effect', wrapper: 'image-body-effect-wrapper', importSortDisplay: 'none' },
    { id: 'featured-filter', wrapper: 'featured-filter-wrapper', importSortDisplay: 'none' },
    { id: 'pro-filter', wrapper: 'pro-filter-wrapper', importSortDisplay: 'none' },
    { id: 'life-filter', wrapper: 'life-filter-wrapper', importSortDisplay: 'none' },
    { id: 'scenery-filter', wrapper: 'scenery-filter-wrapper', importSortDisplay: 'none' },
    { id: 'movies-filter', wrapper: 'movies-filter-wrapper', importSortDisplay: 'none' },
    { id: 'retro-filter', wrapper: 'retro-filter-wrapper', importSortDisplay: 'none' },
    { id: 'style-filter', wrapper: 'style-filter-wrapper', importSortDisplay: 'none' },
];

effects.forEach(function(effect) {
    document.getElementById(effect.id).addEventListener('click', handleEffectClick(effect.wrapper, effect.importSortDisplay));
});
