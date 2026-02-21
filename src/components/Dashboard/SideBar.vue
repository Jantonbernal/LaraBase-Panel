<script setup>
import { onMounted, ref, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from 'vue-router';
import { useFavicon } from '@vueuse/core';

// Stores & Composables
import { useCompanyStore } from "@/stores/company.js";
import { useMenuStore } from "@/stores/menu.js";
import useCompanyService from "@/composables/services/company";
import { showAlert } from "@/utils/swalUtils";

const router = useRouter();
const route = useRoute();
const icon = useFavicon();

const { company } = storeToRefs(useCompanyStore());
const { drawer, menus } = storeToRefs(useMenuStore());
const { dataShowCompany, showCompany } = useCompanyService();

// Estado Reactivo
const openedGroups = ref([]);
const selectedMenu = computed(() => route.name);

// --- LÓGICA DE EMPRESA ---
onMounted(() => showCompany(1));

watch(dataShowCompany, (received) => {
    if (!received?.data) return;
    company.value = received.data;
    if (company.value.logo?.url) icon.value = company.value.logo.url;
});

// --- LÓGICA DE MENÚS Y GRUPOS ---
const updateNavigationState = () => {
    if (!menus.value.length) return;

    const parent = menus.value.find(item =>
        item.all_children_menus?.some(child => child.permission.slug === route.name)
    );
    
    if (parent) openedGroups.value = [parent.menu];
};

// Observar cambios en ruta o menús para expandir el grupo correcto
watch([() => route.name, menus], updateNavigationState, { immediate: true });

const navigateTo = (path) => {
    if (!router.hasRoute(path)) {
        return showAlert({ title: "Opps!", text: "Ruta no encontrada.", icon: "error" });
    }
    router.push({ name: path });
};
</script>

<template>
    <v-navigation-drawer v-model="drawer" rounded="lg" :elevation="15" width="290" class="sidebar mx-5 my-5 pa-5">
        
        <div class="d-flex align-center mb-5 cursor-pointer">
            <v-avatar size="35" class="me-3">
                <v-img v-if="company?.logo?.url" :src="company.logo.url" alt="logo" cover/>
                <v-icon v-else icon="mdi-account-tie"></v-icon>
            </v-avatar>
            <span class="company-title font-weight-bold"> {{ company?.business_name }} </span>
        </div>

        <v-list v-model:opened="openedGroups" density="compact" nav>
            <v-list-group 
                v-for="item in menus" 
                :key="item.menu" 
                :value="item.menu"
                v-show="item.all_children_menus?.length > 0"
            >
                <template v-slot:activator="{ props }">
                    <v-list-item 
                        v-bind="props" 
                        :prepend-icon="item.icon" 
                        :title="item.menu"
                    />
                </template>

                <v-list-item 
                    v-for="child in item.all_children_menus" 
                    :key="child.permission.slug"
                    :prepend-icon="child.icon"
                    :title="child.menu"
                    :active="child.permission.slug === selectedMenu"
                    @click="navigateTo(child.permission.slug)"
                    class="my-1"
                    rounded="lg"
                />
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<style scoped>
/* Vuetify ya maneja la clase .v-list-item--active, pero si quieres algo muy específico: */
:deep(.v-list-item--active) {
    color: rgb(var(--v-theme-primary)) !important;
    font-weight: bold;
}
</style>