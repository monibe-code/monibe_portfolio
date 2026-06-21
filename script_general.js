// =========================================
// Importamos la configuración de Firebase
// ==========================================
import { documentoRef, updateDoc, increment, onSnapshot } from './firebase-config.js';


// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

let esperandoPreguntaInicial = true;

// Elementos de la Terminal e Interfaz General
const output          = document.getElementById('output');
const promptElement   = document.getElementById('terminal-prompt');
const commandInput    = document.getElementById('commandInput');
const terminalUI      = document.getElementById('terminal');
const terminalSide    = document.getElementById('terminal-side');
const portfolioContent = document.getElementById('portfolio-content');
const hamburger       = document.getElementById('hamburger');
const sideMenu        = document.getElementById('side-menu');
const sendBtn         = document.getElementById('send-btn');
const topbar          = document.getElementById('topbar');
let intentosFallidos  = 0;

// Elementos del Vídeo y Textos internos del vídeo
const vid          = document.getElementById('v0');
const videoSection = document.getElementById('video-section');
const txtFrase1    = document.getElementById('frase1');
const txtFrase2    = document.getElementById('frase2');
const txtFrase3    = document.getElementById('frase3');

// Elementos del Efecto Glow (Logo)
const container = document.getElementById('mouseContainer');

// Elementos de música
const musicControl = document.getElementById('music-control');
const bgMusic      = document.getElementById('bg-music');


// ==========================================
// 2. ESTADO DE LA APLICACIÓN
// ==========================================

let targetScrollPos  = 0;
let currentVideoTime = 0;

// Variables para el control multi-sección de frases deslizantes
let seccionActiva    = null;
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
        } else if (limpiado === 'n') {
            output.innerHTML += `<div>${cmd}${response}</div>`;
            setTimeout(() => { transitionToPortfolio(); }, 800);
        } else {
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
            <br><strong>clear</strong>   - Limpiar terminal
            <br><strong>letsgo</strong>  - Iniciar experiencia`;
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
    const delay  = instantaneo ? 0 : 2500;

    terminalUI.classList.add('hidden');
    if (!instantaneo && loader) loader.classList.remove('hidden');

    setTimeout(() => {
        if (loader) loader.classList.add('fade-out');

        hamburger.classList.remove('hidden');
        if (topbar) topbar.classList.remove('hidden');

        terminalSide.style.opacity      = '0';
        terminalSide.style.pointerEvents = 'none';

        setTimeout(() => {
            terminalSide.classList.add('as-menu', 'menu-hidden');
            terminalSide.style.opacity      = '';
            terminalSide.style.pointerEvents = '';
            sideMenu.classList.remove('hidden');
        }, 600);

        portfolioContent.classList.remove('hidden');

        if (bgMusic) {
            bgMusic.play().catch(err => {
                console.log("El navegador bloqueó el autoplay inicialmente:", err);
            });
        }

        setTimeout(() => { portfolioContent.classList.add('visible'); }, 300);
        setTimeout(() => { if (loader) loader.classList.add('hidden'); }, 1000);

    }, delay);
}

// Bucle de renderizado para sincronizar el vídeo con el scroll
function updateVideo() {
    if (vid && vid.duration && vid.readyState >= 2) {
        const targetTime   = vid.duration * targetScrollPos;
        currentVideoTime  += (targetTime - currentVideoTime) * 0.1;
        vid.currentTime    = currentVideoTime;

        const d = vid.duration;
        txtFrase1.style.opacity = (currentVideoTime > d * 0.05 && currentVideoTime < d * 0.30) ? '1' : '0';
        txtFrase2.style.opacity = (currentVideoTime >= d * 0.35 && currentVideoTime < d * 0.60) ? '1' : '0';
        txtFrase3.style.opacity = (currentVideoTime >= d * 0.65 && currentVideoTime < d * 0.95) ? '1' : '0';
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

    // Línea 1
    if (progreso < 0.4) {
        const t  = progreso / 0.4;
        const x  = 120 - (t * 120);
        const op = Math.min(1, t * 3);
        linea1.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea1.style.opacity   = op;
    } else if (progreso < 0.7) {
        const t  = (progreso - 0.4) / 0.3;
        const x  = -(t * 130);
        const op = Math.max(0, 1 - t * 1.5);
        linea1.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea1.style.opacity   = op;
    } else {
        linea1.style.opacity = 0;
    }

    // Línea 2
    if (progreso >= 0.55) {
        const t  = (progreso - 0.55) / 0.45;
        const x  = 120 - (t * 120);
        const op = Math.min(1, t * 2);
        linea2.style.transform = `translate(calc(-50% + ${x}vw), -50%)`;
        linea2.style.opacity   = op;
    } else {
        linea2.style.transform = `translate(calc(-50% + 120vw), -50%)`;
        linea2.style.opacity   = 0;
    }
}

function onWheelFrase(e) {
    if (!fraseScrollActivo || !seccionActiva) return;
    e.preventDefault();

    const delta = e.deltaY || e.deltaX;
    let progreso = parseFloat(seccionActiva.dataset.progreso || 0);
    progreso = Math.max(0, Math.min(1, progreso + delta * VELOCIDAD_FRASE));

    seccionActiva.dataset.progreso = progreso;
    actualizarFrasesTransicion(seccionActiva, progreso);

    if (progreso >= 1) desactivarScrollFrase();
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

    let progreso = parseFloat(seccionActiva.dataset.progreso || 0);
    progreso = Math.max(0, Math.min(1, progreso + delta * VELOCIDAD_FRASE * 2));

    seccionActiva.dataset.progreso = progreso;
    actualizarFrasesTransicion(seccionActiva, progreso);

    if (progreso >= 1) desactivarScrollFrase();
}

function activarScrollFrase(contenedor) {
    seccionActiva     = contenedor;
    fraseScrollActivo = true;
    if (contenedor.classList.contains('seccion-pasadopresente')) return;
    portfolioContent.style.overflowY = 'hidden';
    window.addEventListener('wheel', onWheelFrase, { passive: false });
    window.addEventListener('touchstart', onTouchStartFrase, { passive: true });
    window.addEventListener('touchmove', onTouchMoveFrase, { passive: false });
}

function desactivarScrollFrase() {
    fraseScrollActivo = false;
    seccionActiva     = null;
    portfolioContent.style.overflowY = 'auto';
    window.removeEventListener('wheel', onWheelFrase);
    window.removeEventListener('touchstart', onTouchStartFrase);
    window.removeEventListener('touchmove', onTouchMoveFrase);
}


// ==========================================
// 4. ESCUCHADORES DE EVENTOS
// ==========================================

commandInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        submitCommand();
    }
});

if (sendBtn) {
    sendBtn.addEventListener('click', function () {
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
    const rect        = videoSection.getBoundingClientRect();
    const totalHeight = videoSection.offsetHeight - window.innerHeight;
    const progress    = -rect.top / totalHeight;
    targetScrollPos   = Math.min(Math.max(progress, 0), 0.996);
});

// Botón de reiniciar experiencia desde el Footer
const btnReiniciar = document.getElementById('btn-reiniciar');
if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
        desactivarScrollFrase();

        document.querySelectorAll('.frase-transicion-contenedor').forEach(contenedor => {
            contenedor.dataset.progreso = 0;
            const linea1 = contenedor.querySelector('.linea-1');
            const linea2 = contenedor.querySelector('.linea-2');
            [linea1, linea2].forEach(linea => {
                if (linea) {
                    linea.style.transform = 'translate(calc(-50% + 120vw), -50%)';
                    linea.style.opacity   = '0';
                }
            });
        });

        targetScrollPos  = 0;
        currentVideoTime = 0;
        if (vid) vid.currentTime = 0;

        portfolioContent.classList.remove('visible');
        portfolioContent.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => { portfolioContent.classList.add('visible'); }, 100);
    });
}

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
            vid.src = URL.createObjectURL(blob);
            vid.load();
        })
        .catch(err => console.error("Error cargando el vídeo:", err));
}

requestAnimationFrame(updateVideo);

// Skip terminal si viene desde página interna
if (new URLSearchParams(window.location.search).get('desde') === 'portfolio') {
    history.replaceState(null, '', window.location.pathname);
    transitionToPortfolio(true);
}

// Año dinámico en el footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.innerHTML = new Date().getFullYear();

// Observador que gestiona ambas secciones transicionales
const observerFrase = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const progreso = parseFloat(entry.target.dataset.progreso || 0);
        if (entry.isIntersecting && progreso < 1) {
            activarScrollFrase(entry.target);
        }
    });
}, { threshold: 0.8 });

document.querySelectorAll('.frase-transicion-contenedor').forEach(contenedor => {
    contenedor.dataset.progreso = 0;
    observerFrase.observe(contenedor);
});


// =============================
// SLIDERS (función genérica reutilizable)
// =============================

function initSlider({ trackId, prevId, nextId, dotsSelector, total }) {
    const track = document.getElementById(trackId);
    const prev  = document.getElementById(prevId);
    const next  = document.getElementById(nextId);
    const dots  = document.querySelectorAll(dotsSelector);
    let current = 0;

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
}

initSlider({ trackId: 'pasadoTrack',   prevId: 'pasadoPrev',   nextId: 'pasadoNext',   dotsSelector: '.pasado-dot',   total: 3 });
initSlider({ trackId: 'presenteTrack', prevId: 'presentePrev', nextId: 'presenteNext', dotsSelector: '.presente-dot', total: 2 });


// =============================
// SKILLS: animación de entrada
// =============================

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
// SECCIÓN INTERACTIVA CON ONDAS
// =================================

const interactiveArea = document.getElementById('interactive-area');
const stone = document.getElementById('stone');

interactiveArea.addEventListener('mousemove', (e) => {
    const rect  = interactiveArea.getBoundingClientRect();
    stone.style.left = `${e.clientX - rect.left}px`;
    stone.style.top  = `${e.clientY - rect.top}px`;
});

interactiveArea.addEventListener('click', (e) => {
    if (stone.classList.contains('is-dropping')) return;

    const rect   = interactiveArea.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;

    stone.classList.add('is-dropping');

    const ripple = document.createElement('span');
    ripple.classList.add('wave-ripple');
    ripple.style.left = `${x}px`;
    ripple.style.top  = `${y}px`;
    interactiveArea.appendChild(ripple);

    setTimeout(() => { ripple.remove(); }, 800);
    setTimeout(() => { stone.classList.remove('is-dropping'); }, 400);
});


// =========================================================================
// MENÚ LATERAL: cerrar al hacer clic en un apartado
// =========================================================================

document.querySelectorAll('#side-menu .nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (sideMenu && !sideMenu.classList.contains('hidden')) {
            hamburger.click();
        }
    });
});


// =========================================================================
// MODAL DE CRÉDITOS
// =========================================================================

const modalCreditos  = document.getElementById('modal-creditos');
const btnCerrarModal = document.getElementById('cerrar-modal');
const enlaceCreditos = document.querySelector('#side-menu a[href="#creditos"]');

if (enlaceCreditos) {
    enlaceCreditos.addEventListener('click', (e) => {
        e.preventDefault();
        modalCreditos.classList.remove('hidden');
    });
}

if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', () => {
        modalCreditos.classList.add('hidden');
    });
}

if (modalCreditos) {
    modalCreditos.addEventListener('click', (e) => {
        if (e.target === modalCreditos) modalCreditos.classList.add('hidden');
    });
}


// ==========================================
// BOTÓN CONTACTO FLOTANTE
// ==========================================

(function () {
    const btn       = document.getElementById('btnContacto');
    const hero      = document.getElementById('monibe');

    if (!btn || !hero || !portfolioContent) return;

    function isOutOfHero() {
        return hero.getBoundingClientRect().bottom <= 0;
    }

    function onScroll() {
        const scrolled = portfolioContent.scrollTop > 80;
        if (scrolled) {
            btn.classList.add('is-sticky');
        } else {
            btn.classList.remove('is-sticky', 'out-of-hero');
        }
        btn.classList.toggle('out-of-hero', isOutOfHero());
    }

    portfolioContent.addEventListener('scroll', onScroll, { passive: true });

    const footerSection = document.getElementById('footer-section');
    if (footerSection) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                btn.classList.toggle('is-at-footer', entry.isIntersecting);
            });
        }, { root: portfolioContent, threshold: 0.1 });

        footerObserver.observe(footerSection);
    }
})();


// ==========================================
// PANEL CONTACTO
// ==========================================

(function () {
    const btnAbrir    = document.getElementById('btnContacto');
    const mini        = document.getElementById('contacto-mini');
    const miniCerrar  = document.getElementById('contacto-mini-cerrar');
    const panel       = document.getElementById('contacto-panel');
    const panelCerrar = document.getElementById('contacto-cerrar');
    const respuestaEl = document.getElementById('contacto-respuesta');

    // Estilos del botón de descarga CV
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
                <button id="btn-corazon" style="font-size:4.5rem; background:none; border:none; cursor:pointer;">❤️</button>
                <p id="contador-corazones" style="margin-top:0.5rem; font-size:1.2rem; color: var(--color-bg-main);">Contador de Corazones</p>
            </div>
        `
    };

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

    function cerrarPanel() {
        panel.classList.remove('activo');
        panel.setAttribute('aria-hidden', 'true');
        respuestaEl.innerHTML = '';
        if (btnAbrir) btnAbrir.style.display = 'block';
    }

    function abrirPanel(tema) {
        respuestaEl.innerHTML = respuestas[tema] || '';
        if (tema === 'proyecto') initFormProyecto();
        panel.classList.add('activo');
        panel.setAttribute('aria-hidden', 'false');
        panelCerrar.focus();

        // Firebase: contador de corazones
        if (tema === 'corazon') {
            const botonCorazon  = document.getElementById('btn-corazon');
            const contadorTexto = document.getElementById('contador-corazones');

            if (botonCorazon && contadorTexto) {
                onSnapshot(documentoRef, (doc) => {
                    contadorTexto.innerText = doc.exists()
                        ? `Contador: [ ${doc.data().contador} ] corazones enviados`
                        : '0 corazones enviados por mamás orgullosas';
                });

                botonCorazon.addEventListener('click', async () => {
                    try {
                        await updateDoc(documentoRef, { contador: increment(1) });

                        const corazon = document.createElement('span');
                        corazon.classList.add('corazon-flotante');
                        corazon.innerText  = '❤️';
                        const offset       = (Math.random() - 0.5) * 30;
                        corazon.style.left = `${botonCorazon.offsetLeft + (botonCorazon.offsetWidth / 2) + offset - 12}px`;
                        corazon.style.top  = `${botonCorazon.offsetTop}px`;
                        botonCorazon.parentElement.appendChild(corazon);
                        setTimeout(() => corazon.remove(), 1000);
                    } catch (error) {
                        console.error('Error al enviar el corazón: ', error);
                    }
                });
            }
        }

        // Lightbox del CV
        if (tema === 'cv') {
            const imgCV = document.getElementById('cv-preview-img');
            if (!imgCV) return;

            imgCV.addEventListener('click', () => {
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed; inset: 0; z-index: 9999;
                    background: rgba(0,0,0,0.85);
                    display: flex; align-items: center; justify-content: center;
                    cursor: zoom-out;
                `;

                const imgGrande = document.createElement('img');
                imgGrande.src   = imgCV.src;
                imgGrande.style.cssText = `
                    max-width: 90vw; max-height: 90vh;
                    border-radius: 8px;
                    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
                `;

                overlay.appendChild(imgGrande);
                document.body.appendChild(overlay);

                overlay.addEventListener('click', () => overlay.remove());
                const onEsc = (e) => {
                    if (e.key === 'Escape') { overlay.remove(); document.removeEventListener('keydown', onEsc); }
                };
                document.addEventListener('keydown', onEsc);
            });
        }
    }

    btnAbrir?.addEventListener('click', abrirMini);
    miniCerrar?.addEventListener('click', cerrarMini);
    panelCerrar?.addEventListener('click', cerrarPanel);

    document.querySelector('a[href="#contacto-mini"]')?.addEventListener('click', (e) => {
        e.preventDefault();
        abrirMini();
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

    panel.addEventListener('click', (e) => {
        if (e.target === panel) cerrarPanel();
    });

    function initFormProyecto() {
        const TOTAL_STEPS  = 5;
        const slides       = document.querySelectorAll('.fp-slide');
        const progressFill = document.getElementById('fp-progress-fill');

        function goToSlide(idx) {
            slides.forEach(s => s.classList.remove('active'));
            const target = document.querySelector(`.fp-slide[data-index="${idx}"]`);
            if (target) target.classList.add('active');
            progressFill.style.width = `${Math.round(((idx + 1) / TOTAL_STEPS) * 100)}%`;
            const input = target?.querySelector('.fp-input');
            if (input) setTimeout(() => input.focus(), 80);
        }

        function currentSlideIndex() {
            const active = document.querySelector('.fp-slide.active');
            return active ? parseInt(active.dataset.index) : 0;
        }

        document.querySelectorAll('.fp-btn-next').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextIdx    = parseInt(btn.dataset.next);
                const currentIdx = currentSlideIndex();

                if (currentIdx === 0) {
                    const val = document.getElementById('fp-nombre')?.value.trim();
                    if (!val) { document.getElementById('fp-nombre')?.focus(); return; }
                }
                if (currentIdx === 1) {
                    const val   = document.getElementById('fp-email')?.value.trim();
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

        document.querySelectorAll('.fp-option').forEach(opt => {
            opt.addEventListener('click', () => {
                document.querySelectorAll('.fp-option').forEach(o => o.classList.remove('selected'));
                opt.classList.add('selected');
                document.getElementById('fp-tipo').value = opt.dataset.value;
                setTimeout(() => goToSlide(3), 220);
            });
        });

        ['fp-nombre', 'fp-email'].forEach(id => {
            document.getElementById(id)?.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.querySelector('.fp-slide.active .fp-btn-next')?.click();
                }
            });
        });

        const checkPriv = document.getElementById('fp-privacidad');
        const btnEnviar = document.getElementById('fp-btn-enviar');
        checkPriv?.addEventListener('change', () => {
            btnEnviar.disabled = !checkPriv.checked;
        });

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

            btnEnviar.disabled     = true;
            btnEnviar.textContent  = 'Enviando…';
            errorMsg.textContent   = '';

            try {
                const PUBLIC_KEY  = 'l2swxxhOUql-X3Xm_';
                const SERVICE_ID  = 'service_fvhp9jv';
                const TEMPLATE_ID = 'template_ubw0339';

                await emailjs.init(PUBLIC_KEY);
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                    from_name:    nombre,
                    from_email:   email,
                    project_type: tipo,
                    message:      descripcion
                });

                const formWrap = document.getElementById('form-proyecto');
                const gracias  = document.getElementById('fp-gracias');
                if (formWrap && gracias) {
                    const activeSlide = document.querySelector('.fp-slide.active');
                    activeSlide?.style.setProperty('opacity', '0');
                    activeSlide?.style.setProperty('transition', 'opacity 0.3s');
                    progressFill.style.width = '100%';
                    setTimeout(() => {
                        document.querySelector('.fp-slide.active').style.display = 'none';
                        gracias.classList.remove('hidden');
                    }, 300);
                }
            } catch (err) {
                console.error('EmailJS error:', err);
                errorMsg.textContent  = 'Ups, algo fue mal. Prueba de nuevo o escríbeme directamente.';
                btnEnviar.disabled    = false;
                btnEnviar.textContent = 'Enviar mensaje ✦';
            }
        });
    }
})();


// ── CROSSFADE SECTION (solo tablet/móvil ≤1024px) ──────────────────────────

(function () {
    const crossfadeSection = document.getElementById('crossfade-section');
    if (!crossfadeSection || window.innerWidth > 1024) return;

    const img1   = document.getElementById('cf-img1');
    const img2   = document.getElementById('cf-img2');
    const imgs   = [img1, img2];
    const franjas = [
        { desde: 0,    hasta: 0.55 },
        { desde: 0.45, hasta: 1.00 },
    ];

    function getProgreso() {
        const rect        = crossfadeSection.getBoundingClientRect();
        const totalHeight = crossfadeSection.offsetHeight - window.innerHeight;
        return Math.min(Math.max(-rect.top / totalHeight, 0), 1);
    }

    function actualizarCrossfade() {
        const p = getProgreso();
        imgs.forEach((img, i) => {
            const { desde, hasta } = franjas[i];
            img.style.opacity = (p >= desde && p < hasta) ? '1' : '0';
        });
    }

    if (portfolioContent) {
        portfolioContent.addEventListener('scroll', actualizarCrossfade, { passive: true });
    }

    actualizarCrossfade();
})();
