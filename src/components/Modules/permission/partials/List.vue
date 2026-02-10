<script setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";

// Importar stores
import { useAccessStore } from "@/stores/access";
import { useModalStore } from "@/stores/modal.js";
// Importar composables
import usePermission from "@/composables/services/permission";
import { useTablePagination } from "@/composables/logic/useTablePagination";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
import Alert from '@/components/Common/Alert.vue';
import Paginator from '@/components/Common/Paginator.vue';
import BaseTable from '@/components/Common/BaseTable.vue';
import Create from '../pages/Create.vue'
import Edit from '../pages/Edit.vue'

// Importar utilidades
import { showAlert, showConfirmAlert } from "@/utils/swalUtils";
import { showToast } from '@/utils/toastUtils';

// Store de accesos
const useAccess = useAccessStore();
const { permissions } = storeToRefs(useAccess);
// Store de modales
const useModal = useModalStore();
const { changeModal } = useModal;
const { permissionId } = storeToRefs(useModal);

// Inicializar composables
const {
    dataIndexPermissions, numberOfPages, indexPermissions, loadingIndexPermissions,
    dataTogglePermission, togglePermission, loadingTogglePermission, errorTogglePermission
} = usePermission();
const { page, search, resetAndFetch } = useTablePagination(indexPermissions)

onMounted(async () => {
        resetAndFetch();
})

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Nombre', key: 'name' },
    { title: 'Slug', key: 'slug' },
    { title: 'Status', key: 'status' },
    { title: 'Fecha de Registro', key: 'created_at' },
    { title: 'Acciones', key: 'actions' },
];

const changeStatus = async (item) => {
    if (!dataIndexPermissions.value?.data.length) {
        return showAlert({ title: "No hay registros seleccionados", text: "Selecciona al menos un registros.", icon: "warning" });
    }

    const confirmed = await showConfirmAlert(
        `¿Estás seguro de realizar esta acción?`,
    );

    if (!confirmed) {
        return showAlert({ title: "Acción cancelada", text: "No se cambió el registro.", icon: "info" });
    }

    dataTogglePermission.value = null
    errorTogglePermission.value = null

    togglePermission(item.id);
};

const showModal = (modalName, id = null) => {
    permissionId.value = id
    changeModal(modalName, true)
}

const closeModal = () => {
    resetAndFetch()
}

watch(dataTogglePermission, (received) => {
    if (received) {
        resetAndFetch()
        showToast(received?.message, 'success', 5000)
    }
})

watch(errorTogglePermission, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})
</script>

<template>
    <v-container class="ma-4" fluid>
        <!-- Loading -->
        <Loading :active="loadingIndexPermissions" />
        <Loading :active="loadingTogglePermission" />

        <v-row>
            <!-- Buscador -->
            <v-col cols="12" md="4">
                <v-text-field :loading="loadingIndexPermissions" append-inner-icon="mdi-magnify" density="compact"
                    label="Buscar..." placeholder="Buscar Permisos..." variant="solo-filled" v-model="search" single-line
                    hide-details @click:append-inner="resetAndFetch" @keyup.enter="resetAndFetch"></v-text-field>
            </v-col>
            <!-- Botón Crear -->
            <v-col cols="12" md="4">
                <v-tooltip location="left" v-if="permissions.includes('permiso.crear')" text="Crear">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="primary" density="comfortable"
                            icon="mdi mdi-plus-box-multiple-outline" @click.prevent="showModal('permission.store')">
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-col>
        </v-row>

        <div v-if="dataIndexPermissions?.data.length">
            <!-- table -->
            <BaseTable :headers="headers" :items="dataIndexPermissions?.data || []">
                <template #status="{ item }">
                    <v-chip :color="item.status == 1 ? 'success' : 'error'" label size="small">
                        <v-icon :icon="item.status == 1 ? 'mdi-check' : 'mdi-close'" start></v-icon>
                        {{ item.status_name }}
                    </v-chip>
                </template>
                <template #actions="{ item }">
                    <div class="d-flex justify-space-around">
                        <v-tooltip location="top" v-if="permissions.includes('permiso.editar')" text="Editar">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" color="warning" density="comfortable" icon="mdi-open-in-new"
                                    size="small" @click.prevent="showModal('permission.update', item.id)"></v-btn>
                            </template>
                        </v-tooltip>

                        <v-tooltip v-if="permissions.includes('permiso.eliminar')" location="top"
                            :text="item.status == 1 ? 'Desactivar' : 'Activar'">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :color="item.status == 1 ? 'error' : 'success'"
                                    density="comfortable"
                                    :icon="item.status == 1 ? 'mdi-delete-empty' : 'mdi-check-bold'" size="small"
                                    @click.prevent="changeStatus(item)">
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </div>
                </template>
            </BaseTable>

            <!-- Paginador -->
            <Paginator v-model="page" :length="numberOfPages" :loading="loadingIndexPermissions" />
        </div>
        <div v-else>
            <!-- Alerta -->
            <Alert type="info" title="Sin resultados" text="No se encontraron registros de Permisos."></Alert>
        </div>

        <Create @closeModal="closeModal" />
        <Edit @closeModal="closeModal" />
    </v-container>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>