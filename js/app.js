let currentMedia = [];
let currentMediaIndex = 0;
let currentEpisodeIndex = 0;
let currentSeasonNumber = 1;
let isTrailer = false;
let slideshowTimer = null;
let isPaused = false;

const photoDuration = 3500;

/* ==================================================
   INITIAL PAGE SETUP
================================================== */

document.addEventListener("DOMContentLoaded", function () {
  buildEpisodes();
  createPlayer();
});

/* ==================================================
   EPISODE CARDS
================================================== */

function buildEpisodes() {
  buildTrailerCards();
  buildSeason1Cards();
  buildSeason2Cards();
}

function buildTrailerCards() {
  const trailerRow = document.getElementById("trailerRow");

  if (!trailerRow || typeof memories === "undefined") return;

  trailerRow.innerHTML = "";

  memories.trailer.forEach(function (item, index) {
    const card = document.createElement("div");
    card.className = "episode";

    card.innerHTML = `
      <div class="episode-thumbnail-wrapper">
        <img
          src="${item.folder}/1.jpg"
          class="episode-img"
          alt="${item.title}"
        >

        <div class="episode-play-icon">▶</div>
      </div>

      <h3>Trailer Part ${index + 1}</h3>
      <p>${item.title}</p>
    `;

    card.addEventListener("click", playTrailer);
    trailerRow.appendChild(card);
  });
}

function buildSeason1Cards() {
  const season1Row = document.getElementById("season1Row");

  if (!season1Row || typeof memories === "undefined") return;

  season1Row.innerHTML = "";

  memories.season1.forEach(function (item, index) {
    const card = document.createElement("div");
    card.className = "episode";

    card.innerHTML = `
      <div class="episode-thumbnail-wrapper">
        <img
          src="${item.folder}/1.jpg"
          class="episode-img"
          alt="${item.title}"
        >

        <div class="episode-play-icon">▶</div>
      </div>

      <h3>${item.episode}</h3>
      <p>${item.name}</p>
      <span>${item.title}</span>
    `;

    card.addEventListener("click", function () {
      playSeason1Episode(index);
    });

    season1Row.appendChild(card);
  });
}

function buildSeason2Cards() {
  const season2Row = document.getElementById("season2Row");

  if (!season2Row || typeof memories === "undefined") return;

  season2Row.innerHTML = "";

  memories.season2.forEach(function (item, index) {
    const card = document.createElement("div");

    if (item.released) {
      card.className = "episode season-two-episode";

      card.innerHTML = `
        <div class="episode-thumbnail-wrapper">
          <img
            src="${item.folder}/1.jpg"
            class="episode-img"
            alt="${item.title}"
          >

          <div class="episode-number-badge">
            ${item.episode}
          </div>

          <div class="video-included-badge">
            Includes Video
          </div>

          <div class="episode-play-icon">▶</div>
        </div>

        <h3>${item.episode}</h3>
        <p>${item.name}</p>
        <span>${item.title}</span>
      `;

      card.addEventListener("click", function () {
        playSeason2Episode(index);
      });
    } else {
      card.className = "episode coming-soon locked-episode";

      card.innerHTML = `
        <div class="coming-soon-thumbnail">
          <div class="lock-icon">♡</div>
          <strong>${item.title}</strong>
          <span>New episode</span>
        </div>

        <h3>${item.episode}</h3>
        <p>Coming Soon</p>
        <span>Releases ${item.releaseDate}</span>
      `;
    }

    season2Row.appendChild(card);
  });
}

/* ==================================================
   MEMORY PLAYER
================================================== */

function createPlayer() {
  if (document.getElementById("player")) return;

  const player = document.createElement("div");
  player.id = "player";
  player.className = "player";

  player.innerHTML = `
    <div class="player-top">
      <button
        type="button"
        class="close-player-button"
        onclick="closePlayer()"
        aria-label="Close player"
      >
        ×
      </button>
    </div>

    <div class="player-info" id="playerInfo">
      <h2 id="playerEpisode"></h2>
      <h1 id="playerTitle"></h1>
      <p id="playerMonth"></p>
    </div>

    <div class="media-stage" id="mediaStage">
      <img
        id="playerImage"
        class="player-image"
        alt="Memory"
      >

      <video
        id="playerVideo"
        class="player-video"
        controls
        playsinline
      ></video>
    </div>

    <div id="endingCard" class="ending-card">
      <h2 id="endingSmall"></h2>
      <h1 id="endingBig"></h1>
      <p id="endingText"></p>

      <button
        id="endingButton"
        type="button"
        onclick="handleEndingButton()"
      ></button>
    </div>

    <div class="controls" id="controls">
      <button type="button" onclick="previousMedia()">‹</button>

      <button
        type="button"
        onclick="togglePlay()"
        id="playPause"
      >
        Pause
      </button>

      <button type="button" onclick="nextMedia()">›</button>
    </div>

    <div class="progress" id="progress">
      <div id="progressBar"></div>
    </div>
  `;

  document.body.appendChild(player);

  const video = document.getElementById("playerVideo");

  if (!video) return;

  video.addEventListener("ended", nextMedia);

  video.addEventListener("play", function () {
    const playPauseButton =
      document.getElementById("playPause");

    if (playPauseButton) {
      playPauseButton.innerText = "Pause";
    }

    isPaused = false;
  });

  video.addEventListener("pause", function () {
    if (!video.ended) {
      const playPauseButton =
        document.getElementById("playPause");

      if (playPauseButton) {
        playPauseButton.innerText = "Play";
      }

      isPaused = true;
    }
  });
}

function playTrailer() {
  if (typeof memories === "undefined") return;

  isTrailer = true;
  currentSeasonNumber = 0;
  currentEpisodeIndex = 0;
  currentMedia = [];

  memories.trailer.forEach(function (month) {
    for (
      let number = 1;
      number <= month.count;
      number += 1
    ) {
      currentMedia.push({
        type: "image",
        src: `${month.folder}/${number}.jpg`
      });
    }
  });

  setPlayerInformation(
    "Official Trailer",
    "Our Story Begins",
    "September 2025 + October 2025"
  );

  openPlayer();
}

function playSeason1Episode(index) {
  if (
    typeof memories === "undefined" ||
    !memories.season1[index]
  ) {
    return;
  }

  const episode = memories.season1[index];

  isTrailer = false;
  currentSeasonNumber = 1;
  currentEpisodeIndex = index;
  currentMedia = [];

  for (
    let number = 1;
    number <= episode.count;
    number += 1
  ) {
    currentMedia.push({
      type: "image",
      src: `${episode.folder}/${number}.jpg`
    });
  }

  setPlayerInformation(
    episode.episode,
    episode.name,
    episode.title
  );

  openPlayer();
}

function playSeason2Episode(index) {
  if (
    typeof memories === "undefined" ||
    !memories.season2[index]
  ) {
    return;
  }

  const episode = memories.season2[index];

  if (!episode.released) return;

  isTrailer = false;
  currentSeasonNumber = 2;
  currentEpisodeIndex = index;

  currentMedia = Array.isArray(episode.media)
    ? episode.media
    : [];

  setPlayerInformation(
    `Season 2 • ${episode.episode}`,
    episode.name,
    episode.title
  );

  openPlayer();
}

function setPlayerInformation(episode, title, month) {
  const episodeElement =
    document.getElementById("playerEpisode");

  const titleElement =
    document.getElementById("playerTitle");

  const monthElement =
    document.getElementById("playerMonth");

  if (episodeElement) {
    episodeElement.innerText = episode;
  }

  if (titleElement) {
    titleElement.innerText = title;
  }

  if (monthElement) {
    monthElement.innerText = month;
  }
}

function openPlayer() {
  const player = document.getElementById("player");

  if (!player) return;

  stopAllMedia();

  currentMediaIndex = 0;
  isPaused = false;

  player.style.display = "flex";
  document.body.style.overflow = "hidden";

  const playerInfo =
    document.getElementById("playerInfo");

  const mediaStage =
    document.getElementById("mediaStage");

  const controls =
    document.getElementById("controls");

  const progress =
    document.getElementById("progress");

  const endingCard =
    document.getElementById("endingCard");

  const playPauseButton =
    document.getElementById("playPause");

  if (playerInfo) {
    playerInfo.style.display = "block";
  }

  if (mediaStage) {
    mediaStage.style.display = "flex";
  }

  if (controls) {
    controls.style.display = "flex";
  }

  if (progress) {
    progress.style.display = "block";
  }

  if (endingCard) {
    endingCard.style.display = "none";
  }

  if (playPauseButton) {
    playPauseButton.innerText = "Pause";
  }

  showCurrentMedia();
}

function showCurrentMedia() {
  stopAllMedia();

  const media = currentMedia[currentMediaIndex];

  const image =
    document.getElementById("playerImage");

  const video =
    document.getElementById("playerVideo");

  const playPauseButton =
    document.getElementById("playPause");

  if (!media) {
    endEpisode();
    return;
  }

  if (!image || !video) return;

  updateProgress();

  if (media.type === "video") {
    image.style.display = "none";

    video.style.display = "block";
    video.src = media.src;
    video.currentTime = 0;

    if (playPauseButton) {
      playPauseButton.innerText = "Pause";
    }

    video.play().catch(function (error) {
      console.error("Video could not play:", error);

      if (playPauseButton) {
        playPauseButton.innerText = "Play";
      }

      isPaused = true;
    });

    return;
  }

  video.style.display = "none";
  video.removeAttribute("src");
  video.load();

  image.style.display = "block";
  image.src = media.src;

  image.classList.remove("fade");
  void image.offsetWidth;
  image.classList.add("fade");

  if (playPauseButton) {
    playPauseButton.innerText = "Pause";
  }

  slideshowTimer = window.setTimeout(function () {
    nextMedia();
  }, photoDuration);
}

function updateProgress() {
  const progressBar =
    document.getElementById("progressBar");

  if (
    !progressBar ||
    currentMedia.length === 0
  ) {
    return;
  }

  const progress =
    ((currentMediaIndex + 1) /
      currentMedia.length) *
    100;

  progressBar.style.width = `${progress}%`;
}
function nextMedia() {
  stopAllMedia();

  if (
    currentMediaIndex <
    currentMedia.length - 1
  ) {
    currentMediaIndex += 1;
    showCurrentMedia();
  } else {
    endEpisode();
  }
}

function previousMedia() {
  stopAllMedia();

  if (currentMediaIndex > 0) {
    currentMediaIndex -= 1;
    showCurrentMedia();
  }
}

function togglePlay() {
  const currentItem =
    currentMedia[currentMediaIndex];

  const button =
    document.getElementById("playPause");

  const video =
    document.getElementById("playerVideo");

  if (!currentItem || !button || !video) return;

  if (currentItem.type === "video") {
    if (video.paused) {
      video.play().catch(function (error) {
        console.error(
          "Video could not play:",
          error
        );
      });

      button.innerText = "Pause";
      isPaused = false;
    } else {
      video.pause();
      button.innerText = "Play";
      isPaused = true;
    }

    return;
  }

  if (isPaused) {
    isPaused = false;
    button.innerText = "Pause";

    slideshowTimer =
      window.setTimeout(function () {
        nextMedia();
      }, photoDuration);
  } else {
    isPaused = true;
    button.innerText = "Play";
    window.clearTimeout(slideshowTimer);
  }
}

function stopAllMedia() {
  window.clearTimeout(slideshowTimer);
  slideshowTimer = null;

  const video =
    document.getElementById("playerVideo");

  if (video && !video.paused) {
    video.pause();
  }
}

function endEpisode() {
  stopAllMedia();

  const mediaStage =
    document.getElementById("mediaStage");

  const controls =
    document.getElementById("controls");

  const progress =
    document.getElementById("progress");

  const playerInfo =
    document.getElementById("playerInfo");

  if (mediaStage) {
    mediaStage.style.display = "none";
  }

  if (controls) {
    controls.style.display = "none";
  }

  if (progress) {
    progress.style.display = "none";
  }

  if (playerInfo) {
    playerInfo.style.display = "none";
  }

  if (typeof memories === "undefined") return;

  if (isTrailer) {
    showEndingCard(
      "Now Playing",
      "Season 1",
      "The story officially begins with November 2025.",
      "Start Episode 1"
    );

    return;
  }

  if (currentSeasonNumber === 1) {
    if (
      currentEpisodeIndex <
      memories.season1.length - 1
    ) {
      const nextEpisode =
        memories.season1[
          currentEpisodeIndex + 1
        ];

      showEndingCard(
        "Up Next",
        nextEpisode.episode,
        `${nextEpisode.name} • ${nextEpisode.title}`,
        "Next Episode →"
      );
    } else {
      showEndingCard(
        "Season 1 Complete",
        "Continue to Season 2",
        "The next chapter begins with May 2026.",
        "Start Season 2"
      );
    }

    return;
  }

  if (currentSeasonNumber === 2) {
    const nextReleasedIndex =
      findNextReleasedSeason2Episode(
        currentEpisodeIndex
      );

    if (nextReleasedIndex !== -1) {
      const nextEpisode =
        memories.season2[nextReleasedIndex];

      showEndingCard(
        "Up Next",
        nextEpisode.episode,
        `${nextEpisode.name} • ${nextEpisode.title}`,
        "Next Episode →"
      );
    } else {
      const nextComingSoon =
        memories.season2.find(
          function (episode) {
            return !episode.released;
          }
        );

      const endingText = nextComingSoon
        ? `The next episode releases ${nextComingSoon.releaseDate}.`
        : "Our story is still being written.";

      showEndingCard(
        "You Are All Caught Up",
        "More Memories Coming Soon",
        endingText,
        "Replay Episode"
      );
    }
  }
}

function showEndingCard(
  small,
  big,
  text,
  buttonText
) {
  const endingSmall =
    document.getElementById("endingSmall");

  const endingBig =
    document.getElementById("endingBig");

  const endingText =
    document.getElementById("endingText");

  const endingButton =
    document.getElementById("endingButton");

  const endingCard =
    document.getElementById("endingCard");

  if (endingSmall) {
    endingSmall.innerText = small;
  }

  if (endingBig) {
    endingBig.innerText = big;
  }

  if (endingText) {
    endingText.innerText = text;
  }

  if (endingButton) {
    endingButton.innerText = buttonText;
  }

  if (endingCard) {
    endingCard.style.display = "flex";
  }
}

function handleEndingButton() {
  if (typeof memories === "undefined") return;

  if (isTrailer) {
    playSeason1Episode(0);
    return;
  }

  if (currentSeasonNumber === 1) {
    if (
      currentEpisodeIndex <
      memories.season1.length - 1
    ) {
      playSeason1Episode(
        currentEpisodeIndex + 1
      );
    } else {
      playSeason2Episode(0);
    }

    return;
  }

  if (currentSeasonNumber === 2) {
    const nextReleasedIndex =
      findNextReleasedSeason2Episode(
        currentEpisodeIndex
      );

    if (nextReleasedIndex !== -1) {
      playSeason2Episode(nextReleasedIndex);
    } else {
      playSeason2Episode(
        currentEpisodeIndex
      );
    }
  }
}

function findNextReleasedSeason2Episode(
  startingIndex
) {
  if (typeof memories === "undefined") {
    return -1;
  }

  for (
    let index = startingIndex + 1;
    index < memories.season2.length;
    index += 1
  ) {
    if (memories.season2[index].released) {
      return index;
    }
  }

  return -1;
}

function closePlayer() {
  stopAllMedia();

  const player =
    document.getElementById("player");

  const video =
    document.getElementById("playerVideo");

  if (video) {
    video.removeAttribute("src");
    video.load();
  }

  if (player) {
    player.style.display = "none";
  }

  document.body.style.overflow = "";
}

/* ==================================================
   MORE INFO MODAL
================================================== */

function openMoreInfo() {
  const modal =
    document.getElementById("infoModal");

  if (!modal) return;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeMoreInfo() {
  const modal =
    document.getElementById("infoModal");

  if (!modal) return;

  modal.classList.remove("open");
  document.body.style.overflow = "";
}

/* ==================================================
   END CREDITS
================================================== */

let creditsEndingTimer = null;
let creditsAreOpen = false;

function openCredits() {
  const creditsModal =
    document.getElementById("creditsModal");

  const scrollingCredits =
    document.getElementById("scrollingCredits") ||
    document.querySelector(".scrolling-credits");

  const finalLine =
    document.getElementById("finalLine");

  if (!creditsModal || !scrollingCredits) {
    return;
  }

  window.clearTimeout(creditsEndingTimer);

  creditsAreOpen = true;

  if (finalLine) {
    finalLine.classList.remove("revealed");
  }

  creditsModal.classList.add("open");

  creditsModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  scrollingCredits.style.animation =
    "none";

  void scrollingCredits.offsetHeight;

  scrollingCredits.style.animation =
    "creditsRise 20s linear both";

  window.setTimeout(function () {
    if (
      creditsAreOpen &&
      finalLine
    ) {
      finalLine.classList.add(
        "revealed"
      );
    }
  }, 16500);

  creditsEndingTimer =
    window.setTimeout(function () {
      if (
        creditsAreOpen &&
        typeof window.startFinalEnding ===
          "function"
      ) {
        window.startFinalEnding();
      }
    }, 20000);
}

function closeCredits() {
  const creditsModal =
    document.getElementById("creditsModal");

  const scrollingCredits =
    document.getElementById("scrollingCredits") ||
    document.querySelector(".scrolling-credits");

  const finalLine =
    document.getElementById("finalLine");

  creditsAreOpen = false;

  window.clearTimeout(creditsEndingTimer);
  creditsEndingTimer = null;

  if (scrollingCredits) {
    scrollingCredits.style.animation =
      "none";
  }

  if (finalLine) {
    finalLine.classList.remove(
      "revealed"
    );
  }

  if (creditsModal) {
    creditsModal.classList.remove(
      "open"
    );

    creditsModal.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  document.body.style.overflow = "";
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const openCreditsButton =
      document.getElementById(
        "openCreditsButton"
      );

    const creditsCloseButton =
      document.getElementById(
        "creditsCloseButton"
      );

    if (openCreditsButton) {
      openCreditsButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          openCredits();
        }
      );
    }

    if (creditsCloseButton) {
      creditsCloseButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();
          closeCredits();
        }
      );
    }
  }
);

/* ==================================================
   KEYBOARD AND MODAL CONTROLS
================================================== */

document.addEventListener(
  "keydown",
  function (event) {
    const player =
      document.getElementById("player");

    const playerIsOpen =
      player &&
      player.style.display === "flex";

    if (event.key === "Escape") {
      if (playerIsOpen) {
        closePlayer();
      }

      closeMoreInfo();
      closeCredits();

      const loveNoteModal =
        document.getElementById(
          "loveNoteModal"
        );

      if (loveNoteModal) {
        loveNoteModal.classList.remove(
          "open"
        );

        loveNoteModal.setAttribute(
          "aria-hidden",
          "true"
        );
      }
    }

    if (!playerIsOpen) return;

    if (event.key === "ArrowRight") {
      nextMedia();
    }

    if (event.key === "ArrowLeft") {
      previousMedia();
    }

    if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    }
  }
);

document.addEventListener(
  "click",
  function (event) {
    const infoModal =
      document.getElementById("infoModal");

    const creditsModal =
      document.getElementById(
        "creditsModal"
      );

    if (
      infoModal &&
      event.target === infoModal
    ) {
      closeMoreInfo();
    }

    if (
      creditsModal &&
      event.target === creditsModal
    ) {
      closeCredits();
    }
  }
);
/* ==================================================
   CHRIS & GABY NAVIGATION BAR
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const navbar =
      document.getElementById(
        "memoryNavbar"
      );

    const navigationLinks =
      document.querySelectorAll(
        ".nav-link"
      );

    const scrollLinks =
      document.querySelectorAll(
        ".nav-scroll-link"
      );

    scrollLinks.forEach(function (link) {
      link.addEventListener(
        "click",
        function (event) {
          const sectionName =
            link.getAttribute("href");

          const targetSection =
            document.querySelector(
              sectionName
            );

          if (!targetSection) {
            console.error(
              "Section not found:",
              sectionName
            );

            return;
          }

          event.preventDefault();

          const navbarHeight = navbar
            ? navbar.offsetHeight
            : 0;

          const targetPosition =
            targetSection
              .getBoundingClientRect()
              .top +
            window.scrollY -
            navbarHeight -
            12;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
          });
        }
      );
    });

    function updateNavbarBackground() {
      if (!navbar) return;

      navbar.classList.toggle(
        "scrolled",
        window.scrollY > 35
      );
    }

    function updateActiveNavigationLink() {
      const sections = [
        document.getElementById("home"),
        document.getElementById(
          "season1"
        ),
        document.getElementById(
          "season2"
        ),
        document.getElementById(
          "credits"
        )
      ].filter(Boolean);

      let currentSectionId = "home";

      sections.forEach(function (section) {
        const sectionTop =
          section.offsetTop - 180;

        if (
          window.scrollY >= sectionTop
        ) {
          currentSectionId = section.id;
        }
      });

      navigationLinks.forEach(
        function (link) {
          const linkSectionId = link
            .getAttribute("href")
            .replace("#", "");

          link.classList.toggle(
            "active",
            linkSectionId ===
              currentSectionId
          );
        }
      );
    }

    window.addEventListener(
      "scroll",
      function () {
        updateNavbarBackground();
        updateActiveNavigationLink();
      }
    );

    updateNavbarBackground();
    updateActiveNavigationLink();
  }
);

/* ==================================================
   CINEMATIC ANNIVERSARY EXPERIENCE
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const intro =
      document.getElementById("siteIntro");

    const music =
      document.getElementById(
        "backgroundMusic"
      );

    const musicButton =
      document.getElementById(
        "musicToggle"
      );

    const musicIcon =
      document.getElementById(
        "musicIcon"
      );

    const secretHeart =
      document.getElementById(
        "secretHeart"
      );

    const loveNoteModal =
      document.getElementById(
        "loveNoteModal"
      );

    const loveNoteClose =
      document.getElementById(
        "loveNoteClose"
      );

    const heroArea =
      document.getElementById("home");

    const butterflyMessage =
      document.getElementById(
        "butterflyMessage"
      );

    const watchingMessage =
      document.getElementById(
        "watchingMessage"
      );

    const finalEnding =
      document.getElementById(
        "finalEnding"
      );

    const sections =
      document.querySelectorAll(
        ".season, .credits-preview"
      );

    let preferredMusicVolume = 0.18;
    let butterflyTimer = null;
    let endingStarted = false;
    let activeFadeInterval = null;

    /* ----------------------------------------------
       Opening animation
    ---------------------------------------------- */

    if (intro) {
      document.body.style.overflow =
        "hidden";

      const netflixSound =
        document.getElementById(
          "netflixIntro"
        );

      if (netflixSound) {
        netflixSound.volume = 1;
        netflixSound.currentTime = 0;

        netflixSound
          .play()
          .catch(function (error) {
            console.log(
              "Intro sound was blocked by the browser:",
              error
            );
          });
      }

      window.setTimeout(function () {
        intro.classList.add(
          "intro-finished"
        );

        if (music) {
          music.volume = 0;

          music
            .play()
            .then(function () {
              fadeAudio(
                music,
                preferredMusicVolume,
                2500
              );

              updateMusicButton();
            })
            .catch(function (error) {
              console.log(
                "Background music is waiting for a click:",
                error
              );

              updateMusicButton();
            });
        }

        document.body.style.overflow =
          "";

        window.setTimeout(function () {
          intro.remove();
        }, 1300);
      }, 3900);
    }

    /* ----------------------------------------------
       Audio fading helper
    ---------------------------------------------- */

    function fadeAudio(
      audio,
      targetVolume,
      duration,
      callback
    ) {
      if (!audio) return;

      if (activeFadeInterval) {
        window.clearInterval(
          activeFadeInterval
        );

        activeFadeInterval = null;
      }

      const startVolume =
        audio.volume;

      const volumeDifference =
        targetVolume - startVolume;

      const steps = 25;

      const stepDuration =
        Math.max(
          duration / steps,
          20
        );

      let currentStep = 0;

      activeFadeInterval =
        window.setInterval(
          function () {
            currentStep += 1;

            const progress =
              currentStep / steps;

            audio.volume = Math.max(
              0,
              Math.min(
                1,
                startVolume +
                  volumeDifference *
                    progress
              )
            );

            if (
              currentStep >= steps
            ) {
              window.clearInterval(
                activeFadeInterval
              );

              activeFadeInterval = null;
              audio.volume =
                targetVolume;

              if (
                typeof callback ===
                "function"
              ) {
                callback();
              }
            }
          },
          stepDuration
        );
    }

    function updateMusicButton() {
      if (
        !music ||
        !musicIcon ||
        !musicButton
      ) {
        return;
      }

      if (music.paused) {
        musicIcon.textContent = "🔇";

        musicButton.title =
          "Play music";
      } else {
        musicIcon.textContent = "🔊";

        musicButton.title =
          "Pause music";
      }
    }

    /* ----------------------------------------------
       Music button
    ---------------------------------------------- */

    if (music) {
      music.volume = 0;
    }

    if (musicButton && music) {
      musicButton.addEventListener(
        "click",
        function () {
          if (music.paused) {
            music.volume = 0;

            music
              .play()
              .then(function () {
                fadeAudio(
                  music,
                  preferredMusicVolume,
                  2200
                );

                updateMusicButton();
              })
              .catch(function (error) {
                console.error(
                  "Music could not play:",
                  error
                );
              });
          } else {
            fadeAudio(
              music,
              0,
              600,
              function () {
                music.pause();
                updateMusicButton();
              }
            );
          }
        }
      );
    }

    updateMusicButton();

    /* ----------------------------------------------
       Lower music while videos play
    ---------------------------------------------- */

    function connectVideoEvents() {
      const videos =
        document.querySelectorAll(
          "video"
        );

      videos.forEach(
        function (video) {
          if (
            video.dataset
              .musicConnected ===
            "true"
          ) {
            return;
          }

          video.dataset.musicConnected =
            "true";

          video.addEventListener(
            "play",
            function () {
              if (
                music &&
                !music.paused
              ) {
                fadeAudio(
                  music,
                  0.025,
                  600
                );
              }
            }
          );

          video.addEventListener(
            "pause",
            function () {
              if (
                music &&
                !music.paused &&
                !video.ended
              ) {
                fadeAudio(
                  music,
                  preferredMusicVolume,
                  900
                );
              }
            }
          );

          video.addEventListener(
            "ended",
            function () {
              if (
                music &&
                !music.paused
              ) {
                fadeAudio(
                  music,
                  preferredMusicVolume,
                  1100
                );
              }
            }
          );
        }
      );
    }

    connectVideoEvents();

    const videoObserver =
      new MutationObserver(
        function () {
          connectVideoEvents();
        }
      );

    videoObserver.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );

    /* ----------------------------------------------
       Hidden navbar heart message
    ---------------------------------------------- */

    function openLoveNote() {
      if (!loveNoteModal) return;

      loveNoteModal.classList.add(
        "open"
      );

      loveNoteModal.setAttribute(
        "aria-hidden",
        "false"
      );
    }

    function closeLoveNote() {
      if (!loveNoteModal) return;

      loveNoteModal.classList.remove(
        "open"
      );

      loveNoteModal.setAttribute(
        "aria-hidden",
        "true"
      );
    }

    if (secretHeart) {
      secretHeart.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          event.stopPropagation();

          openLoveNote();
        }
      );
    }

    if (loveNoteClose) {
      loveNoteClose.addEventListener(
        "click",
        closeLoveNote
      );
    }

    if (loveNoteModal) {
      loveNoteModal.addEventListener(
        "click",
        function (event) {
          if (
            event.target ===
            loveNoteModal
          ) {
            closeLoveNote();
          }
        }
      );
    }
        /* ----------------------------------------------
       Double-click hero butterfly surprise
    ---------------------------------------------- */

    if (
      heroArea &&
      butterflyMessage
    ) {
      heroArea.addEventListener(
        "dblclick",
        function (event) {
          if (
            event.target.closest(
              "button"
            ) ||
            event.target.closest("a")
          ) {
            return;
          }

          window.clearTimeout(
            butterflyTimer
          );

          butterflyMessage.style.display =
            "block";

          void butterflyMessage.offsetWidth;

          butterflyMessage.classList.add(
            "show"
          );

          butterflyTimer =
            window.setTimeout(
              function () {
                butterflyMessage
                  .classList.remove(
                    "show"
                  );

                window.setTimeout(
                  function () {
                    butterflyMessage
                      .style.display =
                      "none";
                  },
                  450
                );
              },
              3500
            );
        }
      );
    }

    /* ----------------------------------------------
       Press L for floating hearts
    ---------------------------------------------- */

    function createFloatingHearts() {
      const heartCharacters = [
        "❤️",
        "💕",
        "💗",
        "💖",
        "💘"
      ];

      for (
        let index = 0;
        index < 28;
        index += 1
      ) {
        const heart =
          document.createElement(
            "span"
          );

        heart.className =
          "floating-heart";

        heart.textContent =
          heartCharacters[
            Math.floor(
              Math.random() *
                heartCharacters.length
            )
          ];

        heart.style.left =
          `${Math.random() * 100}vw`;

        heart.style.fontSize =
          `${18 +
            Math.random() * 26}px`;

        heart.style.animationDuration =
          `${4 +
            Math.random() * 4}s`;

        heart.style.animationDelay =
          `${Math.random() *
            1.8}s`;

        document.body.appendChild(
          heart
        );

        window.setTimeout(
          function () {
            heart.remove();
          },
          10000
        );
      }
    }

    document.addEventListener(
      "keydown",
      function (event) {
        const activeElement =
          document.activeElement;

        const userIsTyping =
          activeElement &&
          (
            activeElement.tagName ===
              "INPUT" ||
            activeElement.tagName ===
              "TEXTAREA"
          );

        if (
          event.key.toLowerCase() ===
            "l" &&
          !userIsTyping
        ) {
          createFloatingHearts();
        }

        if (
          event.key === "Escape"
        ) {
          closeLoveNote();
        }
      }
    );

    /* ----------------------------------------------
       Reveal sections while scrolling
    ---------------------------------------------- */

    if (
      "IntersectionObserver" in
      window
    ) {
      const sectionObserver =
        new IntersectionObserver(
          function (entries) {
            entries.forEach(
              function (entry) {
                if (
                  entry.isIntersecting
                ) {
                  entry.target
                    .classList.add(
                      "section-visible"
                    );

                  sectionObserver
                    .unobserve(
                      entry.target
                    );
                }
              }
            );
          },
          {
            threshold: 0.14
          }
        );

      sections.forEach(
        function (section) {
          sectionObserver.observe(
            section
          );
        }
      );
    } else {
      sections.forEach(
        function (section) {
          section.classList.add(
            "section-visible"
          );
        }
      );
    }

    /* ----------------------------------------------
       Ten-minute watching message
    ---------------------------------------------- */

    window.setTimeout(
      function () {
        if (!watchingMessage) return;

        watchingMessage.classList.add(
          "show"
        );

        window.setTimeout(
          function () {
            watchingMessage
              .classList.remove(
                "show"
              );
          },
          6000
        );
      },
      10 * 60 * 1000
    );

    /* ----------------------------------------------
       Stagger episode-card animations
    ---------------------------------------------- */

    window.setTimeout(
      function () {
        const episodeCards =
          document.querySelectorAll(
            ".episode-card, .episode, .memory-card"
          );

        episodeCards.forEach(
          function (card, index) {
            card.style.animationDelay =
              `${Math.min(
                index * 0.08,
                1.2
              )}s`;
          }
        );
      },
      300
    );

    /* ----------------------------------------------
       Final cinematic ending
    ---------------------------------------------- */

    window.startFinalEnding =
      function () {
        if (
          !finalEnding ||
          endingStarted
        ) {
          return;
        }

        endingStarted = true;

        closeCredits();

        finalEnding.classList.add(
          "open"
        );

        finalEnding.setAttribute(
          "aria-hidden",
          "false"
        );

        document.body.style.overflow =
          "hidden";

        window.setTimeout(
          function () {
            finalEnding.classList.add(
              "play"
            );
          },
          150
        );

        window.setTimeout(
          function () {
            finalEnding.classList.remove(
              "open",
              "play"
            );

            finalEnding.setAttribute(
              "aria-hidden",
              "true"
            );

            document.body.style.overflow =
              "";

            endingStarted = false;
          },
          9300
        );
      };
  }
);

/* ==================================================
   HERO BUTTERFLY SECRET
================================================== */

document.addEventListener("DOMContentLoaded", function () {
    const secretButterfly =
        document.getElementById("secretButterfly");

    const butterflyMessage =
        document.getElementById("butterflyMessage");

    const butterflyOverlay =
        document.getElementById("butterflySecretOverlay");

    const butterflyClose =
        document.getElementById("butterflySecretClose");

    const butterflyEffects =
        document.getElementById("butterflyEffects");

    if (!secretButterfly || !butterflyOverlay) {
        return;
    }

    let butterflyOpening = false;

    function randomNumber(minimum, maximum) {
        return (
            Math.random() *
            (maximum - minimum) +
            minimum
        );
    }

    function clearButterflyEffects() {
        if (butterflyEffects) {
            butterflyEffects.innerHTML = "";
        }
    }

    function createButterflies() {
        if (!butterflyEffects) {
            return;
        }

        for (
            let index = 0;
            index < 12;
            index += 1
        ) {
            const butterfly =
                document.createElement("span");

            butterfly.className =
                "secret-butterfly-effect";

            butterfly.textContent = "🦋";

            butterfly.style.left =
                `${randomNumber(4, 94)}%`;

            butterfly.style.bottom =
                `${randomNumber(-5, 18)}%`;

            butterfly.style.animationDelay =
                `${randomNumber(0, 1.4)}s`;

            butterfly.style.animationDuration =
                `${randomNumber(4.8, 7.2)}s`;

            butterfly.style.fontSize =
                `${randomNumber(22, 43)}px`;

            butterflyEffects.appendChild(
                butterfly
            );
        }
    }

    function createSparkles() {
        if (!butterflyEffects) {
            return;
        }

        for (
            let index = 0;
            index < 30;
            index += 1
        ) {
            const sparkle =
                document.createElement("span");

            sparkle.className =
                "secret-sparkle";

            sparkle.style.left =
                `${randomNumber(4, 96)}%`;

            sparkle.style.top =
                `${randomNumber(4, 96)}%`;

            sparkle.style.animationDelay =
                `${randomNumber(0, 2)}s`;

            sparkle.style.animationDuration =
                `${randomNumber(2, 4)}s`;

            butterflyEffects.appendChild(
                sparkle
            );
        }
    }

    function createSecretFloatingHearts() {
        if (!butterflyEffects) {
            return;
        }

        for (
            let index = 0;
            index < 10;
            index += 1
        ) {
            const heart =
                document.createElement("span");

            heart.className =
                "secret-floating-heart";

            heart.textContent =
                index % 3 === 0
                    ? "♡"
                    : "♥";

            heart.style.left =
                `${randomNumber(3, 97)}%`;

            heart.style.animationDelay =
                `${randomNumber(0, 2.2)}s`;

            heart.style.animationDuration =
                `${randomNumber(5, 8)}s`;

            heart.style.fontSize =
                `${randomNumber(17, 34)}px`;

            butterflyEffects.appendChild(
                heart
            );
        }
    }

    function showButterflyMessage() {
        if (!butterflyMessage) {
            return;
        }

        butterflyMessage.style.display =
            "block";

        butterflyMessage.classList.remove(
            "show"
        );

        void butterflyMessage.offsetWidth;

        butterflyMessage.classList.add(
            "show"
        );

        butterflyMessage.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    function hideButterflyMessage() {
        if (!butterflyMessage) {
            return;
        }

        butterflyMessage.classList.remove(
            "show"
        );

        butterflyMessage.setAttribute(
            "aria-hidden",
            "true"
        );

        window.setTimeout(function () {
            if (
                !butterflyMessage.classList.contains(
                    "show"
                )
            ) {
                butterflyMessage.style.display =
                    "none";
            }
        }, 450);
    }

    function openButterflySecret() {
        if (butterflyOpening) {
            return;
        }

        butterflyOpening = true;

        showButterflyMessage();

        secretButterfly.classList.add(
            "clicked"
        );

        window.setTimeout(function () {
            clearButterflyEffects();

            butterflyOverlay.classList.add(
                "open"
            );

            butterflyOverlay.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.classList.add(
                "modal-open"
            );

            createButterflies();
            createSparkles();
            createSecretFloatingHearts();

            hideButterflyMessage();

            butterflyOpening = false;
        }, 850);
    }

    function closeButterflySecret() {
        butterflyOpening = false;

        butterflyOverlay.classList.remove(
            "open"
        );

        butterflyOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        secretButterfly.classList.remove(
            "clicked"
        );

        document.body.classList.remove(
            "modal-open"
        );

        hideButterflyMessage();

        window.setTimeout(function () {
            clearButterflyEffects();
        }, 550);
    }

    secretButterfly.addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            event.stopPropagation();

            openButterflySecret();
        }
    );

    if (butterflyClose) {
        butterflyClose.addEventListener(
            "click",
            function (event) {
                event.preventDefault();
                event.stopPropagation();

                closeButterflySecret();
            }
        );
    }

    butterflyOverlay.addEventListener(
        "click",
        function (event) {
            if (
                event.target ===
                butterflyOverlay
            ) {
                closeButterflySecret();
            }
        }
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                butterflyOverlay.classList.contains(
                    "open"
                )
            ) {
                event.preventDefault();
                event.stopImmediatePropagation();

                closeButterflySecret();
            }
        },
        true
    );
});
/* ==================================================
   GLOBAL BUTTON CONNECTIONS
================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const moreInfoButton =
      document.getElementById(
        "moreInfoButton"
      );

    const infoCloseButton =
      document.getElementById(
        "infoCloseButton"
      );

    const playTrailerButton =
      document.getElementById(
        "playTrailerButton"
      );

    if (moreInfoButton) {
      moreInfoButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          openMoreInfo();
        }
      );
    }

    if (infoCloseButton) {
      infoCloseButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          closeMoreInfo();
        }
      );
    }

    if (playTrailerButton) {
      playTrailerButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          playTrailer();
        }
      );
    }
  }
);

/* ==================================================
   CLOSE OPEN EXPERIENCES WHEN PAGE IS HIDDEN
================================================== */

document.addEventListener(
  "visibilitychange",
  function () {
    if (!document.hidden) return;

    const player =
      document.getElementById("player");

    const video =
      document.getElementById(
        "playerVideo"
      );

    if (
      player &&
      player.style.display === "flex"
    ) {
      window.clearTimeout(
        slideshowTimer
      );

      if (
        video &&
        !video.paused
      ) {
        video.pause();
      }

      isPaused = true;

      const playPauseButton =
        document.getElementById(
          "playPause"
        );

      if (playPauseButton) {
        playPauseButton.innerText =
          "Play";
      }
    }
  }
);

/* ==================================================
   IMAGE ERROR HANDLING
================================================== */

document.addEventListener(
  "error",
  function (event) {
    const target = event.target;

    if (
      !target ||
      target.tagName !== "IMG"
    ) {
      return;
    }

    if (
      target.dataset.errorHandled ===
      "true"
    ) {
      return;
    }

    target.dataset.errorHandled =
      "true";

    console.error(
      "Image could not be loaded:",
      target.src
    );

    target.classList.add(
      "image-load-error"
    );
  },
  true
);

/* ==================================================
   FINAL PAGE CLEANUP
================================================== */

window.addEventListener(
  "beforeunload",
  function () {
    window.clearTimeout(
      slideshowTimer
    );

    window.clearTimeout(
      creditsEndingTimer
    );

    const videos =
      document.querySelectorAll(
        "video"
      );

    videos.forEach(
      function (video) {
        video.pause();
      }
    );
  }
);
