<script setup>
// Define emit event
const emit = defineEmits(['closeModal']);

const props = defineProps({
    title: String,
    data: Object,
});

const closeModal = () => {
    emit('closeModal');
};
</script>

<template>
    <v-card class="mx-auto overflow-hidden" elevation="4" rounded="xl">
        <v-img height="120" class="align-end text-white" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.7)">
            <div class="d-flex align-center pa-4">
                <v-avatar size="80" border="white md" elevation="10" class="me-4">
                    <v-img v-if="data?.photo?.url" :src="data?.photo.url" alt="Foto de perfil" cover></v-img>
                    <v-icon v-else size="40" icon="mdi-account-circle"></v-icon>
                </v-avatar>
                <div>
                    <div class="text-h5 font-weight-bold">{{ data?.full_name }}</div>
                    <div class="text-subtitle-2 opacity-80">{{ data?.code }}</div>
                </div>
            </div>
        </v-img>

        <v-card-text class="pt-6">
            <div class="d-flex justify-end mb-4">
                <v-chip :color="data?.status === '1' ? 'success' : 'error'" size="small" variant="flat"
                    prepend-icon="mdi-check-circle" class="text-uppercase font-weight-bold">
                    {{ data?.status_name }}
                </v-chip>
            </div>

            <v-list lines="one" class="bg-transparent pa-0">
                <v-list-item prepend-icon="mdi-email-outline" :title="data?.email"
                    subtitle="Correo Electrónico"></v-list-item>

                <v-list-item prepend-icon="mdi-phone-outline" :title="data?.phone || 'No registrado'"
                    subtitle="Teléfono de contacto"></v-list-item>

                <v-list-item prepend-icon="mdi-calendar-clock" :title="data?.created_at"
                    subtitle="Fecha de registro"></v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <div class="mb-4">
                <div class="text-subtitle-2 font-weight-bold mb-2 text-info">
                    <v-icon icon="mdi-shield-account-outline" start></v-icon> ROLES
                </div>
                <div class="d-flex flex-wrap gap-2">
                    <v-chip v-for="role in data?.roles" :key="role.id" color="secondary" variant="tonal" size="small"
                        class="me-1">
                        {{ role.name }}
                    </v-chip>
                </div>
            </div>

            <div>
                <div class="text-subtitle-2 font-weight-bold mb-2 text-primary">
                    <v-icon icon="mdi-key-chain-variant" start></v-icon> PERMISOS CLAVE
                </div>
                <div class="d-flex flex-wrap gap-1">
                    <v-chip v-for="perm in data?.permissions" :key="perm.id" size="x-small" variant="outlined"
                        class="me-1 mb-1">
                        {{ perm.name }}
                    </v-chip>
                </div>
            </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="grey-darken-1" variant="text" @click="closeModal" prepend-icon="mdi-close">
                Cerrar
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.gap-2 {
    gap: 8px;
}

.gap-1 {
    gap: 4px;
}
</style>