import { useHttpRequest } from "@/composables/useHttpRequest";

export default function useAuth() {
    const { dataEndPoint: dataLogin, sendRequest: login_, loading: loadingLogin, errorEndPoint: errorLogin } = useHttpRequest();
    const { dataEndPoint: dataLogout, sendRequest: logout_, loading: loadingLogout, errorEndPoint: errorLogout } = useHttpRequest();
    const { dataEndPoint: dataForgotPassword, sendRequest: forgotPassword_, loading: loadingForgotPassword, errorEndPoint: errorForgotPassword } = useHttpRequest();
    const { dataEndPoint: dataVerifyCode, sendRequest: verifyCode_, loading: loadingVerifyCode, errorEndPoint: errorVerifyCode } = useHttpRequest();
    const { dataEndPoint: dataResetPassword, sendRequest: resetPassword_, loading: loadingResetPassword, errorEndPoint: errorResetPassword } = useHttpRequest();
    const { dataEndPoint: dataAllAccess, sendRequest: allAccess_, loading: loadingAllAccess, errorEndPoint: errorAllAccess } = useHttpRequest();

    // Envíar E-mail y contraseña para iniciar sesión
    const login = (params) => {
        login_('POST', 'login', params);
    };

    // Cerrar sesión
    const logout = () => {
        logout_('POST', 'logout');
    };

    // Envíar E-mail para restablecer cuenta a traves de código de seguridad
    const forgotPassword = (params) => {
        forgotPassword_('POST', 'forgot-password', params)
    }

    // Corroborar código de seguridad
    const verifyCode = (params) => {
        verifyCode_('POST', 'verify-code', params)
    }

    // Restablecer contraseña
    const resetPassword = async (params) => {
        resetPassword_('POST', 'reset-password', params)
    }

    // Obtener los accesos del sistema
    const allAccess = async (params) => {
        allAccess_('GET', 'user/allAccess', params)
    }

    return {
        dataLogin, login, loadingLogin, errorLogin,
        dataLogout, logout, loadingLogout, errorLogout,
        dataForgotPassword, forgotPassword, loadingForgotPassword, errorForgotPassword,
        dataVerifyCode, verifyCode, loadingVerifyCode, errorVerifyCode,
        dataResetPassword, resetPassword, loadingResetPassword, errorResetPassword,
        dataAllAccess, allAccess, loadingAllAccess, errorAllAccess
    }
}