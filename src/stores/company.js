import { defineStore } from "pinia";
import { ref } from "vue";

export const useCompanyStore = defineStore('company', () => {
    // variables
    const company = ref({});

    return {
        company,
    }
}, {
    persist: true
})