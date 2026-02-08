<script setup>
import { computed } from 'vue';
import Loading from '@/components/Common/Loading.vue';

const props = defineProps({
    loaders: Array // Ejemplo: [loadingIndex, loadingStore, ...]
})
const isLoading = computed(() => props.loaders.some(Boolean))
</script>

<template>
    <div v-if="isLoading">
        <Loading :active="true" />
    </div>
</template>
