# 💍 Plantilla Web Premium de Invitación Digital para Bodas

Bienvenido a la documentación oficial de la **Plantilla Comercial de Invitación Digital para Bodas**. Esta plantilla ha sido diseñada con estándares editoriales de alta gama, arquitectura mobile-first, animaciones sutiles, reproductor de música ambiental, lightbox fotográfico y un sistema centralizado de configuración mediante `config.js`.

---

## 📋 Tabla de Contenidos
1. [Cómo instalar](#1-cómo-instalar)
2. [Cómo ejecutar localmente](#2-cómo-ejecutar-localmente)
3. [Cómo cambiar nombres de los novios](#3-cómo-cambiar-nombres)
4. [Cómo cambiar la fecha y el contador](#4-cómo-cambiar-fecha)
5. [Cómo cambiar las fotografías](#5-cómo-cambiar-fotografías)
6. [Cómo cambiar la música ambiental](#6-cómo-cambiar-música)
7. [Cómo cambiar la ubicación y Google Maps](#7-cómo-cambiar-ubicación)
8. [Cómo cambiar el número de WhatsApp para RSVP](#8-cómo-cambiar-whatsapp)
9. [Cómo cambiar los colores y tema visual](#9-cómo-cambiar-colores)
10. [Cómo cambiar textos y frases románticas](#10-cómo-cambiar-textos)
11. [Cómo configurar la mesa de regalos y datos bancarios](#11-cómo-cambiar-mesa-de-regalos)
12. [Cómo modificar la línea de tiempo (timeline)](#12-cómo-modificar-timeline)
13. [Cómo crear otra invitación para una nueva pareja](#13-cómo-crear-otra-invitación)
14. [Cómo desplegar en Vercel](#14-cómo-desplegar-en-vercel)
15. [Cómo desplegar en Netlify](#15-cómo-desplegar-en-netlify)
16. [Cómo desplegar en GitHub Pages](#16-cómo-desplegar-en-github-pages)

---

## 1. Cómo instalar

Esta plantilla está construida con **HTML5, CSS3 y JavaScript moderno nativo**, por lo que **no requiere compilar, transpilar ni instalar frameworks pesados**.

1. Descarga o clona la carpeta del proyecto en tu computadora:
   ```bash
   git clone https://github.com/tu-usuario/plantilla-bodas.git
   ```
2. La estructura del proyecto es la siguiente:
   ```text
   /
   ├── index.html                 # Estructura semántica y metadatos SEO / Open Graph
   ├── config.js                  # Centralización total de datos de la pareja y evento
   ├── favicon.svg                # Favicon de alta resolución
   ├── README.md                  # Este manual de uso
   ├── css/
   │   ├── variables.css          # Colores, tipografías, sombras y tokens visuales
   │   ├── base.css               # Estilos base, reset y utilidades
   │   ├── components.css         # Tarjetas, botones, countdown, lightbox, reproductor
   │   └── responsive.css         # Optimización móvil para 360px, 375px, 390px, 412px, 768px+
   ├── js/
   │   ├── app.js                 # Hidratador principal y animaciones al scroll
   │   ├── countdown.js           # Motor de cuenta regresiva en tiempo real
   │   ├── audio-player.js        # Reproductor de música ambiental flotante
   │   ├── lightbox.js            # Visor táctil para galería fotográfica
   │   └── rsvp.js                # Validación de formulario y generador de mensaje WhatsApp
   └── assets/
       ├── images/                # Fotos de los novios y galería
       ├── icons/                 # Iconos SVG vectoriales limpios
       └── music/                 # Archivo de audio ambiental (MP3)
   ```

---

## 2. Cómo ejecutar localmente

Puedes probar la invitación de tres formas sencillas:

- **Opción A (Doble clic directo)**:
  Abre directamente el archivo `index.html` en tu navegador favorito (Chrome, Edge, Safari, Firefox).
  
- **Opción B (Con extensión Live Server de VS Code)**:
  Haz clic derecho sobre `index.html` y selecciona **"Open with Live Server"**.

- **Opción C (Servidor local por terminal)**:
  Si tienes Python o Node.js instalado:
  ```bash
  # Con Python:
  python -m http.server 8080
  
  # O con npx:
  npx serve .
  ```
  Luego abre en tu navegador: `http://localhost:8080`.

---

## 3. Cómo cambiar nombres

Abre el archivo `config.js` y localiza el bloque `couple`:

```javascript
couple: {
  brideName: "Sofía",                  // Nombre de pila de la novia
  groomName: "Alejandro",              // Nombre de pila del novio
  fullNameBride: "Sofía Martínez Valdés",
  fullNameGroom: "Alejandro Gómez Rivera",
  hashtag: "#BodaSofiaYAlejandro",
  monogram: "S & A"                    // Iniciales estilizadas
}
```

Al guardar el archivo, los nombres se actualizarán automáticamente en la portada, sección "Nos casamos", WhatsApp RSVP, mensaje final y pie de página.

---

## 4. Cómo cambiar fecha y el contador

En `config.js`, edita el bloque `event`:

```javascript
event: {
  // Formato ISO estándar (Año-Mes-DíaTHora:Minuto:Segundo)
  targetDate: "2026-11-15T16:00:00",
  displayDate: "15 de Noviembre de 2026",
  shortDate: "15 · 11 · 2026",
  year: "2026",
  city: "Guadalajara, Jalisco"
}
```

- `targetDate`: Es la fecha que calcula el contador regresivo en días, horas, minutos y segundos.
- `displayDate`: El texto legible que se muestra en la portada, tarjetas y pie de página.

---

## 5. Cómo cambiar fotografías

1. Coloca las nuevas imágenes dentro de la carpeta `assets/images/`.
2. Puedes conservar los mismos nombres de archivo para reemplazarlas directamente:
   - `hero-bg.jpg` (Fotografía vertical o panorámica de alta resolución para la portada).
   - `couple-portrait.jpg` (Retrato editorial con encuadre vertical para la presentación de los novios).
   - `gallery-1.jpg` a `gallery-10.jpg` (Fotografías para la galería).
   - `og-preview.jpg` (Imagen de 1200x630 px que se verá al compartir por WhatsApp o Facebook).
3. Si utilizas otros nombres o rutas, actualízalas en `config.js` en las secciones `images` y `gallery`.

---

## 6. Cómo cambiar música

1. Coloca tu archivo de música en formato `.mp3` dentro de `assets/music/` (por ejemplo, `assets/music/music.mp3` o `assets/music.mp3`).
2. En `config.js`, verifica la ruta:
   ```javascript
   music: {
     src: "assets/music.mp3",
     title: "Melodía Romántica al Piano",
     artist: "Sofía & Alejandro",
     autoplayOnOpen: true
   }
   ```
> **Nota de política de navegadores**: Los navegadores modernos bloquean la reproducción automática de sonido sin interacción del usuario. Por esta razón, la música comienza de forma natural cuando el invitado presiona el botón **"ABRIR INVITACIÓN"** o mediante el botón flotante en la esquina inferior.

---

## 7. Cómo cambiar ubicación y Google Maps

En `config.js`, edita las secciones `ceremony` y `reception`:

```javascript
ceremony: {
  title: "Ceremonia Religiosa",
  venue: "Parroquia San Miguel Arcángel",
  date: "Domingo, 15 de Noviembre de 2026",
  time: "16:00 hrs",
  address: "Av. Hidalgo 1450, Centro Histórico, Guadalajara, Jal.",
  mapsUrl: "https://maps.google.com/?q=Parroquia+San+Miguel+Guadalajara",
  embedMapSrc: "https://www.google.com/maps/embed?..." // URL del iframe de Google Maps
},
reception: {
  title: "Recepción & Brindis",
  venue: "Jardín Los Olivos",
  date: "Domingo, 15 de Noviembre de 2026",
  time: "18:30 hrs",
  address: "Camino Real a Colima 520, Santa Ana Tepetitlán, Zapopan, Jal.",
  mapsUrl: "https://maps.google.com/?q=Jardin+Los+Olivos+Zapopan"
}
```

### ¿Cómo obtener el enlace de Google Maps?
1. Abre Google Maps y busca la iglesia o salón.
2. Haz clic en **Compartir** y copia el enlace para `mapsUrl`.
3. Para el mapa embebido, haz clic en **Compartir > Insertar un mapa** y copia únicamente el contenido dentro de `src="..."` para colocarlo en `embedMapSrc`.

---

## 8. Cómo cambiar WhatsApp para confirmación de asistencia (RSVP)

En `config.js`, en el bloque `contact`:

```javascript
contact: {
  // Código de país + lada + número (sin espacios, signos + ni guiones)
  // Ejemplo México: 52 + 10 dígitos -> 5213312345678
  whatsappNumber: "5213312345678",
  displayPhone: "+52 (33) 1234-5678",
  rsvpDeadline: "30 de Octubre de 2026"
}
```

Cuando un invitado llene el formulario y pulse **"CONFIRMAR POR WHATSAPP"**, se abrirá la aplicación de WhatsApp con un mensaje estructurado y listo para enviar:
> *¡Hola! Soy Ramón Gómez.*
> *Confirmo con mucha alegría mi asistencia a la boda de Sofía y Alejandro.*
> *👥 Acompañantes adicionales: 1*
> *💌 Mensaje / Restricciones: Alergia a nueces.*

---

## 9. Cómo cambiar colores y estilo visual

Todo el estilo visual se controla mediante variables CSS en `css/variables.css`. Puedes crear temas de color completos modificando:

```css
:root {
  --color-bg: #FAF7F2;          /* Color de fondo principal (marfil suave) */
  --color-bg-card: #FFFFFF;     /* Fondo de las tarjetas */
  --color-bg-subtle: #F4EFEA;   /* Fondo de secciones alternas (beige champagne) */
  
  --color-primary: #C5A880;     /* Dorado champán elegante */
  --color-primary-dark: #A48459;/* Dorado oscuro para textos destacados */
  --color-primary-light: #EFE4D6;/* Acento dorado marfil */

  --color-text: #242220;        /* Color del texto de lectura */
  --color-text-muted: #6B6762;  /* Texto secundario y descripciones */
}
```

**Ejemplos de paletas recomendadas**:
- **Boda Romántica Rosa Nude**: `--color-primary: #D4A5A5; --color-bg: #FDFBFB;`
- **Boda Jardín / Eucalipto**: `--color-primary: #7C9082; --color-bg: #F8FAF8;`
- **Boda Minimalista Noir**: `--color-primary: #1F1F1F; --color-bg: #F9F9F9;`

---

## 10. Cómo cambiar textos y frases

En `config.js`, en el bloque `texts`:

```javascript
texts: {
  heroTagline: "Tenemos el honor de invitarte a celebrar nuestro amor",
  heroButton: "ABRIR INVITACIÓN",
  weAreGettingMarried: "Nos casamos",
  coupleStory: "Después de compartir tantos momentos, aventuras y sueños, hemos decidido dar el siguiente paso juntos...",
  quote: "«El amor no consiste en mirarse el uno al otro, sino en mirar juntos en la misma dirección.»",
  quoteAuthor: "Antoine de Saint-Exupéry",
  finalMessage: "Gracias por formar parte de nuestra historia y acompañarnos en el día más feliz de nuestras vidas.",
  rsvpTitle: "¿Nos acompañas?",
  rsvpSubtitle: "Confirma tu asistencia antes del 30 de Octubre",
  footerLove: "Con amor",
  footerPoweredBy: "Invitación digital"
}
```

---

## 11. Cómo cambiar mesa de regalos y datos bancarios

En `config.js`, en el bloque `gifts`:

```javascript
gifts: {
  message: "Tu presencia es nuestro mejor regalo...",
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
      description: "Lista de Deseos",
      buttonText: "Ver Lista en Amazon",
      url: "https://www.amazon.com.mx/",
      type: "link"
    },
    {
      id: "bank",
      name: "Transferencia Bancaria",
      description: "Aportación directa",
      buttonText: "Ver Datos Bancarios",
      type: "modal",
      bankDetails: {
        bank: "BBVA México",
        holder: "Sofía Martínez & Alejandro Gómez",
        accountNumber: "1548 9204 8831",
        clabe: "012180015489204883",
        concept: "Regalo Boda"
      }
    }
  ]
}
```

Al hacer clic en el botón de transferencia, se abrirá un modal con un botón interactivo **"Copiar CLABE"** que copia el número al portapapeles y muestra confirmación visual.

---

## 12. Cómo modificar la línea de tiempo (timeline)

Puedes añadir, quitar o reordenar hitos de amor en el arreglo `timeline` de `config.js`:

```javascript
timeline: [
  {
    year: "Marzo 2020",
    title: "El Primer Encuentro",
    description: "Nos conocimos en una cafetería del centro una tarde lluviosa..."
  },
  {
    year: "Diciembre 2024",
    title: "El Compromiso",
    description: "Frente al mar al atardecer, dijimos que sí con todo el corazón..."
  },
  {
    year: "15 Noviembre 2026",
    title: "El Gran Día",
    description: "Uniremos nuestras vidas para siempre frente a Dios y ustedes..."
  }
]
```

La página calculará y renderizará automáticamente las tarjetas en la línea de tiempo con animaciones al scroll.

---

## 13. Cómo crear otra invitación utilizando la misma plantilla

Para vender o entregar una nueva invitación a otra pareja:

1. Duplica toda la carpeta del proyecto y renómbrala (ej: `boda-mariana-y-carlos`).
2. Reemplaza las fotos de la pareja en `assets/images/`.
3. Modifica únicamente el archivo `config.js` con los datos de la nueva boda.
4. Si la nueva boda requiere una paleta de color diferente (ej. verde olivo o azul marino), ajusta 2 o 3 valores en `css/variables.css`.
5. ¡Listo! La nueva invitación queda 100% personalizada en menos de 10 minutos.

---

## 14. Cómo desplegar en Vercel

1. Crea una cuenta gratuita en [Vercel](https://vercel.com).
2. Si tienes [Vercel CLI](https://vercel.com/docs/cli) instalado:
   ```bash
   vercel
   ```
3. O bien, conecta tu repositorio de GitHub a Vercel:
   - Selecciona **Add New Project**.
   - Importa el repositorio de la boda.
   - En **Framework Preset**, selecciona **Other** (sitio estático).
   - Haz clic en **Deploy**.
4. En 10 segundos tendrás una URL segura con certificado SSL (ejemplo: `boda-sofia-y-alejandro.vercel.app`).

---

## 15. Cómo desplegar en Netlify

1. Ve a [Netlify](https://www.netlify.com) e inicia sesión.
2. Puedes desplegar mediante **Drag & Drop** instantáneo:
   - Ve a la pestaña **Sites**.
   - Arrastra la carpeta completa del proyecto al recuadro de subida.
   - Netlify publicará la página de inmediato.
3. O conéctalo mediante Git:
   - Haz clic en **Add new site > Import an existing project**.
   - Selecciona el repositorio y haz clic en **Deploy site**.

---

## 16. Cómo desplegar en GitHub Pages

1. Sube tu proyecto a un repositorio de GitHub (público o privado).
2. En GitHub, ve a **Settings > Pages** en el menú lateral.
3. En la sección **Branch**, selecciona la rama `main` (o `master`) y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. En 1 o 2 minutos, tu invitación estará en línea en:
   `https://tu-usuario.github.io/nombre-del-repo/`

---

## 💎 Licencia y Uso Comercial

Esta plantilla está optimizada para ser comercializada como un servicio llave en mano de invitaciones digitales de lujo. Todos los recursos incluidos (código, tipografías e iconos SVG) son de libre uso comercial sin regalías.
