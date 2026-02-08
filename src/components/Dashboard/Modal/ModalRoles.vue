<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
import { useAccessStore } from "@/stores/access.js";
import { useMenuStore } from "@/stores/menu.js";
// Importar composables
import useAuth from "@/composables/services/auth";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
// Importar utilidades
import { showToast } from '@/utils/toastUtils';

// Router inicializado
const router = useRouter();

// Store de modales
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalRolesVisible } = storeToRefs(useModal);

// Store de accesos
const useAccess = useAccessStore();
const { permissions, roles, role, roleSelected } = storeToRefs(useAccess);

// Store de menus
const useMenu = useMenuStore();
const { menus } = storeToRefs(useMenu);

// Inicializar call api
const { dataAllAccess, allAccess, loadingAllAccess, errorAllAccess } = useAuth();

const roleValue = ref(roleSelected || null)

// Está atento a cambios para setear los datos del rol seleccionado
watch(roleValue, (received) => {
    allAccess({
        'roleSelected': received,
    })

    roleSelected.value = received

    // Cerrar modal de selección de rol
    changeModal('rol.select', false)
})

watch(dataAllAccess, (received) => {
    if (received) {
        permissions.value = received.allPermissions;
        roles.value = received.allRoles;
        role.value = received.role;
        roleSelected.value = received.role.id;
        menus.value = received.allMenus;

        showToast("Se estableció perfil de usuario " + ' ' + role.value.name, 'success', 5000)

        router.replace({
            name: 'Home'
        })
    }
})

watch(errorAllAccess, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
});
</script>

<template>
    <Loading :active="loadingAllAccess" />

    <v-dialog v-model="isModalRolesVisible" width="auto">
        <v-card max-width="500" prepend-icon="mdi mdi-lock-check" title="Seleccione un Rol.">
            <v-card-text class="px-4" style="max-height: 300px;">
                <v-radio-group v-model="roleValue" v-for="(item, index) in roles" :key="index" column>
                    <v-radio :value="item.id">
                        <template v-slot:label>
                            <div class="d-flex flex-column">
                                <div><strong class="text-primary"> {{ item.name }} &nbsp;</strong></div>
                            </div>
                        </template>
                    </v-radio>
                </v-radio-group>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="CERRAR" @click="changeModal('role.select', !isModalRolesVisible)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>