import { defineStore } from "pinia";
import { computed, ref, watch, nextTick } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export const useMenuStore = defineStore('menu', () => {
    const drawer = ref(false);
    const menus = ref([]);

    // Uso de useDisplay para obtener información sobre el tamaño de la pantalla
    const { smAndDown } = useDisplay();

    // Esta propiedad computada devuelve true si el tamaño de la pantalla es pequeño (smAndDown)
    const isSmallScreen = computed(() => smAndDown.value);

    // Un observador que ajusta el estado del drawer (drawer.value) según el tamaño de la pantalla. Si la pantalla es pequeña, el drawer se muestra, de lo contrario, se oculta
    // async/await en el watch: Se usa async/await para esperar a que nextTick complete antes de establecer drawer.value.
    watch(isSmallScreen, async (val) => {
        // nextTick en el watch: Se utiliza nextTick para asegurarse de que el DOM y el estado de Vuetify estén completamente actualizados antes de cambiar el valor de drawer. Esto evita problemas donde los valores de smAndDown podrían no estar actualizados inmediatamente.
        await nextTick();
        drawer.value = val;
    });

    const changeDrawer = (value) => {
        drawer.value = value;
    }

    return {
        drawer, // Estado del drawer (abierto o cerrado)
        isSmallScreen, // Verifica si la pantalla es pequeña
        smAndDown, // Información de Vuetify sobre el tamaño de la pantalla
        changeDrawer, // Método para cambiar el estado del drawer
        menus, // Menús del sistema
    }
}, {
    persist: true
})