<script setup>
import SideBar from '../components/Dashboard/SideBar.vue';
import TopBar from '../components/Dashboard/TopBar.vue';
import Main from '../components/Dashboard/Main.vue';
import Footer from '../components/Dashboard/Footer.vue';
</script>

<template>
    <v-app>
        <SideBar />
        <TopBar />
        <Main />
        <Footer />
    </v-app>
</template>

<style>
.scrollable-content {
    overflow-y: auto;
}
</style>