import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
// Importar stores
import { useForgotStore } from "@/stores/forgot.js";
// Importar servicios
import useAuth from "@/composables/services/auth";
// Importar utilidades
import { showToast } from "@/utils/toastUtils";

export default function useEmailRecovery(credentials, v$ = null) {
    // Store de recuperación de contraseña
    const useForgot = useForgotStore();
    const { recoveryEmail } = storeToRefs(useForgot);

    const {
        dataForgotPassword,
        forgotPassword,
        loadingForgotPassword,
        errorForgotPassword
    } = useAuth();

    // Ocultar parte del correo electrónico
    const hideEmail = computed(() => {
        const email = credentials?.email || recoveryEmail.value;

        if (!email) return null;

        return email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => {
            return gp2 + "*".repeat(gp3.length);
        });
    });

    const generateCode = async () => {
        if (v$) {
            const isFormCorrect = await v$.value.$validate();
            if (!isFormCorrect) return;
        }

        dataForgotPassword.value = null;
        errorForgotPassword.value = null;
        credentials.hideEmail = hideEmail.value

        forgotPassword(credentials);
    };

    // Manejo de respuestas y errores centralizado
    const handleForgotPasswordResponses = (onSuccess) => {
        watch(dataForgotPassword, (received) => {
            if (received) {
                showToast(received?.message, "success", 5000);
                if (onSuccess) {
                    onSuccess();
                }
            }
        });

        watch(errorForgotPassword, (received) => {
            if (received) {
                showToast(received?.data?.message, "error", 5000);
            }
        });
    };

    return {
        hideEmail,
        recoveryEmail,
        generateCode,
        loadingForgotPassword,
        handleForgotPasswordResponses
    };
}
