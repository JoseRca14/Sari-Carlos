/**
 * ==============================================================================
 * APLICACIÓN PRINCIPAL & HIDRATACIÓN DINÁMICA DE CONFIG.JS
 * ==============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
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

  // 8. CONFIGURAR AGENDAR EN CALENDARIO
  setupCalendarIntegration(weddingConfig);
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
  setLink("ceremony-waze-btn", cfg.ceremony.wazeUrl || "#");

  setText("reception-date", cfg.reception.date || cfg.event.displayDate || "");
  setText("reception-time", cfg.reception.time || "");
  setText("reception-venue", cfg.reception.venue || "");
  setText("reception-address", cfg.reception.address || "");
  setLink("reception-maps-btn", cfg.reception.mapsUrl || "#");
  setLink("reception-waze-btn", cfg.reception.wazeUrl || "#");

  // Sección ¿Cómo llegar? (Ubicación global)
  setText("location-venue-ceremony", cfg.ceremony.venue || "");
  setText("location-address-ceremony", cfg.ceremony.address || "");
  setLink("location-maps-btn-ceremony", cfg.ceremony.mapsUrl || "#");
  setLink("location-waze-btn-ceremony", cfg.ceremony.wazeUrl || "#");

  setText("location-venue-reception", cfg.reception.venue || "");
  setText("location-address-reception", cfg.reception.address || "");
  setLink("location-maps-btn-reception", cfg.reception.mapsUrl || "#");
  setLink("location-waze-btn-reception", cfg.reception.wazeUrl || "#");

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

  // Iniciar siempre arriba si la invitación está bloqueada
  if (document.body.classList.contains("invitation-locked")) {
    window.scrollTo(0, 0);
  }

  // Prevenir desplazamiento por teclado mientras esté bloqueado
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("invitation-locked")) {
      if (["Space", "ArrowDown", "PageDown", "End"].includes(e.code) || e.key === " " || e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
      }
    }
  }, { passive: false });

  openBtn.addEventListener("click", () => {
    // 1. Desbloquear desplazamiento en html y body
    document.documentElement.classList.remove("invitation-locked");
    document.body.classList.remove("invitation-locked");

    // 2. Lanzar lluvia sutil de pétalos y destellos dorados
    launchCelebrationAnimation();

    // 3. Intentar iniciar música ambiental
    if (window.audioPlayer && weddingConfig.music && weddingConfig.music.autoplayOnOpen) {
      window.audioPlayer.play();
    }

    // 4. Desplazar suavemente a la presentación de los novios
    const nextSection = document.getElementById("nos-casamos");
    if (nextSection) {
      setTimeout(() => {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }, 120);
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

/**
 * Configura la integración interactiva con Calendarios (Google, Apple, Outlook)
 */
function setupCalendarIntegration(cfg) {
  const btn = document.getElementById("btn-add-calendar");
  const dropdown = document.getElementById("calendar-dropdown");
  const googleBtn = document.getElementById("cal-google");
  const appleBtn = document.getElementById("cal-apple");
  const outlookBtn = document.getElementById("cal-outlook");

  if (!btn || !dropdown) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActive = dropdown.classList.toggle("active");
    btn.setAttribute("aria-expanded", isActive ? "true" : "false");
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.remove("active");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Datos del evento
  const bride = (cfg.couple && cfg.couple.brideName) || "Sari";
  const groom = (cfg.couple && cfg.couple.groomName) || "Carlos";
  const venueChurch = (cfg.ceremony && cfg.ceremony.venue) || "Parroquia Margaritas";
  const venueParty = (cfg.reception && cfg.reception.venue) || "Salón de Eventos Paraíso las Palmas";
  const title = encodeURIComponent(`Boda ${bride} & ${groom}`);
  const details = encodeURIComponent(
    `Tenemos el honor de invitarte a celebrar nuestro enlace matrimonial.\n\n` +
    `⛪ Ceremonia Religiosa: 5:00 p.m. en ${venueChurch}\n` +
    `🎉 Recepción & Brindis: 6:30 p.m. en ${venueParty}\n\n` +
    `¡Te esperamos con alegría!`
  );
  const location = encodeURIComponent(`${venueChurch}, Margaritas, Jalisco`);

  // 19 Dic 2026 17:00 local (UTC-6) = 23:00Z. Fin aprox 20 Dic 02:00 local = 08:00Z
  const startUTC = "20261219T230000Z";
  const endUTC = "20261220T080000Z";

  if (googleBtn) {
    googleBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUTC}/${endUTC}&details=${details}&location=${location}`;
  }

  if (outlookBtn) {
    outlookBtn.href = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=2026-12-19T17:00:00-06:00&enddt=2026-12-20T02:00:00-06:00&body=${details}&location=${location}`;
  }

  if (appleBtn) {
    appleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const icsData = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Sari y Carlos//Boda//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `SUMMARY:Boda ${bride} & ${groom}`,
        `DESCRIPTION:Tenemos el honor de invitarte a celebrar nuestro enlace matrimonial. Misa 5:00 p.m. en ${venueChurch} y Recepción 6:30 p.m. en ${venueParty}.`,
        `LOCATION:${venueChurch}, Margaritas, Jal.`,
        `DTSTART:${startUTC}`,
        `DTEND:${endUTC}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-P1D",
        "ACTION:DISPLAY",
        `DESCRIPTION:Recordatorio: Mañana es la Boda de ${bride} & ${groom}`,
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");

      const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", `Boda-${bride}-y-${groom}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      dropdown.classList.remove("active");
    });
  }
}

/**
 * Animación sutil de apertura: Lluvia de pétalos de rosa y destellos dorados
 */
function launchCelebrationAnimation() {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.id = "celebration-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  canvas.style.transition = "opacity 1.2s ease-out";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { once: true });

  const particles = [];
  const petalColors = ["#E8A598", "#D9827B", "#C96D68", "#F4C2BA", "#E5B4AC"];
  const goldColors = ["#D4AF37", "#F0DFAD", "#C5A880", "#EBD5AB"];

  // 45 pétalos suaves
  for (let i = 0; i < 45; i++) {
    particles.push({
      type: "petal",
      x: Math.random() * width,
      y: Math.random() * -height * 0.5 - 20,
      size: 10 + Math.random() * 12,
      speedY: 1.5 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 1.5,
      swaySpeed: 0.02 + Math.random() * 0.03,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.04,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      opacity: 0.75 + Math.random() * 0.25
    });
  }

  // 40 destellos dorados
  for (let i = 0; i < 40; i++) {
    particles.push({
      type: "gold",
      x: Math.random() * width,
      y: Math.random() * -height * 0.4,
      size: 2 + Math.random() * 3.5,
      speedY: 1.0 + Math.random() * 1.8,
      speedX: (Math.random() - 0.5) * 1.2,
      color: goldColors[Math.floor(Math.random() * goldColors.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.05 + Math.random() * 0.08,
      opacity: 0.6 + Math.random() * 0.4
    });
  }

  const startTime = performance.now();
  const DURATION = 4500;

  function render(now) {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      if (p.type === "petal") {
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 1.8 + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.8);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.6, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.7, -p.size * 0.8, -p.size * 0.4, 0, -p.size * 0.8);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.restore();
      } else {
        p.twinkle += p.twinkleSpeed;
        p.x += p.speedX;
        p.y += p.speedY;
        const currentAlpha = Math.abs(Math.sin(p.twinkle)) * p.opacity;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-p.size * 2, 0);
        ctx.lineTo(p.size * 2, 0);
        ctx.moveTo(0, -p.size * 2);
        ctx.lineTo(0, p.size * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    if (elapsed < DURATION) {
      requestAnimationFrame(render);
    } else {
      canvas.style.opacity = "0";
      setTimeout(() => {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }, 1200);
    }
  }

  requestAnimationFrame(render);
}



