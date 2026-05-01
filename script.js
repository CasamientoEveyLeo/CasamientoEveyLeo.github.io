const WeddingApp = (() => {
    // === ESTADO PRIVADO ===
    const state = {
        currentSlide: 0,
        autoPlayDelay: 5000,
        elements: {
            slides: null,
            form: null,
            successMsg: null,
            submitBtn: null
        }
    };

    // === MÉTODOS PRIVADOS ===

    const _cacheDOM = () => {
        state.elements.slides = document.querySelectorAll('#carouselSlides img');
        state.elements.form = document.getElementById('rsvpForm');
        state.elements.successMsg = document.getElementById('successMsg');
        state.elements.submitBtn = state.elements.form.querySelector('.submit-btn');
    };

    // Lógica del Carrusel
    const _updateCarousel = (index) => {
        if (!state.elements.slides || state.elements.slides.length === 0) return;

        // quitar clase activa de todas
        state.elements.slides.forEach(img => img.classList.remove('active'));

        // calcular índice válido
        state.currentSlide = (index + state.elements.slides.length) % state.elements.slides.length;

        // activar la imagen correspondiente
        state.elements.slides[state.currentSlide].classList.add('active');
    };

    // Manejador del Formulario
    const _handleRSVP = async (event) => {
        event.preventDefault();
        
        const formData = new FormData(state.elements.form);
        const data = {
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            asistencia: formData.get('asistencia')
        };

        if (!data.nombre || !data.apellido || !data.asistencia) return;

        _setLoadingState(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            _showSuccess(data.nombre);
            console.log("Datos enviados con éxito:", data);
        } catch (error) {
            alert("Error al enviar. Inténtalo de nuevo.");
            _setLoadingState(false);
        }
    };

    const _setLoadingState = (isLoading) => {
        const btn = state.elements.submitBtn;
        btn.disabled = isLoading;
        btn.innerText = isLoading ? "Procesando..." : "Enviar Confirmación";
        btn.style.opacity = isLoading ? "0.7" : "1";
    };

    const _showSuccess = (nombre) => {
        state.elements.form.style.transition = "opacity 0.5s";
        state.elements.form.style.opacity = "0";
        
        setTimeout(() => {
            state.elements.form.classList.add('hidden');
            state.elements.form.style.display = 'none';
            state.elements.successMsg.innerHTML = `¡Gracias <strong>${nombre}</strong>! <br> Tu respuesta ha sido registrada. ❤️`;
            state.elements.successMsg.style.display = 'block';
        }, 500);
    };

    // === MÉTODOS PÚBLICOS ===
    return {
        init: () => {
            _cacheDOM();

            // inicializar carrusel mostrando la primera imagen
            _updateCarousel(0);

            // Eventos del Carrusel
            document.querySelector('.next').addEventListener('click', () => _updateCarousel(state.currentSlide + 1));
            document.querySelector('.prev').addEventListener('click', () => _updateCarousel(state.currentSlide - 1));

            // Auto-play
            setInterval(() => _updateCarousel(state.currentSlide + 1), state.autoPlayDelay);

            // Evento Formulario
            state.elements.form.addEventListener('submit', _handleRSVP);
            
            console.log("Boda App inicializada correctamente.");
        }
    };
})();

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', WeddingApp.init);
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll("#carouselSlides img");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(img => img.classList.remove("active"));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
  }

  document.querySelector(".next").addEventListener("click", () => showSlide(currentSlide + 1));
  document.querySelector(".prev").addEventListener("click", () => showSlide(currentSlide - 1));

  showSlide(0); // inicializar
  setInterval(() => showSlide(currentSlide + 1), 5000);
});