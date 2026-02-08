<script setup>
import { computed, reactive, watch } from 'vue';
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useAccessStore } from "@/stores/access.js";
import { useMenuStore } from "@/stores/menu.js";
// Importar composables
import useAuth from "@/composables/services/auth";
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Router inicializado
const router = useRouter();

// Store de accesos
const useAccess = useAccessStore();
const { access, accessToken, permissions, roles, role, roleSelected } = storeToRefs(useAccess);
// Store de menus
const useMenu = useMenuStore();
const { menus } = storeToRefs(useMenu);

// Inicializar composables
const {
    dataLogin, login, loadingLogin, errorLogin,
    dataAllAccess, allAccess, loadingAllAccess, errorAllAccess
} = useAuth();

const credentials = reactive({
    email: null,
    password: null,
})

// Definir reglas de validación
const rules = computed(() => {
    return {
        email: {
            required: m.required(),
            email: m.email()
        },
        password: {
            required: m.required(),
            minLength: m.min(6)
        },
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, credentials)

const signIn = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return
    dataLogin.value = null
    errorLogin.value = null
    login(credentials);
}

watch(dataLogin, (received) => {
    if (received) {
        access.value = received.user;
        accessToken.value = received.token
        showToast("Bienvenido" + ' ' + received.user?.name || "Inicio de sesión exitoso", 'success', 5000)
        allAccess()
    }
});

watch(errorLogin, (received) => {
    access.value = null;
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
});

watch(dataAllAccess, (received) => {
    if (received) {
        permissions.value = received.allPermissions;
        roles.value = received.allRoles;
        role.value = received.role;
        roleSelected.value = received.role.id;
        menus.value = received.allMenus;
    }
});

watch(errorAllAccess, (received) => {
    if (received) {
        showToast(received?.data?.message || "Ocurrió un error", 'error', 5000)
    }
});

const goToForgotPassword = async () => {
    router.push({ name: 'forgot' })
}
</script>

<template>
    <Loading :active="loadingLogin" />
    <Loading :active="loadingAllAccess" />

    <div v-if="loadingLogin">
        <v-alert type="warning" class="my-5" closable>
            Comprobando credenciales
        </v-alert>
    </div>

    <div v-if="errorLogin">
        <v-alert type="error" class="my-5" closable>
            {{ errorLogin.data.message }}
        </v-alert>
    </div>

    <v-form class="ma-1" validate-on="submit lazy" @submit.prevent="signIn">
        <div class="mb-4">
            <v-text-field v-model="credentials.email" :error-messages="getError(v$, 'email')"
                label="Correo electronico" variant="outlined" color="primary" @blur="v$.email.$touch"
                @input="v$.email.$touch" density="compact"></v-text-field>
        </div>
        <div class="mb-4">
            <v-text-field v-model="credentials.password" :error-messages="getError(v$, 'password')"
                label="Contraseña" variant="outlined" color="primary" type="password" @blur="v$.password.$touch"
                @input="v$.password.$touch" density="compact"></v-text-field>
        </div>
        <v-row>
            <v-col cols="12">
                <v-btn block color="primary" class="font-weight-bold" type="submit" :disabled="loadingLogin"
                    :loading="loadingLogin">
                    Ingresar
                </v-btn>
            </v-col>
            <v-col cols="12" md="6">
                <v-btn class="text-caption" variant="text" @click.prevent="goToForgotPassword">
                    ¿Olvidó su contraseña?
                </v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>