import { computed, reactive, ref, watch } from "vue"
import { useVuelidate } from '@vuelidate/core'
import { useTablePagination } from '@/composables/logic/useTablePagination';
import { m } from '@/composables/logic/useValidationUtils'
import { showAlert, showConfirmAlert } from "@/utils/swalUtils";
import { showToast } from '@/utils/toastUtils';

export default function useMenuForm(permissions, menuService, authService, menus) {

    const {
        page,
        search,
        resetAndFetch: searchResults // Renombramos resetAndFetch a searchResults para no romper el resto de tu código
    } = useTablePagination(menuService.indexMenus);

    // Params Tree
    const mode = ref(null);
    const active = ref([]);
    const open = ref([]);
    // Tipos de Jerarquias
    const hierarchyOptions = ref([{ id: '1', title: 'Padre' }, { id: '2', title: 'Hijo' }]);

    // Formulario
    const form = reactive({
        id: null,
        menu: null,
        icon: null,
        hierarchy: null,
        parent: null,
        permission_id: null,
        status: '1'
    })

    // Definir reglas de validación
    const rules = computed(() => ({
        id: { requiredIf: m.requiredIf(!mode.value) },
        menu: { required: m.required() },
        icon: { required: m.required() },
        hierarchy: { required: m.required() },
        parent: { requiredIf: m.requiredIf(form.hierarchy == '2') },
        permission_id: { requiredIf: m.requiredIf(form.hierarchy == '2') },
    }));

    // Inicializar validaciones
    const v$ = useVuelidate(rules, form);

    // Formatear Tree para el componente
    const treeItems = computed(() => {
        const mapMenu = (item) => ({
            id: item.id,
            title: item.menu,
            icon: item.icon,
            // Si tiene hijos, los mapeamos recursivamente
            children: item.allChildrenMenus && item.allChildrenMenus.length > 0
                ? item.allChildrenMenus.map(mapMenu)
                : undefined
        })

        return menuService.dataIndexMenus?.value.data.map(mapMenu)
    })

    // 1. ¿Debe el usuario ver el input? 
    // Se muestra si tiene permiso de editar, ver o crear.
    const canSeeMenu = computed(() => {
        return ['menu.editar', 'menu.ver', 'menu.crear'].some(p => permissions.value.includes(p));
    });

    // 2. ¿Debe el input estar bloqueado?
    // Solo se bloquea si puede ver pero NO puede editar.
    // Solo puede Ver = true && !false -> true && true = true (Bloqueado ✅)
    // Puede Ver y Editar = true && !true -> true && false = false (Habilitado ✅)
    // Solo puedo Editar = false && !true -> false && false = true (Habilitaado ✅)
    const isMenuReadOnly = computed(() => {
        const canEdit = permissions.value.includes('menu.editar');
        const canView = permissions.value.includes('menu.ver');
        const canCreate = permissions.value.includes('menu.crear');

        // REGLA 1: Si el usuario intenta crear (mode tiene valor o es 'create')
        if (mode.value) {
            // Si tiene permiso de crear, NO es readonly (false). 
            // Si NO tiene permiso, es readonly (true).
            return !canCreate;
        }

        // REGLA 2: Si no estamos creando (modo edición o vista de datos existentes)
        // Se bloquea si solo puede ver pero no editar.
        return canView && !canEdit;
    });

    // Métodos de Acción
    const reset = () => {
        v$.value.$reset();
        Object.assign(form, { id: null, menu: null, icon: null, hierarchy: null, parent: null, permission_id: null, status: '1' });
        // Limpiar errores de servidor si los hay
        menuService.dataStoreMenu.value = null;
        menuService.errorStoreMenu.value = null;
        menuService.dataUpdateMenu.value = null;
        menuService.errorUpdateMenu.value = null;
    };

    const handleStatusChange = async (item) => {
        if (!menuService.dataIndexMenus.value?.data.length) return;

        const confirmed = await showConfirmAlert(`¿Estás seguro de realizar esta acción?`);

        if (!confirmed) {
            return showAlert({ title: "Acción cancelada", text: "No se cambió el registro.", icon: "info" });
        }

        if (confirmed) {
            menuService.dataToggleMenu.value = null
            menuService.errorToggleMenu.value = null

            menuService.toggleMenu(item.id);
        }
    };

    const save = async () => {
        const isFormCorrect = await v$.value.$validate()
        if (!isFormCorrect) return

        form.id ? menuService.updateMenu(form.id, form) : menuService.storeMenu(form);
    };

    // Atento al menu seleccionado
    watch(active, (val) => {
        if (val?.length) {
            mode.value = null;
            reset();
            menuService.showMenu(val);
        }
    }, { deep: true });

    // Watch para modalidad de registro
    watch(mode, (val) => { if (val) reset(); });

    // Carga los datos del menu seleccionado
    watch(menuService.dataShowMenu, (val) => {
        if (val) Object.assign(form, val.data);
    });

    // 1. Helper para acciones comunes de éxito
    const handleApiSuccess = (message) => {
        showToast(message || 'Operación exitosa', 'success', 5000);
        active.value = []; // Limpia selección
        searchResults();   // Recarga lista
        authService.allAccess(); // Actualiza accesos globales
    };

    // 2. Helper para acciones de error
    const handleApiError = (error) => {
        const msg = error?.data?.message || "Ocurrió un error inesperado";
        showToast(msg, 'error', 5000);
    };

    // --- WATCHERS DE PETICIONES ---

    // Watch para Store (Crear)
    watch(menuService.dataStoreMenu, (received) => {
        if (received) handleApiSuccess(received.message);
    });
    watch(menuService.errorStoreMenu, (received) => {
        if (received) handleApiError(received);
    });

    // Watch para Update (Editar)
    watch(menuService.dataUpdateMenu, (received) => {
        if (received) handleApiSuccess(received.message);
    });
    watch(menuService.errorUpdateMenu, (received) => {
        if (received) handleApiError(received);
    });

    // Watch para Toggle (Estado/Eliminar)
    watch(menuService.dataToggleMenu, (received) => {
        if (received) handleApiSuccess(received.message);
    });
    watch(menuService.errorToggleMenu, (received) => {
        if (received) {
            searchResults(); // Específico de tu lógica original
            handleApiError(received);
        }
    });

    // Watch para actualizar el Store de Pinia (Menus globales)
    watch(authService.dataAllAccess, (received) => {
        if (received) {
            // Asignamos directamente al store de Pinia
            menus.value = received.allMenus;
        }
    });

    return {
        form, v$, mode, active, open, page, search, treeItems,
        hierarchyOptions, isMenuReadOnly, canSeeMenu,
        save, reset, searchResults, handleStatusChange
    };
}