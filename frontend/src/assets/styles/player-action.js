var video = document.getElementById('player');
var playPauseBtn = document.getElementById('playPause');
var zoomBtn = document.getElementById('zoom');
var fullScreenBtn = document.getElementById('fullScreen');

    // Hàm phát/tạm dừng video
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
                'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                'stroke-linejoin="round" class="lucide lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/>' +
                '<rect x="6" y="4" width="4" height="16" rx="1"/>' +
                '</svg>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" \n' +
                '                                                 fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" \n' +
                '                                                 stroke-linejoin="round" class="lucide lucide-play">\n' +
                '                                                <polygon points="6 3 20 12 6 21 6 3"/>\n' +
                '                                            </svg>';
        }
    });

    fullScreenBtn.addEventListener('click', function() {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
    });
