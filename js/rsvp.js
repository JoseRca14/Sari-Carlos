/**
 * ==============================================================================
 * MÓDULO DE CONFIRMACIÓN DE ASISTENCIA (RSVP POR WHATSAPP)
 * ==============================================================================
 */

function initRSVP(config) {
  const form = document.getElementById("rsvp-form");
  const feedbackEl = document.getElementById("rsvp-feedback");
  if (!form) return;

  // Radio button visual styling
  const radioLabels = form.querySelectorAll(".radio-card");
  radioLabels.forEach(label => {
    const radioInput = label.querySelector("input[type='radio']");
    if (radioInput) {
      radioInput.addEventListener("change", () => {
        radioLabels.forEach(l => l.classList.remove("selected"));
        if (radioInput.checked) label.classList.add("selected");
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (feedbackEl) {
      feedbackEl.className = "form-feedback";
      feedbackEl.style.display = "none";
      feedbackEl.textContent = "";
    }

    const nameInput = document.getElementById("rsvp-name");
    const attendanceInput = form.querySelector("input[name='attendance']:checked");
    const guestsSelect = document.getElementById("rsvp-guests");
    const messageInput = document.getElementById("rsvp-message");

    const name = nameInput ? nameInput.value.trim() : "";
    const attendance = attendanceInput ? attendanceInput.value : "yes";
    const guests = guestsSelect ? guestsSelect.value : "0";
    const message = messageInput ? messageInput.value.trim() : "";

    // Validación
    if (!name || name.length < 2) {
      showError("Por favor, ingresa tu nombre completo.");
      if (nameInput) nameInput.focus();
      return;
    }

    const bride = (config.couple && config.couple.brideName) || "la novia";
    const groom = (config.couple && config.couple.groomName) || "el novio";
    const phone = (config.contact && config.contact.whatsappNumber) || "";

    if (!phone) {
      showError("El número de WhatsApp no está configurado en config.js.");
      return;
    }

    let whatsappText = "";

    if (attendance === "yes") {
      whatsappText = `¡Hola! Soy *${name}*.\n` +
        `Confirmo con mucha alegría mi asistencia a la boda de *${bride}* y *${groom}*.\n` +
        `👥 *Acompañantes adicionales:* ${guests}\n`;
      if (message) {
        whatsappText += `💌 *Mensaje / Restricciones:* ${message}\n`;
      }
      whatsappText += `\n¡Nos vemos pronto para celebrar juntos! ✨🥂`;
    } else {
      whatsappText = `¡Hola! Soy *${name}*.\n` +
        `Lamentablemente no podré acompañarlos a la boda de *${bride}* y *${groom}*, pero les envío mis mejores deseos y bendiciones en esta nueva etapa.\n`;
      if (message) {
        whatsappText += `💌 *Mensaje con cariño:* ${message}\n`;
      }
    }

    // Limpiar caracteres del número (solo dígitos)
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(whatsappText);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

    // Abrir WhatsApp en pestaña nueva
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Feedback al usuario
    if (feedbackEl) {
      feedbackEl.className = "form-feedback";
      feedbackEl.style.display = "block";
      feedbackEl.style.backgroundColor = "#E6F4EA";
      feedbackEl.style.color = "#137333";
      feedbackEl.style.border = "1px solid #CEEAD6";
      feedbackEl.textContent = "¡Redirigiendo a WhatsApp para enviar tu confirmación!";
    }
  });

  function showError(msg) {
    if (!feedbackEl) {
      alert(msg);
      return;
    }
    feedbackEl.className = "form-feedback error";
    feedbackEl.style.display = "block";
    feedbackEl.textContent = msg;
  }
}

window.initRSVP = initRSVP;
