/**
 * Función para desplazar la vista al inicio de la página o contenedor específico
 * con un retraso opcional para permitir transiciones suaves
 */
export const scrollToTop = (delay = 1100) => {
    setTimeout(() => {
        const contentContainer = document.querySelector(".scrollable-content");

        if (contentContainer) {
            contentContainer.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, delay);
};
