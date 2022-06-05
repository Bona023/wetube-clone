const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");

let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "play" : "pause";
};

const handelMuteClick = (e) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handelVolumeChange = (event) => {
    const {
        target: { value },
    } = event;
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    if (Number(value) === 0) {
        muteBtn.innerText = "Unmute";
        video.muted = true;
    } else {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handelMuteClick);
volumeRange.addEventListener("input", handelVolumeChange);
