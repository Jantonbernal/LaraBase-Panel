<script setup>
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar componentes
import Form from '../partials/Form.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalPermissionStoreVisible } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('permission.store', false)
    emit('closeModal')
}

</script>

<template>
    <v-dialog v-model="isModalPermissionStoreVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <Form mode="create" title="Crear Permiso" :id="null" :data="null" @closeModal="closeModal" />
        </template>
    </v-dialog>
</template>