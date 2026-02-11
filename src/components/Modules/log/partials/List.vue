<script setup>
import { onMounted, ref, watch } from "vue";

// Importar composables
import useLog from "@/composables/services/log";
import { useTablePagination } from "@/composables/logic/useTablePagination";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
import Alert from '@/components/Common/Alert.vue';
import Paginator from '@/components/Common/Paginator.vue';

const { dataIndexLogs, numberOfPages, indexLogs, loadingIndexLogs } = useLog();
const { page, search, resetAndFetch } = useTablePagination(indexLogs)

onMounted(async () => {
    resetAndFetch();
})

// Colores según el método HTTP
const getMethodColor = (method) => {
    const colors = {
        'GET': 'blue',
        'POST': 'green',
        'PUT': 'orange',
        'DELETE': 'error',
        'PATCH': 'purple'
    };
    return colors[method] || 'grey';
}

// Formatear JSON bonito
const formatJSON = (payload) => {
    try {
        const obj = typeof payload === 'string' ? JSON.parse(payload) : payload;
        return JSON.stringify(obj, null, 2);
    } catch {
        return payload;
    }
};
</script>

<template>
    <v-container class="ma-4" fluid>
        <Loading :active="loadingIndexLogs" />

        <!-- Buscador -->
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field :loading="loadingIndexLogs" append-inner-icon="mdi-magnify" density="compact"
                    label="Buscar..." placeholder="Buscar logs..." variant="solo-filled" v-model="search" single-line
                    hide-details @click:append-inner="resetAndFetch" @keyup.enter="resetAndFetch"></v-text-field>
            </v-col>
        </v-row>

        <!-- Listado de logs -->
        <div v-if="dataIndexLogs?.data.length">
            <v-expansion-panels variant="accordion" class="my-4">
                <v-expansion-panel v-for="log in dataIndexLogs?.data" :key="log.id">
                    <v-expansion-panel-title>
                        <v-row no-gutters align="center" class="w-100">
                            <v-col cols="4" md="1">
                                <v-chip :color="'gray'" label class="font-weight-bold mb-2">
                                    #{{ log.id }}
                                </v-chip>
                            </v-col>
                            <v-col cols="4" md="1">
                                <v-chip :color="getMethodColor(log.method)" size="small" label class="font-weight-bold mb-2">
                                    {{ log.method }}
                                </v-chip>
                            </v-col>
                            <v-col cols="4" md="1">
                                <v-chip :color="log.status == 'success' ? 'green' : 'error'" size="small" label
                                    class="font-weight-bold mb-2">
                                    {{ log.status }}
                                </v-chip>
                            </v-col>
                            <v-col cols="12" md="3" class="text-body-2 text-grey mb-2">
                                <span class="font-weight-bold">{{ log.route }}</span>
                            </v-col>
                            <v-col cols="12" md="3" class="text-caption mb-2">
                                <v-icon size="small" icon="mdi-account-circle" class="mr-1"></v-icon>
                                {{ log.user?.full_name || 'Sistema' }}
                            </v-col>
                            <v-col cols="12" md="3" class="text-caption mb-2">
                                {{ log.created_at }}
                            </v-col>
                        </v-row>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text class="pt-4">
                        <div class="mb-2">
                            <strong class="text-subtitle-2">Mensaje:</strong>
                            <p class="text-body-2">{{ log.message }}</p>
                        </div>
                        <div>
                            <strong class="text-subtitle-2">Payload (JSON):</strong>
                            <v-sheet border rounded class="pa-3 mt-1 bg-shades-black text-green-accent-3 overflow-auto">
                                <pre class="text-caption">{{ formatJSON(log.payload) }}</pre>
                            </v-sheet>
                        </div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <Paginator v-model="page" :length="numberOfPages" :loading="loadingIndexLogs" />
        </div>
        <div v-else>
            <Alert type="info" title="Sin resultados" text="No se encontraron registros de logs."></Alert>
        </div>
    </v-container>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>