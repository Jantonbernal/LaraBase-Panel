<script setup>
import { storeToRefs } from "pinia";

import { useMenuStore } from "@/stores/menu.js";
import { useHeightStore } from "@/stores/height.js";

import Profile from "@/components/Dashboard/Profile.vue";

// Store de menús
const useMenu = useMenuStore();
const { changeDrawer } = useMenu;
const { drawer } = storeToRefs(useMenu);

// Store de altura
const useHeight = useHeightStore();
const { height } = storeToRefs(useHeight);

</script>

<template>
    <!-- Barra de Superior -->
    <v-app-bar :elevation="5" rounded="lg" class="mx-xs-6 mx-lg-12 my-5"
        :class="(drawer) ? 'topbar' : 'topbar-sidebar-off'" app>
        <!-- Icono del menú para pantallas pequeñas -->
        <template v-slot:prepend>
            <v-app-bar-nav-icon @click="changeDrawer(!drawer)"></v-app-bar-nav-icon>
        </template>

        <!-- Sección derecha -->
        <div class="d-flex flex-row justify-center align-center mr-5" v-if="height >= 500"
            :class="height >= 500 ? '' : 'mt-4'">
            <Profile />
        </div>
    </v-app-bar>
</template>