import axios from "axios";
import { storeToRefs } from "pinia";
import { useAccessStore } from "@/stores/access";
import useAuth from "@/composables/services/auth";
import { showToast } from '@/utils/toastUtils';

// Configuración de Axios
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
});

/**
 * Antes de enviar una petición el interceptor de solicitud se activa, 
 * Agrega el token de autorización a los headers si está disponible, en el store de Pinia (useAccessStore)
 * Esto asegura que todas las peticiones tengan el token necesario para autenticación si el usuario ha iniciado sesión
 * 
 * @return  {[type]}  Finalmente, devuelve la configuración modificada para que la petición pueda continuar
 * Si ocurre un error durante la configuración, se rechaza la promesa con el error
 */
api.interceptors.request.use(
    (config) => {
        const useAccess = useAccessStore(); // Obtener el store de Pinia
        const token = useAccess.accessToken; // Obtener el token del store

        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Agregar el token al header
        }

        return config; // Devolver la configuración modificada
    },
    (error) => {
        return Promise.reject(error); // Manejar errores de configuración
    }
);

/**
 * Después de recibir una respuesta, el interceptor de respuesta se activa.
 * Maneja errores específicos como 401 (no autorizado) y errores de red.
 * Si se recibe un 401, se cierra la sesión del usuario y se limpian los datos de autenticación en el store de Pinia.
 * Si ocurre un error de red, se muestra un mensaje de error al usuario.
 * Finalmente, se rechaza la promesa con el error para que pueda ser manejado más adelante.
 */
api.interceptors.response.use(
    (response) => {
        // Si la respuesta es exitosa, simplemente devolverla.
        return response
    },
    (error) => {
        console.log(error);
        
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            const status = error.response.status;

            if (status === 401 && !error.config.url.includes('logout')) {
                const { logout } = useAuth();
                logout(); // Cerrar sesión

                const useAccess = useAccessStore(); // Obtener el store de Pinia
                const { access, accessToken } = storeToRefs(useAccess);
                access.value = null; // Obtener el auth del store
                accessToken.value = null; // Obtener el token del store
            }
        } else if (error.code === "ERR_NETWORK") {
            // Error de red (servidor no disponible, problemas de conectividad, etc.)
            console.error("Error de red:", error.message);
            showToast(error.message, "error");
        }

        // Rechazar el error para que pueda ser capturado más adelante
        return Promise.reject(error);
    }
);

export default api;
