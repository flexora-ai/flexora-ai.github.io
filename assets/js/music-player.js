/* music-player.js
   Floating play/pause button for background music.
   - Remembers on/off state across page navigation (localStorage)
   - Track filename can be changed per-page via data-track attribute on the
     script tag or the CSS var below (see instructions)
*/
(function () {
  var STORAGE_KEY = "flexora_music_on";
  var DEFAULT_TRACK = "assets/audio/pulse-vector.mp3";

  document.addEventListener("DOMContentLoaded", function () {
    var scriptTag = document.currentScript || document.querySelector('script[src*="music-player.js"]');
    var track = (scriptTag && scriptTag.getAttribute("data-track")) || DEFAULT_TRACK;

    var audio = document.createElement("audio");
    audio.src = track;
    audio.loop = true;
    audio.preload = "none";
    document.body.appendChild(audio);

    var btn = document.createElement("button");
    btn.id = "music-toggle-btn";
    btn.setAttribute("aria-label", "Toggle background music");
    btn.innerHTML = "&#9835;"; // music note
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      border: "none",
      background: "#111",
      color: "#fff",
      fontSize: "20px",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      opacity: "0.85"
    });
    document.body.appendChild(btn);

    function setPlayingUI(isPlaying) {
      btn.style.opacity = isPlaying ? "1" : "0.6";
      btn.innerHTML = isPlaying ? "&#9835;" : "&#9835;&#65039;&#8288;"; // subtle visual diff
      btn.title = isPlaying ? "Music: on (click to pause)" : "Music: off (click to play)";
    }

    function play() {
      audio.play().then(function () {
        localStorage.setItem(STORAGE_KEY, "1");
        setPlayingUI(true);
      }).catch(function () {
        // Autoplay blocked - wait for the click that's already happening
      });
    }

    function pause() {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, "0");
      setPlayingUI(false);
    }

    btn.addEventListener("click", function () {
      if (audio.paused) {
        play();
      } else {
        pause();
      }
    });

    // Resume automatically on this page if it was on from a previous page
    if (localStorage.getItem(STORAGE_KEY) === "1") {
      play();
    } else {
      setPlayingUI(false);
    }
  });
})();
