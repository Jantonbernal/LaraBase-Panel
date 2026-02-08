<script setup>
defineProps({
    type: String,
    title: String,
    text: String
});
</script>

<template>
    <v-alert :type="type" :title="title" :text="text" class="my-5"></v-alert>
</template>