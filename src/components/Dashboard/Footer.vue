<script setup>
import { storeToRefs } from "pinia";

// Importar stores
import { useCompanyStore } from "@/stores/company.js";

// Store de company
const useCompany = useCompanyStore();
const { company } = storeToRefs(useCompany);

const currentYear = new Date().getFullYear();
</script>

<template>
    <v-footer app class="pa-6">
        <v-container class="d-flex justify-end align-center" fluid>
            © {{ currentYear }}, {{ company?.business_name }}
        </v-container>
    </v-footer>
</template>
