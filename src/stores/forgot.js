import { defineStore } from "pinia";
import { ref } from "vue";

export const useForgotStore = defineStore('forgot', () => {

    const recoveryEmail = ref(null);
    const confirmationCode = ref(null);

    return {
        recoveryEmail,
        confirmationCode
    }
}, {
    persist: true
})