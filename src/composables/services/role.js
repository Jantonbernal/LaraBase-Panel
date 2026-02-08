import { useHttpRequest } from "@/composables/useHttpRequest";
import { ref, watch } from "vue";

export default function useRole() {

    const { dataEndPoint: dataIndexRoles, sendRequest: indexRoles_, loading: loadingIndexRoles, errorEndPoint: errorIndexRoles } = useHttpRequest();
    const { dataEndPoint: dataAllRoles, sendRequest: allRoles_, loading: loadingAllRoles, errorEndPoint: errorAllRoles } = useHttpRequest();
    const { dataEndPoint: dataShowRole, sendRequest: showRole_, loading: loadingShowRole, errorEndPoint: errorShowRole } = useHttpRequest();
    const { dataEndPoint: dataStoreRole, sendRequest: storeRole_, loading: loadingStoreRole, errorEndPoint: errorStoreRole } = useHttpRequest();
    const { dataEndPoint: dataUpdateRole, sendRequest: updateRole_, loading: loadingUpdateRole, errorEndPoint: errorUpdateRole } = useHttpRequest();
    const { dataEndPoint: dataToggleRole, sendRequest: toggleRole_, loading: loadingToggleRole, errorEndPoint: errorToggleRole } = useHttpRequest();

    const numberOfPages = ref(0)

    // Listar Roles
    const indexRoles = async (params) => {
        indexRoles_('GET', 'role', params)
    }

    // Listar Todos los roles
    const allRoles = async (params) => {
        allRoles_('GET', 'role/allRoles', params)
    }

    // Mostrar Rol
    const showRole = async (id) => {
        showRole_('GET', 'role/' + id)
    }

    // Registrar
    const storeRole = async (params) => {
        storeRole_('POST', 'role', params)
    }

    // Actualizar
    const updateRole = async (id, params, headers) => {
        updateRole_('PUT', 'role/' + id, params, headers)
    }

    // Toggle Estado
    const toggleRole = async (id) => {
        toggleRole_('PATCH', 'role/' + id + '/toggle')
    }

    // Está atento a cambios para setear el número de páginas
    watch(dataIndexRoles, (received) => {
        if (received?.data?.length > 0) {
            numberOfPages.value = received?.meta?.last_page
        } else {
            numberOfPages.value = 0;
        }
    })

    return {
        dataIndexRoles, numberOfPages, indexRoles, loadingIndexRoles, errorIndexRoles,
        dataAllRoles, allRoles, loadingAllRoles, errorAllRoles,
        dataShowRole, showRole, loadingShowRole, errorShowRole,
        dataStoreRole, storeRole, loadingStoreRole, errorStoreRole,
        dataUpdateRole, updateRole, loadingUpdateRole, errorUpdateRole,
        dataToggleRole, toggleRole, loadingToggleRole, errorToggleRole,
    }
}