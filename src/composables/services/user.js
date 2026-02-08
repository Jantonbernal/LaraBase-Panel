import { useHttpRequest } from "@/composables/useHttpRequest";
import { ref, watch } from "vue";

export default function useUser() {

    const { dataEndPoint: dataIndexUsers, sendRequest: indexUsers_, loading: loadingIndexUser, errorEndPoint: errorIndexUser } = useHttpRequest();
    const { dataEndPoint: dataShowUser, sendRequest: showUser_, loading: loadingShowUser, errorEndPoint: errorShowUser } = useHttpRequest();
    const { dataEndPoint: dataStoreUser, sendRequest: storeUser_, loading: loadingStoreUser, errorEndPoint: errorStoreUser } = useHttpRequest();
    const { dataEndPoint: dataUpdateUser, sendRequest: updateUser_, loading: loadingUpdateUser, errorEndPoint: errorUpdateUser } = useHttpRequest();
    const { dataEndPoint: dataToggleUser, sendRequest: toggleUser_, loading: loadingToggleUser, errorEndPoint: errorToggleUser } = useHttpRequest();
    const { dataEndPoint: dataVerifyCode, sendRequest: verifyCode_, loading: loadingVerifyCode, errorEndPoint: errorVerifyCode } = useHttpRequest();
    const { dataEndPoint: dataAssignPermissions, sendRequest: assignPermissions_, loading: loadingAssignPermissions, errorEndPoint: errorAssignPermissions } = useHttpRequest();

    const numberOfPages = ref(0)

    // Listar Users
    const indexUsers = async (params) => {
        indexUsers_('GET', 'user', params)
    }

    // Mostrar
    const showUser = async (id) => {
        showUser_('GET', 'user/' + id)
    }

    // Registrar
    const storeUser = async (params) => {
        storeUser_('POST', 'user', params)
    }

    // Actualizar
    const updateUser = async (id, params, headers) => {
        updateUser_('POST', 'user/' + id, params, headers)
    }

    // Toggle Estado
    const toggleUser = async (id) => {
        toggleUser_('PATCH', 'user/' + id + '/toggle')
    }

    // Corroborar código de seguridad
    const verifyCode = async (params) => {
        verifyCode_('POST', 'user/verify-code', params)
    }

    const assignPermissions = async (id, params) => {
        assignPermissions_('PUT', 'user/assignPermissions/' + id, params)
    }

    // Está atento a cambios para setear el número de páginas
    watch(dataIndexUsers, (received) => {
        if (received?.data?.length > 0) {
            numberOfPages.value = received?.meta?.last_page
        } else {
            numberOfPages.value = 0;
        }
    })

    return {
        dataIndexUsers, numberOfPages, indexUsers, loadingIndexUser, errorIndexUser,
        dataShowUser, showUser, loadingShowUser, errorShowUser,
        dataStoreUser, storeUser, loadingStoreUser, errorStoreUser,
        dataUpdateUser, updateUser, loadingUpdateUser, errorUpdateUser,
        dataToggleUser, toggleUser, loadingToggleUser, errorToggleUser,
        dataVerifyCode, verifyCode, loadingVerifyCode, errorVerifyCode,
        dataAssignPermissions, assignPermissions, loadingAssignPermissions, errorAssignPermissions
    }
}