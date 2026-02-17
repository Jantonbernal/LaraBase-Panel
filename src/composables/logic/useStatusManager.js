import { watch } from 'vue'
import { showAlert, showConfirmAlert } from "@/utils/swalUtils";
import { showToast } from '@/utils/toastUtils';

export default function useStatusManager() {

    /**
     * @param {Object} options
     * @param {Function} options.toggleMethod - Función que dispara el API (ej: toggleServiceType)
     * @param {Ref} options.dataRef - Referencia reactiva del éxito (ej: dataToggleServiceType)
     * @param {Ref} options.errorRef - Referencia reactiva del error (ej: errorToggleServiceType)
     * @param {Function} options.onSuccess - Callback para refrescar la tabla (ej: resetAndFetch)
     */
    const changeStatus = async (item, { toggleMethod, dataRef, errorRef, onSuccess }) => {
        if (!item?.id) return;

        const confirmed = await showConfirmAlert(
            `¿Estás seguro de cambiar el estado de "${item.name || 'este registro'}"?`,
        );

        if (!confirmed) {
            return showAlert({ title: "Acción cancelada", text: "No se cambió el registro.", icon: "info" });
        }

        // Limpiamos estados previos antes de disparar
        dataRef.value = null;
        errorRef.value = null;

        // Ejecutamos la función que dispara el API
        await toggleMethod(item.id);

        // Configuramos watchers temporales o únicos para esta acción
        const unwatchSuccess = watch(dataRef, (received) => {
            if (received) {
                if (onSuccess) onSuccess();
                showToast(received?.message || "Operación exitosa", 'success', 5000);
                unwatchSuccess(); // Limpiamos el watcher
            }
        });

        const unwatchError = watch(errorRef, (received) => {
            if (received) {
                showToast(received?.data?.message || "Ocurrió un error", 'error', 5000);
                unwatchError(); // Limpiamos el watcher
            }
        });
    };

    return {
        changeStatus
    };
}