/**
 * ==============================================================================
 * APLICACIÓN PRINCIPAL & HIDRATACIÓN DINÁMICA DE CONFIG.JS
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 0. FUSIONAR PERSONALIZACIONES DE LOCALSTORAGE SI EXISTEN
  try {
    const saved = localStorage.getItem("wedding_custom_config");
    if (saved && window.weddingConfig) {
      const parsed = JSON.parse(saved);
      Object.assign(window.weddingConfig, parsed);
    }
  } catch (err) {}

  if (typeof weddingConfig === "undefined") {
    console.error("No se encontró el objeto weddingConfig en config.js.");
    return;
  }

  // 1. HIDRATAR METADATOS Y TÍTULO DE LA PÁGINA
  hydrateMetadata(weddingConfig);

  // 2. HIDRATAR CONTENIDO DE TEXTOS Y DATOS
  hydrateContent(weddingConfig);

  // 3. RENDERIZAR COMPONENTES DINÁMICOS
  renderTimeline(weddingConfig.timeline);
  renderGallery(weddingConfig.gallery);
  renderGifts(weddingConfig.gifts);
  renderDressCode(weddingConfig.dressCode);

  // 4. INICIALIZAR MÓDULOS ESPECÍFICOS
  if (window.initCountdown && weddingConfig.event && weddingConfig.event.targetDate) {
    window.initCountdown(weddingConfig.event.targetDate);
  }

  if (window.audioPlayer && weddingConfig.music) {
    window.audioPlayer.init(weddingConfig.music);
  }

  if (window.galleryLightbox && weddingConfig.gallery) {
    window.galleryLightbox.init(weddingConfig.gallery);
  }

  if (window.initRSVP) {
    window.initRSVP(weddingConfig);
  }

  // 5. CONFIGURAR BOTÓN "ABRIR INVITACIÓN"
  setupHeroOpenButton();

  // 6. CONFIGURAR MODAL DE TRANSFERENCIA BANCARIA
  setupBankModal(weddingConfig.gifts);

  // 7. CONFIGURAR ANIMACIONES AL SCROLL (IntersectionObserver)
  setupScrollAnimations();
});

/**
 * Actualiza etiquetas del encabezado, Open Graph y SEO
 */
function hydrateMetadata(cfg) {
  if (!cfg.seo) return;

  if (cfg.seo.title) {
    document.title = cfg.seo.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", cfg.seo.title);
  }

  if (cfg.seo.description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", cfg.seo.description);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", cfg.seo.description);
  }

  if (cfg.seo.ogImage) {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute("content", cfg.seo.ogImage);
  }
}

/**
 * Inserta todos los textos e imágenes estáticas
 */
function hydrateContent(cfg) {
  // Nombres de los novios
  const bride = cfg.couple.brideName || "Novia";
  const groom = cfg.couple.groomName || "Novio";

  setText("hero-bride-name", bride);
  setText("hero-groom-name", groom);
  setText("couple-bride-name", bride);
  setText("couple-groom-name", groom);
  setText("footer-couple-names", `${bride} & ${groom}`);
  setText("final-signature-names", `${bride} & ${groom}`);

  // Monograma
  if (cfg.couple.monogram) {
    setText("couple-monogram", cfg.couple.monogram);
  }

  // Fechas y lugares
  setText("hero-date", cfg.event.displayDate || "");
  setText("footer-date", cfg.event.displayDate || "");
  setText("ceremony-date", cfg.ceremony.date || cfg.event.displayDate || "");
  setText("ceremony-time", cfg.ceremony.time || "");
  setText("ceremony-venue", cfg.ceremony.venue || "");
  setText("ceremony-address", cfg.ceremony.address || "");
  setLink("ceremony-maps-btn", cfg.ceremony.mapsUrl || "#");

  setText("reception-date", cfg.reception.date || cfg.event.displayDate || "");
  setText("reception-time", cfg.reception.time || "");
  setText("reception-venue", cfg.reception.venue || "");
  setText("reception-address", cfg.reception.address || "");
  setLink("reception-maps-btn", cfg.reception.mapsUrl || "#");

  // Sección ¿Cómo llegar? (Ubicación global)
  setText("location-venue-ceremony", cfg.ceremony.venue || "");
  setText("location-address-ceremony", cfg.ceremony.address || "");
  setLink("location-maps-btn-ceremony", cfg.ceremony.mapsUrl || "#");

  setText("location-venue-reception", cfg.reception.venue || "");
  setText("location-address-reception", cfg.reception.address || "");
  setLink("location-maps-btn-reception", cfg.reception.mapsUrl || "#");

  // Iframe de mapa si existe
  const mapIframe = document.getElementById("location-map-iframe");
  if (mapIframe && cfg.ceremony.embedMapSrc) {
    mapIframe.src = cfg.ceremony.embedMapSrc;
  }

  // Textos editoriales
  if (cfg.texts) {
    setText("we-are-getting-married-text", cfg.texts.weAreGettingMarried || "Nos casamos");
    setText("hero-tagline", cfg.texts.heroTagline);
    setText("hero-btn-text", cfg.texts.heroButton || "ABRIR INVITACIÓN");
    setText("couple-story-text", cfg.texts.coupleStory);
    setText("final-quote-text", cfg.texts.quote);
    setText("final-quote-author", cfg.texts.quoteAuthor);
    setText("final-thanks-text", cfg.texts.finalMessage);
    setText("footer-love-text", cfg.texts.footerLove || "Con amor");
    setText("footer-powered", cfg.texts.footerPoweredBy || "Invitación digital");
  }

  // Fotografías
  if (cfg.images) {
    const heroBg = document.getElementById("hero-background-img");
    if (heroBg && cfg.images.heroBackground) {
      heroBg.src = cfg.images.heroBackground;
    }

    const coupleImg = document.getElementById("couple-portrait-img");
    if (coupleImg && cfg.images.couplePortrait) {
      coupleImg.src = cfg.images.couplePortrait;
      coupleImg.alt = `Fotografía de ${bride} y ${groom}`;
    }
  }
}

/**
 * Renderiza la línea de tiempo dinámica
 */
function renderTimeline(timelineEvents) {
  const container = document.getElementById("timeline-container");
  if (!container || !timelineEvents || !Array.isArray(timelineEvents)) return;

  container.innerHTML = "";
  timelineEvents.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "timeline-item reveal-on-scroll";
    itemEl.innerHTML = `
      <div class="timeline-node" aria-hidden="true"></div>
      <div class="timeline-card">
        <div class="timeline-date">${escapeHTML(item.year || "")}</div>
        <h3 class="timeline-title">${escapeHTML(item.title || "")}</h3>
        <p class="timeline-desc">${escapeHTML(item.description || "")}</p>
      </div>
    `;
    container.appendChild(itemEl);
  });
}

/**
 * Renderiza la galería con tarjetas interactivas
 */
function renderGallery(galleryItems) {
  const grid = document.getElementById("gallery-grid");
  if (!grid || !galleryItems || !Array.isArray(galleryItems)) return;

  grid.innerHTML = "";
  galleryItems.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-item reveal-on-scroll";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Ver foto ampliada: ${item.caption || item.alt || "Fotografía"}`);

    card.innerHTML = `
      <img src="${item.thumb || item.src}" alt="${escapeHTML(item.alt || "Foto de boda")}" loading="lazy" decoding="async">
      <div class="gallery-item-overlay">
        <span class="gallery-item-caption">${escapeHTML(item.caption || "")}</span>
      </div>
    `;

    // Abrir Lightbox al clic o tecla Enter
    card.addEventListener("click", () => {
      if (window.galleryLightbox) window.galleryLightbox.open(index);
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (window.galleryLightbox) window.galleryLightbox.open(index);
      }
    });

    grid.appendChild(card);
  });
}

/**
 * Renderiza los botones y tarjetas de la mesa de regalos
 */
function renderGifts(giftsConfig) {
  if (!giftsConfig) return;
  setText("gifts-intro-msg", giftsConfig.message || "");

  const grid = document.getElementById("gifts-grid");
  if (!grid || !giftsConfig.items) return;

  grid.innerHTML = "";
  giftsConfig.items.forEach((gift) => {
    const card = document.createElement("div");
    card.className = "gift-card reveal-on-scroll";

    let actionButton = "";
    if (gift.type === "modal") {
      actionButton = `
        <button type="button" class="btn btn-outline" id="btn-open-bank-modal">
          ${escapeHTML(gift.buttonText || "Ver Datos")}
        </button>
      `;
    } else {
      actionButton = `
        <a href="${gift.url || "#"}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
          ${escapeHTML(gift.buttonText || "Ver Tienda")}
        </a>
      `;
    }

    card.innerHTML = `
      <div class="gift-card-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <polyline points="20 12 20 22 4 22 4 12"></polyline>
          <rect x="2" y="7" width="20" height="5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      </div>
      <h3 class="gift-card-title">${escapeHTML(gift.name)}</h3>
      <p class="gift-card-desc">${escapeHTML(gift.description || "")}</p>
      ${actionButton}
    `;

    grid.appendChild(card);
  });
}

/**
 * Renderiza la sección de código de vestimenta
 */
function renderDressCode(dressConfig) {
  if (!dressConfig) return;

  setText("dresscode-category", dressConfig.category || "");
  setText("dresscode-text", dressConfig.description || "");

  if (dressConfig.suggestions) {
    setText("dresscode-ladies-desc", dressConfig.suggestions.ladies || "");
    setText("dresscode-gentlemen-desc", dressConfig.suggestions.gentlemen || "");
  }

  // Paleta de sugerencia
  const paletteContainer = document.getElementById("dresscode-palette-dots");
  if (paletteContainer && dressConfig.suggestedPalette && Array.isArray(dressConfig.suggestedPalette)) {
    paletteContainer.innerHTML = "";
    dressConfig.suggestedPalette.forEach((item) => {
      const dot = document.createElement("span");
      dot.className = "palette-dot";
      dot.style.backgroundColor = item.hex;
      dot.title = item.name;
      dot.setAttribute("aria-label", item.name);
      paletteContainer.appendChild(dot);
    });
  }
}

/**
 * Configuración del botón de apertura "ABRIR INVITACIÓN"
 */
function setupHeroOpenButton() {
  const openBtn = document.getElementById("hero-open-invitation-btn");
  if (!openBtn) return;

  openBtn.addEventListener("click", () => {
    // 1. Intentar iniciar música ambiental
    if (window.audioPlayer && weddingConfig.music && weddingConfig.music.autoplayOnOpen) {
      window.audioPlayer.play();
    }

    // 2. Desplazar suavemente a la presentación de los novios
    const nextSection = document.getElementById("nos-casamos");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

/**
 * Configura el modal interactivo de datos bancarios y botón copiar CLABE
 */
function setupBankModal(giftsConfig) {
  const modal = document.getElementById("bank-modal");
  const closeBtn = document.getElementById("bank-modal-close");
  const copyBtn = document.getElementById("copy-clabe-btn");
  const clabeDisplay = document.getElementById("bank-clabe-display");

  if (!modal || !giftsConfig) return;

  // Encontrar datos bancarios en config
  const bankItem = giftsConfig.items ? giftsConfig.items.find(i => i.id === "bank") : null;
  if (bankItem && bankItem.bankDetails) {
    const details = bankItem.bankDetails;
    setText("bank-name-val", details.bank || "");
    setText("bank-holder-val", details.holder || "");
    setText("bank-account-val", details.accountNumber || "");
    setText("bank-concept-val", details.concept || "");
    if (clabeDisplay) clabeDisplay.textContent = details.clabe || "";
  }

  // Abrir modal
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "btn-open-bank-modal") {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  });

  // Cerrar modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal());
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Copiar CLABE al portapapeles
  if (copyBtn && clabeDisplay) {
    copyBtn.addEventListener("click", () => {
      const textToCopy = clabeDisplay.textContent.replace(/\s+/g, "");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopySuccess();
        }).catch(() => fallbackCopy(textToCopy));
      } else {
        fallbackCopy(textToCopy);
      }
    });
  }

  function showCopySuccess() {
    if (!copyBtn) return;
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      ¡Copiado!
    `;
    copyBtn.style.backgroundColor = "#2E7D32";
    copyBtn.style.color = "#FFFFFF";
    copyBtn.style.borderColor = "#2E7D32";

    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.backgroundColor = "";
      copyBtn.style.color = "";
      copyBtn.style.borderColor = "";
    }, 2500);
  }

  function fallbackCopy(str) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    showCopySuccess();
  }
}

/**
 * Animaciones suaves con IntersectionObserver
 */
function setupScrollAnimations() {
  const elements = document.querySelectorAll(".reveal-on-scroll");
  if (!elements.length) return;

  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

/* FUNCIONES DE UTILIDAD */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function setLink(id, href) {
  const el = document.getElementById(id);
  if (el) el.href = href || "#";
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Exportación global para soporte del Personalizador de Administración
window.hydrateMetadata = hydrateMetadata;
window.hydrateContent = hydrateContent;
window.renderTimeline = renderTimeline;
window.renderGallery = renderGallery;
window.renderGifts = renderGifts;
window.renderDressCode = renderDressCode;

