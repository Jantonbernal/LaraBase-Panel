/**
 * Funcion para desplazar suavemente la vista hasta el contenedor de la tabla después de un retraso especificado.
 */
export const scrollToTable = (delay = 500) => {
    setTimeout(() => {
        const tableContainer = document.querySelector(".table-container");

        if (tableContainer) {
            tableContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, delay);
};
