<script setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

// Importar stores
import { useAccessStore } from "@/stores/access";
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import useUser from "@/composables/services/user";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
import Alert from '@/components/Common/Alert.vue';
import Paginator from '@/components/Common/Paginator.vue';
import BaseTable from '@/components/Common/BaseTable.vue';
import View from '../pages/View.vue'
import AssignPermission from '../pages/AssignPermission.vue'
// Importar utilidades
import { showAlert, showConfirmAlert } from "@/utils/swalUtils";
import { showToast } from '@/utils/toastUtils';

// Router inicializado
const router = useRouter();

// Store de accesos
const useAccess = useAccessStore();
const { permissions } = storeToRefs(useAccess);
// Store de modales
const useModal = useModalStore();
const { changeModal } = useModal;
const { userId } = storeToRefs(useModal);

// Inicializar composables
const {
    dataIndexUsers, numberOfPages, indexUsers, loadingIndexUser,
    dataToggleUser, toggleUser, loadingToggleUser, errorToggleUser
} = useUser();

onMounted(async () => {
    indexUsers({ page: page.value, search: search.value });
})

const page = ref(1);
const search = ref(null)
const headers = [
    { title: 'Code', key: 'code' },
    { title: 'Nombre', key: 'full_name' },
    { title: 'E-mail', key: 'email' },
    { title: 'Status', key: 'status' },
    { title: 'Fecha de Registro', key: 'created_at' },
    { title: 'Acciones', key: 'actions' },
];

let debounceTimer = null;
// Observamos los cambios
watch([page, search], ([newPage, newSearch], [oldPage, oldSearch]) => {
    // Si lo que cambió fue la PÁGINA, disparamos de inmediato
    if (newPage !== oldPage) {
        indexUsers({ page: newPage, search: newSearch });
        return;
    }

    // Si lo que cambió fue el BUSCADOR, usamos Debounce
    if (newSearch !== oldSearch) {
        // Limpiamos el temporizador anterior
        clearTimeout(debounceTimer);

        // Creamos un nuevo temporizador
        debounceTimer = setTimeout(() => {
            page.value = 1; // Al buscar, siempre volvemos a la pág 1
            indexUsers({ page: page.value, search: newSearch });
        }, 500); // Espera 500ms después de que el usuario deja de escribir
    }
});

const searchResults = () => {
    page.value = 1;
    indexUsers({ page: page.value, search: search.value });
}

const create = () => router.push({ name: 'usuario.crear' });

const edit = (id) => router.push({ name: "usuario.editar", params: { id } });

const changeStatus = async (item) => {
    if (!dataIndexUsers.value?.data.length) {
        return showAlert({ title: "No hay registros seleccionados", text: "Selecciona al menos un registros.", icon: "warning" });
    }

    const confirmed = await showConfirmAlert(
        `¿Estás seguro de realizar esta acción?`,
    );

    if (!confirmed) {
        return showAlert({ title: "Acción cancelada", text: "No se cambió el registro.", icon: "info" });
    }

    dataToggleUser.value = null
    errorToggleUser.value = null

    toggleUser(item.id);
};

const showModal = (modalName, id = null) => {
    userId.value = id
    changeModal(modalName, true)
}

const closeModal = () => {
    searchResults()
}

watch(dataToggleUser, (received) => {
    if (received) {
        searchResults()
        showToast(received?.message, 'success', 5000)
    }
})

watch(errorToggleUser, (received) => {
    if (received) {
        searchResults()
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})
</script>

<template>
    <v-container class="ma-4" fluid>
        <!-- Loading -->
        <Loading :active="loadingIndexUser" />
        <Loading :active="loadingToggleUser" />

        <v-row>
            <!-- Buscador -->
            <v-col cols="12" md="4">
                <v-text-field :loading="loadingIndexUser" append-inner-icon="mdi-magnify" density="compact"
                    label="Buscar..." placeholder="Buscar Usuarios..." variant="solo-filled" v-model="search"
                    single-line hide-details @click:append-inner="searchResults"
                    @keyup.enter="searchResults"></v-text-field>
            </v-col>
            <!-- Botón Crear -->
            <v-col cols="12" md="4">
                <v-tooltip location="left" v-if="permissions.includes('usuario.crear')" text="Crear">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="primary" density="comfortable"
                            icon="mdi mdi-plus-box-multiple-outline" @click="create">
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-col>
        </v-row>

        <div v-if="dataIndexUsers?.data.length">
            <!-- table -->
            <BaseTable :headers="headers" :items="dataIndexUsers?.data || []">
                <template #status="{ item }">
                    <v-chip :color="item.status == 1 ? 'success' : 'error'" label size="small">
                        <v-icon :icon="item.status == 1 ? 'mdi-check' : 'mdi-close'" start></v-icon>
                        {{ item.status_name }}
                    </v-chip>
                </template>
                <template #actions="{ item }">
                    <div class="d-flex justify-space-around">
                        <v-tooltip location="top" v-if="permissions.includes('usuario.ver')" text="Ver">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="info" density="comfortable" icon="mdi-information"
                                    size="small" @click.prevent="showModal('user.view', item.id)">
                                </v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip location="top" v-if="permissions.includes('usuario.editar')" text="Editar">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="warning" density="comfortable" icon="mdi-open-in-new"
                                    size="small" @click="edit(item.id)"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip v-if="permissions.includes('usuario.eliminar')" location="top"
                            :text="item.status == 1 ? 'Desactivar' : 'Activar'">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :color="item.status == 1 ? 'error' : 'success'"
                                    density="comfortable"
                                    :icon="item.status == 1 ? 'mdi-delete-empty' : 'mdi-check-bold'" size="small"
                                    @click.prevent="changeStatus(item)">
                                </v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip location="top" v-if="permissions.includes('usuario.permiso')"
                            text="Asignar Permisos">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="primary" density="comfortable"
                                    icon="mdi mdi-clipboard-text" size="small"
                                    @click.prevent="showModal('user.assign', item.id)">
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
            </BaseTable>

            <!-- Paginador -->
            <Paginator v-model="page" :length="numberOfPages" :loading="loadingIndexUser" />
        </div>
        <div v-else>
            <!-- Alerta -->
            <Alert type="info" title="Sin resultados" text="No se encontraron registros de Usuarios."></Alert>
        </div>

        <View />
        <AssignPermission @close-modal="closeModal" />
    </v-container>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>