// composables/useFileHandler.js
import { ref } from 'vue';
import { showToast } from '@/utils/toastUtils';
import { validateFileExtension } from '@/utils/fileUtils';

export function useFileHandler() {
    const imagePreview = ref(null);

    /**
     * @param {Event} event - Evento del input
     * @param {Function} callback - Para asignar el archivo al form
     * @param {Object} options - Configuración: { extensions: [], maxSizeMB: 2 }
     */
    const handleImageSelected = async (event, callback, options = {}) => {
        const {
            extensions = ["png", "jpg", "jpeg", "gif"],
            maxSizeMB = 2
        } = options;

        const file = event.target.files[0];

        // Función auxiliar para limpiar todo en caso de error
        const resetSelection = () => {
            imagePreview.value = null;
            if (event.target) event.target.value = ''; // Limpia el input físicamente
            if (callback) callback(null); // Avisa al componente que limpie el form.file
        };

        // 1. Validar que exista un archivo
        if (!file) {
            resetSelection();
            return null;
        }

        // 2. Validar tamaño (Convertir MB a Bytes)
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            showToast(`El archivo es muy pesado. Máximo permitido: ${maxSizeMB}MB`, 'error');
            resetSelection();
            return null;
        }

        // 3. Validar extensión (Promesa)
        const isAllowed = await validateFileExtension(file, extensions);
        if (!isAllowed) {
            showToast(`Extensión no permitida. Use: ${extensions.join(', ')}`, 'error');
            resetSelection();
            return null;
        }

        // 4. Generar Preview si es imagen
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.value = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.value = null;
        }

        // 5. Todo OK: Retornar archivo al componente
        if (callback) callback(file);
        return file;
    };

    return {
        imagePreview,
        handleImageSelected
    };
}