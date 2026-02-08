<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import useRole from "@/composables/services/role";
// Importar componentes
import Form from '../partials/Form.vue';
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

const { dataShowRole, showRole, loadingShowRole } = useRole();

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalRoleUpdateVisible, roleId } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('role.update', false)
    emit('closeModal')
}

// Está atento al cerrar/Abrir modal para cargar data
watch(isModalRoleUpdateVisible, (received) => {
    if (received) {
        showRole(roleId.value)
    }
})

</script>

<template>
    <Loading :active="loadingShowRole" />

    <v-dialog v-model="isModalRoleUpdateVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <Form mode="edit" title="Editar Rol" :id="roleId" :data="dataShowRole?.data" @closeModal="closeModal" />
        </template>
    </v-dialog>
</template>