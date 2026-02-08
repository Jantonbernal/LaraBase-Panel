import { useHttpRequest } from "@/composables/useHttpRequest";

export default function useCompany() {

    const { dataEndPoint: dataShowCompany, sendRequest: showCompany_, loading: loadingShowCompany, errorEndPoint: errorShowCompany } = useHttpRequest();
    const { dataEndPoint: dataUpdateCompany, sendRequest: updateCompany_, loading: loadingUpdateCompany, errorEndPoint: errorUpdateCompany } = useHttpRequest();

    // Obtener los company del sistema
    const showCompany = async (id, params) => {
        showCompany_('GET', 'company/' + id, params)
    }

    const updateCompany = async (id, params, headers) => {
        updateCompany_('PUT', 'company/' + id, params, headers)
    }

    return {
        // obtener compañia
        dataShowCompany, showCompany, loadingShowCompany, errorShowCompany,
        // actualizar compañia
        dataUpdateCompany, updateCompany, loadingUpdateCompany, errorUpdateCompany
    }
}