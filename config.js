/**
 * ==============================================================================
 * ARCHIVO DE CONFIGURACIÓN GLOBAL - PLANTILLA DE INVITACIÓN DIGITAL PARA BODAS
 * ==============================================================================
 * Toda la información de la invitación se centraliza en este archivo.
 * Para crear una nueva invitación para otra pareja, solo debes cambiar los
 * valores de este objeto y reemplazar las imágenes en /assets/images/.
 * ==============================================================================
 */

const weddingConfig = {
  // 1. INFORMACIÓN DE LA PAREJA
  couple: {
    brideName: "Sarai",
    groomName: "Carlos",
    fullNameBride: "Sarai guadalupe cutirel aguila",
    fullNameGroom: "Carlos",
    hashtag: "#BodaSariyCarlos",
    monogram: "S & C"
  },

  // 2. FECHA Y HORA PRINCIPAL (Para la cuenta regresiva y textos de portada)
  event: {
    // Formato ISO (YYYY-MM-DDTHH:MM:SS) - Usado por el motor del contador regresivo
    targetDate: "2026-12-19T17:00:00",
    displayDate: "19 de Diciembre de 2026",
    shortDate: "19 · 12 · 2026",
    year: "2026",
    city: "Margaritas, Jalisco"
  },

  // 3. FOTOGRAFÍAS PRINCIPALES
  images: {
    heroBackground: "assets/images/hero-bg.jpg",
    couplePortrait: "assets/images/couple-portrait.jpg",
    ogShareImage: "assets/images/og-preview.jpg"
  },

  // 4. CEREMONIA RELIGIOSA / SIMBÓLICA
  ceremony: {
    title: "Ceremonia Religiosa",
    venue: "Parroquia Margaritas",
    date: "Domingo, 19 de Diciembre de 2026",
    time: "5:00 p.m.",
    address: "calle. Miguel Hidalgo, 47778, Margaritas, Jal.",
    mapsUrl: "https://maps.app.goo.gl/VtHXBFRgoCLX98BJA",
    // Si deseas embeber un mapa interactivo en la sección ubicación, coloca aquí el src del iframe de Google Maps:
    embedMapSrc: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d808.9083826179848!2d-102.4778264105843!3d20.452952090986248!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842ec878d7aa7e0d%3A0x5a4b79d4e9e24c4!2sParroquia%20Margaritas!5e0!3m2!1ses-419!2smx!4v1789064318255!5m2!1ses-419!2smx"
  },

  // 5. RECEPCIÓN Y FIESTA
  reception: {
    title: "Recepción & Brindis",
    venue: "Salón de Eventos Paraíso las Palmas",
    date: "Sabado, 19 de Diciembre de 2026",
    time: "6:30 p.m.",
    address: "Francisco Sarabia 301, 47778 Margaritas, Jal..",
    mapsUrl: "https://maps.app.goo.gl/8okCDPmBfpZQwBiF6"
  },

  // 6. CONTACTO Y CONFIRMACIÓN DE ASISTENCIA (WhatsApp RSVP)
  contact: {
    // Número con código de país, sin signos ni espacios (Ej: México 52 + 10 dígitos)
    whatsappNumber: "523329156763",
    displayPhone: "+52 (33) 291563",
    rsvpDeadline: "19 de Diciembre de 2026"
  },

  // 7. CÓDIGO DE VESTIMENTA (DRESS CODE) - Desactivado
  dressCode: null,

  // 8. MÚSICA AMBIENTAL
  music: {
    src: "assets/music.mp3",
    title: "Yellow",
    artist: "coldplay",
    autoplayOnOpen: true // Inicia al hacer clic en 'Abrir Invitación'
  },

  // 9. MESA DE REGALOS
  gifts: {
    message: "Tu presencia y bendición en nuestro gran día es el mejor regalo de todos. Sin embargo, si deseas tener un detalle con nosotros para comenzar nuestro nuevo hogar, ponemos a tu disposición las siguientes opciones:",
    items: [
      {
        id: "liverpool",
        name: "Liverpool",
        description: "Evento No. 50928413",
        buttonText: "Ver Mesa de Regalos",
        url: "https://mesaderegalos.liverpool.com.mx/",
        type: "link"
      },
      {
        id: "amazon",
        name: "Amazon Bodas",
        description: "Lista de Deseos Sofía & Alejandro",
        buttonText: "Ver Lista en Amazon",
        url: "https://www.amazon.com.mx/",
        type: "link"
      },
      {
        id: "palacio",
        name: "El Palacio de Hierro",
        description: "Celebraciones ID: PH-774921",
        buttonText: "Ver en Palacio",
        url: "https://www.elpalaciodehierro.com/",
        type: "link"
      },
      {
        id: "bank",
        name: "Transferencia Bancaria",
        description: "Aportación directa para nuestra luna de miel",
        buttonText: "Ver Datos Bancarios",
        type: "modal", // Abre modal interactivo con datos y botón copiar CLABE
        bankDetails: {
          bank: "BBVA México",
          holder: "Sofía Martínez Valdés / Alejandro Gómez Rivera",
          accountNumber: "1548 9204 8831",
          clabe: "012180015489204883",
          concept: "Boda Sofia y Alex"
        }
      }
    ]
  },

  // 10. NUESTRA HISTORIA (Timeline Dinámico)
  timeline: [
    {
      year: "Marzo 2020",
      title: "El Primer Encuentro",
      description: "Nos conocimos en una cafetería del centro una tarde lluviosa. Lo que comenzó como una conversación casual se transformó en horas de risas interminables."
    },
    {
      year: "Octubre 2020",
      title: "Nuestra Primera Cita Oficial",
      description: "Una cena con vista panorámica y un paseo bajo las luces de la ciudad que confirmó que estábamos hechos el uno para el otro."
    },
    {
      year: "Febrero 2021",
      title: "Comenzó Nuestra Historia",
      description: "Decidimos caminar de la mano formalmente e iniciar la aventura más bonita de nuestras vidas, coleccionando viajes y memorias."
    },
    {
      year: "Diciembre 2024",
      title: "El Gran '¡Sí, Acepto!'",
      description: "Durante un viaje inolvidable al atardecer frente al mar, Alejandro se arrodilló con lágrimas de emoción y Sofía dijo que sí con todo el corazón."
    },
    {
      year: "19 Diciembre 2026",
      title: "El Gran Día",
      description: "Frente a Dios, a nuestras familias y a ustedes, uniremos nuestras vidas para siempre en un amor sin final."
    }
  ],

  // 11. GALERÍA FOTOGRÁFICA (Placeholder de 10 fotos estéticas)
  gallery: [
    {
      src: "assets/images/gallery-1.jpg",
      thumb: "assets/images/gallery-1.jpg",
      caption: "Nuestras alianzas de compromiso",
      alt: "Aas sobre terciopelo"
    },
    {
      src: "assets/images/gallery-2.jpg",
      thumb: "assets/images/gallery-2.jpg",
      caption: "El dia en que tomamos la mejor decisión de nuestras vidas",
      alt: "Ramo de novia en tonos marfil y beige"
    },
    {
      src: "assets/images/gallery-3.jpg",
      thumb: "assets/images/gallery-3.jpg",
      caption: "Nuestro Amor es mas que real",
      alt: "Velo nupcial y vestido de alta costura"
    },
    {
      src: "assets/images/gallery-4.jpg",
      thumb: "assets/images/gallery-4.jpg",
      caption: "Nuestro amor es eterno y verdadero",
      alt: "Mancuernillas y reloj formal del novio"
    },
    {
      src: "assets/images/gallery-5.jpg",
      thumb: "assets/images/gallery-5.jpg",
      caption: "El comienzo de nuestra eternidad",
      alt: "Pasillo nupcial con arreglos de flores blancas"
    },
    {
      src: "assets/images/gallery-6.jpg",
      thumb: "assets/images/gallery-6.jpg",
      caption: "Un amor que nos trajo hasta aquí",
      alt: "Decoración de mesas para recepción de boda"
    },
    {
      src: "assets/images/gallery-7.jpg",
      thumb: "assets/images/gallery-7.jpg",
      caption: "Un poco de nosotros, un poco de nuestro amor",
      alt: "Pareja caminando de la mano durante la hora dorada"
    },
    {
      src: "assets/images/gallery-8.jpg",
      thumb: "assets/images/gallery-8.jpg",
      caption: "Miradas que dicen más que mil palabras",
      alt: "Copas de champagne listas para el brindis"
    },
    {
      src: "assets/images/gallery-9.jpg",
      thumb: "assets/images/gallery-9.jpg",
      caption: "Cada paso nos acercaba a nuestro destino",
      alt: "Pareja abrazada en la pista de baile"
    },
    {
      src: "assets/images/gallery-10.jpg",
      thumb: "assets/images/gallery-10.jpg",
      caption: "Momentos que durarán toda la vida",
      alt: "Pareja compartiendo una sonrisa espontánea"
    }
  ],

  // 12. TEXTOS EDITORIALES Y FRASES
  texts: {
    heroTagline: "Tenemos el honor de invitarte a celebrar nuestro amor",
    heroButton: "ABRIR INVITACIÓN",
    weAreGettingMarried: "Nos casamos",
    coupleStory: "Después de compartir tantos momentos, aventuras y sueños, hemos decidido dar el siguiente paso juntos. Queremos que seas testigo de nuestra promesa eterna de amor.",
    quote: "«El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.»",
    quoteAuthor: "Antoine de Saint-Exupéry",
    finalMessage: "Gracias por formar parte de nuestra historia y acompañarnos en el día más feliz de nuestras vidas.",
    rsvpTitle: "¿Nos acompañas?",
    rsvpSubtitle: "Confirma tu asistencia antes del 30 de Octubre",
    locationTitle: "¿Cómo llegar?",
    locationSubtitle: "Te esperamos con los brazos abiertos para celebrar juntos",
    footerLove: "Con amor",
    footerPoweredBy: "Invitación digital"
  },

  // 13. SEO & OPEN GRAPH (Para vista previa perfecta en WhatsApp, Facebook, iMessage)
  seo: {
    title: "Sari & Carlos | Nuestra Boda",
    description: "Tenemos el honor de invitarte a celebrar nuestro enlace matrimonial el 19 de Diciembre de 2026 en Margaritas, Jal.",
    siteUrl: "https://tudominio.com",
    ogImage: "assets/images/og-preview.jpeg"
  }
};

// Asignación explícita para acceso universal en navegador y consola
if (typeof window !== "undefined") {
  window.weddingConfig = weddingConfig;
}

// Exportación para entornos modulares si se requiere
if (typeof module !== "undefined" && module.exports) {
  module.exports = weddingConfig;
}
