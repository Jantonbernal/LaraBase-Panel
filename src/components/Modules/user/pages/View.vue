<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import useUser from "@/composables/services/user";
// Importar componentes
import Card from '../partials/Card.vue';
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

const { dataShowUser, showUser, loadingShowUser } = useUser();

// Store Modal inicializado
const useModal = useModalStore();
const { changeModal } = useModal;
const { isModalUserViewVisible, userId } = storeToRefs(useModal);

// Cerrar modal
const closeModal = () => {
    changeModal('user.view', false)
    emit('closeModal')
}

// Está atento al cerrar/Abrir modal para cargar data
watch(isModalUserViewVisible, (received) => {
    if (received) {
        showUser(userId.value)
    }
})

</script>

<template>
    <Loading :active="loadingShowUser"/>

    <v-dialog v-model="isModalUserViewVisible" max-width="600" persistent scrollable>
        <template v-slot:default="{ isActive }">
            <Card title="Ver Usuario" :data="dataShowUser?.data" @closeModal="closeModal"/>
        </template>
    </v-dialog>
</template>