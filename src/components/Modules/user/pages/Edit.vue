<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

// Importar composables
import useUser from "@/composables/services/user";
// Importar componentes
import Form from '../partials/Form.vue';
import Loading from '@/components/Common/Loading.vue';

// Route inicializado
const route = useRoute();

const { dataShowUser, showUser, loadingShowUser } = useUser();

onMounted(() => {
    id.value = Number.parseInt(route?.params?.id)
    showUser(id.value)
})

const id = ref(null);
</script>

<template>
    <v-container fluid>
        <Loading :active="loadingShowUser" />
        <Form mode="edit" title="Editar Usuario" :id="id" :data="dataShowUser?.data" />
    </v-container>
</template>