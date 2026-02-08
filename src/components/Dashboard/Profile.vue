<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

// Importar stores
import { useAccessStore } from "@/stores/access.js";
import { useModalStore } from "@/stores/modal.js";
import { useCompanyStore } from "@/stores/company.js";
import { useMenuStore } from "@/stores/menu.js";
// Importar composables
import useAuth from "@/composables/services/auth";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
// Importar componentes de modales
import ModalRoles from './Modal/ModalRoles.vue';
// Importar utilidades
import { showToast } from '@/utils/toastUtils';

const router = useRouter();

// Store de accesos
const useAccess = useAccessStore();
const { access, role } = storeToRefs(useAccess);
// Store de company
const useCompany = useCompanyStore();
const { company } = storeToRefs(useCompany);
// Store de menus
const useMenu = useMenuStore();
const { menus } = storeToRefs(useMenu);
// Store de modales
const useModal = useModalStore();
const { changeModal } = useModal;

// Inicializar composables
const { dataLogout, logout, loadingLogout, errorLogout } = useAuth();

// Cerrar sesión del usuario actual
const signOut = () => {
    logout();
}

watch(dataLogout, (newValue) => {
    if (newValue) {
        access.value = null;
        company.value = null;
        menus.value = [];
    }
});

watch(errorLogout, (newValue) => {
    if (newValue) {
        showToast('Error al cerrar sesión. Inténtalo de nuevo.', 'error');
    }
});

const items = ref([
    { text: 'Mi Perfil', 'icon': 'mdi mdi-account-tie', modalShow: false, modalName: 'usuario.perfil' },
    { text: 'Roles', 'icon': 'mdi mdi-lock-check', modalShow: true, modalName: 'role.select' },
])

const verifyModalToChange = (item) => {
    if (item.modalShow) {
        switch (item.modalName) {
            case 'role.select':
                changeModal(item.modalName, true)
                break;
            default:
                break;
        }
    } else {
        router.replace({
            name: item.modalName
        })
    }
}
</script>

<template>
    <Loading :active="loadingLogout" />

    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" icon>
                <v-avatar size="35">
                    <img v-if="access?.access?.photo" :src="access?.access?.photo.url" height="35" alt="user" />
                    <v-icon v-else icon="mdi mdi-account-tie"></v-icon>
                </v-avatar>
            </v-btn>
        </template>

        <v-sheet :elevation="3" :max-height="300" :max-width="250" :rounded="'xl'" class="cursor-pointer mt-2">
            <v-list>
                <v-list-item :subtitle="role?.name" :title="access?.name">
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <v-list class="py-0" lines="one" density="compact">
                <v-list-item v-for="(item, i) in items" :key="i" :value="i" color="primary">
                    <v-list-item-title class="pl-1 text-body-1" v-text="item.text"
                        @click="verifyModalToChange(item)"></v-list-item-title>
                    <template v-slot:prepend>
                        <v-icon size="small" :icon="item.icon"></v-icon>
                    </template>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>

            <div class="pt-4 pb-4 px-5 text-center">
                <v-btn @click="signOut" color="primary" block>
                    Cerrar Sesión
                    <template v-slot:loader>
                        <v-progress-linear indeterminate></v-progress-linear>
                    </template>
                </v-btn>
            </div>
        </v-sheet>
    </v-menu>

    <ModalRoles />
</template>