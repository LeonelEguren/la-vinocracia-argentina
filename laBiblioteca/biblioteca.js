document.addEventListener("DOMContentLoaded", () => {
  const gridNotas = document.getElementById("gridNotas");
  const lectorNota = document.getElementById("lectorNota");
  const bibliotecaHeader = document.querySelector(".biblioteca-header");

  // Renderizar la grilla de Polaroids
  function renderizarGrilla(lista) {
    gridNotas.innerHTML = "";

    if (lista.length === 0) {
      gridNotas.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align: center; font-size: 1.2rem; color: #666; padding: 2rem;">No se encontraron notas con esa búsqueda.</p>`;
      return;
    }

    lista.forEach(nota => {
      const card = document.createElement("article");
      card.className = "biblioteca-card";
      card.innerHTML = `
        <div class="biblioteca-card-image">
          <img src="${nota.imagen}" alt="${nota.altImagen || nota.titulo}">
        </div>
        <div class="biblioteca-card-caption">
          <span class="biblioteca-card-tag">${nota.categoria}</span>
          <h3>${nota.titulo}</h3>
          <p>${nota.bajada}</p>
        </div>
      `;

      card.addEventListener("click", () => abrirNota(nota));
      card.setAttribute("tabindex", "0");
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          abrirNota(nota);
        }
      });
      gridNotas.appendChild(card);
    });
  }

  // Abrir vista de lectura
  function abrirNota(nota) {
    document.getElementById("notaImg").src = nota.imagen;
    document.getElementById("notaImg").alt = nota.titulo;
    const imagenSecundaria = document.getElementById("notaImagenSecundaria");
    const imagenSecundariaElemento = document.getElementById("notaImgSecundaria");
    if (nota.imagenSecundaria) {
      imagenSecundariaElemento.src = nota.imagenSecundaria;
      imagenSecundariaElemento.alt = "";
      imagenSecundaria.hidden = false;
    } else {
      imagenSecundariaElemento.removeAttribute("src");
      imagenSecundaria.hidden = true;
    }
    document.getElementById("notaFecha").textContent = nota.fecha;
    document.getElementById("notaAutor").textContent = `Por ${nota.autor}`;
    document.getElementById("notaCategoria").textContent = nota.categoria;
    document.getElementById("notaTitulo").textContent = nota.titulo;
    document.getElementById("notaBajada").textContent = nota.bajada;
    document.getElementById("notaContenido").innerHTML = nota.contenido;

    gridNotas.style.display = "none";
    lectorNota.style.display = "block";
    if (bibliotecaHeader) {
      bibliotecaHeader.classList.add('clickable-back');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Volver a la grilla al hacer clic en el header si se está leyendo una nota
  if (bibliotecaHeader) {
    bibliotecaHeader.addEventListener("click", () => {
      // Solo actuar si la vista de nota está activa
      if (lectorNota.style.display === "block") {
        lectorNota.style.display = "none";
        gridNotas.style.display = "grid";
        bibliotecaHeader.classList.remove('clickable-back');
      }
    });
  }

  // Inicialización de la grilla si la variable existe
  if (typeof notasBiblioteca !== 'undefined') {
    renderizarGrilla(notasBiblioteca);
  }

  // Escuchar al buscador del Navbar (cargado dinámicamente)
  const ejecutarBusqueda = (termino) => {
    const terminoNormalizado = termino.toLowerCase().trim();
    if (typeof notasBiblioteca === 'undefined') return;

    const filtradas = notasBiblioteca.filter(nota => 
      nota.titulo.toLowerCase().includes(terminoNormalizado) ||
      nota.bajada.toLowerCase().includes(terminoNormalizado) ||
      nota.categoria.toLowerCase().includes(terminoNormalizado)
    );
    
    if (lectorNota && lectorNota.style.display === "block") {
      lectorNota.style.display = "none";
      gridNotas.style.display = "grid";
      bibliotecaHeader.classList.remove('clickable-back');
    }
    renderizarGrilla(filtradas);
  };

  // El evento se dispara desde el script que carga el navbar en laBiblioteca.html
  document.addEventListener('navbarSearchRequested', (event) => ejecutarBusqueda(event.detail.value));
});