/* ==========================================================================
   ISTP SANTA LUCÍA — SCRIPT PRINCIPAL
   Este archivo se comparte en todas las páginas. Cada función verifica
   que sus elementos existan antes de ejecutarse, ya que no todas las
   páginas tienen los mismos componentes (galería, formularios, etc).

   Índice:
   1.  Encabezado con efecto de scroll + menú responsive
   2.  Scroll suave para enlaces internos (anclas)
   3.  Botón "volver arriba"
   4.  Animaciones al desplazarse (Intersection Observer)
   5.  Contadores animados (estadísticas)
   6.  Efecto parallax del hero
   7.  Pestañas de noticias
   8.  Acordeón de preguntas frecuentes (FAQ)
   9.  Filtros de galería + Lightbox
   10. Validación de formularios (admisión / contacto)
   11. Año dinámico en el footer
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ========================================================================
     1. ENCABEZADO CON EFECTO DE SCROLL + MENÚ RESPONSIVE
     ======================================================================== */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__menu");

  function actualizarHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("con-scroll");
    } else {
      header.classList.remove("con-scroll");
    }
  }
  actualizarHeader();
  window.addEventListener("scroll", actualizarHeader, { passive: true });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const abierto = navMenu.classList.toggle("abierto");
      navToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
      navToggle.innerHTML = abierto
        ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });

    // Cierra el menú móvil al elegir una opción
    navMenu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        navMenu.classList.remove("abierto");
        navToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      });
    });
  }

  /* ========================================================================
     2. SCROLL SUAVE PARA ENLACES INTERNOS (ANCLAS DENTRO DE LA MISMA PÁGINA)
     ======================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (enlace) {
    enlace.addEventListener("click", function (evento) {
      const destinoId = enlace.getAttribute("href");
      if (destinoId.length < 2) return;
      const destino = document.querySelector(destinoId);
      if (destino) {
        evento.preventDefault();
        const offset = 90;
        const posicion = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: posicion, behavior: "smooth" });
      }
    });
  });

  /* ========================================================================
     3. BOTÓN "VOLVER ARRIBA"
     ======================================================================== */
  const btnArriba = document.querySelector(".volver-arriba");
  if (btnArriba) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 500) {
        btnArriba.classList.add("visible");
      } else {
        btnArriba.classList.remove("visible");
      }
    }, { passive: true });

    btnArriba.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ========================================================================
     4. ANIMACIONES AL DESPLAZARSE (INTERSECTION OBSERVER)
     Aplica la clase ".visible" cuando un elemento ".reveal" entra en
     el viewport, disparando la transición definida en estilos.css.
     ======================================================================== */
  const elementosReveal = document.querySelectorAll(".reveal");
  if (elementosReveal.length && "IntersectionObserver" in window) {
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    elementosReveal.forEach(function (el) { observador.observe(el); });
  } else {
    // Sin soporte de IntersectionObserver: mostrar todo directamente
    elementosReveal.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ========================================================================
     5. CONTADORES ANIMADOS (ESTADÍSTICAS)
     Anima los números de class ".estadistica__numero" desde 0 hasta el
     valor indicado en el atributo data-valor, solo cuando son visibles.
     ======================================================================== */
  const contadores = document.querySelectorAll(".estadistica__numero[data-valor]");
  if (contadores.length) {
    const duracionMs = 1800;

    function animarContador(elemento) {
      const valorFinal = parseInt(elemento.getAttribute("data-valor"), 10) || 0;
      const inicio = performance.now();

      function paso(ahora) {
        const progreso = Math.min((ahora - inicio) / duracionMs, 1);
        const facilitado = 1 - Math.pow(1 - progreso, 3); // ease-out cúbico
        elemento.textContent = Math.floor(facilitado * valorFinal).toLocaleString("es-PE");
        if (progreso < 1) {
          requestAnimationFrame(paso);
        } else {
          elemento.textContent = valorFinal.toLocaleString("es-PE");
        }
      }
      requestAnimationFrame(paso);
    }

    if ("IntersectionObserver" in window) {
      const observadorContadores = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observadorContadores.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.5 });
      contadores.forEach(function (el) { observadorContadores.observe(el); });
    } else {
      contadores.forEach(animarContador);
    }
  }

  /* ========================================================================
     6. EFECTO PARALLAX DEL HERO
     Desplaza el fondo del hero a una velocidad menor que el scroll real,
     generando profundidad. Se desactiva si el usuario prefiere menos
     movimiento en pantalla.
     ======================================================================== */
  const fondoHero = document.querySelector(".hero__fondo");
  const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (fondoHero && !prefiereMenosMovimiento) {
    window.addEventListener("scroll", function () {
      const desplazamiento = window.scrollY;
      if (desplazamiento < window.innerHeight * 1.2) {
        fondoHero.style.transform = "translateY(" + (desplazamiento * 0.32) + "px)";
      }
    }, { passive: true });
  }

  /* ========================================================================
     7. PESTAÑAS DE NOTICIAS (INICIO)
     ======================================================================== */
  const tabsNoticias = document.querySelectorAll(".tabs-noticias button");
  const tarjetasNoticias = document.querySelectorAll(".noticia-card");
  if (tabsNoticias.length && tarjetasNoticias.length) {
    tabsNoticias.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabsNoticias.forEach(function (t) { t.classList.remove("activo"); });
        tab.classList.add("activo");
        const categoria = tab.getAttribute("data-categoria");

        tarjetasNoticias.forEach(function (tarjeta) {
          const coincide = categoria === "todas" || tarjeta.getAttribute("data-categoria") === categoria;
          tarjeta.style.display = coincide ? "" : "none";
        });
      });
    });
  }

  /* ========================================================================
     8. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) — ADMISIÓN
     ======================================================================== */
  const preguntasFaq = document.querySelectorAll(".faq__item");
  preguntasFaq.forEach(function (item) {
    const boton = item.querySelector(".faq__pregunta");
    if (!boton) return;
    boton.addEventListener("click", function () {
      const yaAbierto = item.classList.contains("abierto");
      preguntasFaq.forEach(function (otro) { otro.classList.remove("abierto"); });
      if (!yaAbierto) item.classList.add("abierto");
    });
  });

  /* ========================================================================
     9. FILTROS DE GALERÍA + LIGHTBOX
     ======================================================================== */
  const filtrosGaleria = document.querySelectorAll(".filtros-galeria button");
  const itemsGaleria = document.querySelectorAll(".galeria-item");

  if (filtrosGaleria.length && itemsGaleria.length) {
    filtrosGaleria.forEach(function (filtro) {
      filtro.addEventListener("click", function () {
        filtrosGaleria.forEach(function (f) { f.classList.remove("activo"); });
        filtro.classList.add("activo");
        const categoria = filtro.getAttribute("data-filtro");

        itemsGaleria.forEach(function (item) {
          const coincide = categoria === "todas" || item.getAttribute("data-categoria") === categoria;
          item.classList.toggle("oculto", !coincide);
        });
      });
    });
  }

  const lightbox = document.querySelector(".lightbox");
  if (lightbox && itemsGaleria.length) {
    const imagenLightbox = lightbox.querySelector("img");
    const leyendaLightbox = lightbox.querySelector(".lightbox__leyenda");
    const btnCerrar = lightbox.querySelector(".lightbox__cerrar");
    const btnPrev = lightbox.querySelector(".lightbox__prev");
    const btnNext = lightbox.querySelector(".lightbox__next");
    let listaVisible = [];
    let indiceActual = 0;

    function abrirLightbox(indice) {
      listaVisible = Array.from(itemsGaleria).filter(function (item) {
        return !item.classList.contains("oculto");
      });
      indiceActual = listaVisible.indexOf(indice);
      mostrarImagenActual();
      lightbox.classList.add("activo");
      document.body.style.overflow = "hidden";
    }

    function mostrarImagenActual() {
      const item = listaVisible[indiceActual];
      if (!item) return;
      const img = item.querySelector("img");
      imagenLightbox.src = img.src;
      imagenLightbox.alt = img.alt;
      leyendaLightbox.textContent = img.alt;
    }

    itemsGaleria.forEach(function (item) {
      item.addEventListener("click", function () { abrirLightbox(item); });
    });

    function cerrarLightbox() {
      lightbox.classList.remove("activo");
      document.body.style.overflow = "";
    }

    if (btnCerrar) btnCerrar.addEventListener("click", cerrarLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) cerrarLightbox();
    });

    if (btnPrev) btnPrev.addEventListener("click", function () {
      indiceActual = (indiceActual - 1 + listaVisible.length) % listaVisible.length;
      mostrarImagenActual();
    });
    if (btnNext) btnNext.addEventListener("click", function () {
      indiceActual = (indiceActual + 1) % listaVisible.length;
      mostrarImagenActual();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("activo")) return;
      if (e.key === "Escape") cerrarLightbox();
      if (e.key === "ArrowLeft" && btnPrev) btnPrev.click();
      if (e.key === "ArrowRight" && btnNext) btnNext.click();
    });
  }

  /* ========================================================================
     10. VALIDACIÓN DE FORMULARIOS (ADMISIÓN / CONTACTO)
     Validación simple en el cliente: campos obligatorios, formato de
     correo y teléfono. Muestra mensajes de error específicos por campo.
     ======================================================================== */
  const formularios = document.querySelectorAll("form[data-validar]");

  formularios.forEach(function (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      let formularioValido = true;

      formulario.querySelectorAll("[required]").forEach(function (campo) {
        const grupo = campo.closest(".form__grupo");
        const errorEtiqueta = grupo ? grupo.querySelector(".form__error") : null;
        let mensajeError = "";

        if (!campo.value.trim()) {
          mensajeError = "Este campo es obligatorio.";
        } else if (campo.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)) {
          mensajeError = "Ingresa un correo electrónico válido.";
        } else if (campo.type === "tel" && !/^[0-9+()\s-]{6,15}$/.test(campo.value)) {
          mensajeError = "Ingresa un número de teléfono válido.";
        }

        if (mensajeError) {
          formularioValido = false;
          if (grupo) grupo.classList.add("con-error");
          if (errorEtiqueta) errorEtiqueta.textContent = mensajeError;
        } else {
          if (grupo) grupo.classList.remove("con-error");
          if (errorEtiqueta) errorEtiqueta.textContent = "";
        }
      });

      const mensajeExito = formulario.querySelector(".form__exito") || formulario.closest(".form-card").querySelector(".form__exito");
      if (!formularioValido) {
        if (mensajeExito) {
          mensajeExito.classList.remove("error");
          mensajeExito.classList.add("mostrar");
          mensajeExito.style.display = "flex";
          mensajeExito.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Completa los campos obligatorios antes de enviar.';
        }
        return;
      }

      if (mensajeExito) {
        mensajeExito.classList.remove("error");
        mensajeExito.classList.add("mostrar");
        mensajeExito.style.display = "flex";
        mensajeExito.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Procesando...';
      }

      const url = formulario.action;
      const datos = new FormData(formulario);

      fetch(url, {
        method: "POST",
        body: datos,
        headers: {
          "Accept": "application/json"
        }
      })
        .then(function (respuesta) {
          if (!respuesta.ok) {
            throw new Error("No se pudo enviar el mensaje.");
          }
          return respuesta.text().catch(function () { return ""; });
        })
        .then(function () {
          if (mensajeExito) {
            mensajeExito.classList.remove("error");
            mensajeExito.classList.add("mostrar");
            mensajeExito.style.display = "flex";
            mensajeExito.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Mensaje enviado. Gracias por contactarnos.';
            setTimeout(function () {
              mensajeExito.classList.remove("mostrar", "error");
              mensajeExito.style.display = "none";
            }, 4000);
          }
          formulario.reset();
        })
        .catch(function () {
          if (mensajeExito) {
            mensajeExito.classList.add("error");
            mensajeExito.classList.add("mostrar");
            mensajeExito.style.display = "flex";
            mensajeExito.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Ocurrió un error al enviar tu mensaje. Inténtalo de nuevo.';
            setTimeout(function () {
              mensajeExito.classList.remove("mostrar", "error");
              mensajeExito.style.display = "none";
            }, 4000);
          }
        });
    });
  });

  /* ========================================================================
     11. AÑO DINÁMICO EN EL FOOTER
     ======================================================================== */
  const elementoAnio = document.querySelector("[data-anio]");
  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }

});
