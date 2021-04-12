
const videoContainer = document.getElementById("jsVideoContainer");
const controlbar = document.querySelector(".videoControls");
const videoPlayer = document.querySelector("video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");

let previousVol = 50;
let mousedown = false;

function handleProgress() {
    const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * videoPlayer.duration;
    videoPlayer.currentTime = scrubTime;
}

function handleSpaceKey(event) {
    const keyCode = event.keyCode;

    if (keyCode === 32) {
        handlePlayClick();
    }
}

// function handleBlur() {
//     console.log("i am focused out!");
//     window.addEventListener("keydown", handleSpaceKey);
// }

// function handleFocus() {
//     console.log("i am focused!");
//     .addEventListener("keydown", handleSpaceKey);
// }

function downControlbar() {
    controlbar.style.opacity = "0";
    videoContainer.style.cursor = "none";
    videoContainer.addEventListener("mousemove", upControlbar);
}

function upControlbar() {
    videoContainer.removeEventListener("mousemove", upControlbar);
    controlbar.style.opacity = "1";
    videoContainer.style.cursor = "auto";
    setTimeout(downControlbar, 5000);
}

function downVolumeRange() {
    volumeBtn.addEventListener("mouseenter", upVolumeRange);
    volumeRange.style.display = "none";
}

function upVolumeRange() {
    volumeBtn.removeEventListener("mouseenter", upVolumeRange);
    volumeRange.style.display = "flex";
    setTimeout(downVolumeRange, 3000);
}

function handlePlayClick() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function handleVolumeClick() {
    if (videoPlayer.volume === 0) {
        videoPlayer.volume = previousVol;
        volumeRange.value = videoPlayer.volume;
        if (previousVol >= 0.6) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else if (previousVol >= 0.1) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        }
    } else {
        previousVol = videoPlayer.volume;
        videoPlayer.volume = 0;
        volumeRange.value = videoPlayer.volume;

        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

const formatDate = (seconds) => {
    const secondsNumber = parseInt(seconds, 10);
    let hours = Math.floor(secondsNumber / 3600);
    let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
    let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

    if (hours < 10) {
        hours = `0${hours}`;
    }
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    if (totalSeconds < 10) {
        totalSeconds = `0${totalSeconds}`;
    }

    if (hours === "00") {
        return `${minutes}:${totalSeconds}`;
    } else {
        return `${hours}:${minutes}:${totalSeconds}`;
    }
};

function setCurrentTime() {
    currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
    handleProgress();
}

function handleEnded() {
    videoPlayer.currentTime = 0;
    videoPlayer.play();
}

function handleDrag(event) {
    const {
        target: { value },
    } = event;

    videoPlayer.volume = value;

    if (value >= 0.6) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else if (value >= 0.1) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

function init() {
    videoPlayer.volume = 0.5;
    videoPlayer.onloadedmetadata = function () {
        totalTime.innerHTML = formatDate(Math.floor(videoPlayer.duration));
    };
    videoContainer.addEventListener("keydown", handleSpaceKey);
    // videoContainer.addEventListener("focus", handleFocus);
    // videoContainer.addEventListener("blur", handleBlur);
    videoContainer.addEventListener("mousemove", upControlbar);
    playBtn.addEventListener("click", handlePlayClick);
    volumeBtn.addEventListener("click", handleVolumeClick);
    volumeBtn.addEventListener("mouseenter", upVolumeRange);

    videoPlayer.addEventListener("timeupdate", setCurrentTime);
    videoPlayer.addEventListener("ended", handleEnded);
    volumeRange.addEventListener("input", handleDrag);

    progress.addEventListener("click", scrub);
    progress.addEventListener("mousemove", (e) => {
        mousedown && scrub(e);
    });
    progress.addEventListener("mousedown", () => (mousedown = true));
    progress.addEventListener("mouseup", () => (mousedown = false));
}

init();
