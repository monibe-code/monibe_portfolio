/* ================================================================
   FORMULARIO DE COLABORACIÓN — MoniBe
   Reemplaza el valor de respuestas.proyecto en script5-slider-presente.js
   ================================================================ */

/* ─── 1. HTML del formulario (pega esto como valor de respuestas.proyecto) ───
   Sustituye el bloque proyecto: `...` completo por este: */

const proyectoFormHTML = `
<div id="form-proyecto" class="form-proyecto">

  <!-- Barra de progreso -->
  <div class="fp-progress-bar">
    <div class="fp-progress-fill" id="fp-progress-fill"></div>
  </div>

  <!-- Slides del formulario -->
  <div class="fp-slides" id="fp-slides">

    <!-- Slide 0: Nombre -->
    <div class="fp-slide active" data-index="0">
      <span class="fp-step-label">01 —</span>
      <label class="fp-question">¿Cómo te llamas?</label>
      <input class="fp-input" type="text" id="fp-nombre" placeholder="Tu nombre" autocomplete="off" />
      <button class="fp-btn-next" data-next="1">Continuar →</button>
    </div>

    <!-- Slide 1: Email -->
    <div class="fp-slide" data-index="1">
      <span class="fp-step-label">02 —</span>
      <label class="fp-question">¿Cuál es tu email?</label>
      <input class="fp-input" type="email" id="fp-email" placeholder="hola@ejemplo.com" autocomplete="off" />
      <button class="fp-btn-next" data-next="2">Continuar →</button>
    </div>

    <!-- Slide 2: Tipo de proyecto -->
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

    <!-- Slide 3: Descripción -->
    <div class="fp-slide" data-index="3">
      <span class="fp-step-label">04 —</span>
      <label class="fp-question">Cuéntame un poco más. ¿En qué consiste el proyecto?</label>
      <textarea class="fp-input fp-textarea" id="fp-descripcion" placeholder="Una breve descripción del proyecto, el sector, lo que necesitas..." rows="4"></textarea>
      <button class="fp-btn-next" data-next="4">Continuar →</button>
    </div>

    <!-- Slide 4: Privacidad + Enviar -->
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

  <!-- Pantalla de gracias (oculta hasta envío) -->
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
`;

/* ─── 2. CSS (inyéctalo junto al estilo del botón CV, dentro del mismo bloque style.textContent) ─── */

const proyectoCSSExtra = `

/* ── Formulario TypeForm ── */
#form-proyecto {
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  min-height: 260px;
}

/* Barra de progreso */
.fp-progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(247,225,215,0.15);
  border-radius: 99px;
  margin-bottom: 2.4rem;
  overflow: hidden;
}
.fp-progress-fill {
  height: 100%;
  width: 0%;
  background: var(--color-accent-pink);
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(.4,0,.2,1);
}

/* Slides */
.fp-slides { position: relative; }
.fp-slide {
  display: none;
  flex-direction: column;
  gap: 1rem;
  animation: fpSlideIn 0.35s cubic-bezier(.4,0,.2,1);
}
.fp-slide.active { display: flex; }

@keyframes fpSlideIn {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

.fp-step-label {
  font-family: 'Chillax', sans-serif;
  font-size: 0.75rem;
  color: var(--color-accent-green);
  letter-spacing: 0.08em;
  opacity: 0.8;
}

.fp-question {
  font-family: 'Chillax', sans-serif;
  font-size: clamp(1.1rem, 2.2vw, 1.45rem);
  color: var(--color-bg-main);
  line-height: 1.35;
}

.fp-input {
  background: rgba(247,225,215,0.07);
  border: none;
  border-bottom: 1.5px solid rgba(247,225,215,0.35);
  color: var(--color-bg-main);
  font-family: 'Satoshi', sans-serif;
  font-size: 1rem;
  padding: 0.6rem 0.2rem;
  outline: none;
  transition: border-color 0.2s;
  caret-color: var(--color-accent-pink);
}
.fp-input:focus { border-bottom-color: var(--color-accent-pink); }
.fp-input::placeholder { color: rgba(247,225,215,0.3); }

.fp-textarea {
  resize: none;
  border: 1.5px solid rgba(247,225,215,0.25);
  border-radius: 8px;
  padding: 0.7rem 0.8rem;
}
.fp-textarea:focus { border-color: var(--color-accent-pink); }

/* Opciones tipo chip */
.fp-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.2rem;
}
.fp-option {
  background: rgba(247,225,215,0.07);
  border: 1.5px solid rgba(247,225,215,0.2);
  color: var(--color-bg-main);
  font-family: 'Satoshi', sans-serif;
  font-size: 0.88rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}
.fp-option:hover,
.fp-option.selected {
  background: var(--color-accent-pink);
  border-color: var(--color-accent-pink);
  color: var(--color-dark-slate);
}

/* Botón continuar */
.fp-btn-next {
  align-self: flex-start;
  background: none;
  border: 1.5px solid var(--color-bg-main);
  color: var(--color-bg-main);
  font-family: 'Chillax', sans-serif;
  font-size: 0.95rem;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 0.4rem;
  transition: background 0.2s, color 0.2s;
}
.fp-btn-next:hover {
  background: var(--color-bg-main);
  color: var(--color-dark-slate);
}

/* Privacidad */
.fp-privacy-label {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-family: 'Satoshi', sans-serif;
  font-size: 0.88rem;
  color: rgba(247,225,215,0.75);
  cursor: pointer;
  line-height: 1.5;
}
.fp-checkbox {
  accent-color: var(--color-accent-pink);
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 3px;
  cursor: pointer;
}
.fp-privacy-link {
  color: var(--color-accent-pink);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.fp-privacy-link:hover { opacity: 0.8; }

/* Botón enviar */
.fp-btn-send {
  align-self: flex-start;
  background: var(--color-accent-green);
  border: none;
  color: var(--color-dark-slate);
  font-family: 'Chillax', sans-serif;
  font-size: 1rem;
  padding: 0.7rem 1.8rem;
  border-radius: 999px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  margin-top: 0.4rem;
}
.fp-btn-send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.fp-btn-send:not(:disabled):hover {
  opacity: 0.85;
  transform: scale(1.02);
}

.fp-error-msg {
  font-size: 0.82rem;
  color: var(--color-accent-pink);
  min-height: 1.2em;
}

/* ── Pantalla de Gracias ── */
.fp-gracias {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.fp-gracias:not(.hidden) {
  opacity: 1;
  pointer-events: all;
  animation: fpGraciasIn 0.6s cubic-bezier(.4,0,.2,1) forwards;
}
@keyframes fpGraciasIn {
  from { opacity: 0; transform: scale(0.94) translateY(10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.fp-gracias-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.fp-gracias-icon {
  font-size: 2.4rem;
  color: var(--color-accent-pink);
  animation: fpPulse 2s ease-in-out infinite;
}
@keyframes fpPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.6; transform: scale(1.12); }
}

.fp-gracias-titulo {
  font-family: 'Chillax', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--color-bg-main);
  line-height: 1;
}

.fp-gracias-sub {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(247,225,215,0.85);
}

.fp-gracias-linea {
  width: 40px;
  height: 1.5px;
  background: var(--color-accent-green);
  border-radius: 99px;
  margin: 0.4rem 0;
}

.fp-gracias-detalle {
  font-family: 'Satoshi', sans-serif;
  font-size: 0.88rem;
  color: rgba(247,225,215,0.45);
}
`;

/* ─── 3. JS del formulario ─── 
   Añade esta función en tu script, y llámala tras inyectar el HTML del formulario.
   Llámala así dentro de abrirPanel, en el bloque if (tema === 'proyecto'): 
   
     if (tema === 'proyecto') initFormProyecto();
*/

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
