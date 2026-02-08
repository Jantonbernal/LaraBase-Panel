<script setup>
import LoginForm from '@/components/Auth/LoginForm.vue';
</script>

<template>
    <v-main>
        <v-container class="h-100">
            <v-row align="center" class="fill-height" justify="center">
                <v-col cols="12" sm="6" md="5" lg="4">
                    <v-card rounded="lg" variant="flat" title="Inicia sesión con tus credenciales" hover>
                        <v-card-item class="pa-sm-8">
                            <LoginForm />
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>