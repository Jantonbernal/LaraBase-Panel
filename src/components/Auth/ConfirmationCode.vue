<script setup>
import { reactive, watch, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useForgotStore } from "@/stores/forgot.js";
// Importar composables
import useAuth from "@/composables/services/auth";
import useEmailRecovery from "@/composables/logic/useEmailRecovery";
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
const { dataVerifyCode, verifyCode, loadingVerifyCode, errorVerifyCode } = useAuth();

// Verifica que existe el Email
onMounted(() => {
    verifyRecoveryEmail()
})

// Retorna a la ventana anterior si recarga el navegador
const verifyRecoveryEmail = () => {
    if (!recoveryEmail.value) {
        router.back()
    }
}

// Variables
const credentials = reactive({
    code: null,
    email: recoveryEmail?.value,
    hideEmail: null
})

const { hideEmail, generateCode, loadingForgotPassword } = useEmailRecovery(credentials);

// Definir reglas de validación
const rules = computed(() => {
    return {
        code: {
            required: m.required(),
        },
        email: {
            required: m.required(),
            email: m.email()
        }
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, credentials)

const verifyCodeForRecoveryEmail = async () => {
    const isFormCorrect = await v$.value.$validate()
    if (!isFormCorrect) return

    verifyCode(credentials)
}

watch(dataVerifyCode, (received) => {
    if (received) {
        showToast(received?.message, 'success', 5000)

        confirmationCode.value = credentials.code
        router.push({ name: 'ResetPassword' })
    }
})

watch(errorVerifyCode, (received) => {
    if (received) {
        showToast(received?.data?.message, 'error', 5000)
    }
})

</script>

<template>
    <v-main>
        <Loading :active="loadingVerifyCode" />
        <Loading :active="loadingForgotPassword" />

        <v-container class="h-100">
            <v-row align="center" class="fill-height" justify="center">
                <v-col cols="12" sm="8">
                    <div class="boxed-auth-wrap">
                        <v-card class="py-8 px-6 text-center mx-auto ma-4" max-width="400" rounded="lg" variant="flat" hover>
                            <h3 class="text-h6 mb-4">Verificar tu cuenta</h3>
                            <div class="text-body-2">
                                Hemos enviado un código de verificación a {{ hideEmail }} <br>
                                Porfavor verifique su E-mail y pega el código proporcionado.
                            </div>
                            <v-sheet color="surface">
                                <v-otp-input v-model="credentials.code" :error-messages="getError(v$, 'code')" length="4" placeholder="0"
                                    variant="solo"></v-otp-input>
                            </v-sheet>
                            <v-btn class="my-4" color="primary" height="40" text="VERIFICAR" variant="flat" width="70%"
                                @click.prevent="verifyCodeForRecoveryEmail"></v-btn>
                            <div class="text-caption">
                                No recibió el código?
                                <v-btn @click.prevent="generateCode" color="primary" size="x-small" variant="text">
                                    Reenviar
                                </v-btn>
                            </div>
                             <v-col cols="12" md="6">
                                <v-btn class="text-caption" variant="text" @click.prevent="router.back()">
                                    Volver
                                </v-btn>
                            </v-col>
                        </v-card>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>