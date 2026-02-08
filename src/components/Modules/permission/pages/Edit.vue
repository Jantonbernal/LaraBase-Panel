<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import usePermission from "@/composables/services/permission";
// Importar componentes
import Form from '../partials/Form.vue';
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

// Composable 
const { dataShowPermission, showPermission, loadingShowPermission } = usePermission();

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalPermissionUpdateVisible, permissionId } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('permission.update', false)
    emit('closeModal')
}

// Está atento al cerrar/Abrir modal para cargar data
watch(isModalPermissionUpdateVisible, (received) => {
    if (received) {
        showPermission(permissionId.value)
    }
})
</script>

<template>
    <Loading :active="loadingShowPermission" />

    <v-dialog v-model="isModalPermissionUpdateVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <Form mode="edit" title="Editar Permiso" :id="permissionId" :data="dataShowPermission?.data"
                @closeModal="closeModal" />
        </template>
    </v-dialog>
</template>