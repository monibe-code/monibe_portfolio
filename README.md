# MoniBe — Portfolio Personal 🚀

¡Hola! Soy **Mónica**, desarrolladora web enfocada en la **programación empática**. Este repositorio contiene el código fuente de mi portfolio profesional, donde muestro mi transición, mis habilidades técnicas y mi forma de entender la tecnología: poniendo siempre a las personas en el centro.

🌍 **Puedes ver el proyecto en vivo aquí:** [monibe.es](https://monibe.es)

---

## 🧠 Sobre mí & Programación Empática

Mi camino hacia el desarrollo web no ha sido el tradicional, y eso es precisamente lo que define mi valor como programadora. Tras licenciarme en **Psicología** y especializarme en **Quiromasaje profesional**, pasé años trabajando en entornos de alta exigencia y bienestar. 

De ahí nace mi visión de la **programación empática**:
* **Enfoque en el usuario:** No solo escribo código que funcione, busco entender las necesidades emocionales y cognitivas de quien va a interactuar con la aplicación.
* **Público polivalente:** Es un portfolio diseñado meticulosamente para que los **desarrolladores, compañeros y profesores** puedan auditar el código y la arquitectura, pero a la vez es accesible, intuitivo y cercano para que **familiares, amigos y reclutadores** de RRHH naveguen por él con total comodidad.
* **Código limpio y colaborativo:** Facilidad para comunicarme con equipos multidisciplinares, entender las dinámicas de grupo y escribir código que otros desarrolladores puedan leer y mantener con facilidad.

Actualmente, acabo de finalizar el curso de ** Técnico Superior en Desarrollo de Aplicaciones Web (DAW)**.

---

## ✨ Características Especiales del Proyecto

Este portfolio va más allá de una web estática común, incorporando decisiones de diseño y desarrollo avanzadas:

* **Usabilidad y Heurísticas de Nielsen:** Interfaz diseñada siguiendo rigurosamente las normas de usabilidad de Jakob Nielsen, garantizando consistencia, prevención de errores y un control intuitivo por parte del usuario.
* **Diseño 100% Responsivo:** Adaptabilidad absoluta. La experiencia de usuario es impecable ya se visite desde un ordenador, una tablet o un teléfono móvil.
* **Formulario estilo Typeform:** Sistema de formulario secuencial, fluido y muy agradable visualmente, que transforma la típica experiencia aburrida de contacto en una conversación interactiva.
* **Consumo de API Propia:** Realiza una llamada asíncrona a una API externa utilizando un archivo JSON creado a medida por mí para estructurar y servir dinámicamente ciertos contenidos.
* **Contador en Tiempo Real:** Conexión con Firebase (Cloud Firestore) para un sistema de interacción dinámica de "corazones" (Me gusta) con persistencia de datos.
* **Seguridad por Diseño (F12 Deshabilitado):** Se ha deshabilitado la tecla F12 a propósito mediante JavaScript como una bromilla y una demostración de control de eventos del teclado.

---

## 🛠️ Tecnologías y Herramientas utilizadas

* **Frontend:** HTML5, CSS3 nativo (Animaciones y Sliders dinámicos) y JavaScript Nativo (ES6+).
* **Backend & Serverless:** Firebase (Cloud Firestore) para la gestión del contador.
* **Datos:** JSON personalizado y APIs REST de terceros.
* **Despliegue:** GitHub Pages & Gestión de dominio personalizado (`monibe.es`).

---

## 📂 Estructura del Repositorio

```text
├── audio/          # Archivos de audio del sitio
├── fonts/          # Tipografías locales (Chillax, Satoshi)
├── img/            # Recursos gráficos e imágenes
├── video/          # Elementos multimedia en vídeo
├── index.html      # Página principal del portfolio
├── estilo...css    # Estilos y animaciones de los sliders
├── script-API.js   # Lógica e integraciones externas y JSON
└── firebase-config.js # Configuración de la base de datos