const modal = document.getElementById("welcomeModal");
if (!modal) {
    // No hace nada si el modal no está en la página.
} else {
    const btnCerrar = document.getElementById("closeModal");

    // Muestra el modal después de 500ms
    setTimeout(() => {
        modal.classList.add("mostrar");
    }, 500);

    // Lógica para cerrar el modal
    if (btnCerrar) { btnCerrar.addEventListener("click", () => modal.classList.remove("mostrar")); }
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("mostrar");
    });
}