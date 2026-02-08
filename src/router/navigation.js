import { storeToRefs } from "pinia";
import router from '@/router/index';
import { useAccessStore } from "@/stores/access.js";
import { scrollToTop } from '@/utils/scrollToTop'

// Hook global de navegación para proteger rutas que requieren autenticación
// y redirigir si no se cumple la condición
// Usamos el store de accesos para verificar el token de acceso
// Si la ruta requiere autenticación y no hay token, redirigimos a "Home"
// Si la ruta no requiere autenticación, permitimos la navegación
router.beforeEach((to, from, next) => {
    // Store de accesos
    const useAccess = useAccessStore();
    const { accessToken, permissions } = storeToRefs(useAccess);

    // Verificar si la ruta requiere autenticación
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // Verificar si hay token de acceso
        if (accessToken.value) {
            // Si los permisos del usuario autenticado está incluida la ruta a donde va navegar
            if (permissions.value.includes(to.name)) {
                // que lo deje pasar
                next();
            } else {
                // de lo contrario que lo regrese a la ventana general
                next({
                    name: "Home",
                });
            }
        } else {
            // Redirigir a la página de inicio si no hay token de acceso
            next({ name: "Login" });
        }
    } else {
        // Permitir navegación si la ruta no requiere autenticación
        next();
    }
});

// Hook global para subir al inicio en cada navegación
router.afterEach(() => {
    scrollToTop()
})