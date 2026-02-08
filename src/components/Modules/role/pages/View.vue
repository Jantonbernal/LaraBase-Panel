<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import useRole from "@/composables/services/role";
// Importar componentes
import Card from '../partials/Card.vue';
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

const { dataShowRole, showRole, loadingShowRole } = useRole();

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalRoleViewVisible, roleId } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('role.view', false)
    emit('closeModal')
}

// Está atento al cerrar/Abrir modal para cargar data
watch(isModalRoleViewVisible, (received) => {
    if (received) {
        showRole(roleId.value)
    }
})

</script>

<template>
    <Loading :active="loadingShowRole"/>

    <v-dialog v-model="isModalRoleViewVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <Card title="Ver Rol" :id="roleId" :data="dataShowRole?.data" @closeModal="closeModal"/>
        </template>
    </v-dialog>
</template>