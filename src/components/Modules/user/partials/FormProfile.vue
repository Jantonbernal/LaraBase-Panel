<script setup>
import { watch, reactive, computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useAccessStore } from "@/stores/access.js";
// Importar composables
import useUser from "@/composables/services/user";
import { useFileHandler } from '@/composables/logic/useFileHandler'
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
import { prepareFormData } from '@/utils/formHelpers'
import OverlayLoaders from '@/components/Common/OverlayLoaders.vue';

// Store de accesos
const useAccess = useAccessStore();
const { access } = storeToRefs(useAccess);

// Inicializar composables
const {
    dataShowUser, showUser, loadingShowUser,
    dataUpdateUser, updateUser, loadingUpdateUser, errorUpdateUser
} = useUser();
const { imagePreview, handleImageSelected } = useFileHandler()

const props = defineProps({
    title: String,
});

onMounted(() => {
    showUser(access.value?.id)
})

// Variables
const form = reactive({
    id: access.value?.id,
    name: null,
    last_name: null,
    email: null,
    password: null,
    phone: null,
    file: null,
    roles: null,
})

const showPassowrd = ref(false)

// Definir reglas de validación
const rules = computed(() => {
    return {
        id: {
            required: m.required(),
        },
        name: {
            required: m.required(),
        },
        last_name: {
            required: m.required(),
        },
        email: {
            required: m.required(),
            email: m.email()
        },
        phone: {
            required: m.required(),
        }
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, form)

// Está atento al cerrar/Abrir modal para cargar data
watch(dataShowUser, (val) => {
    if (val) {
        form.name = val.data?.name || null;
        form.last_name = val.data?.last_name || null;
        form.email = val.data?.email || null;
        form.phone = val.data?.phone || null;
        form.roles = val.data?.roles.length > 0 ? val.data?.roles.map(a => a.id) : null;
        imagePreview.value = val.data?.photo.url

        access.value = val.data
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

// Guardar datos
const save = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    const dataToSend = prepareFormData(form, 'update')

    updateUser(form.id, dataToSend)
}

watch(dataUpdateUser, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        showUser(access.value?.id)
    }
})

watch(errorUpdateUser, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})
</script>

<template>
    <v-container fluid>
        <!-- Loading -->
        <OverlayLoaders :loaders="[loadingShowUser, loadingUpdateUser]" />

        <v-form validate-on="submit lazy" @submit.prevent="save">
            <v-card class="mx-auto pb-3" elevation="3" rounded="xl" border>
                <v-toolbar color="primary" flat>
                    <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                    <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                        {{ title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>

                <v-container v-if="errorUpdateUser" class="px-6 pt-4">
                    <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                        {{ errorUpdateUser?.data?.message }}
                    </v-alert>
                </v-container>

                <v-card-text class="pa-6">
                    <div class="text-overline mb-3 text-primary font-weight-bold">Información Personal</div>
                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.name" :error-messages="getError(v$, 'name')" label="Nombre*"
                                variant="outlined" density="compact" rounded="lg"
                                prepend-inner-icon="mdi-account-outline"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.last_name" :error-messages="getError(v$, 'last_name')"
                                label="Apellidos*" variant="outlined" density="compact" rounded="lg"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="form.phone" :error-messages="getError(v$, 'phone')" label="Teléfono*"
                                variant="outlined" density="compact" rounded="lg"
                                prepend-inner-icon="mdi-phone-outline"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"></v-divider>

                    <div class="text-overline mb-3 text-primary font-weight-bold">Credenciales y Acceso</div>
                    <v-row dense>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.email" :error-messages="getError(v$, 'email')" label="E-mail*"
                                variant="outlined" density="compact" rounded="lg"
                                prepend-inner-icon="mdi-email-outline"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-text-field v-model="form.password" :error-messages="getError(v$, 'password')"
                                :type="showPassowrd ? 'text' : 'password'"
                                :append-inner-icon="showPassowrd ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña*"
                                variant="outlined" density="compact" rounded="lg" prepend-inner-icon="mdi-lock-outline"
                                @click:append-inner="showPassowrd = !showPassowrd"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"></v-divider>

                    <div class="text-overline mb-3 text-primary font-weight-bold">Imagen de Perfil</div>
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

                <v-card-actions class="px-6 py-4">
                    <v-spacer></v-spacer>
                    <v-btn :loading="loadingUpdateUser" color="primary" variant="elevated" class="px-8 rounded-pill"
                        type="submit">
                        GUARDAR CAMBIOS
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-container>
</template>