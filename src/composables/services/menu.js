import { useHttpRequest } from "@/composables/useHttpRequest";
import { ref, watch } from "vue";

export default function useMenu() {

    const { dataEndPoint: dataIndexMenus, sendRequest: indexMenus_, loading: loadingIndexMenus, errorEndPoint: errorIndexMenus } = useHttpRequest();
    const { dataEndPoint: dataAllMenus, sendRequest: allMenus_, loading: loadingAllMenus, errorEndPoint: errorAllMenus } = useHttpRequest();
    const { dataEndPoint: dataShowMenu, sendRequest: showMenu_, loading: loadingShowMenu, errorEndPoint: errorShowMenu } = useHttpRequest();
    const { dataEndPoint: dataStoreMenu, sendRequest: storeMenu_, loading: loadingStoreMenu, errorEndPoint: errorStoreMenu } = useHttpRequest();
    const { dataEndPoint: dataUpdateMenu, sendRequest: updateMenu_, loading: loadingUpdateMenu, errorEndPoint: errorUpdateMenu } = useHttpRequest();
    const { dataEndPoint: dataToggleMenu, sendRequest: toggleMenu_, loading: loadingToggleMenu, errorEndPoint: errorToggleMenu } = useHttpRequest();

    const numberOfPages = ref(0)

    // Listar Menus
    const indexMenus = async (params) => {
        indexMenus_('GET', 'menu', params)
    }

    // All Menus
    const allMenus = async (params) => {
        allMenus_('GET', 'menu/allMenus', params)
    }

    // Mostrar registro
    const showMenu = async (id) => {
        showMenu_('GET', 'menu/' + id)
    }

    // Registrar
    const storeMenu = async (params) => {
        storeMenu_('POST', 'menu', params)
    }

    // Actualizar
    const updateMenu = async (id, params, headers) => {
        updateMenu_('PUT', 'menu/' + id, params, headers)
    }

    // Toggle Estado
    const toggleMenu = async (id) => {
        toggleMenu_('PATCH', 'menu/' + id + '/toggle')
    }

    // Está atento a cambios para setear el número de páginas
    watch(dataIndexMenus, (received) => {
        if (received?.data?.length > 0) {
            numberOfPages.value = received?.meta?.last_page
        } else {
            numberOfPages.value = 0;
        }
    })

    return {
        dataIndexMenus, numberOfPages, indexMenus, loadingIndexMenus, errorIndexMenus,
        dataAllMenus, allMenus, loadingAllMenus, errorAllMenus,
        dataShowMenu, showMenu, loadingShowMenu, errorShowMenu,
        dataStoreMenu, storeMenu, loadingStoreMenu, errorStoreMenu,
        dataUpdateMenu, updateMenu, loadingUpdateMenu, errorUpdateMenu,
        dataToggleMenu, toggleMenu, loadingToggleMenu, errorToggleMenu,
    }
}