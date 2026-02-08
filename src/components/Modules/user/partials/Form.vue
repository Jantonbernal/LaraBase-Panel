<script setup>
import { watch, reactive, computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar composables
import useUser from "@/composables/services/user";
import useRole from "@/composables/services/role";
import { useFileHandler } from '@/composables/logic/useFileHandler'
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
import { prepareFormData } from '@/utils/formHelpers'

// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Router inicializado
const router = useRouter();

const {
    dataStoreUser, storeUser, loadingStoreUser, errorStoreUser,
    dataUpdateUser, updateUser, loadingUpdateUser, errorUpdateUser,
} = useUser();

const { dataAllRoles, allRoles, loadingAllRoles } = useRole();
const { imagePreview, handleImageSelected } = useFileHandler()

const props = defineProps({
    mode: String,
    title: String,
    id: Number,
    data: Object
});

onMounted(() => {
    allRoles()
})

// Variables
const form = reactive({
    id: null,
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
            required: m.requiredIf(props.mode !== 'create'),
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
        password: {
            required: m.requiredIf(props.mode == 'create'),
        },
        phone: {
            required: m.required(),
        },
        roles: {
            required: m.required(),
            minLength: m.minEntity(1, 'rol(s)')
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
        form.last_name = newData.last_name || null;
        form.email = newData.email || null;
        form.phone = newData.phone || null;
        form.roles = newData.roles.length > 0 ? newData.roles.map(a => a.id) : null;
    }
}, { immediate: true });

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

    const dataToSend = prepareFormData(form, props.mode)

    if (props.mode == "create") {
        storeUser(dataToSend)
    } else {
        updateUser(form.id, dataToSend)
    }
}

const goBack = () => {
    router.back()
}

watch(dataStoreUser, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        goBack()
    }
})

watch(errorStoreUser, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})

watch(dataUpdateUser, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)
        goBack()
    }
})

watch(errorUpdateUser, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
})
</script>

<template>
    <Loading :active="loadingStoreUser" />
    <Loading :active="loadingUpdateUser" />
    <Loading :active="loadingAllRoles" />

    <v-form validate-on="submit lazy" @submit.prevent="save">
        <v-card class="mx-auto pb-3" elevation="3" rounded="xl" border>
            <v-toolbar color="primary" flat>
                <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <v-container v-if="errorStoreUser || errorUpdateUser" class="px-6 pt-4">
                <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                    {{ errorStoreUser?.data?.message || errorUpdateUser?.data?.message }}
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

                    <v-col cols="12">
                        <v-autocomplete v-model="form.roles" :items="dataAllRoles?.data"
                            :error-messages="getError(v$, 'roles')" multiple chips label="Roles asignados*"
                            variant="outlined" density="compact" rounded="lg"
                            prepend-inner-icon="mdi-shield-check-outline" item-title="name"
                            item-value="id"></v-autocomplete>
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
                <v-btn text="CANCELAR" color="grey-darken-1" variant="text" class="px-6" @click="goBack"></v-btn>
                <v-btn :loading="props.mode == 'create' ? loadingStoreUser : loadingUpdateUser" color="primary"
                    variant="elevated" class="px-8 rounded-pill" type="submit">
                    GUARDAR CAMBIOS
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>