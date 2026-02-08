<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useVuelidate } from '@vuelidate/core'
import { m, getError } from '@/composables/logic/useValidationUtils'

// Importar composables 
import useEmailRecovery from "@/composables/logic/useEmailRecovery";
// Importar componentes
import Loading from '@/components/Common/Loading.vue';

// Router inicializado
const router = useRouter();

const credentials = reactive({
    email: null,
    hideEmail: null
})

// Definir reglas de validación
const rules = computed(() => {
    return {
        email: {
            required: m.required(),
            email: m.email()
        }
    }
})

// Inicializar validaciones
const v$ = useVuelidate(rules, credentials)

const {
    recoveryEmail, generateCode, loadingForgotPassword, handleForgotPasswordResponses
} = useEmailRecovery(credentials, v$);

handleForgotPasswordResponses(() => {
    recoveryEmail.value = credentials.email;
    router.push({ name: "ConfirmationCode" });
});

const submitForm = async () => {
    await generateCode();
};
</script>

<template>
    <v-main>
        <Loading :active="loadingForgotPassword" />

        <v-container class="h-100">
            <v-row align="center" class="fill-height" justify="center">
                <v-col cols="12" sm="8">
                    <v-card rounded="lg" variant="flat" hover>
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center mb-5 text-high-emphasis">
                                <h1 class="text-h5 text-center">
                                    Ingrese el correo electronico a recuperar y luego presione el boton
                                    <v-icon size="x-small" icon="mdi mdi-send-check"></v-icon>
                                </h1>
                            </div>
                            <v-col cols="12">
                                <div :class="{ error: v$.email.$errors.length }">
                                    <v-text-field v-model="credentials.email"
                                        :error-messages="getError(v$, 'email')" @blur="v$.email.$touch"
                                        @input="v$.email.$touch" label="Ingrese el correo electronico a recuperar"
                                        variant="solo-filled" class="pwdInput" color="primary"
                                        prepend-icon="mdi mdi-email-open-outline" append-icon="mdi mdi-send-check"
                                        @click:append="submitForm"></v-text-field>
                                </div>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-btn class="text-caption" variant="text" @click.prevent="router.back()">
                                    Volver
                                </v-btn>
                            </v-col>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>