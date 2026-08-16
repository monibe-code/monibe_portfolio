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
 
    if (terminalUI) terminalUI.classList.add('hidden');
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) welcomeScreen.classList.add('hidden');
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
    if (contenedor.classList.contains('seccion-pasadopresente')) return;
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
        if (contenedor.classList.contains('seccion-pasadopresente')) return;
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

if (commandInput) {
    commandInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            submitCommand();
        }
    });
}

if (sendBtn) {
    sendBtn.addEventListener('click', function() {
        submitCommand();
        commandInput.focus();
    });
}

// Pantalla de bienvenida simple: el botón lleva directo al loader
const btnIniciarExperiencia = document.getElementById('btn-iniciar-experiencia');
if (btnIniciarExperiencia) {
    btnIniciarExperiencia.addEventListener('click', () => {
        transitionToPortfolio();
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
    contacto: `
      <h3>¡Hablemos! 📩</h3>
      <p style="color: #f7e1d7;">Puedes escribirme directamente a <a href="mailto:hola.monibe@gmail.com" style="color: var(--color-accent-pink); text-decoration: underline; text-underline-offset: 2px;">hola.monibe@gmail.com</a>, o por aquí:</p>
      <div class="social-icons" style="justify-content: center; padding-left: 0; margin: 1.5rem 0 0.5rem;">
        <a href="https://www.linkedin.com/in/monibe/" target="_blank" class="social-btn" title="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" class="icon-svg">
            <path fill-rule="evenodd" d="M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm1.102 4.297a1.195 1.195 0 1 0 0-2.39a1.195 1.195 0 0 0 0 2.39m1 7.516V6.234h-2v6.579zM6.43 6.234h2v.881c.295-.462.943-1.084 2.148-1.084c1.438 0 2.219.953 2.219 2.766c0 .087.008.484.008.484v3.531h-2v-3.53c0-.485-.102-1.438-1.18-1.438c-1.079 0-1.17 1.198-1.195 1.982v2.986h-2z" clip-rule="evenodd"/>
          </svg>
        </a>
        <a href="https://github.com/monibe-code" target="_blank" class="social-btn" title="GitHub">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="icon-svg">
            <path d="M12 .999c-6.074 0-11 5.05-11 11.278c0 4.983 3.152 9.21 7.523 10.702c.55.104.727-.246.727-.543v-2.1c-3.06.683-3.697-1.33-3.697-1.33c-.5-1.304-1.222-1.65-1.222-1.65c-.998-.7.076-.686.076-.686c1.105.08 1.686 1.163 1.686 1.163c.98 1.724 2.573 1.226 3.201.937c.098-.728.383-1.226.698-1.508c-2.442-.286-5.01-1.253-5.01-5.574c0-1.232.429-2.237 1.132-3.027c-.114-.285-.49-1.432.107-2.985c0 0 .924-.303 3.026 1.156c.877-.25 1.818-.375 2.753-.38c.935.005 1.876.13 2.755.38c2.1-1.459 3.023-1.156 3.023-1.156c.598 1.554.222 2.701.108 2.985c.706.79 1.132 1.796 1.132 3.027c0 4.332-2.573 5.286-5.022 5.565c.394.35.754 1.036.754 2.088v3.095c0 .3.176.652.734.542C19.852 21.484 23 17.258 23 12.277C23 6.048 18.075.999 12 .999"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/profile.php?id=61592705676465&locale=es_ES" target="_blank" class="social-btn" title="Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="icon-svg">
            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/monibe_dev/" target="_blank" class="social-btn" title="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" class="icon-svg">
            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>
          </svg>
        </a>
      </div>
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
            <input class="fp-input" type="text" id="fp-nombre" placeholder="Tu nombre" autocomplete="off" maxlength="60" />
            <span class="fp-field-error" id="fp-nombre-error"></span>
            <div class="fp-slide-actions">
                <button class="fp-btn-next" data-next="1">Continuar →</button>
            </div>
            </div>

            <div class="fp-slide" data-index="1">
            <span class="fp-step-label">02 —</span>
            <label class="fp-question">¿Cuál es tu email?</label>
            <input class="fp-input" type="email" id="fp-email" placeholder="hola@ejemplo.com" autocomplete="off" maxlength="100" />
            <span class="fp-field-error" id="fp-email-error"></span>
            <div class="fp-slide-actions">
                <button class="fp-btn-back" data-back="0">← Atrás</button>
                <button class="fp-btn-next" data-next="2">Continuar →</button>
            </div>
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
            <div class="fp-slide-actions">
                <button class="fp-btn-back" data-back="1">← Atrás</button>
            </div>
            </div>

            <div class="fp-slide" data-index="3">
            <span class="fp-step-label">04 —</span>
            <label class="fp-question">Cuéntame un poco más. ¿En qué consiste el proyecto?</label>
            <textarea class="fp-input fp-textarea" id="fp-descripcion" placeholder="Una breve descripción del proyecto, el sector, lo que necesitas..." rows="4" maxlength="600"></textarea>
            <span class="fp-field-error" id="fp-descripcion-error"></span>
            <div class="fp-slide-actions">
                <button class="fp-btn-back" data-back="2">← Atrás</button>
                <button class="fp-btn-next" data-next="4">Continuar →</button>
            </div>
            </div>

            <div class="fp-slide" data-index="4">
            <span class="fp-step-label">05 —</span>
            <label class="fp-question">¡Ya casi está! Solo un paso más.</label>
            <label class="fp-privacy-label">
                <input type="checkbox" id="fp-privacidad" class="fp-checkbox" />
                <span>He leído y acepto la <a href="politica-de-privacidad.html" target="_blank" class="fp-privacy-link">política de privacidad</a></span>
            </label>
            <div class="fp-slide-actions">
                <button class="fp-btn-back" data-back="3">← Atrás</button>
                <button class="fp-btn-send" id="fp-btn-enviar" disabled>Enviar mensaje ✦</button>
            </div>
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

  function mostrarError(id, msg) {
    const errorEl = document.getElementById(`${id}-error`);
    const inputEl = document.getElementById(id);
    if (errorEl) errorEl.textContent = msg;
    if (inputEl) inputEl.classList.add('fp-invalid');
  }

  function limpiarError(id) {
    const errorEl = document.getElementById(`${id}-error`);
    const inputEl = document.getElementById(id);
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('fp-invalid');
  }

  // ── Validadores por campo, con mensaje específico ──
  function validarNombre() {
    const val = document.getElementById('fp-nombre')?.value.trim() || '';
    if (!val) { mostrarError('fp-nombre', 'Este campo no puede quedar en blanco.'); return false; }
    if (val.length < 2) { mostrarError('fp-nombre', 'Escribe al menos 2 caracteres.'); return false; }
    if (val.length > 60) { mostrarError('fp-nombre', 'Máximo 60 caracteres.'); return false; }
    limpiarError('fp-nombre');
    return true;
  }

  function validarEmail() {
    const val = document.getElementById('fp-email')?.value.trim() || '';
    if (!val) { mostrarError('fp-email', 'Este campo no puede quedar en blanco.'); return false; }
    if (!val.includes('@')) { mostrarError('fp-email', 'Falta la arroba (@) en el correo.'); return false; }
    const [usuario, dominio] = val.split('@');
    if (!usuario) { mostrarError('fp-email', 'Falta la parte antes de la arroba (@).'); return false; }
    if (!dominio || !dominio.includes('.')) { mostrarError('fp-email', 'Falta un punto (.) en el dominio, ej: gmail.com'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { mostrarError('fp-email', 'Ese formato de correo no es válido.'); return false; }
    limpiarError('fp-email');
    return true;
  }

  function validarDescripcion() {
    const val = document.getElementById('fp-descripcion')?.value.trim() || '';
    if (!val) { mostrarError('fp-descripcion', 'Cuéntame algo, aunque sea breve 🙂'); return false; }
    if (val.length < 10) { mostrarError('fp-descripcion', 'Necesito al menos 10 caracteres para hacerme una idea.'); return false; }
    if (val.length > 600) { mostrarError('fp-descripcion', 'Máximo 600 caracteres.'); return false; }
    limpiarError('fp-descripcion');
    return true;
  }

  // Quita el error en cuanto el usuario empieza a corregir
  ['fp-nombre', 'fp-email', 'fp-descripcion'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => limpiarError(id));
  });

  // ── Botones "Atrás" ──
  document.querySelectorAll('.fp-btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      goToSlide(parseInt(btn.dataset.back));
    });
  });

  // ── Botones "Continuar" ──
  document.querySelectorAll('.fp-btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextIdx = parseInt(btn.dataset.next);
      const currentIdx = currentSlideIndex();

      // Validación específica por slide
      if (currentIdx === 0 && !validarNombre()) { document.getElementById('fp-nombre')?.focus(); return; }
      if (currentIdx === 1 && !validarEmail()) { document.getElementById('fp-email')?.focus(); return; }
      if (currentIdx === 3 && !validarDescripcion()) { document.getElementById('fp-descripcion')?.focus(); return; }

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

// ── CROSSFADE SECTION (solo tablet/móvil ≤1024px) ──────────────────────────
(function () {
    const crossfadeSection = document.getElementById('crossfade-section');
    if (!crossfadeSection) return;

    // Solo activamos en dispositivos donde el crossfade es visible
    if (window.innerWidth > 1024) return;

    const img1 = document.getElementById('cf-img1');
    const img2 = document.getElementById('cf-img2');
    const imgs = [img1, img2];

    // Las tres franjas de progreso (0–1) que activan cada imagen
    // Coinciden con los mismos umbrales que usa el vídeo en escritorio
    const franjas = [
        { desde: 0,    hasta: 0.55 },  // "mi pasado"
        { desde: 0.45, hasta: 1.00 },  // "y mi presente"
    ];

    function getProgreso() {
        const rect = crossfadeSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = crossfadeSection.offsetHeight - windowHeight;
        const progreso = -rect.top / totalHeight;
        return Math.min(Math.max(progreso, 0), 1);
    }

    function actualizarCrossfade() {
        const p = getProgreso();
        imgs.forEach((img, i) => {
            const { desde, hasta } = franjas[i];
            const visible = p >= desde && p < hasta;
            img.style.opacity = visible ? '1' : '0';
        });
    }

    // Escucha el scroll del contenedor principal (igual que el resto del portfolio)
    if (portfolioContent) {
        portfolioContent.addEventListener('scroll', actualizarCrossfade, { passive: true });
    }

    // Estado inicial
    actualizarCrossfade();
})();