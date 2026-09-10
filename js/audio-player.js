/**
 * ==============================================================================
 * MÓDULO DE REPRODUCTOR DE MÚSICA AMBIENTAL
 * ==============================================================================
 */

const audioPlayer = {
  audioEl: null,
  widgetEl: null,
  toggleBtn: null,
  isPlaying: false,
  initialized: false,

  init(musicConfig) {
    if (this.initialized) return;
    this.initialized = true;

    this.widgetEl = document.getElementById("music-player");
    this.toggleBtn = document.getElementById("music-toggle-btn");
    this.audioEl = document.getElementById("wedding-audio");

    if (!this.audioEl) {
      this.audioEl = new Audio();
      this.audioEl.id = "wedding-audio";
      this.audioEl.loop = true;
      document.body.appendChild(this.audioEl);
    }

    if (musicConfig && musicConfig.src) {
      this.audioEl.src = musicConfig.src;
    }

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener("click", () => this.toggle());
    }

    // Actualizar estado si el audio termina o se pausa externamente
    this.audioEl.addEventListener("play", () => this.setPlayingState(true));
    this.audioEl.addEventListener("pause", () => this.setPlayingState(false));

    // Fallback silencioso en caso de error de archivo
    this.audioEl.addEventListener("error", (e) => {
      console.warn("No se pudo cargar el archivo de audio especificado en config.js. Continuando sin música de fondo.", e);
      this.setPlayingState(false);
    });
  },

  async play() {
    if (!this.audioEl) return;
    try {
      await this.audioEl.play();
      this.setPlayingState(true);
    } catch (err) {
      // El navegador bloqueó el autoplay o requiere interacción previa
      console.log("Autoplay prevenido por la política de audio del navegador:", err);
      this.setPlayingState(false);
    }
  },

  pause() {
    if (!this.audioEl) return;
    this.audioEl.pause();
    this.setPlayingState(false);
  },

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  },

  setPlayingState(isPlaying) {
    this.isPlaying = isPlaying;
    if (!this.widgetEl || !this.toggleBtn) return;

    const playIcon = this.toggleBtn.querySelector(".icon-play");
    const pauseIcon = this.toggleBtn.querySelector(".icon-pause");

    if (isPlaying) {
      this.widgetEl.classList.add("playing");
      this.toggleBtn.setAttribute("aria-label", "Pausar música ambiental");
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
    } else {
      this.widgetEl.classList.remove("playing");
      this.toggleBtn.setAttribute("aria-label", "Reproducir música ambiental");
      if (playIcon) playIcon.style.display = "block";
      if (pauseIcon) pauseIcon.style.display = "none";
    }
  }
};

window.audioPlayer = audioPlayer;
