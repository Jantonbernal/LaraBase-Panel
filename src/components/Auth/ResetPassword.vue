<script setup>
import { reactive, watch, computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useForgotStore } from "@/stores/forgot.js";
// Importar composables
import useAuth from "@/composables/services/auth";
// Importar utilidades
import { showToast } from '@/utils/toastUtils';
// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Router inicializado
const router = useRouter();

// Store de recuperación de contraseña
const useForgot = useForgotStore();
const { recoveryEmail, confirmationCode } = storeToRefs(useForgot);

// Composables inicializados (servicios)
const { dataResetPassword, resetPassword, loadingResetPassword, errorResetPassword } = useAuth();

// Verifica que existe el Email
onMounted(() => {
    verifyRecoveryEmail()
})

// Retorna a la ventana Login si recarga el navegador
const verifyRecoveryEmail = () => {
    if (!recoveryEmail.value || !confirmationCode.value) {
        router.replace('/')
    }
}

// Variables
const credentials = reactive({
    code: confirmationCode?.value,
    email: recoveryEmail?.value,
    password: '',
    confirmPassword: ''
})

const showPassowrd = ref(false)
const showConfirmPassowrd = ref(false)

// Definir reglas de validación
const rules = computed(() => {
    return {
        code: {
            required: m.required(),
        },
        email: {
            required: m.required(),
            email: m.email()
        },
        password: {
            required: m.required(),
        },
        confirmPassword: {
            required: m.required(),
            sameAs: m.sameAs(credentials.password, 'la contraseña')
        }
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, credentials)

const resetPasswordForRecovery = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    resetPassword(credentials)
}

watch(dataResetPassword, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)

        // Limpiar los datos de recuperación
        recoveryEmail.value = null
        confirmationCode.value = null
        router.push({ name: 'Login' })
    }
})

watch(errorResetPassword, (received) => {
    if (received) {
        showToast(received?.data?.message, 'error', 5000)
    }
})
</script>

<template>
    <v-main>
        <Loading :active="loadingResetPassword" />

        <v-container class="h-100">
            <v-row align="center" class="fill-height" justify="center">
                <v-col cols="12" md="6">
                    <v-card rounded="lg" class="mx-auto" variant="flat" hover>
                        <v-card-item class="pa-sm-8">
                            <h1 class="text-h5 text-center mb-5">
                                Ingrese la nueva contraseña para restablecer su cuenta
                            </h1>
                            <v-col cols="12">
                                <v-text-field v-model="credentials.password" :error-messages="getError(v$, 'password')"
                                    @blur="v$.password.$touch" @input="v$.password.$touch"
                                    :type="showPassowrd ? 'text' : 'password'"
                                    :append-icon="showPassowrd ? 'mdi-eye' : 'mdi-eye-off'" label="Contraseña*"
                                    @click:append="showPassowrd = !showPassowrd" variant="outlined" class="pwdInput"
                                    color="primary"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="credentials.confirmPassword"
                                    :error-messages="getError(v$, 'confirmPassword')" @blur="v$.confirmPassword.$touch"
                                    @input="v$.confirmPassword.$touch" :type="showConfirmPassowrd ? 'text' : 'password'"
                                    :append-icon="showConfirmPassowrd ? 'mdi-eye' : 'mdi-eye-off'"
                                    label="Confirmar contraseña*"
                                    @click:append="showConfirmPassowrd = !showConfirmPassowrd" variant="outlined"
                                    class="pwdInput" color="primary"></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-btn class="my-4" color="primary" height="40" text="RESTABLECER" variant="flat"
                                    width="100%" @click.prevent="resetPasswordForRecovery"></v-btn>
                            </v-col>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>