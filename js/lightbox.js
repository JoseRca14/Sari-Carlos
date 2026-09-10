/**
 * ==============================================================================
 * MÓDULO DE LIGHTBOX FOTOGRÁFICO CON SOPORTE TÁCTIL Y DE TECLADO
 * ==============================================================================
 */

const galleryLightbox = {
  items: [],
  currentIndex: 0,
  modalEl: null,
  imageEl: null,
  captionEl: null,
  counterEl: null,
  touchStartX: 0,
  touchEndX: 0,

  init(galleryData) {
    this.items = galleryData || [];
    this.modalEl = document.getElementById("gallery-lightbox");
    this.imageEl = document.getElementById("lightbox-img");
    this.captionEl = document.getElementById("lightbox-caption");
    this.counterEl = document.getElementById("lightbox-counter");

    if (!this.modalEl) return;

    // Botones de control
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    if (closeBtn) closeBtn.addEventListener("click", () => this.close());
    if (prevBtn) prevBtn.addEventListener("click", () => this.prev());
    if (nextBtn) nextBtn.addEventListener("click", () => this.next());

    // Cierre al hacer clic en el fondo oscuro
    this.modalEl.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Navegación con teclado
    document.addEventListener("keydown", (e) => {
      if (!this.modalEl.classList.contains("active")) return;
      if (e.key === "Escape") this.close();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "ArrowRight") this.next();
    });

    // Soporte táctil (Swipe) para teléfonos móviles
    this.modalEl.addEventListener("touchstart", (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.modalEl.addEventListener("touchend", (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  },

  open(index) {
    if (!this.items || this.items.length === 0) return;
    this.currentIndex = (index >= 0 && index < this.items.length) ? index : 0;
    this.updateContent();
    this.modalEl.classList.add("active");
    document.body.style.overflow = "hidden";
  },

  close() {
    this.modalEl.classList.remove("active");
    document.body.style.overflow = "";
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.updateContent();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.updateContent();
  },

  updateContent() {
    const item = this.items[this.currentIndex];
    if (!item) return;

    if (this.imageEl) {
      this.imageEl.src = item.src;
      this.imageEl.alt = item.alt || "Fotografía de boda";
    }

    if (this.captionEl) {
      this.captionEl.textContent = item.caption || "";
    }

    if (this.counterEl) {
      this.counterEl.textContent = `${this.currentIndex + 1} / ${this.items.length}`;
    }
  },

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchEndX - this.touchStartX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.prev(); // Deslizar hacia la derecha = imagen anterior
      } else {
        this.next(); // Deslizar hacia la izquierda = imagen siguiente
      }
    }
  }
};

window.galleryLightbox = galleryLightbox;
