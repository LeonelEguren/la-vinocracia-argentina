function initModal() {
    const modal = document.getElementById("welcomeModal");
    if (!modal) return;

    const btnCerrar = document.getElementById("closeModal");

    setTimeout(() => {
        modal.classList.add("mostrar");
    }, 500);

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => modal.classList.remove("mostrar"));
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("mostrar");
    });
}

window.initModal = initModal;

if (document.readyState !== "loading") {
    initModal();
}