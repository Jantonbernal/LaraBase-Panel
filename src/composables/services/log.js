import { useHttpRequest } from "@/composables/useHttpRequest";
import { ref, watch } from "vue";

export default function useLog() {

    const { dataEndPoint: dataIndexLogs, sendRequest: indexLogs_, loading: loadingIndexLogs, errorEndPoint: errorIndexLogs } = useHttpRequest();

    const numberOfPages = ref(0)

    // Listar logs
    const indexLogs = async (params) => {
        indexLogs_('GET', 'log', params)
    }

    // Está atento a cambios para setear el número de páginas
    watch(dataIndexLogs, (received) => {
        if (received?.data?.length > 0) {
            numberOfPages.value = received?.meta?.last_page
        } else {
            numberOfPages.value = 0;
        }
    })

    return {
        dataIndexLogs, numberOfPages, indexLogs, loadingIndexLogs, errorIndexLogs,
    }
}