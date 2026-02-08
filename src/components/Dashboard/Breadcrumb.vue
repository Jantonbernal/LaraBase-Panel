<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
    return route.matched.map((r) => ({
        title: r.meta.title || r.name, // Usa meta.title si está definido, de lo contrario usa el nombre de la ruta
        to: r.path,
        disabled: r.path === route.path, // Deshabilitar si es la ruta actual
    }));
});
</script>

<template>
    <v-breadcrumbs :items="breadcrumbs" class="px-5 py-1 justify-end">
        <template v-slot:item="{ item, index }">
            <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
                <v-icon v-if="index === 0" class="mr-1" icon="mdi-view-dashboard"></v-icon>
                {{ item.title }}
            </v-breadcrumbs-item>
        </template>
    </v-breadcrumbs>
</template>