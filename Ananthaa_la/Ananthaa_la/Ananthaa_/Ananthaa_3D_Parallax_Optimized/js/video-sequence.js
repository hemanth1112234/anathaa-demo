// js/video-sequence.js
// Basic script for video controls (play/pause all videos on click)
document.addEventListener('DOMContentLoaded', function() {
    var videos = document.querySelectorAll('video');
    videos.forEach(function(video) {
        video.addEventListener('click', function() {
            if (video.paused) {
                // Pause all other videos
                videos.forEach(function(v) { if (v !== video) v.pause(); });
                video.play();
            } else {
                video.pause();
            }
        });
    });
});
