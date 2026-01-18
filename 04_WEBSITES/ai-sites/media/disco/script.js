const progress = document.getElementById("progress");
const song = document.getElementById("song");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const nextButton = document.querySelector(".controls button.forward");
const prevButton = document.querySelector(".controls button.backward");
const songName = document.querySelector(".music-player h1");
const artistName = document.querySelector(".music-player p");

const songs = [
  {
    title: "Symphony",
    name: "Clean Bandit ft. Zara Larsson",
    source:
    Echoes of Yesterday_transcript.txt
    https://drive.google.com/file/d/1sK_gy7F4yEX-pIcb-N-Pp_prJmQgqRCu/view?usp=drivesdk
    Your DaYs i SaVe tHems by _avatararts _ Suno_transcript.txt
    https://drive.google.com/file/d/15FiPZad-k-SSwk5vgTW3Wr31ef3x8kYI/view?usp=drivesdk
    Whisper of the Willow_transcript.txt
    https://drive.google.com/file/d/1OIM-peMy-H3ersGaZxmTJBPCwUgyQPw0/view?usp=drivesdk
    No More Love Songs_transcript.txt
    https://drive.google.com/file/d/1I-8cSDrZ55cBJOBh_3EwrCG8RaLs0cj4/view?usp=drivesdk
    The Sound of Ancestors_transcript.txt
    https://drive.google.com/file/d/1b9ffDAaUpBhp4HxVZunJ2fJs6MfKW9L3/view?usp=drivesdk
    Moonly Alley_transcript.txt
    https://drive.google.com/file/d/1r2gkIucfoAmCvv5G5lgWxfSXH_tiocCr/view?usp=drivesdk
    Moonly Alley by _avatararts _ Suno_transcript.txt
    https://drive.google.com/file/d/1mfeUR0ST923fFe-WAnNp3fFlEhDe4tVm/view?usp=drivesdk
    Love is Rubbish, and Rubbish is Love_transcript.txt
    https://drive.google.com/file/d/1Ga8xjPKBMsQSIagMYAJCed0lQYzfZpnB/view?usp=drivesdk
    In_this_Alley_transcript.txt
    https://drive.google.com/file/d/1SkAmoytUqDl3VTQVc_3-SVzkudUTmzYB/view?usp=drivesdk
    Love in Imperfection_transcript.txt
    https://drive.google.com/file/d/1l6H4clBsW0rPflssXV67UApF9s8AzcDe/view?usp=drivesdk
    Moonlit Reverie_transcript.txt
    https://drive.google.com/file/d/1gXKWG_Dqu56VamPMzaDT_tuwuiO8LNKw/view?usp=drivesdk
    Heroes Rise  - Villains Overthrow_transcript.txt
    https://drive.google.com/file/d/1cI2kVZ-WB17zzUH0djiCnBKMwgDo4Nvr/view?usp=drivesdk
    Beautiful Mess_transcript.txt
    https://drive.google.com/file/d/1voGe1pvUnquoYRvroUUcIAclEProlbH_/view?usp=drivesdk
    Blues in the Alley Haunted Strings Nocturnal Notes_transcript.txt
    https://drive.google.com/file/d/1yeTHR_gR82QvP8xT0WzwDM54zpgO-3nt/view?usp=drivesdk
    Heartbeats in the Dark_transcript.txt
    https://drive.google.com/file/d/1idlUEnzwjTCcKVzRnZHbg7ImTvqLCije/view?usp=drivesdk"https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Clean-Bandit-Symphony.mp3",
  },
  {
    title: "Pawn It All",
    name: "Alicia Keys",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Pawn-It-All.mp3",
  },
  {
    title: "Seni Dert Etmeler",
    name: "Madrigal",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Madrigal-Seni-Dert-Etmeler.mp3",
  },
  {
    title: "Instant Crush",
    name: "Daft Punk ft. Julian Casablancas",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Daft-Punk-Instant-Crush.mp3",
  },
  {
    title: "As It Was",
    name: "Harry Styles",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Harry-Styles-As-It-Was.mp3",
  },

  {
    title: "Physical",
    name: "Dua Lipa",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Dua-Lipa-Physical.mp3",
  },
  {
    title: "Delicate",
    name: "Taylor Swift",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3",
  },
];

let currentSongIndex = 3;

function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title;
  artistName.textContent = songs[currentSongIndex].name;
  song.src = songs[currentSongIndex].source;

  song.addEventListener("loadeddata", () => {});
}

song.addEventListener("timeupdate", () => {
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});

song.addEventListener("loadedmetadata", () => {
  progress.max = song.duration;
  progress.value = song.currentTime;
});

song.addEventListener("ended", () => {
  currentSongIndex = (swiper.activeIndex + 1) % songs.length;
  updateSongInfo();
  swiper.slideTo(currentSongIndex); 
  playSong(); 
});

function pauseSong() {
  song.pause();
  controlIcon.classList.remove("fa-pause");
  controlIcon.classList.add("fa-play");
}

function playSong() {
  song.play();
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
}

function playPause() {
  if (song.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

playPauseButton.addEventListener("click", playPause);

progress.addEventListener("input", () => {
  song.currentTime = progress.value;
});

progress.addEventListener("change", () => {
  playSong();
});

nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

prevButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongInfo();
  playPause();
});

updateSongInfo();

var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  centeredSlides: true,
  initialSlide: 3,
  slidesPerView: "auto",
  grabCursor: true,
  spaceBetween: 40,
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 50,
    modifier: 1,
    slideShadows: false,
  },
  navigation: {
    nextEl: ".forward",
    prevEl: ".backward",
  },
});

swiper.on("slideChange", () => {
  currentSongIndex = swiper.activeIndex;
  updateSongInfo(); 
  playPause(); 
});