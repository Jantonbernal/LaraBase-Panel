import { useHttpRequest } from "@/composables/useHttpRequest";

export default function useFile() {

    const { dataEndPoint: dataStoreFile, sendRequest: storeFile_, loading: loadingStoreFile, errorEndPoint: errorStoreFile } = useHttpRequest();
    const { dataEndPoint: dataStoreFiles, sendRequest: storeFiles_, loading: loadingStoreFiles, errorEndPoint: errorStoreFiles } = useHttpRequest();

    // Registrar un archivo
    const storeFile = async (params, headers) => {
        storeFile_('POST', 'file', params, headers)
    }

    // Registrar varios archivos
    const storeFiles = async (params, headers) => {
        storeFiles_('POST', 'files', params, headers)
    }

    return {
        dataStoreFile, storeFile, loadingStoreFile, errorStoreFile,
        dataStoreFiles, storeFiles, loadingStoreFiles, errorStoreFiles,
    }
}