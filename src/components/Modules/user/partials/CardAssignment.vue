<script setup>
import { watch, reactive, computed, onMounted, ref } from "vue";
import { useVuelidate } from '@vuelidate/core'
import { m } from '@/composables/logic/useValidationUtils'

// Importar composables
import useUser from "@/composables/services/user";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';
// Importar utilidades
import { showToast } from '@/utils/toastUtils';

// Define emit event
const emit = defineEmits(['closeModal']);

const { dataAssignPermissions, assignPermissions, loadingAssignPermissions, errorAssignPermissions } = useUser();

const props = defineProps({
    title: String,
    id: Number,
    data: Object,
    permissions: Array
});

onMounted(() => {
    reset()
})

// Variables
const form = reactive({
    id: null,
    permissions: [],
})

const reset = () => {
    v$.value.$reset()
    form.id = null
    form.permissions = []
    dataAssignPermissions.value = null;
    errorAssignPermissions.value = null;
}

// Definir reglas de validación
const rules = computed(() => {
    return {
        id: {
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
        form.permissions = newData.permissions.length > 0 ? newData.permissions.map(a => a.id) : null;
    }
}, { immediate: true });

const save = async () => {
    // No pasa si estan las validaciones
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    assignPermissions(form.id, form)
}

watch(dataAssignPermissions, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        closeModal()
    }
})

watch(errorAssignPermissions, (received) => {
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
    <Loading :active="loadingAssignPermissions" />

    <v-form validate-on="submit lazy" @submit.prevent="save">
        <v-card class="mx-auto pb-3" width="500" elevation="17" rounded="xl" border>
            <v-toolbar color="primary" flat>
                <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="px-4">
                <v-autocomplete v-model="form.permissions" :items="permissions" multiple item-title="name"
                    item-value="id" label="Seleccione un(os) permiso(s)*" persistent-hint chips single-line
                    variant="outlined" density="comfortable" rounded="lg" color="primary">
                </v-autocomplete>
            </v-card-text>
            <v-card-actions class="px-6 py-4">
                <v-spacer></v-spacer>
                <v-btn text="CERRAR" color="grey-darken-1" variant="text" class="px-6" @click="closeModal"></v-btn>
                <v-btn color="primary" variant="elevated" class="px-8 rounded-pill" type="submit"
                    :disabled="loadingAssignPermissions">
                    GUARDAR CAMBIOS
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>