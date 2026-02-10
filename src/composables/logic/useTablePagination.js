import { ref, watch } from 'vue'

export function useTablePagination(indexFunction) {
    const page = ref(1)
    const search = ref(null)
    let debounceTimer = null

    // 1. La lógica core de petición
    const fetchData = () => {
        indexFunction({
            page: page.value,
            search: search.value
        })
    }

    // 2. Método para botones (Lupa) o Tecla Enter (searchResults)
    const resetAndFetch = () => {
        // Limpiamos cualquier debounce pendiente para evitar peticiones duplicadas
        clearTimeout(debounceTimer)
        page.value = 1
        fetchData()
    }

    // 3. Watcher para cambios automáticos
    watch([page, search], ([newPage, newSearch], [oldPage, oldSearch]) => {
        // Cambio de página: inmediato
        if (newPage !== oldPage) {
            fetchData()
            return
        }

        // Cambio de búsqueda: con debounce
        if (newSearch !== oldSearch) {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => {
                resetAndFetch()
            }, 500)
        }
    })

    return {
        page,
        search,
        fetchData,
        resetAndFetch
    }
}