<script setup>
import { watch, reactive, computed, onMounted } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar composables
import usePermission from "@/composables/services/permission";
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Define emit event
const emit = defineEmits(['closeModal']);

// Inicializar composables
const {
    dataStorePermission, storePermission, loadingStorePermission, errorStorePermission,
    dataUpdatePermission, updatePermission, loadingUpdatePermission, errorUpdatePermission,
} = usePermission();

const props = defineProps({
    mode: String,
    title: String,
    id: Number,
    data: Object
});

onMounted(() => {
    reset()
})

// Formulario
const form = reactive({
    id: null,
    name: null,
    slug: null,
})

const reset = () => {
    v$.value.$reset()
    form.name = null
    form.slug = null
    dataStorePermission.value = null
    errorStorePermission.value = null
    dataUpdatePermission.value = null
    errorUpdatePermission.value = null
}

// Definir reglas de validación
const rules = computed(() => {
    return {
        id: {
            requiredIf: m.requiredIf(props.mode !== 'create'),
        },
        name: {
            required: m.required(),
        },
        slug: {
            required: m.required(),
        }
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, form)

// Watch para actualizar los datos cuando cambie data
watch(() => props.data, async (newData) => {
    if (newData) {
        form.id = props.id ?? newData.id;
        form.name = newData.name || null;
        form.slug = newData.slug || null;
    }
}, { immediate: true });

// Guardar datos
const save = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    if (props.mode == "create") {
        storePermission(form)
    } else {
        updatePermission(form.id, form)
    }
}

watch(dataStorePermission, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        closeModal()
    }
})

watch(errorStorePermission, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})

watch(dataUpdatePermission, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        closeModal()
    }
})

watch(errorUpdatePermission, (received) => {
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
    <Loading :active="loadingStorePermission" />
    <Loading :active="loadingUpdatePermission" />

    <v-form validate-on="submit lazy" @submit.prevent="save">
        <v-card class="mx-auto pb-3" width="450" elevation="3" rounded="xl" border>
            <v-toolbar color="primary" flat>
                <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-container v-if="errorStorePermission || errorUpdatePermission" class="px-6 pt-4">
                <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                    {{ errorStorePermission?.data?.message || errorUpdatePermission?.data?.message }}
                </v-alert>
            </v-container>

            <v-card-text class="px-4">
                <v-row dense>
                    <v-col cols="12">
                        <v-text-field v-model="form.name" :error-messages="getError(v$, 'name')" @blur="v$.name.$touch"
                            @input="v$.name.$touch" label="Nombre" variant="outlined" density="comfortable" rounded="lg"
                            color="primary"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.slug" :error-messages="getError(v$, 'slug')" @blur="v$.slug.$touch"
                            @input="v$.slug.$touch" label="Slug" variant="outlined" density="comfortable" rounded="lg"
                            color="primary"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="CERRAR" color="grey-darken-1" variant="text" class="px-6" @click="closeModal"></v-btn>
                <v-btn color="primary" variant="elevated" class="px-8 rounded-pill" type="submit"
                    :disabled="props.mode == 'create' ? loadingStorePermission : loadingUpdatePermission">
                    GUARDAR CAMBIOS
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>