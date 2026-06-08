// =========================================
// Importamos la configuración de Firebase
// ==========================================
import { documentoRef, updateDoc, increment, onSnapshot } from './firebase-config.js';



// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

let esperandoPreguntaInicial = true;

// Elementos de la Terminal e Interfaz General
const output = document.getElementById('output');
const promptElement = document.getElementById('terminal-prompt');
const commandInput = document.getElementById('commandInput');
const terminalUI = document.getElementById('terminal');
const terminalSide = document.getElementById('terminal-side');
const portfolioContent = document.getElementById('portfolio-content');
const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('side-menu');
const sendBtn = document.getElementById('send-btn');
let intentosFallidos = 0; // Se inicia en 0 y no se reinicia en cada comando
const topbar = document.getElementById('topbar');

// Elementos del Vídeo y Textos internos del vídeo
const vid = document.getElementById('v0');
const videoSection = document.getElementById('video-section');
const txtFrase1 = document.getElementById('frase1');
const txtFrase2 = document.getElementById('frase2');
const txtFrase3 = document.getElementById('frase3');

// Elementos del Efecto Glow (Logo)
const container = document.getElementById('mouseContainer');

// Elementos de música
const musicControl = document.getElementById('music-control');
const bgMusic = document.getElementById('bg-music');


// ==========================================
// 2. ESTADO DE LA APLICACIÓN
// ==========================================
let targetScrollPos = 0;
let currentVideoTime = 0;

// Variables para el control multi-sección de frases deslizantes
let seccionActiva = null; 
let fraseScrollActivo = false;
const VELOCIDAD_FRASE = 0.0005; 


// ==========================================
// 3. FUNCIONES Y LÓGICA PRINCIPAL
// ==========================================

function processCommand(cmd) {
    let response = '';
    let limpiado = cmd.toLowerCase().trim();

    // FASE 1: Responder a la pregunta de si es programador
    if (esperandoPreguntaInicial) {
        if (limpiado === 's') {
            esperandoPreguntaInicial = false;
            response = `<br>¡Genial! Entonces, no tendrás problema para escribir el comando adecuado:`;
            output.innerHTML += `<div>${cmd}${response}</div>`;
            promptElement.textContent = '>';
        }
        else if (limpiado === 'n') {
            output.innerHTML += `<div>${cmd}${response}</div>`;
            setTimeout(() => {
                transitionToPortfolio();
            }, 800);
        }
        else {
            response = `<br><span class="Terminal-error">Por favor, responde 's' para Sí o 'n' para No.</span>`;
            output.innerHTML += `<div>${cmd}${response}</div>`;
        }

        commandInput.value = '';
        terminalUI.scrollTop = terminalUI.scrollHeight;
        return;
    }

    // FASE 2: Comandos normales
    if (limpiado === 'letsgo') {
        transitionToPortfolio();
        return;
    } else if (limpiado === 'clear') {
        output.innerHTML = `<p>MoniBe Portfolio [Versión MRB.01 (2026)]</p>`;
        commandInput.value = '';
        return;
    } else if (limpiado === 'restart') {
        window.location.reload();
        return;
    } else if (limpiado === 'help' || limpiado === '-help' || limpiado === '--help') {
        response = `<br>Comandos disponibles: 
            <br><strong>restart</strong> - Volver a empezar
            <br><strong>clear</strong> - Limpiar terminal
            <br><strong>letsgo</strong> - Iniciar experiencia` ;

    } else {
        intentosFallidos++; 

        if (intentosFallidos < 3) {
            response = `<br><span class="terminal-error">Terminal-error: comando no reconocido: "${limpiado}"</span>`;
        } else {
            response = `<br><span class="terminal-error">Comando no reconocido: "${limpiado}".<br>¿Estás seguro que eres desarrollador? 😋 <br>Prueba a escribir <strong>--help</strong> si estás perdido.</span>`;
        }
    }

    output.innerHTML += `<div><span class="prompt">> ${cmd}</span>${response}</div>`;
    commandInput.value = '';
    terminalUI.scrollTop = terminalUI.scrollHeight;
}

function submitCommand() {
    const command = commandInput.value;
    if (command.trim() !== '') {
        processCommand(command);
    }
}

function transitionToPortfolio(instantaneo = false) {
    const loader = document.getElementById('loader');
    const delay = instantaneo ? 0 : 2500;
 
    terminalUI.classList.add('hidden');
    if (!instantaneo && loader) loader.classList.remove('hidden');
 
    setTimeout(() => {
        if (loader) loader.classList.add('fade-out');
 
        hamburger.classList.remove('hidden');
        if (topbar) topbar.classList.remove('hidden');
        
        terminalSide.style.opacity = '0';
        terminalSide.style.pointerEvents = 'none';

        setTimeout(() => {
            terminalSide.classList.add('as-menu');
            terminalSide.classList.add('menu-hidden');
            terminalSide.style.opacity = '';
            terminalSide.style.pointerEvents = '';
            sideMenu.classList.remove('hidden');
        }, 600);

        portfolioContent.classList.remove('hidden');

        if (bgMusic) {
            bgMusic.play().catch(err => {
                console.log("El navegador bloqueó el autoplay inicialmente:", err);
            });
        }

        setTimeout(() => {
            portfolioContent.classList.add('visible');
        }, 300);
 
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
        }, 1000);
 
    }, delay); 
}

// Bucle de renderizado para sincronizar el vídeo con el scroll
function updateVideo() {
    if (vid && vid.duration && vid.readyState >= 2) {
        const targetTime = vid.duration * targetScrollPos;
        currentVideoTime += (targetTime - currentVideoTime) * 0.1;
        vid.currentTime = currentVideoTime;

        const totalDuration = vid.duration;

        if (currentVideoTime > (totalDuration * 0.05) && currentVideoTime < (totalDuration * 0.30)) {
            txtFrase1.style.opacity = "1";
        } else {
            txtFrase1.style.opacity = "0";
        }

        if (currentVideoTime >= (totalDuration * 0.35) && currentVideoTime < (totalDuration * 0.60)) {
            txtFrase2.style.opacity = "1";
        } else {
            txtFrase2.style.opacity = "0";
        }

        if (currentVideoTime >= (totalDuration * 0.65) && currentVideoTime < (totalDuration * 0.95)) {
            txtFrase3.style.opacity = "1";
        } else {
            txtFrase3.style.opacity = "0";
        }
    }
    requestAnimationFrame(updateVideo);
}

// LÓGICA DE MOVIMIENTO DE LAS FRASES TRANSICIONALES (Cualquier Sección)
function actualizarFrasesTransicion(contenedor, progreso) {
    if (!contenedor) return;
    const linea1 = contenedor.querySelector('.linea-1');
    const linea2 = contenedor.querySelector('.linea-2');
    if (!linea1 || !linea2) return;

    // Linea 1
    if (progreso < 0.4) {
        const t = progreso / 0.4; 
        const x = 120 - (t * 120); 
        const op = Math.min(1, t * 3); 
        linea1.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea1.style.opacity = op;
    } else if (progreso < 0.7) {
        const t = (progreso - 0.4) / 0.3; 
        const x = -(t * 130); 
        const op = Math.max(0, 1 - t * 1.5);
        linea1.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea1.style.opacity = op;
    } else {
        linea1.style.opacity = 0;
    }

    // Linea 2
    if (progreso >= 0.55) {
        const t = (progreso - 0.55) / 0.45; 
        const x = 120 - (t * 120); 
        const op = Math.min(1, t * 2);
        linea2.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea2.style.opacity = op;
    } else {
        linea2.style.transform = `translate(calc(-50% + 120vw), -50%)`;
        linea2.style.opacity = 0;
    }
}

function onWheelFrase(e) {
    if (!fraseScrollActivo || !seccionActiva) return;
    e.preventDefault();

    const delta = e.deltaY || e.deltaX;
    let progresoActual = parseFloat(seccionActiva.dataset.progreso || 0);
    progresoActual += delta * VELOCIDAD_FRASE;

    if (progresoActual < 0) progresoActual = 0;
    if (progresoActual > 1) progresoActual = 1;

    seccionActiva.dataset.progreso = progresoActual;
    actualizarFrasesTransicion(seccionActiva, progresoActual);

    if (progresoActual >= 1) {
        desactivarScrollFrase();
    }
}

let touchStartY = 0;
function onTouchStartFrase(e) {
    touchStartY = e.touches[0].clientY;
}

function onTouchMoveFrase(e) {
    if (!fraseScrollActivo || !seccionActiva) return;
    e.preventDefault();
    const delta = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    
    let progresoActual = parseFloat(seccionActiva.dataset.progreso || 0);
    progresoActual += delta * VELOCIDAD_FRASE * 2;
    progresoActual = Math.max(0, Math.min(1, progresoActual));
    
    seccionActiva.dataset.progreso = progresoActual;
    actualizarFrasesTransicion(seccionActiva, progresoActual);
    
    if (progresoActual >= 1) desactivarScrollFrase();
}

function activarScrollFrase(contenedor) {
    seccionActiva = contenedor;
    fraseScrollActivo = true;
    portfolioContent.style.overflowY = 'hidden';
    window.addEventListener('wheel', onWheelFrase, { passive: false });
    window.addEventListener('touchstart', onTouchStartFrase, { passive: true });
    window.addEventListener('touchmove', onTouchMoveFrase, { passive: false });
}

function desactivarScrollFrase() {
    fraseScrollActivo = false;
    seccionActiva = null;
    portfolioContent.style.overflowY = 'auto';
    window.removeEventListener('wheel', onWheelFrase);
    window.removeEventListener('touchstart', onTouchStartFrase);
    window.removeEventListener('touchmove', onTouchMoveFrase);
}


// ==========================================
// 4. ESCUCHADORES DE EVENTOS
// ==========================================

commandInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        submitCommand();
    }
});

if (sendBtn) {
    sendBtn.addEventListener('click', function() {
        submitCommand();
        commandInput.focus();
    });
}

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    terminalSide.classList.toggle('menu-hidden');
});

if (musicControl && bgMusic) {
    musicControl.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicControl.classList.remove('muted');
        } else {
            bgMusic.pause();
            musicControl.classList.add('muted');
        }
    });
}

// Control del scroll para el progreso del vídeo
portfolioContent.addEventListener('scroll', () => {
    if (!videoSection) return;

    const rect = videoSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = videoSection.offsetHeight - windowHeight;

    const progress = -rect.top / totalHeight;
    targetScrollPos = Math.min(Math.max(progress, 0), 0.996);
});

// Botón de reiniciar experiencia desde el Footer
const btnReiniciar = document.getElementById('btn-reiniciar');
if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
        // 1. Desactivamos cualquier bloqueo activo de scroll en las frases
        desactivarScrollFrase();

        // 2. Reseteamos los contadores de progreso de los bloques transicionales
        document.querySelectorAll('.frase-transicion-contenedor').forEach(contenedor => {
            contenedor.dataset.progreso = 0;
            
            // Devolvemos las líneas a su estado oculto/inicial a la derecha
            const linea1 = contenedor.querySelector('.linea-1');
            const linea2 = contenedor.querySelector('.linea-2');
            if (linea1) {
                linea1.style.transform = 'translate(calc(-50% + 120vw), -50%)';
                linea1.style.opacity = '0';
            }
            if (linea2) {
                linea2.style.transform = 'translate(calc(-50% + 120vw), -50%)';
                linea2.style.opacity = '0';
            }
        });

        // 3. Reseteamos las variables de control del vídeo
        targetScrollPos = 0;
        currentVideoTime = 0;
        if (vid) vid.currentTime = 0;

        // 4. Ocultamos temporalmente el portfolio para forzar que vuelva a entrar con su animación
        portfolioContent.classList.remove('visible');

        // 5. Llevamos el scroll del contenedor del portfolio arriba del todo instantáneamente
        portfolioContent.scrollTo({
            top: 0,
            behavior: 'instant'
        });

        // 6. Volvemos a aplicar el efecto visual de entrada fade-in tras un breve parpadeo
        setTimeout(() => {
            portfolioContent.classList.add('visible');
        }, 100);
    });
}

// ── BOTÓN CONTACTO FLOTANTE ──────────────────────────────────────────────────
(function () {
  const btn       = document.getElementById('btnContacto');
  const hero      = document.getElementById('monibe');        // la sección hero
  const container = document.getElementById('portfolio-content'); // el scroll container

  if (!btn || !hero || !container) return;

  // Determina si el hero ya no está visible (usuario ha hecho scroll más allá)
  function isOutOfHero() {
    const heroBottom = hero.getBoundingClientRect().bottom;
    return heroBottom <= 0;
  }

  function onScroll() {
    const scrolled = container.scrollTop > 80; // umbral pequeño para activar sticky

    if (scrolled) {
      btn.classList.add('is-sticky');
    } else {
      btn.classList.remove('is-sticky', 'out-of-hero');
    }

    if (isOutOfHero()) {
      btn.classList.add('out-of-hero');
    } else {
      btn.classList.remove('out-of-hero');
    }
  }

  container.addEventListener('scroll', onScroll, { passive: true });

  const footerSection = document.getElementById('footer-section');

  if (footerSection) {
    // Configuramos el observador
    const observerOptions = {
      root: container, // tu contenedor con scroll
      threshold: 0.1   // se activa en cuanto asoma un 10% del footer
    };

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Si el footer es visible, añadimos la clase de expansión
          btn.classList.add('is-at-footer');
        } else {
          // Si el usuario vuelve a subir, vuelve a ser un círculo flotante
          btn.classList.remove('is-at-footer');
        }
      });
    }, observerOptions);

    footerObserver.observe(footerSection);
  }
})();

// ======================
// HUEVO DE PASCUA F12
// ======================
window.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
        e.preventDefault();
        alert("ah! ah! aaaAAAaahh! No has dicho las palabras mágicas!");
    }
});


// ==========================================
// 5. INICIALIZACIÓN Y CARGAS INICIALES
// ==========================================

if (vid) {
    fetch('/video/transicion_masaje_ordenador.webm')
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            vid.src = url;
            vid.load();
        })
        .catch(err => console.error("Error cargando el vídeo:", err));
}

requestAnimationFrame(updateVideo);

// ── Skip terminal si viene desde página interna ──
if (new URLSearchParams(window.location.search).get('desde') === 'portfolio') {
    history.replaceState(null, '', window.location.pathname);
    transitionToPortfolio(true);
}

// Asegurar que existe el elemento "year" antes de asignarlo para evitar fallos si falta en el HTML
const yearEl = document.getElementById("year");
if (yearEl) yearEl.innerHTML = new Date().getFullYear();

// Observador que gestiona dinámicamente AMBAS secciones transicionales
const observerFrase = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            const progreso = parseFloat(entry.target.dataset.progreso || 0);
            if (entry.isIntersecting && progreso < 1) {
                activarScrollFrase(entry.target);
            }
        });
    },
    { threshold: 0.8 }
);

// Registra todos los contenedores de transición del HTML
document.querySelectorAll('.frase-transicion-contenedor').forEach(contenedor => {
    contenedor.dataset.progreso = 0; // Inicializador de scroll independiente
    observerFrase.observe(contenedor);
});


// =============================
// SLIDERS SECCIÓN PASADO
// =============================
(function () {
    const track  = document.getElementById('pasadoTrack');
    const prev   = document.getElementById('pasadoPrev');
    const next   = document.getElementById('pasadoNext');
    const dots   = document.querySelectorAll('.pasado-dot');
    let current  = 0;
    const total  = 3;

    if (!track || !prev || !next) return;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });
})();

// =============================
// SLIDER SECCIÓN PRESENTE
// =============================
(function () {
    const track  = document.getElementById('presenteTrack');
    const prev   = document.getElementById('presentePrev');
    const next   = document.getElementById('presenteNext');
    const dots   = document.querySelectorAll('.presente-dot');
    let current  = 0;
    const total  = 2;

    if (!track || !prev || !next) return;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.index)));

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });
})();

const skillsList = document.querySelector('.pasado-skills-list');
if (skillsList) {
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillsList.classList.remove('skills-visible');
                void skillsList.offsetWidth; 
                skillsList.classList.add('skills-visible');
            }
        });
    }, { threshold: 0.5 });

    skillsObserver.observe(skillsList);
}

// =================================
// SECCION INTERACTIVA CON ONDAS
// =================================

const interactiveArea = document.getElementById('interactive-area');
const stone = document.getElementById('stone');

// 1. Hacer que la piedra siga al ratón
interactiveArea.addEventListener('mousemove', (e) => {
  const rect = interactiveArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  stone.style.left = `${x}px`;
  stone.style.top = `${y}px`;
});

// 2. El efecto del clic (Lanzar la piedra)
interactiveArea.addEventListener('click', (e) => {
  // Si la piedra ya se está hundiendo, evitamos que cliquen mil veces seguidas
  if (stone.classList.contains('is-dropping')) return;

  const rect = interactiveArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Hacemos que la piedra "desaparezca" (se hunda)
  stone.classList.add('is-dropping');

  // Creamos la onda en esa posición
  const ripple = document.createElement('span');
  ripple.classList.add('wave-ripple');
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  interactiveArea.appendChild(ripple);

  // Eliminamos la onda del DOM cuando acabe su animación
  setTimeout(() => {
    ripple.remove();
  }, 800);

  // Hacemos que la piedra REAPAREZCA después de 400ms (tiempo del "hundimiento")
  setTimeout(() => {
    stone.classList.remove('is-dropping');
  }, 400);
});

// =========================================================================
// CERRAR EL MENÚ LATERAL AUTOMÁTICAMENTE AL HACER CLIC EN LOS APARTADOS
// =========================================================================

// Seleccionamos los enlaces de las secciones en el menú lateral
const menuSectionsLinks = document.querySelectorAll('#side-menu .nav-links a');

menuSectionsLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Comprobamos si el menú está visible antes de intentar cerrarlo
    if (sideMenu && !sideMenu.classList.contains('hidden')) {
      
      // ¡LA CLAVE! Ejecutamos el método click() nativo sobre tu hamburguesa.
      // Esto activa tu función original (línea 210), guardando los textos,
      // aplicando las opacidades correctas y transformando la X de nuevo en tres rayas.
      hamburger.click();
    }
  });
});

// =========================================================================
// CONTROL DE LA VENTANA EMERGENTE (MODAL) DE CRÉDITOS
// =========================================================================

const modalCreditos = document.getElementById('modal-creditos');
const btnCerrarModal = document.getElementById('cerrar-modal');
// Buscamos el enlace específico de Créditos en tu menú lateral
const enlaceCreditos = document.querySelector('#side-menu a[href="#creditos"]');

// 1. Abrir el modal cuando se hace clic en "Créditos"
if (enlaceCreditos) {
  enlaceCreditos.addEventListener('click', (e) => {
    // Evitamos el comportamiento por defecto del enlace para que no salte la pantalla
    e.preventDefault(); 
    
    // Mostramos el modal quitando la clase hidden
    modalCreditos.classList.remove('hidden');
  });
}

// 2. Cerrar el modal al hacer clic en el botón de la (X)
if (btnCerrarModal) {
  btnCerrarModal.addEventListener('click', () => {
    modalCreditos.classList.add('hidden');
  });
}

// 3. Opcional: Cerrar el modal si el usuario hace clic fuera de la cajita negra (en el fondo borroso)
if (modalCreditos) {
  modalCreditos.addEventListener('click', (e) => {
    if (e.target === modalCreditos) {
      modalCreditos.classList.add('hidden');
    }
  });
}


// ── PANEL CONTACTO ──────────────────────────────────────────────────────────
(function () {
  const btnAbrir    = document.getElementById('btnContacto');
  const mini        = document.getElementById('contacto-mini');
  const miniCerrar  = document.getElementById('contacto-mini-cerrar');
  const panel       = document.getElementById('contacto-panel');
  const panelCerrar = document.getElementById('contacto-cerrar');
  const respuestaEl = document.getElementById('contacto-respuesta');

  // Contenidos por tema
  const respuestas = {
    video: `
      <h3>¡Me alegra que te haya gustado! 🎥</h3>
      <p style="color: #f7e1d7;">El proceso empezó fuera del código: generé dos imágenes con IA (una de manos haciendo masaje, otra de manos tecleando) y las usé como fotogramas clave. Luego, con otra IA generé la transición entre ambas, obteniendo un vídeo corto y fluido.</p>
      <p style="color: #f7e1d7;">En cuanto al código, el vídeo funciona con <strong>scroll-driven animation</strong>: un <code style="color: #f7e1d7;">&lt;video&gt;</code> pausado al que actualizo <code style="color: #f7e1d7;">currentTime</code> según el progreso del scroll dentro de un contenedor <code>sticky</code>. Puro JS + CSS, sin librerías.</p>
      <p style="color: #f7e1d7;">Lo próximo en mi lista de deseos técnicos: aprender <strong>GSAP</strong> para llevar este tipo de animaciones a otro nivel. Tengo ideas en mente... 👀</p>
    `,
    proyecto: `
        <div id="form-proyecto" class="form-proyecto">

        <div class="fp-progress-bar">
            <div class="fp-progress-fill" id="fp-progress-fill"></div>
        </div>

        <div class="fp-slides" id="fp-slides">

            <div class="fp-slide active" data-index="0">
            <span class="fp-step-label">01 —</span>
            <label class="fp-question">¿Cómo te llamas?</label>
            <input class="fp-input" type="text" id="fp-nombre" placeholder="Tu nombre" autocomplete="off" />
            <button class="fp-btn-next" data-next="1">Continuar →</button>
            </div>

            <div class="fp-slide" data-index="1">
            <span class="fp-step-label">02 —</span>
            <label class="fp-question">¿Cuál es tu email?</label>
            <input class="fp-input" type="email" id="fp-email" placeholder="hola@ejemplo.com" autocomplete="off" />
            <button class="fp-btn-next" data-next="2">Continuar →</button>
            </div>

            <div class="fp-slide" data-index="2">
            <span class="fp-step-label">03 —</span>
            <label class="fp-question">¿Qué tipo de proyecto tienes en mente?</label>
            <div class="fp-options" id="fp-tipo-options">
                <button class="fp-option" data-value="Web desde cero">🌱 Web desde cero</button>
                <button class="fp-option" data-value="Rediseño web">✏️ Rediseño web</button>
                <button class="fp-option" data-value="Aplicación web">⚙️ Aplicación web</button>
                <button class="fp-option" data-value="Consultoría / revisión">🔍 Consultoría / revisión</button>
                <button class="fp-option" data-value="Otro">💬 Otro</button>
            </div>
            <input type="hidden" id="fp-tipo" />
            </div>

            <div class="fp-slide" data-index="3">
            <span class="fp-step-label">04 —</span>
            <label class="fp-question">Cuéntame un poco más. ¿En qué consiste el proyecto?</label>
            <textarea class="fp-input fp-textarea" id="fp-descripcion" placeholder="Una breve descripción del proyecto, el sector, lo que necesitas..." rows="4"></textarea>
            <button class="fp-btn-next" data-next="4">Continuar →</button>
            </div>

            <div class="fp-slide" data-index="4">
            <span class="fp-step-label">05 —</span>
            <label class="fp-question">¡Ya casi está! Solo un paso más.</label>
            <label class="fp-privacy-label">
                <input type="checkbox" id="fp-privacidad" class="fp-checkbox" />
                <span>He leído y acepto la <a href="politica-de-privacidad.html" target="_blank" class="fp-privacy-link">política de privacidad</a></span>
            </label>
            <button class="fp-btn-send" id="fp-btn-enviar" disabled>Enviar mensaje ✦</button>
            <p class="fp-error-msg" id="fp-error-msg"></p>
            </div>

        </div>

        <div class="fp-gracias hidden" id="fp-gracias">
            <div class="fp-gracias-inner">
            <div class="fp-gracias-icon">✦</div>
            <h3 class="fp-gracias-titulo">¡Gracias!</h3>
            <p class="fp-gracias-sub">Mónica se pondrá en contacto contigo pronto.</p>
            <div class="fp-gracias-linea"></div>
            <p class="fp-gracias-detalle">Tu mensaje ha llegado sano y salvo. 🌿</p>
            </div>
        </div>

        </div>
        `,
    cv: `
      <h3>¡Claro! Aquí tienes mi CV 📄</h3>
        <div style="text-align:center; margin-top: 1rem;">
            <img 
            id="cv-preview-img"
            src="img/CV_MoniBe.png" 
            alt="Vista previa del CV de MoniBe" 
            style="max-width:100%; max-height:55vh; border-radius:8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); margin-bottom: 1.2rem; cursor: zoom-in;"
            >
            <br>
            <a href="img/CV_MoniBe.pdf" download class="contacto-btn-cv">Descargar CV ↓</a>
        </div>
    `,
    corazon: `
      <h3>Mamá!🫶</h3>
      <p style="color: #f7e1d7;">Claro que sí — dale al ❤️ de aquí abajo. Y gracias por ser mi fan número uno! <br> (También puedes darle al corazón aunque no seas mi madre 😋)</p>
      <div style="text-align:center; margin-top: 1.5rem;">
        <!-- Botón corazón + contador -->
        <button id="btn-corazon" style="font-size:4.5rem; background:none; border:none; cursor:pointer;">❤️</button>
        <p id="contador-corazones" style="margin-top:0.5rem; font-size:1.2rem; color: var(--color-bg-main);">Contador de Corazones</p>
      </div>
    `
  };

  

  // Añade estilos inline del botón CV (o muévelo al CSS)
  const style = document.createElement('style');
  style.textContent = `
    .contacto-btn-cv {
      display: inline-block;
      padding: 0.7rem 1.8rem;
      background: var(--color-bg-subtle);
      color: var(--color-dark-slate);
      border-radius: 8px;
      text-decoration: none;
      font-family: 'Chillax', sans-serif;
      font-size: 1rem;
      transition: background 0.2s;
    }
    .contacto-btn-cv:hover { background: var(--color-dark-slate); color: var(--color-bg-subtle); }
  `;
  document.head.appendChild(style);

  function abrirMini() {
    mini.classList.add('activo');
    mini.setAttribute('aria-hidden', 'false');
    if (btnAbrir) btnAbrir.style.display = 'none';
  }

  function cerrarMini() {
    mini.classList.remove('activo');
    mini.setAttribute('aria-hidden', 'true');
    if (btnAbrir) btnAbrir.style.display = 'block';
  }

function abrirPanel(tema) {
    respuestaEl.innerHTML = respuestas[tema] || '';
    if (tema === 'proyecto') initFormProyecto(); 
    panel.classList.add('activo');
    panel.setAttribute('aria-hidden', 'false');
    panelCerrar.focus();

    // inicializar Firebase solo cuando se abre el panel del corazón ──
    if (tema === 'corazon') {
        const botonCorazon = document.getElementById('btn-corazon');
        const contadorTexto = document.getElementById('contador-corazones');

        if (botonCorazon && contadorTexto) {
            // Escuchar el contador en tiempo real
            onSnapshot(documentoRef, (doc) => {
                if (doc.exists()) {
                    contadorTexto.innerText = `Contador: [ ${doc.data().contador} ] corazones enviados`;
                } else {
                    contadorTexto.innerText = '0 corazones enviados por mamás orgullosas';
                }
            });

            // Click: sumar en Firebase + animación
            botonCorazon.addEventListener('click', async () => {
                try {
                    await updateDoc(documentoRef, { contador: increment(1) });

                    const corazon = document.createElement('span');
                    corazon.classList.add('corazon-flotante');
                    corazon.innerText = '❤️';
                    const unPocoAlLado = (Math.random() - 0.5) * 30;
                    corazon.style.left = `${botonCorazon.offsetLeft + (botonCorazon.offsetWidth / 2) + unPocoAlLado - 12}px`;
                    corazon.style.top = `${botonCorazon.offsetTop}px`;
                    botonCorazon.parentElement.appendChild(corazon);
                    setTimeout(() => corazon.remove(), 1000);
                } catch (error) {
                    console.error('Error al enviar el corazón: ', error);
                }
            });
        }
    }

    // Lupa sobre imagen de CV
    if (tema === 'cv') {
        const imgCV = document.getElementById('cv-preview-img');
        if (!imgCV) return;

        imgCV.addEventListener('click', () => {
            // Crear overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 9999;
            background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center;
            cursor: zoom-out;
            `;

            const imgGrande = document.createElement('img');
            imgGrande.src = imgCV.src;
            imgGrande.style.cssText = `
            max-width: 90vw; max-height: 90vh;
            border-radius: 8px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.6);
            `;

            overlay.appendChild(imgGrande);
            document.body.appendChild(overlay);

            // Cerrar al clicar el fondo
            overlay.addEventListener('click', () => overlay.remove());

            // Cerrar con Escape
            const onEsc = (e) => { if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); } };
            document.addEventListener('keydown', onEsc);
        });
    }
}
  function cerrarPanel() {
    panel.classList.remove('activo');
    panel.setAttribute('aria-hidden', 'true');
    respuestaEl.innerHTML = '';
    if (btnAbrir) btnAbrir.style.display = 'block';
  }

  btnAbrir?.addEventListener('click', abrirMini);
  miniCerrar?.addEventListener('click', cerrarMini);
  panelCerrar?.addEventListener('click', cerrarPanel);

  const enlaceMenuContacto = document.querySelector('a[href="#contacto-mini"]');
  enlaceMenuContacto?.addEventListener('click', (e) => {
    e.preventDefault(); // Evitamos que la URL cambie y haga el salto de scroll
    abrirMini();        // Tu función existente que pone la clase .activo
  });

  document.querySelectorAll('.contacto-opcion').forEach(btn => {
    btn.addEventListener('click', () => {
      cerrarMini();
      abrirPanel(btn.dataset.tema);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (panel.classList.contains('activo')) cerrarPanel();
      else cerrarMini();
    }
  });

  // Cierra el panel al clicar el fondo
  panel.addEventListener('click', (e) => {
    if (e.target === panel) cerrarPanel();
  });

  function initFormProyecto() {
  const TOTAL_STEPS = 5; // slides 0-4
  const slides = document.querySelectorAll('.fp-slide');
  const progressFill = document.getElementById('fp-progress-fill');

  // ── Helpers ──
  function goToSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.fp-slide[data-index="${idx}"]`);
    if (target) target.classList.add('active');
    progressFill.style.width = `${Math.round(((idx + 1) / TOTAL_STEPS) * 100)}%`;
    // Focus automático en el input del slide
    const input = target?.querySelector('.fp-input');
    if (input) setTimeout(() => input.focus(), 80);
  }

  function currentSlideIndex() {
    const active = document.querySelector('.fp-slide.active');
    return active ? parseInt(active.dataset.index) : 0;
  }

  // ── Botones "Continuar" ──
  document.querySelectorAll('.fp-btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextIdx = parseInt(btn.dataset.next);
      const currentIdx = currentSlideIndex();

      // Validación simple
      if (currentIdx === 0) {
        const val = document.getElementById('fp-nombre')?.value.trim();
        if (!val) { document.getElementById('fp-nombre')?.focus(); return; }
      }
      if (currentIdx === 1) {
        const val = document.getElementById('fp-email')?.value.trim();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!valid) { document.getElementById('fp-email')?.focus(); return; }
      }
      if (currentIdx === 3) {
        const val = document.getElementById('fp-descripcion')?.value.trim();
        if (!val) { document.getElementById('fp-descripcion')?.focus(); return; }
      }

      goToSlide(nextIdx);
    });
  });

  // ── Opciones tipo chip (slide 2 → pasan solo al siguiente) ──
  document.querySelectorAll('.fp-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.fp-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      document.getElementById('fp-tipo').value = opt.dataset.value;
      // Avanza automáticamente tras elegir
      setTimeout(() => goToSlide(3), 220);
    });
  });

  // ── Enter para avanzar ──
  ['fp-nombre', 'fp-email'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const btn = document.querySelector(`.fp-slide.active .fp-btn-next`);
        btn?.click();
      }
    });
  });

  // ── Casilla de privacidad habilita el botón enviar ──
  const checkPriv = document.getElementById('fp-privacidad');
  const btnEnviar = document.getElementById('fp-btn-enviar');
  checkPriv?.addEventListener('change', () => {
    btnEnviar.disabled = !checkPriv.checked;
  });

  // ── Envío con EmailJS ──
  btnEnviar?.addEventListener('click', async () => {
    const nombre      = document.getElementById('fp-nombre')?.value.trim();
    const email       = document.getElementById('fp-email')?.value.trim();
    const tipo        = document.getElementById('fp-tipo')?.value || 'No especificado';
    const descripcion = document.getElementById('fp-descripcion')?.value.trim();
    const errorMsg    = document.getElementById('fp-error-msg');

    if (!nombre || !email || !descripcion) {
      errorMsg.textContent = 'Por favor, rellena todos los campos.';
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando…';
    errorMsg.textContent = '';

    try {
      // ── REEMPLAZA estos valores con los tuyos ──
      const PUBLIC_KEY  = 'l2swxxhOUql-X3Xm_';
      const SERVICE_ID  = 'service_fvhp9jv';
      const TEMPLATE_ID = 'template_ubw0339';

      await emailjs.init(PUBLIC_KEY);
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:   nombre,
        from_email:  email,
        project_type: tipo,
        message:     descripcion
      });

      // Mostrar pantalla de gracias
      const formWrap = document.getElementById('form-proyecto');
      const gracias  = document.getElementById('fp-gracias');
      if (formWrap && gracias) {
        // Ocultar el último slide suavemente
        document.querySelector('.fp-slide.active')?.style.setProperty('opacity', '0');
        document.querySelector('.fp-slide.active')?.style.setProperty('transition', 'opacity 0.3s');
        progressFill.style.width = '100%';
        setTimeout(() => {
          document.querySelector('.fp-slide.active').style.display = 'none';
          gracias.classList.remove('hidden');
        }, 300);
      }

    } catch (err) {
      console.error('EmailJS error:', err);
      errorMsg.textContent = 'Ups, algo fue mal. Prueba de nuevo o escríbeme directamente.';
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar mensaje ✦';
    }
  });
}


})();