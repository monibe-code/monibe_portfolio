// ==========================================
// PROGRAMA ZEN — Botón con ondas + frase API
// ==========================================

const urlAPI = 'https://raw.githubusercontent.com/monibe-code/ProgramaZen/refs/heads/main/ProgramaZen.json';

const btnZen        = document.getElementById('btnProgramaZen');
const zenWrapper    = document.getElementById('zenButtonWrapper');
const zenDisplay    = document.getElementById('zenPhraseDisplay');
const zenInstruction = document.getElementById('zenInstruction');

async function obtenerFrasesZen() {
  try {
    const respuesta = await fetch(urlAPI);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    const datos = await respuesta.json();
    return datos.frases;
  } catch (error) {
    console.error('Error al obtener frases Zen:', error);
    return null;
  }
}

function lanzarOndasYFrase(frases) {
  if (!btnZen || !zenWrapper || !zenDisplay) return;

  // 1. Generar ondas expansivas desde el botón
  for (let i = 0; i < 3; i++) {
    const onda = document.createElement('span');
    onda.classList.add('zen-ripple');
    onda.style.animationDelay = `${i * 200}ms`;
    zenWrapper.appendChild(onda);
    setTimeout(() => onda.remove(), 2000 + i * 200);
  }

  // 2. Desvanecer el botón
  btnZen.classList.add('zen-btn-fade');

  // 3. Mostrar frase tras la animación
  setTimeout(() => {
    zenWrapper.style.display = 'none';
    if (zenInstruction) zenInstruction.style.display = 'none';

    if (!frases) {
      zenDisplay.textContent = '🌿 No se pudieron cargar las frases. Comprueba la URL del JSON en GitHub.';
    } else {
      const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
      zenDisplay.textContent = `\u201C${fraseAleatoria.frase}\u201D`;
    }

    zenDisplay.classList.remove('hidden');
    zenDisplay.classList.add('zen-phrase-visible');
  }, 1400);
}

// ── Listener principal ──
if (btnZen) {
  btnZen.addEventListener('click', async () => {
    btnZen.disabled = true; // evita doble clic mientras carga
    const frases = await obtenerFrasesZen();
    lanzarOndasYFrase(frases);
  });
}