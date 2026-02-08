<script setup>
defineProps({
    modelValue: {
        type: Number,
        default: 1
    },
    length: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);

const onPageChange = (newPage) => {
    emit('update:modelValue', newPage);
};
</script>

<template>
    <v-row v-if="length > 0" justify="center" align="center">
        <v-col cols="12">
            <v-pagination :model-value="modelValue" :length="length" @update:modelValue="onPageChange"
                :disabled="loading" class="my-4" active-color="primary" density="compact" elevation="1"></v-pagination>
        </v-col>
    </v-row>
</template>