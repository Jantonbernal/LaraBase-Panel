<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const back = () => {
  router.back()
}
</script>

<template>
  <v-empty-state action-text="Retry Request"
    image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/connection.svg"
    text="La página que esta buscando no se pudo encontrar." title="REGRESAR A UN LUGAR SEGURO" color="secondary  "
    @click:action="back"></v-empty-state>
</template>
