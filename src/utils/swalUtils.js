import Swal from "sweetalert2";

/**
 * Muestra una alerta SweetAlert2 configurable
 * @param {Object} options - Opciones para la alerta
 * @param {string} options.title - Título de la alerta
 * @param {string} options.text - Texto del mensaje
 * @param {string} [options.icon="info"] - Icono de la alerta (success, error, warning, info, question)
 * @param {boolean} [options.showConfirmButton=true] - Mostrar botón de confirmación
 * @param {boolean} [options.showCancelButton=false] - Mostrar botón de cancelación
 * @param {string} [options.confirmButtonText="Aceptar"] - Texto del botón de confirmación
 * @param {string} [options.cancelButtonText="Cancelar"] - Texto del botón de cancelación
 * @returns {Promise} - Devuelve una promesa con el resultado de la alerta
 */
export function showAlert({
    title,
    text,
    icon = "info",
    showConfirmButton = true,
    showCancelButton = false,
    confirmButtonText = "Aceptar",
    cancelButtonText = "Cancelar",
}) {
    return Swal.fire({
        title,
        text,
        icon,
        showConfirmButton,
        showCancelButton,
        confirmButtonText,
        cancelButtonText,
    });
}

/**
 * Muestra una alerta de confirmación
 * @param {string} title - Título de la alerta
 * @param {string} text - Mensaje de confirmación
 * @returns {Promise} - Devuelve `true` si se confirma, `false` si se cancela
 */
export async function showConfirmAlert(title, text, confirm = "Sí, confirmar", cancel = "Cancelar") {
    const result = await Swal.fire({
        title,
        text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: confirm,
        cancelButtonText: cancel,
    });

    return result.isConfirmed;
}
