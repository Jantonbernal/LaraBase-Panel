<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app id="app">
    <!-- Navigation -->
    <router-view v-slot="{ Component }">
      <transition name="slide-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </v-app>
</template>
