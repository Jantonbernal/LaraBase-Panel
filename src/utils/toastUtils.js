import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

/**
 * Muestra un toast de notificación
 * @param {string} message - Mensaje a mostrar en el toast
 * @param {string} type - Tipo de toast: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Tiempo en milisegundos que se mostrará (default: 3000ms)
 */
export function showToast(message, type = 'success', duration = 3000, positionToast = 'bottom-right') {
    toast.open({
        message,
        type,
        duration,
        position: positionToast, // Puedes cambiar la posición (top, bottom, top-right, bottom-right,top-left, bottom-left, etc.)
        dismissible: true, // Permite cerrar la notificación manualmente
    });
}
