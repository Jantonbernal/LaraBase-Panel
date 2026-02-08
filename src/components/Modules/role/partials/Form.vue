<script setup>
import { watch, reactive, computed, onMounted } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar composables
import useRole from "@/composables/services/role";
import usePermission from "@/composables/services/permission";
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

// Inicializar composables
const {
    dataStoreRole, storeRole, loadingStoreRole, errorStoreRole,
    dataUpdateRole, updateRole, loadingUpdateRole, errorUpdateRole,
} = useRole();
const { dataAllPermissions, allPermissions } = usePermission();

const props = defineProps({
    mode: String,
    title: String,
    id: Number,
    data: Object
});

onMounted(() => {
    allPermissions()
    reset()
})

// Formulario
const form = reactive({
    id: null,
    name: null,
    permissions: null
})

const reset = () => {
    v$.value.$reset()
    form.name = null
    form.permissions = null
    dataStoreRole.value = null
    errorStoreRole.value = null
    dataUpdateRole.value = null
    errorUpdateRole.value = null
}

// Definir reglas de validación
const rules = computed(() => {
    return {
        // Usamos requiredIf con la condición del modo
        id: {
            required: m.requiredIf(props.mode !== 'create')
        },
        name: {
            required: m.required()
        },
        permissions: {
            required: m.required(),
            minLength: m.minEntity(1, 'permiso(s)')
        },
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, form)

// Watch para actualizar los datos cuando cambie data
watch(() => props.data, async (newData) => {
    if (newData) {
        form.id = props.id ?? newData.id;
        form.name = newData.name || null;
        form.permissions = newData.permissions.length > 0 ? newData.permissions.map(a => a.id) : null;
    }
}, { immediate: true });

// Guardar datos
const saveModal = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    if (props.mode == "create") {
        storeRole(form)
    } else {
        updateRole(form.id, form)
    }
}

watch(dataStoreRole, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        closeModal()
    }
})

watch(errorStoreRole, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})

watch(dataUpdateRole, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        closeModal()
    }
})

watch(errorUpdateRole, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})

// Cerrar modal
const closeModal = () => {
    emit('closeModal')
}
</script>

<template>
    <Loading :active="loadingStoreRole" />
    <Loading :active="loadingUpdateRole" />

    <v-form validate-on="submit lazy" @submit.prevent="saveModal">
        <v-card class="mx-auto pb-3" elevation="17" rounded="xl" border>
            <v-toolbar color="primary" flat>
                <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-container v-if="errorStoreRole || errorUpdateRole" class="px-6 pt-4">
                <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                    {{ errorStoreRole?.data?.message || errorUpdateRole?.data?.message }}
                </v-alert>
            </v-container>

            <v-card-text class="pa-6">
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field v-model="form.name" :error-messages="getError(v$, 'name')" label="Rol"
                            variant="outlined" density="comfortable" rounded="lg" color="primary"></v-text-field>
                    </v-col>
                    <v-col cols="12" v-if="dataAllPermissions?.data.length">
                        <v-autocomplete v-model="form.permissions" :items="dataAllPermissions?.data" multiple
                            item-title="name" item-value="id" label="Seleccione un permiso" persistent-hint chips
                            single-line variant="outlined" density="comfortable" rounded="lg" color="primary"
                            :error-messages="getError(v$, 'permissions')">
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions class="px-6 py-4">
                <v-spacer></v-spacer>
                <v-btn text="CERRAR" color="grey-darken-1" variant="text" class="px-6" @click="closeModal"></v-btn>
                <v-btn color="primary" variant="elevated" class="px-8 rounded-pill" type="submit"
                    :disabled="props.mode == 'create' ? loadingStoreRole : loadingUpdateRole">
                    GUARDAR CAMBIOS
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>