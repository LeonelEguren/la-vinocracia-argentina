document.addEventListener("DOMContentLoaded", () => {
  const gridNotas = document.getElementById("gridNotas");
  const lectorNota = document.getElementById("lectorNota");
  const inputBuscador = document.getElementById("inputBuscador");
  const btnVolver = document.getElementById("btnVolver");

  // Renderizar la grilla de Polaroids
  function renderizarGrilla(lista) {
    gridNotas.innerHTML = "";

    if (lista.length === 0) {
      gridNotas.innerHTML = `<p class="no-results">No se encontraron notas con esa búsqueda.</p>`;
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
    document.getElementById("notaFecha").textContent = nota.fecha;
    document.getElementById("notaAutor").textContent = `Por ${nota.autor}`;
    document.getElementById("notaCategoria").textContent = nota.categoria;
    document.getElementById("notaTitulo").textContent = nota.titulo;
    document.getElementById("notaBajada").textContent = nota.bajada;
    document.getElementById("notaContenido").innerHTML = nota.contenido;

    gridNotas.style.display = "none";
    lectorNota.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Volver a la grilla
  btnVolver.addEventListener("click", () => {
    lectorNota.style.display = "none";
    gridNotas.style.display = "grid";
  });

  // Buscador en tiempo real
  inputBuscador.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase().trim();
    const filtradas = notasBiblioteca.filter(nota => 
      nota.titulo.toLowerCase().includes(termino) ||
      nota.bajada.toLowerCase().includes(termino) ||
      nota.categoria.toLowerCase().includes(termino)
    );
    
    // Si estaba leyendo una nota y busca, volvemos a la grilla
    if (lectorNota.style.display === "block") {
      lectorNota.style.display = "none";
      gridNotas.style.display = "grid";
    }

    renderizarGrilla(filtradas);
  });

  // Inicialización
  renderizarGrilla(notasBiblioteca);
});