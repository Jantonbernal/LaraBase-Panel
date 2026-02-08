<script setup>
import { watch, reactive, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useCompanyStore } from "@/stores/company.js";
import { useAccessStore } from "@/stores/access";
// Importar composables
import useCompany from "@/composables/services/company";
import { useFileHandler } from '@/composables/logic/useFileHandler'
// Importar componentes
import OverlayLoaders from '@/components/Common/OverlayLoaders.vue';
import { showToast } from '@/utils/toastUtils';

// Store de company
const useComp = useCompanyStore();
const { company } = storeToRefs(useComp);
// Store de accesos
const useAccess = useAccessStore();
const { permissions } = storeToRefs(useAccess);

// Composables inicializados
const {
    dataShowCompany, showCompany, loadingShowCompany,
    dataUpdateCompany, updateCompany, loadingUpdateCompany, errorUpdateCompany
} = useCompany();
const { imagePreview, handleImageSelected } = useFileHandler()

onMounted(() => {
    showCompany(1)
})

// Variables
const form = reactive({
    id: null,
    business_name: null,
    trade_name: null,
    document: null,
    email: null,
    phone_number: null,
    file_id: null,
})

// Definir reglas de validación
const rules = computed(() => {
    return {
        id: {
            required: m.required(),
        },
        business_name: {
            required: m.required(),
        },
        trade_name: {
            required: m.required(),
        },
        document: {
            required: m.required(),
        },
        email: {
            required: m.required(),
            email: m.email()
        },
        phone_number: {
            required: m.required(),
        },
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, form)

// Está atento al cerrar/Abrir modal para cargar data
watch(dataShowCompany, (val) => {
    if (val) {
        company.value = val.data
        Object.assign(form, val.data);
    }
})

// Guardar archivo de imagen
const onFileChange = (e) => {
    handleImageSelected(e, (file) => {
        form.file = file
    }, {
        extensions: ['jpg', 'jpeg', 'png'],
        maxSizeMB: 2
    })
}

// Guardar
const save = async () => {
    // No pasa si estan las validaciones
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    updateCompany(form.id, form)
}

// Verifica que se haya registrado exitosamente
watch(dataUpdateCompany, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        showCompany(1)
    }
})

// Mantiene abierto el modal si encuentra errores
watch(errorUpdateCompany, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})

</script>

<template>
    <v-container fluid>
        <!-- Loading -->
        <OverlayLoaders :loaders="[loadingShowCompany, loadingUpdateCompany]" />

        <v-card class="mx-auto pb-3 w-100" rounded="xl" hover>
            <v-form validate-on="submit lazy" @submit.prevent="save">
                <v-toolbar color="primary" flat>
                    <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                    <v-toolbar-title class="font-weight-bold text-uppercase">
                        Actualizar Información de la Empresa
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-container v-if="errorUpdateCompany" class="px-6 pt-4">
                    <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                        {{ errorUpdateCompany.data?.message }}
                    </v-alert>
                </v-container>

                <v-card-text class="px-4">
                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.business_name" :error-messages="getError(v$, 'business_name')"
                                @blur="v$.business_name.$touch" @input="v$.business_name.$touch" label="Razón Social"
                                variant="outlined" density="compact" color="primary" rounded="lg"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.trade_name" :error-messages="getError(v$, 'trade_name')"
                                @blur="v$.trade_name.$touch" @input="v$.trade_name.$touch" label="Nombre Comercial"
                                variant="outlined" density="compact" color="primary" rounded="lg"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.document" :error-messages="getError(v$, 'document')"
                                @blur="v$.document.$touch" @input="v$.document.$touch" label="#Documento"
                                variant="outlined" density="compact" color="primary" rounded="lg"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.email" :error-messages="getError(v$, 'email')"
                                @blur="v$.email.$touch" @input="v$.email.$touch" label="Email address"
                                variant="outlined" density="compact" color="primary" rounded="lg"
                                type="email"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.phone_number" :error-messages="getError(v$, 'phone_number')"
                                @blur="v$.phone_number.$touch" @input="v$.phone_number.$touch" label="Teléfono"
                                variant="outlined" density="compact" color="primary" rounded="lg"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"></v-divider>

                    <v-row align="center">
                        <v-col cols="12" sm="8">
                            <v-file-input accept="image/*" label="Subir Avatar" variant="outlined" density="compact"
                                rounded="lg" prepend-icon="" prepend-inner-icon="mdi-camera-outline" show-size
                                @change="onFileChange"></v-file-input>
                        </v-col>
                        <v-col cols="12" sm="4" class="d-flex justify-center">
                            <v-hover v-slot="{ isHovering, props }">
                                <v-avatar v-bind="props" size="100" :variant="isHovering ? 'elevated' : 'tonal'"
                                    class="transition-swing border">
                                    <v-img v-if="imagePreview" :src="imagePreview" cover></v-img>
                                    <v-icon v-else size="50" color="grey-lighten-1">mdi-account-circle</v-icon>
                                </v-avatar>
                            </v-hover>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions v-if="permissions.includes('compania.createOrUpdate')">
                    <v-spacer></v-spacer>
                    <v-btn color="primary" variant="elevated" class="px-8 rounded-pill" type="submit"
                        :disabled="loadingUpdateCompany">
                        GUARDAR CAMBIOS
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>