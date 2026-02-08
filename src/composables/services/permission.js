import { useHttpRequest } from "@/composables/useHttpRequest";
import { ref, watch } from "vue";

export default function usePermission() {

    const { dataEndPoint: dataIndexPermissions, sendRequest: indexPermissions_, loading: loadingIndexPermissions, errorEndPoint: errorIndexPermissions } = useHttpRequest();
    const { dataEndPoint: dataShowPermission, sendRequest: showPermission_, loading: loadingShowPermission, errorEndPoint: errorShowPermission } = useHttpRequest();
    const { dataEndPoint: dataAllPermissions, sendRequest: allPermissions_, loading: loadingAllPermissions, errorEndPoint: errorAllPermissions } = useHttpRequest();
    const { dataEndPoint: dataPermissionsForMenu, sendRequest: permissionsForMenu_, loading: loadingPermissionsForMenu, errorEndPoint: errorPermissionsForMenu } = useHttpRequest();
    const { dataEndPoint: dataStorePermission, sendRequest: storePermission_, loading: loadingStorePermission, errorEndPoint: errorStorePermission } = useHttpRequest();
    const { dataEndPoint: dataUpdatePermission, sendRequest: updatePermission_, loading: loadingUpdatePermission, errorEndPoint: errorUpdatePermission } = useHttpRequest();
    const { dataEndPoint: dataTogglePermission, sendRequest: togglePermission_, loading: loadingTogglePermission, errorEndPoint: errorTogglePermission } = useHttpRequest();

    const numberOfPages = ref(0)

    // Listar Permissions
    const indexPermissions = async (params) => {
        indexPermissions_('GET', 'permission', params)
    }

    // Mostrar Rol
    const showPermission = async (id) => {
        showPermission_('GET', 'permission/' + id)
    }

    const allPermissions = async (params) => {
        allPermissions_('GET', 'permission/allPermissions', params)
    }

    const permissionsForMenu = async (params) => {
        permissionsForMenu_('GET', 'permission/permissionsForMenu', params)
    }

    // Registrar
    const storePermission = async (params) => {
        storePermission_('POST', 'permission', params)
    }

    // Actualizar
    const updatePermission = async (id, params, headers) => {
        updatePermission_('PUT', 'permission/' + id, params, headers)
    }

    // Toggle Estado
    const togglePermission = async (id) => {
        togglePermission_('PATCH', 'permission/' + id + '/toggle')
    }

    // Está atento a cambios para setear el número de páginas
    watch(dataIndexPermissions, (received) => {
        if (received?.data?.length > 0) {
            numberOfPages.value = received?.meta?.last_page
        } else {
            numberOfPages.value = 0;
        }
    })

    return {
        dataIndexPermissions, numberOfPages, indexPermissions, loadingIndexPermissions, errorIndexPermissions,
        dataShowPermission, showPermission, loadingShowPermission, errorShowPermission,
        dataAllPermissions, allPermissions, loadingAllPermissions, errorAllPermissions,
        dataPermissionsForMenu, permissionsForMenu, loadingPermissionsForMenu, errorPermissionsForMenu,
        dataStorePermission, storePermission, loadingStorePermission, errorStorePermission,
        dataUpdatePermission, updatePermission, loadingUpdatePermission, errorUpdatePermission,
        dataTogglePermission, togglePermission, loadingTogglePermission, errorTogglePermission,
    }
}