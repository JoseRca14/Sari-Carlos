/**
 * ==============================================================================
 * MÓDULO DE ADMINISTRACIÓN PRIVADO
 * ==============================================================================
 * Permite modificar:
 * 1. Secciones visibles (toggles)
 * 2. Colores y temas (paletas y selectores en vivo)
 * 3. Imágenes (Hero, Novios, Galería con subida de archivo y URL)
 * 4. Música ambiental (MP3, título, artista, autoplay y reproductor de prueba)
 * 5. Textos y datos de la boda (nombres, fechas, lugares, WhatsApp, banco)
 *
 * Credenciales: Usuario: tech / Contraseña: Mon123
 * ==============================================================================
 */

(function () {
  "use strict";

  const CREDENTIALS = {
    user: "tech",
    pass: "Mon123"
  };

  const STORAGE_KEYS = {
    AUTH: "wedding_admin_auth",
    CONFIG: "wedding_custom_config",
    COLORS: "wedding_custom_colors",
    SECTIONS: "wedding_hidden_sections"
  };

  const SECTIONS_DEF = [
    { id: "portada", name: "Portada / Hero", desc: "Pantalla inicial con foto principal, nombres y botón de apertura" },
    { id: "nos-casamos", name: "Presentación de Novios", desc: "Retrato de la pareja, nombres y dedicatoria 'Nos casamos'" },
    { id: "cuenta-regresiva", name: "Cuenta Regresiva", desc: "Contador en tiempo real de días, horas y minutos" },
    { id: "itinerario", name: "Dónde & Cuándo (Itinerario)", desc: "Tarjetas de Ceremonia Religiosa y Recepción/Fiesta" },
    { id: "nuestra-historia", name: "Nuestra Historia (Timeline)", desc: "Línea de tiempo con momentos clave de la relación" },
    { id: "galeria", name: "Galería Fotográfica", desc: "Cuadrícula de fotos con visor ampliado Lightbox" },
    { id: "codigo-vestimenta", name: "Código de Vestimenta", desc: "Etiqueta para damas y caballeros con paleta sugerida" },
    { id: "mesa-regalos", name: "Mesa de Regalos", desc: "Liverpool, Amazon, Palacio y Modal de Transferencia" },
    { id: "confirmacion", name: "Confirmación (RSVP)", desc: "Formulario para confirmar asistencia directa a WhatsApp" },
    { id: "ubicacion", name: "¿Cómo llegar? (Ubicación)", desc: "Mapa de Google Maps y botones de navegación GPS" },
    { id: "mensaje-final", name: "Mensaje Final", desc: "Frase romántica de despedida y agradecimiento" },
    { id: "music-player", name: "Reproductor Flotante", desc: "Botón flotante con ondas de sonido para música" }
  ];

  const COLOR_PRESETS = [
    {
      name: "Dorado Champagne",
      dots: ["#C5A880", "#FAF7F2", "#242220"],
      vars: {
        "--color-primary": "#C5A880",
        "--color-primary-dark": "#A48459",
        "--color-bg": "#FAF7F2",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-subtle": "#F4EFEA",
        "--color-text": "#242220",
        "--color-text-muted": "#6B6762"
      }
    },
    {
      name: "Rosa Blush & Cuarzo",
      dots: ["#C98B8B", "#FDF7F7", "#2D2222"],
      vars: {
        "--color-primary": "#C98B8B",
        "--color-primary-dark": "#A86D6D",
        "--color-bg": "#FDF7F7",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-subtle": "#F7EAEA",
        "--color-text": "#2D2222",
        "--color-text-muted": "#755D5D"
      }
    },
    {
      name: "Verde Salvia & Eucalipto",
      dots: ["#6B8E6B", "#F5F8F5", "#1E291E"],
      vars: {
        "--color-primary": "#6B8E6B",
        "--color-primary-dark": "#4E6E4E",
        "--color-bg": "#F5F8F5",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-subtle": "#E8EFE8",
        "--color-text": "#1E291E",
        "--color-text-muted": "#566656"
      }
    },
    {
      name: "Azul Marino Imperial",
      dots: ["#32527B", "#F4F7FB", "#16202C"],
      vars: {
        "--color-primary": "#32527B",
        "--color-primary-dark": "#1F3A5E",
        "--color-bg": "#F4F7FB",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-subtle": "#E7EEF7",
        "--color-text": "#16202C",
        "--color-text-muted": "#506173"
      }
    },
    {
      name: "Borgoña & Vino Tinto",
      dots: ["#7A283B", "#FAF4F5", "#2B161B"],
      vars: {
        "--color-primary": "#7A283B",
        "--color-primary-dark": "#591928",
        "--color-bg": "#FAF4F5",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-subtle": "#F2E4E7",
        "--color-text": "#2B161B",
        "--color-text-muted": "#694B52"
      }
    },
    {
      name: "Dark Elegance & Oro",
      dots: ["#D4AF37", "#171717", "#F5F5F5"],
      vars: {
        "--color-primary": "#D4AF37",
        "--color-primary-dark": "#B89628",
        "--color-bg": "#141414",
        "--color-bg-card": "#1E1E1E",
        "--color-bg-subtle": "#262626",
        "--color-text": "#F5F5F5",
        "--color-text-muted": "#A3A3A3"
      }
    }
  ];

  // Estado reactivo en memoria
  let state = {
    config: null,
    hiddenSections: [],
    customColors: {}
  };

  /**
   * 1. INICIALIZACIÓN TEMPRANA (Aplica personalizaciones guardadas en localStorage)
   */
  function applySavedPreferences() {
    try {
      // a) Configuración de datos e imágenes
      const savedCfg = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (savedCfg) {
        const parsed = JSON.parse(savedCfg);
        if (window.weddingConfig) {
          window.weddingConfig = deepMerge(window.weddingConfig, parsed);
        }
      }

      // b) Colores
      const savedColors = localStorage.getItem(STORAGE_KEYS.COLORS);
      if (savedColors) {
        state.customColors = JSON.parse(savedColors);
        Object.entries(state.customColors).forEach(([prop, val]) => {
          document.documentElement.style.setProperty(prop, val);
        });
      }

      // c) Secciones ocultas
      const savedSections = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      if (savedSections) {
        state.hiddenSections = JSON.parse(savedSections);
        applyHiddenSections();
      }
    } catch (err) {
      console.warn("Error al cargar personalizaciones previas:", err);
    }
  }

  function applyHiddenSections() {
    SECTIONS_DEF.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (!el) return;
      if (state.hiddenSections.includes(sec.id)) {
        el.classList.add("section-hidden");
      } else {
        el.classList.remove("section-hidden");
      }
    });
  }

  // Ejecutar inmediatamente para evitar parpadeos
  applySavedPreferences();

  /**
   * 2. CONSTRUCCIÓN DEL DOM DEL PANEL Y EVENTOS
   */
  document.addEventListener("DOMContentLoaded", () => {
    // Clonar configuración actual de referencia
    state.config = JSON.parse(JSON.stringify(window.weddingConfig || {}));

    createAdminDOM();
    bindEvents();
    syncUIWithState();
  });

  /**
   * Crea la estructura HTML del botón secreto, modal login y panel drawer
   */
  function createAdminDOM() {
    // a) Botón Secreto (discreto en la esquina)
    const triggerBtn = document.createElement("button");
    triggerBtn.id = "admin-secret-trigger";
    triggerBtn.className = "admin-secret-trigger";
    triggerBtn.setAttribute("type", "button");
    triggerBtn.setAttribute("aria-label", "Acceso privado de administración");
    triggerBtn.title = "Personalizar invitación (Usuario: tech)";
    triggerBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    `;
    document.body.appendChild(triggerBtn);

    // b) Modal de Login
    const loginModal = document.createElement("div");
    loginModal.id = "admin-login-modal";
    loginModal.className = "admin-modal-overlay";
    loginModal.innerHTML = `
      <div class="admin-login-box" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button type="button" class="admin-login-close" id="admin-login-close" aria-label="Cerrar">&times;</button>
        <div class="admin-login-header">
          <div class="admin-login-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 class="admin-login-title" id="admin-login-title">Acceso Administrador</h2>
          <p class="admin-login-desc">Ingresa tus credenciales para editar imágenes, secciones, colores y música en vivo.</p>
        </div>

        <form id="admin-login-form" autocomplete="off">
          <div class="admin-form-group">
            <label class="admin-form-label" for="admin-user-input">Usuario</label>
            <input type="text" id="admin-user-input" class="admin-input" placeholder="Ingresa usuario" required autofocus>
          </div>

          <div class="admin-form-group">
            <label class="admin-form-label" for="admin-pass-input">Contraseña</label>
            <input type="password" id="admin-pass-input" class="admin-input" placeholder="Ingresa contraseña" required>
          </div>

          <div class="admin-login-error" id="admin-login-error">
            Usuario o contraseña incorrectos. Verifica e intenta de nuevo.
          </div>

          <button type="submit" class="admin-login-btn">Entrar al Personalizador</button>
        </form>
      </div>
    `;
    document.body.appendChild(loginModal);

    // c) Backdrop del drawer
    const drawerBackdrop = document.createElement("div");
    drawerBackdrop.id = "admin-drawer-backdrop";
    drawerBackdrop.className = "admin-drawer-backdrop";
    document.body.appendChild(drawerBackdrop);

    // d) Panel Lateral (Customizer Drawer)
    const drawer = document.createElement("aside");
    drawer.id = "admin-drawer";
    drawer.className = "admin-drawer";
    drawer.setAttribute("aria-label", "Panel de personalización");
    drawer.innerHTML = `
      <!-- Encabezado -->
      <div class="admin-drawer-header">
        <div class="admin-drawer-title-box">
          <div class="admin-drawer-title-icon">⚙️</div>
          <div>
            <h2 class="admin-drawer-title">Personalizador de Boda</h2>
            <span class="admin-drawer-badge">Usuario: tech</span>
          </div>
        </div>
        <div class="admin-header-actions">
          <button type="button" class="admin-btn-logout" id="admin-logout-btn" title="Cerrar sesión">Salir</button>
          <button type="button" class="admin-drawer-close" id="admin-drawer-close" aria-label="Cerrar panel">&times;</button>
        </div>
      </div>

      <!-- Navegación por Pestañas -->
      <nav class="admin-tabs-nav" role="tablist">
        <button type="button" class="admin-tab-btn active" data-tab="tab-sections">👁️ Secciones</button>
        <button type="button" class="admin-tab-btn" data-tab="tab-colors">🎨 Colores</button>
        <button type="button" class="admin-tab-btn" data-tab="tab-images">🖼️ Fotos</button>
        <button type="button" class="admin-tab-btn" data-tab="tab-music">🎵 Música</button>
        <button type="button" class="admin-tab-btn" data-tab="tab-content">✏️ Datos & Textos</button>
      </nav>

      <!-- Cuerpo del Panel -->
      <div class="admin-drawer-body">
        
        <!-- PESTAÑA 1: SECCIONES -->
        <div class="admin-tab-pane active" id="tab-sections">
          <h3 class="admin-section-heading">👁️ Visibilidad de Secciones</h3>
          <p class="admin-section-subtext">Activa o desactiva qué bloques deben mostrarse en la invitación.</p>
          <div class="admin-card" id="admin-sections-list">
            <!-- Rellenado dinámicamente -->
          </div>
        </div>

        <!-- PESTAÑA 2: COLORES -->
        <div class="admin-tab-pane" id="tab-colors">
          <h3 class="admin-section-heading">🎨 Paletas Temáticas Rápidas</h3>
          <p class="admin-section-subtext">Aplica combinaciones elegantes de un solo clic.</p>
          <div class="admin-palettes-grid" id="admin-palettes-grid">
            <!-- Rellenado dinámicamente -->
          </div>

          <h3 class="admin-section-heading" style="margin-top: 1.5rem;">🖌️ Personalizar Colores Detallados</h3>
          <p class="admin-section-subtext">Edita los tonos exactos mediante selector visual.</p>
          <div class="admin-card" id="admin-colors-list">
            <!-- Rellenado dinámicamente -->
          </div>
        </div>

        <!-- PESTAÑA 3: IMÁGENES -->
        <div class="admin-tab-pane" id="tab-images">
          <h3 class="admin-section-heading">🖼️ Fotografías Principales</h3>
          <p class="admin-section-subtext">Sube archivos desde tu dispositivo o ingresa una URL.</p>

          <div class="admin-img-editor-card">
            <div class="admin-img-header">
              <span class="admin-img-title">Foto de Portada (Fondo Hero)</span>
            </div>
            <div class="admin-img-preview-box">
              <img src="" id="admin-preview-hero" class="admin-img-thumbnail" alt="Vista previa Hero">
              <div class="admin-img-inputs">
                <label class="admin-file-upload-btn">
                  📁 Subir foto
                  <input type="file" accept="image/*" id="admin-file-hero">
                </label>
                <input type="text" class="admin-input" id="admin-url-hero" placeholder="Ruta o URL de la imagen">
              </div>
            </div>
          </div>

          <div class="admin-img-editor-card">
            <div class="admin-img-header">
              <span class="admin-img-title">Retrato de los Novios</span>
            </div>
            <div class="admin-img-preview-box">
              <img src="" id="admin-preview-couple" class="admin-img-thumbnail" alt="Vista previa Novios">
              <div class="admin-img-inputs">
                <label class="admin-file-upload-btn">
                  📁 Subir foto
                  <input type="file" accept="image/*" id="admin-file-couple">
                </label>
                <input type="text" class="admin-input" id="admin-url-couple" placeholder="Ruta o URL de la imagen">
              </div>
            </div>
          </div>

          <h3 class="admin-section-heading" style="margin-top: 1.5rem;">📸 Galería Fotográfica (10 Fotos)</h3>
          <p class="admin-section-subtext">Modifica cada fotografía y su descripción para el visor Lightbox.</p>
          <div class="admin-gallery-list" id="admin-gallery-editor-list">
            <!-- Rellenado dinámicamente -->
          </div>
        </div>

        <!-- PESTAÑA 4: MÚSICA -->
        <div class="admin-tab-pane" id="tab-music">
          <h3 class="admin-section-heading">🎵 Música Ambiental</h3>
          <p class="admin-section-subtext">Configura la pista musical que acompañará la invitación.</p>

          <div class="admin-card">
            <div class="admin-form-group">
              <label class="admin-form-label">Archivo de Audio (MP3)</label>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <label class="admin-file-upload-btn" style="margin-bottom: 0;">
                  📁 Subir MP3 local
                  <input type="file" accept="audio/*" id="admin-music-file">
                </label>
              </div>
              <input type="text" class="admin-input" id="admin-music-src" placeholder="assets/music.mp3 o URL externa">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Título de la Canción</label>
              <input type="text" class="admin-input" id="admin-music-title" placeholder="Ej: Yellow">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Artista / Banda</label>
              <input type="text" class="admin-input" id="admin-music-artist" placeholder="Ej: Coldplay">
            </div>

            <div class="admin-switch-row" style="border: none; padding: 0.5rem 0;">
              <div class="admin-switch-info">
                <div class="admin-switch-title">Iniciar al abrir invitación</div>
                <div class="admin-switch-desc">Comienza la música al dar clic en el botón principal</div>
              </div>
              <label class="admin-switch">
                <input type="checkbox" id="admin-music-autoplay">
                <span class="admin-slider"></span>
              </label>
            </div>

            <div class="admin-audio-tester">
              <button type="button" class="admin-audio-play-btn" id="admin-audio-test-btn" title="Reproducir / Pausar">▶</button>
              <div class="admin-audio-info">
                <p class="admin-audio-info-title" id="admin-audio-test-title">Canción</p>
                <p class="admin-audio-info-artist" id="admin-audio-test-artist">Artista</p>
              </div>
            </div>
          </div>
        </div>

        <!-- PESTAÑA 5: CONTENIDO Y TEXTOS -->
        <div class="admin-tab-pane" id="tab-content">
          <h3 class="admin-section-heading">💍 Información de los Novios</h3>
          <div class="admin-card">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="admin-form-group">
                <label class="admin-form-label">Nombre Novia</label>
                <input type="text" class="admin-input" id="admin-bride-name">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Nombre Novio</label>
                <input type="text" class="admin-input" id="admin-groom-name">
              </div>
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Nombre Completo Novia</label>
              <input type="text" class="admin-input" id="admin-bride-fullname">
            </div>

            <div class="admin-form-group">
              <label class="admin-form-label">Nombre Completo Novio</label>
              <input type="text" class="admin-input" id="admin-groom-fullname">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
              <div class="admin-form-group">
                <label class="admin-form-label">Monograma</label>
                <input type="text" class="admin-input" id="admin-monogram" placeholder="S & C">
              </div>
              <div class="admin-form-group">
                <label class="admin-form-label">Hashtag</label>
                <input type="text" class="admin-input" id="admin-hashtag" placeholder="#Boda">
              </div>
            </div>
          </div>

          <h3 class="admin-section-heading">📅 Fecha y Ciudad</h3>
          <div class="admin-card">
            <div class="admin-form-group">
              <label class="admin-form-label">Fecha y Hora (Para Contador)</label>
              <input type="datetime-local" class="admin-input" id="admin-target-date">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Fecha en Texto</label>
              <input type="text" class="admin-input" id="admin-display-date" placeholder="19 de Diciembre de 2026">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Ciudad / Estado</label>
              <input type="text" class="admin-input" id="admin-city" placeholder="Margaritas, Jalisco">
            </div>
          </div>

          <h3 class="admin-section-heading">⛪ Ceremonia & Recepción</h3>
          <div class="admin-card">
            <div class="admin-form-group">
              <label class="admin-form-label">Templo / Parroquia</label>
              <input type="text" class="admin-input" id="admin-ceremony-venue">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Hora Ceremonia</label>
              <input type="text" class="admin-input" id="admin-ceremony-time">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Dirección Ceremonia</label>
              <input type="text" class="admin-input" id="admin-ceremony-address">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Enlace Google Maps Ceremonia</label>
              <input type="text" class="admin-input" id="admin-ceremony-maps">
            </div>

            <hr style="border: 0; border-top: 1px solid #27272A; margin: 1.25rem 0;">

            <div class="admin-form-group">
              <label class="admin-form-label">Salón de Recepción</label>
              <input type="text" class="admin-input" id="admin-reception-venue">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Hora Recepción</label>
              <input type="text" class="admin-input" id="admin-reception-time">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Dirección Recepción</label>
              <input type="text" class="admin-input" id="admin-reception-address">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Enlace Google Maps Recepción</label>
              <input type="text" class="admin-input" id="admin-reception-maps">
            </div>
          </div>

          <h3 class="admin-section-heading">📱 WhatsApp RSVP</h3>
          <div class="admin-card">
            <div class="admin-form-group">
              <label class="admin-form-label">Número WhatsApp (con código de país)</label>
              <input type="text" class="admin-input" id="admin-whatsapp" placeholder="523329156763">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Fecha Límite Confirmación</label>
              <input type="text" class="admin-input" id="admin-rsvp-deadline" placeholder="30 de Noviembre de 2026">
            </div>
          </div>

          <h3 class="admin-section-heading">🏦 Datos Bancarios</h3>
          <div class="admin-card">
            <div class="admin-form-group">
              <label class="admin-form-label">Banco</label>
              <input type="text" class="admin-input" id="admin-bank-name">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Titular(es)</label>
              <input type="text" class="admin-input" id="admin-bank-holder">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Número de Cuenta</label>
              <input type="text" class="admin-input" id="admin-bank-acc">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">CLABE Interbancaria (18 dígitos)</label>
              <input type="text" class="admin-input" id="admin-bank-clabe">
            </div>
            <div class="admin-form-group">
              <label class="admin-form-label">Concepto sugerido</label>
              <input type="text" class="admin-input" id="admin-bank-concept">
            </div>
          </div>
        </div>

      </div>

      <!-- Barra de Acciones Inferior -->
      <div class="admin-drawer-footer">
        <button type="button" class="admin-btn-save" id="admin-save-btn">
          💾 Guardar Cambios
        </button>
        <button type="button" class="admin-btn-secondary" id="admin-export-btn" title="Descargar archivo config.js con los cambios">
          📋 Exportar config.js
        </button>
        <button type="button" class="admin-btn-reset" id="admin-reset-btn" title="Borrar cambios locales y volver al original">
          🔄 Restablecer
        </button>
      </div>
    `;
    document.body.appendChild(drawer);

    // e) Toast Flotante
    const toast = document.createElement("div");
    toast.id = "admin-toast";
    toast.className = "admin-toast";
    toast.innerHTML = `
      <span class="admin-toast-icon">✨</span>
      <span id="admin-toast-text">Cambios guardados</span>
    `;
    document.body.appendChild(toast);
  }

  /**
   * 3. VINCULACIÓN DE EVENTOS Y LÓGICA DE CONTROL
   */
  function bindEvents() {
    const trigger = document.getElementById("admin-secret-trigger");
    const loginModal = document.getElementById("admin-login-modal");
    const loginForm = document.getElementById("admin-login-form");
    const loginClose = document.getElementById("admin-login-close");
    const loginError = document.getElementById("admin-login-error");
    const drawer = document.getElementById("admin-drawer");
    const drawerClose = document.getElementById("admin-drawer-close");
    const drawerBackdrop = document.getElementById("admin-drawer-backdrop");
    const logoutBtn = document.getElementById("admin-logout-btn");
    const saveBtn = document.getElementById("admin-save-btn");
    const exportBtn = document.getElementById("admin-export-btn");
    const resetBtn = document.getElementById("admin-reset-btn");

    // a) Disparador: clic en botón oculto
    trigger.addEventListener("click", () => {
      openAdminFlow();
    });

    // b) Atajo de teclado: Ctrl + Shift + A o Alt + A
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) ||
          (e.altKey && (e.key === "A" || e.key === "a"))) {
        e.preventDefault();
        openAdminFlow();
      }
      if (e.key === "Escape") {
        closeAllModals();
      }
    });

    // c) Clic triple en monograma del footer (atajo alternativo discreto)
    const footerMonogram = document.querySelector(".site-footer");
    if (footerMonogram) {
      let clickCount = 0;
      let timer = null;
      footerMonogram.addEventListener("click", () => {
        clickCount++;
        clearTimeout(timer);
        if (clickCount >= 3) {
          clickCount = 0;
          openAdminFlow();
        } else {
          timer = setTimeout(() => { clickCount = 0; }, 600);
        }
      });
    }

    // d) Procesar Formulario de Login
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("admin-user-input").value.trim();
      const pass = document.getElementById("admin-pass-input").value;

      if (user === CREDENTIALS.user && pass === CREDENTIALS.pass) {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, "true");
        loginError.style.display = "none";
        loginModal.classList.remove("active");
        loginForm.reset();
        openDrawer();
        showToast("¡Bienvenido! Sesión iniciada con éxito");
      } else {
        loginError.style.display = "block";
      }
    });

    loginClose.addEventListener("click", () => {
      loginModal.classList.remove("active");
      loginError.style.display = "none";
    });

    // e) Cerrar Drawer
    drawerClose.addEventListener("click", closeDrawer);
    drawerBackdrop.addEventListener("click", closeDrawer);

    // f) Cerrar Sesión
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(STORAGE_KEYS.AUTH);
      closeDrawer();
      showToast("Sesión cerrada");
    });

    // g) Pestañas de navegación
    const tabBtns = document.querySelectorAll(".admin-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".admin-tab-pane").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add("active");
      });
    });

    // h) Subida de Fotos Hero y Pareja
    setupImageFileInput("admin-file-hero", "admin-url-hero", (dataUrl) => {
      state.config.images.heroBackground = dataUrl;
      const heroEl = document.getElementById("hero-background-img");
      if (heroEl) heroEl.src = dataUrl;
      document.getElementById("admin-preview-hero").src = dataUrl;
    });

    setupImageFileInput("admin-file-couple", "admin-url-couple", (dataUrl) => {
      state.config.images.couplePortrait = dataUrl;
      const coupleEl = document.getElementById("couple-portrait-img");
      if (coupleEl) coupleEl.src = dataUrl;
      document.getElementById("admin-preview-couple").src = dataUrl;
    });

    // i) Música
    setupMusicControls();

    // j) Botón Guardar Cambios
    saveBtn.addEventListener("click", () => {
      collectFormData();
      saveToLocalStorage();
      rehydrateAll();
      showToast("💾 ¡Cambios guardados con éxito!");
    });

    // k) Botón Exportar config.js
    exportBtn.addEventListener("click", exportConfigFile);

    // l) Botón Restablecer
    resetBtn.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas restablecer todos los cambios a los valores de fábrica?")) {
        localStorage.removeItem(STORAGE_KEYS.CONFIG);
        localStorage.removeItem(STORAGE_KEYS.COLORS);
        localStorage.removeItem(STORAGE_KEYS.SECTIONS);
        showToast("Restableciendo...");
        setTimeout(() => location.reload(), 600);
      }
    });
  }

  function openAdminFlow() {
    if (sessionStorage.getItem(STORAGE_KEYS.AUTH) === "true") {
      openDrawer();
    } else {
      const modal = document.getElementById("admin-login-modal");
      modal.classList.add("active");
      setTimeout(() => {
        const userInput = document.getElementById("admin-user-input");
        if (userInput) userInput.focus();
      }, 100);
    }
  }

  function openDrawer() {
    syncUIWithState();
    document.getElementById("admin-drawer").classList.add("open");
    document.getElementById("admin-drawer-backdrop").classList.add("active");
  }

  function closeDrawer() {
    document.getElementById("admin-drawer").classList.remove("open");
    document.getElementById("admin-drawer-backdrop").classList.remove("active");
  }

  function closeAllModals() {
    const login = document.getElementById("admin-login-modal");
    if (login) login.classList.remove("active");
    closeDrawer();
  }

  /**
   * 4. SINCRONIZACIÓN DE LA UI CON EL ESTADO ACTUAL
   */
  function syncUIWithState() {
    const cfg = state.config;
    if (!cfg) return;

    // 1. Renderizar Switches de Secciones
    const sectionsContainer = document.getElementById("admin-sections-list");
    sectionsContainer.innerHTML = "";
    SECTIONS_DEF.forEach(sec => {
      const isVisible = !state.hiddenSections.includes(sec.id);
      const row = document.createElement("div");
      row.className = "admin-switch-row";
      row.innerHTML = `
        <div class="admin-switch-info">
          <div class="admin-switch-title">${escapeHTML(sec.name)}</div>
          <div class="admin-switch-desc">${escapeHTML(sec.desc)}</div>
        </div>
        <label class="admin-switch">
          <input type="checkbox" data-section-id="${sec.id}" ${isVisible ? "checked" : ""}>
          <span class="admin-slider"></span>
        </label>
      `;

      const input = row.querySelector("input");
      input.addEventListener("change", (e) => {
        const id = e.target.dataset.sectionId;
        if (e.target.checked) {
          state.hiddenSections = state.hiddenSections.filter(s => s !== id);
        } else {
          if (!state.hiddenSections.includes(id)) {
            state.hiddenSections.push(id);
          }
        }
        applyHiddenSections();
      });

      sectionsContainer.appendChild(row);
    });

    // 2. Renderizar Paletas de Colores
    const palGrid = document.getElementById("admin-palettes-grid");
    palGrid.innerHTML = "";
    COLOR_PRESETS.forEach(pal => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "admin-palette-btn";
      btn.innerHTML = `
        <div class="admin-palette-dots">
          ${pal.dots.map(d => `<span class="admin-p-dot" style="background: ${d}"></span>`).join("")}
        </div>
        <span class="admin-palette-name">${pal.name}</span>
      `;
      btn.addEventListener("click", () => {
        applyPalette(pal);
      });
      palGrid.appendChild(btn);
    });

    // 3. Renderizar Selectores de Color Manuales
    const colorsList = document.getElementById("admin-colors-list");
    colorsList.innerHTML = "";
    const colorVars = [
      { key: "--color-primary", label: "Dorado / Color Primario", fallback: "#C5A880" },
      { key: "--color-primary-dark", label: "Dorado Oscuro / Bordes", fallback: "#A48459" },
      { key: "--color-bg", label: "Fondo General", fallback: "#FAF7F2" },
      { key: "--color-bg-card", label: "Fondo de Tarjetas", fallback: "#FFFFFF" },
      { key: "--color-bg-subtle", label: "Fondo Secundario Suave", fallback: "#F4EFEA" },
      { key: "--color-text", label: "Texto Principal", fallback: "#242220" },
      { key: "--color-text-muted", label: "Texto Secundario", fallback: "#6B6762" }
    ];

    colorVars.forEach(cv => {
      const currentVal = state.customColors[cv.key] || getComputedStyle(document.documentElement).getPropertyValue(cv.key).trim() || cv.fallback;
      const hexVal = rgbToHex(currentVal) || cv.fallback;

      const row = document.createElement("div");
      row.className = "admin-color-picker-row";
      row.innerHTML = `
        <span class="admin-color-label">${cv.label}</span>
        <div class="admin-color-control">
          <span class="admin-color-hex" id="hex-${cv.key}">${hexVal}</span>
          <input type="color" class="admin-color-input" value="${hexVal}" data-var="${cv.key}">
        </div>
      `;

      const colorInput = row.querySelector("input");
      colorInput.addEventListener("input", (e) => {
        const val = e.target.value;
        state.customColors[cv.key] = val;
        document.documentElement.style.setProperty(cv.key, val);
        row.querySelector(".admin-color-hex").textContent = val;
      });

      colorsList.appendChild(row);
    });

    // 4. Sincronizar Imágenes Principales
    if (cfg.images) {
      setVal("admin-url-hero", cfg.images.heroBackground || "");
      document.getElementById("admin-preview-hero").src = cfg.images.heroBackground || "";

      setVal("admin-url-couple", cfg.images.couplePortrait || "");
      document.getElementById("admin-preview-couple").src = cfg.images.couplePortrait || "";
    }

    // 5. Renderizar Editor de Galería
    const galleryContainer = document.getElementById("admin-gallery-editor-list");
    galleryContainer.innerHTML = "";
    if (cfg.gallery && Array.isArray(cfg.gallery)) {
      cfg.gallery.forEach((photo, idx) => {
        const itemRow = document.createElement("div");
        itemRow.className = "admin-gallery-item-row";
        itemRow.innerHTML = `
          <img src="${photo.thumb || photo.src}" class="admin-gallery-thumb" id="admin-gthumb-${idx}" alt="Foto ${idx + 1}">
          <div class="admin-gallery-fields">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.75rem; font-weight: 600; color: #C5A880;">#${idx + 1}</span>
              <label class="admin-file-upload-btn" style="margin-bottom: 0; padding: 0.25rem 0.5rem; font-size: 0.7rem;">
                📁 Subir
                <input type="file" accept="image/*" data-idx="${idx}">
              </label>
            </div>
            <input type="text" class="admin-input" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;" value="${escapeHTML(photo.src || "")}" placeholder="URL de foto" data-src-idx="${idx}">
            <input type="text" class="admin-input" style="padding: 0.4rem 0.6rem; font-size: 0.8rem;" value="${escapeHTML(photo.caption || "")}" placeholder="Pie de foto / Descripción" data-caption-idx="${idx}">
          </div>
        `;

        // Subir archivo
        const fileInput = itemRow.querySelector("input[type='file']");
        fileInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            state.config.gallery[idx].src = dataUrl;
            state.config.gallery[idx].thumb = dataUrl;
            itemRow.querySelector("img").src = dataUrl;
            itemRow.querySelector(`[data-src-idx="${idx}"]`).value = dataUrl;
            if (window.renderGallery) window.renderGallery(state.config.gallery);
          };
          reader.readAsDataURL(file);
        });

        // Cambiar URL texto
        const srcInput = itemRow.querySelector(`[data-src-idx="${idx}"]`);
        srcInput.addEventListener("input", (e) => {
          const url = e.target.value;
          state.config.gallery[idx].src = url;
          state.config.gallery[idx].thumb = url;
          itemRow.querySelector("img").src = url;
          if (window.renderGallery) window.renderGallery(state.config.gallery);
        });

        // Cambiar pie de foto
        const captionInput = itemRow.querySelector(`[data-caption-idx="${idx}"]`);
        captionInput.addEventListener("input", (e) => {
          state.config.gallery[idx].caption = e.target.value;
        });

        galleryContainer.appendChild(itemRow);
      });
    }

    // 6. Sincronizar Música
    if (cfg.music) {
      setVal("admin-music-src", cfg.music.src || "");
      setVal("admin-music-title", cfg.music.title || "");
      setVal("admin-music-artist", cfg.music.artist || "");
      document.getElementById("admin-music-autoplay").checked = !!cfg.music.autoplayOnOpen;
      document.getElementById("admin-audio-test-title").textContent = cfg.music.title || "Canción";
      document.getElementById("admin-audio-test-artist").textContent = cfg.music.artist || "Artista";
    }

    // 7. Sincronizar Textos y Datos
    if (cfg.couple) {
      setVal("admin-bride-name", cfg.couple.brideName || "");
      setVal("admin-groom-name", cfg.couple.groomName || "");
      setVal("admin-bride-fullname", cfg.couple.fullNameBride || "");
      setVal("admin-groom-fullname", cfg.couple.fullNameGroom || "");
      setVal("admin-monogram", cfg.couple.monogram || "");
      setVal("admin-hashtag", cfg.couple.hashtag || "");
    }

    if (cfg.event) {
      setVal("admin-target-date", cfg.event.targetDate ? cfg.event.targetDate.slice(0, 16) : "");
      setVal("admin-display-date", cfg.event.displayDate || "");
      setVal("admin-city", cfg.event.city || "");
    }

    if (cfg.ceremony) {
      setVal("admin-ceremony-venue", cfg.ceremony.venue || "");
      setVal("admin-ceremony-time", cfg.ceremony.time || "");
      setVal("admin-ceremony-address", cfg.ceremony.address || "");
      setVal("admin-ceremony-maps", cfg.ceremony.mapsUrl || "");
    }

    if (cfg.reception) {
      setVal("admin-reception-venue", cfg.reception.venue || "");
      setVal("admin-reception-time", cfg.reception.time || "");
      setVal("admin-reception-address", cfg.reception.address || "");
      setVal("admin-reception-maps", cfg.reception.mapsUrl || "");
    }

    if (cfg.contact) {
      setVal("admin-whatsapp", cfg.contact.whatsappNumber || "");
      setVal("admin-rsvp-deadline", cfg.contact.rsvpDeadline || "");
    }

    const bankItem = cfg.gifts && cfg.gifts.items ? cfg.gifts.items.find(i => i.id === "bank") : null;
    if (bankItem && bankItem.bankDetails) {
      const b = bankItem.bankDetails;
      setVal("admin-bank-name", b.bank || "");
      setVal("admin-bank-holder", b.holder || "");
      setVal("admin-bank-acc", b.accountNumber || "");
      setVal("admin-bank-clabe", b.clabe || "");
      setVal("admin-bank-concept", b.concept || "");
    }
  }

  /**
   * Recolecta los datos de los inputs y actualiza el estado en memoria
   */
  function collectFormData() {
    const cfg = state.config;
    if (!cfg) return;

    // Pareja
    cfg.couple.brideName = getVal("admin-bride-name");
    cfg.couple.groomName = getVal("admin-groom-name");
    cfg.couple.fullNameBride = getVal("admin-bride-fullname");
    cfg.couple.fullNameGroom = getVal("admin-groom-fullname");
    cfg.couple.monogram = getVal("admin-monogram");
    cfg.couple.hashtag = getVal("admin-hashtag");

    // Fecha
    cfg.event.targetDate = getVal("admin-target-date");
    cfg.event.displayDate = getVal("admin-display-date");
    cfg.event.city = getVal("admin-city");

    // Ceremonia
    cfg.ceremony.venue = getVal("admin-ceremony-venue");
    cfg.ceremony.time = getVal("admin-ceremony-time");
    cfg.ceremony.address = getVal("admin-ceremony-address");
    cfg.ceremony.mapsUrl = getVal("admin-ceremony-maps");

    // Recepción
    cfg.reception.venue = getVal("admin-reception-venue");
    cfg.reception.time = getVal("admin-reception-time");
    cfg.reception.address = getVal("admin-reception-address");
    cfg.reception.mapsUrl = getVal("admin-reception-maps");

    // WhatsApp
    cfg.contact.whatsappNumber = getVal("admin-whatsapp");
    cfg.contact.rsvpDeadline = getVal("admin-rsvp-deadline");

    // Banco
    const bankItem = cfg.gifts && cfg.gifts.items ? cfg.gifts.items.find(i => i.id === "bank") : null;
    if (bankItem && bankItem.bankDetails) {
      bankItem.bankDetails.bank = getVal("admin-bank-name");
      bankItem.bankDetails.holder = getVal("admin-bank-holder");
      bankItem.bankDetails.accountNumber = getVal("admin-bank-acc");
      bankItem.bankDetails.clabe = getVal("admin-bank-clabe");
      bankItem.bankDetails.concept = getVal("admin-bank-concept");
    }

    // Imágenes
    cfg.images.heroBackground = getVal("admin-url-hero");
    cfg.images.couplePortrait = getVal("admin-url-couple");

    // Música
    cfg.music.src = getVal("admin-music-src");
    cfg.music.title = getVal("admin-music-title");
    cfg.music.artist = getVal("admin-music-artist");
    cfg.music.autoplayOnOpen = document.getElementById("admin-music-autoplay").checked;
  }

  /**
   * Guarda todo en localStorage
   */
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.config));
      localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(state.customColors));
      localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(state.hiddenSections));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
      alert("Atención: El almacenamiento local alcanzó su límite si las fotos base64 son muy grandes. Se recomienda usar URLs o exportar el archivo config.js.");
    }
  }

  /**
   * Rehidrata los elementos del DOM de la invitación
   */
  function rehydrateAll() {
    window.weddingConfig = JSON.parse(JSON.stringify(state.config));

    if (window.hydrateContent) window.hydrateContent(window.weddingConfig);
    if (window.hydrateMetadata) window.hydrateMetadata(window.weddingConfig);
    if (window.renderGallery) window.renderGallery(window.weddingConfig.gallery);
    if (window.renderGifts) window.renderGifts(window.weddingConfig.gifts);
    if (window.renderDressCode) window.renderDressCode(window.weddingConfig.dressCode);
    if (window.initCountdown && window.weddingConfig.event && window.weddingConfig.event.targetDate) {
      window.initCountdown(window.weddingConfig.event.targetDate);
    }

    // Actualizar audio player
    const audioEl = document.getElementById("wedding-audio");
    if (audioEl && window.weddingConfig.music && window.weddingConfig.music.src) {
      if (audioEl.src !== window.weddingConfig.music.src) {
        audioEl.src = window.weddingConfig.music.src;
      }
    }

    applyHiddenSections();
  }

  /**
   * Aplica una paleta predefinida
   */
  function applyPalette(palette) {
    Object.entries(palette.vars).forEach(([prop, val]) => {
      state.customColors[prop] = val;
      document.documentElement.style.setProperty(prop, val);
      const hexSpan = document.getElementById(`hex-${prop}`);
      if (hexSpan) hexSpan.textContent = val;
      const input = document.querySelector(`input[data-var="${prop}"]`);
      if (input) input.value = val;
    });
    showToast(`Paleta "${palette.name}" aplicada`);
  }

  /**
   * Helper para subida de imágenes con FileReader
   */
  function setupImageFileInput(fileInputId, urlInputId, onLoaded) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          urlInput.value = dataUrl;
          onLoaded(dataUrl);
        };
        reader.readAsDataURL(file);
      });
    }

    if (urlInput) {
      urlInput.addEventListener("input", (e) => {
        onLoaded(e.target.value);
      });
    }
  }

  /**
   * Helper para controles y prueba de audio
   */
  function setupMusicControls() {
    const fileInput = document.getElementById("admin-music-file");
    const srcInput = document.getElementById("admin-music-src");
    const testBtn = document.getElementById("admin-audio-test-btn");
    let testAudio = null;
    let isPlaying = false;

    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target.result;
          srcInput.value = dataUrl;
          state.config.music.src = dataUrl;
          const globalAudio = document.getElementById("wedding-audio");
          if (globalAudio) globalAudio.src = dataUrl;
          showToast("Pista de audio cargada");
        };
        reader.readAsDataURL(file);
      });
    }

    if (srcInput) {
      srcInput.addEventListener("input", (e) => {
        state.config.music.src = e.target.value;
        const globalAudio = document.getElementById("wedding-audio");
        if (globalAudio) globalAudio.src = e.target.value;
      });
    }

    if (testBtn) {
      testBtn.addEventListener("click", () => {
        const src = srcInput.value || (state.config.music ? state.config.music.src : "");
        if (!src) {
          alert("Ingresa primero la ruta o sube un archivo de música.");
          return;
        }

        if (!testAudio) {
          testAudio = new Audio(src);
          testAudio.addEventListener("ended", () => {
            isPlaying = false;
            testBtn.textContent = "▶";
          });
        } else if (testAudio.src !== src) {
          testAudio.src = src;
        }

        if (isPlaying) {
          testAudio.pause();
          isPlaying = false;
          testBtn.textContent = "▶";
        } else {
          testAudio.play().then(() => {
            isPlaying = true;
            testBtn.textContent = "⏸";
          }).catch(err => {
            console.warn("No se pudo reproducir audio:", err);
            alert("No se pudo reproducir el archivo de audio. Verifica el formato o la URL.");
          });
        }
      });
    }
  }

  /**
   * Genera el contenido de config.js para descarga
   */
  function exportConfigFile() {
    collectFormData();
    const configStr = `/**\n * ==============================================================================\n * ARCHIVO DE CONFIGURACIÓN GLOBAL - PLANTILLA DE INVITACIÓN DIGITAL PARA BODAS\n * ==============================================================================\n * Generado desde el Panel de Administración Privado\n * ==============================================================================\n */\n\nconst weddingConfig = ${JSON.stringify(state.config, null, 2)};\n\nif (typeof window !== "undefined") {\n  window.weddingConfig = weddingConfig;\n}\n\nif (typeof module !== "undefined" && module.exports) {\n  module.exports = weddingConfig;\n}\n`;

    const blob = new Blob([configStr], { type: "application/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("📋 Archivo config.js descargado");
  }

  /**
   * Muestra notificación Toast flotante
   */
  function showToast(msg) {
    const toast = document.getElementById("admin-toast");
    const toastText = document.getElementById("admin-toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  /* HELPERS DE UTILIDAD */
  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function escapeHTML(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function rgbToHex(rgb) {
    if (!rgb) return null;
    if (rgb.startsWith("#")) return rgb;
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return null;
    const r = parseInt(match[1]).toString(16).padStart(2, "0");
    const g = parseInt(match[2]).toString(16).padStart(2, "0");
    const b = parseInt(match[3]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
  }

})();
