<script setup>
import Breadcrumb from '@/components/Dashboard/Breadcrumb.vue';
</script>
<template>
    <v-main class="my-5 scrollable-content" id="app-main">
        <v-container fluid>
            <!-- Ruta de navegación -->
            <Breadcrumb />
            <!-- Navigation -->
            <router-view v-slot="{ Component }">
                <transition name="slide-fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </v-container>
    </v-main>
</template>