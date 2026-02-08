<script setup>
// Define emit event
const emit = defineEmits(['closeModal']);

const props = defineProps({
    title: String,
    id: Number,
    data: Object
});

// Cerrar modal
const closeModal = () => {
    emit('closeModal')
}
</script>

<template>
    <v-card class="mx-auto pb-3" width="350" elevation="17" rounded="xl" border>
        <v-toolbar color="primary" flat>
            <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
            <v-toolbar-title class="font-weight-bold text-uppercase" style="letter-spacing: 1px;">
                {{ title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <v-card-text class="px-4">
            <v-row dense>
                <v-col cols="12">
                    <v-text-field :model-value="data?.name" label="Rol" variant="outlined" density="comfortable"
                        rounded="lg" color="primary" disabled></v-text-field>
                </v-col>
                <v-col cols="12" v-if="data?.permissions?.length">
                    <v-list density="compact" :disabled="true">
                        <v-list-subheader>PERMISOS</v-list-subheader>
                        <v-chip-group selected-class="text-primary" column>
                            <v-chip v-for="(item, i) in data?.permissions" :key="i" size="small" label>
                                {{ item.name }}
                            </v-chip>
                        </v-chip-group>
                    </v-list>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="px-6 py-4">
            <v-btn text="CERRAR" color="grey-darken-1" variant="text" class="px-6" @click="closeModal"></v-btn>
        </v-card-actions>
    </v-card>
</template>