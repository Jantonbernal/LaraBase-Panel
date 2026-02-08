<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import useUser from "@/composables/services/user";
import usePermission from "@/composables/services/permission";
// Importar componentes
import CardAssignment from '../partials/CardAssignment.vue';
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

const { dataShowUser, showUser, loadingShowUser } = useUser();
const { dataAllPermissions, allPermissions, loadingAllPermissions } = usePermission();

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalUserAssignPermissionsVisible, userId } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('user.assign', false)
    emit('closeModal')
}

// Está atento al cerrar/Abrir modal para cargar data
watch(isModalUserAssignPermissionsVisible, (received) => {
    if (received) {
        showUser(userId.value)
        allPermissions()
    }
})

</script>

<template>
    <Loading :active="loadingShowUser"/>
    <Loading :active="loadingAllPermissions"/>

    <v-dialog v-model="isModalUserAssignPermissionsVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <CardAssignment title="Asignar Permisos" :id="userId" :data="dataShowUser?.data" :permissions="dataAllPermissions?.data" @closeModal="closeModal"/>
        </template>
    </v-dialog>
</template>