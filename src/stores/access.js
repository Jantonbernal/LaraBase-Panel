import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { showToast } from '@/utils/toastUtils';

export const useAccessStore = defineStore('access', () => {
    const access = ref(null);
    const accessToken = ref(null)
    const permissions = ref([]);
    const roles = ref([]);
    const role = ref({});
    const roleSelected = ref(null);

    const router = useRouter();

    // Está atento a cambios en el access
    watch(access, (value) => {
        if (!value) {
            // Si el access es nulo, limpiar el token de acceso y demás datos de acceso
            accessToken.value = null
            permissions.value = [];
            roles.value = [];
            role.value = {};
            roleSelected.value = null;

            // Verificar si el usuario no está en la página de login
            if (router.currentRoute.value.name !== "Login") {
                router.push({ name: "Login" });
            }
            showToast("Tu sesión ha caducado. Por favor, inicia sesión nuevamente", "error");
        }
    });

    watch(permissions, async (newPermissions) => {
        // 1. Verificamos que existan permisos
        const hasPermissions = newPermissions && newPermissions.length > 0;

        // 2. Esperamos un "tick" para asegurarnos de que el router se haya actualizado
        // o forzamos la lectura de la ruta de destino
        await router.isReady();

        // 3. Obtenemos la ruta actual
        const currentRoute = router.currentRoute.value;

        // 4. Verificamos si la ruta actual (o alguna de sus padres) requiere Auth
        const isAuthRoute = currentRoute.matched.some(record => record.meta.requiresAuth);

        // console.log('Ruta actual:', currentRoute.name);
        // console.log('¿Requiere Auth?:', isAuthRoute);

        // 5. Si ya tenemos permisos y estamos en una ruta que NO requiere auth (Login/Reset)
        if (hasPermissions && isAuthRoute === false) {
            // console.log('Redirigiendo a Home porque ya tienes permisos...');
            router.push({ name: 'Home' });
        }
    });

    return {
        access,
        accessToken,
        permissions,
        roles,
        role,
        roleSelected
    }
}, {
    persist: true
})