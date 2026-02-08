<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
// Importar stores
import { useCompanyStore } from "@/stores/company.js";
import { useMenuStore } from "@/stores/menu.js";
// Importar composables
import useCompanyService from "@/composables/services/company";
// Favicon management
import { useFavicon } from '@vueuse/core'

// Store de company
const useCompany = useCompanyStore();
const { company } = storeToRefs(useCompany);
// Store de menus
const useMenu = useMenuStore();
const { drawer, menus } = storeToRefs(useMenu);

// Inicializar composables
const { dataShowCompany, showCompany } = useCompanyService();

showCompany(1);

// Está atento a cambios para setear los datos de la empresa
watch(dataShowCompany, (received) => {
    if (received) {
        company.value = received?.data

        // Set favicon
        if (company.value?.logo?.url) {
            const icon = useFavicon()
            icon.value = company.value?.logo?.url
        }
    }
})

</script>

<template>
    <v-navigation-drawer v-model="drawer" rounded="lg" :elevation="15" width="290"
        class="sidebar mx-5 my-5 mb-n10 pa-5">

        <div class="d-flex flex-row flex-wrap justify-start align-center mb-5 cursor-pointer">
            <v-btn variant="text" icon>
                <v-avatar size="35">
                    <img v-if="company?.file_id" :src="company?.logo.url" height="35" alt="company" />
                    <v-icon v-else icon="mdi mdi-account-tie" height="35" alt="company"></v-icon>
                </v-avatar>
            </v-btn>
            <span class="company-title"> {{ company?.business_name }} </span>
        </div>

        <v-list v-for="item in menus" :key="item.menu" v-show="menus.length > 0" class="cursor-pointer pt-0">
            <v-list-group expand-icon>
                <template v-slot:activator="{ props }">
                    <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.menu"
                        v-show="item.all_children_menus.length > 0" density="compact" rounded="lg"></v-list-item>
                </template>

                <!-- :to="{ name: child.permission.slug }" -->
                <v-list-item v-for="(child, i) in item.all_children_menus" :key="i" density="compact" class="my-1"
                    rounded="lg" :to="{ name: child.permission.slug }">
                    <template v-slot:prepend>
                        <v-icon :icon="child.icon"></v-icon>
                    </template>

                    <v-list-item-title v-text="child.menu"></v-list-item-title>
                </v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>