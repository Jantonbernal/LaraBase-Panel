<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { getError } from '@/composables/logic/useValidationUtils'

// Importar stores
import { useAccessStore } from "@/stores/access";
import { useMenuStore } from "@/stores/menu";

// Importar composables
import useMenu from "@/composables/services/menu";
import usePermission from "@/composables/services/permission";
import useAuth from "@/composables/services/auth";

// Logic Composable (Nuestro nuevo archivo)
import useMenuLogic from "@/composables/logic/useMenuForm";

// Importar componentes
import OverlayLoaders from '@/components/Common/OverlayLoaders.vue';
import Alert from '@/components/Common/Alert.vue';
import Paginator from '@/components/Common/Paginator.vue';

// Store de accesos
const useAccess = useAccessStore();
const { permissions } = storeToRefs(useAccess);
// Store de accesos
const useMenus = useMenuStore();
const { menus } = storeToRefs(useMenus)

// Inicializar composables
const menuService = useMenu();
const permissionService = usePermission();
const authService = useAuth();

// Inyectamos la lógica
const {
    form, v$, mode, active, open, page, search, treeItems,
    hierarchyOptions, isMenuReadOnly, canSeeMenu,
    save, searchResults, handleStatusChange
} = useMenuLogic(permissions, menuService, authService, menus);

onMounted(async () => {
    menuService.indexMenus({ page: page.value, search: search.value });
    menuService.allMenus()
    permissionService.permissionsForMenu()
})

</script>

<template>
    <v-container class="ma-4" fluid>
        <!-- Loading -->
        <OverlayLoaders :loaders="[
            menuService.loadingIndexMenus.value, menuService.loadingStoreMenu.value, menuService.loadingUpdateMenu.value,
            menuService.loadingToggleMenu.value, menuService.loadingShowMenu.value, menuService.loadingAllMenus.value,
            permissionService.loadingPermissionsForMenu.value, authService.loadingAllAccess.value]" />

        <v-row>
            <!-- Buscador -->
            <v-col cols="12" md="4">
                <v-text-field v-model="search" :loading="menuService?.loadingIndexMenus.value"
                    append-inner-icon="mdi-magnify" density="compact" label="Buscar..." placeholder="Buscar Menus..."
                    variant="solo-filled" single-line hide-details @click:append-inner="searchResults"
                    @keyup.enter="searchResults"></v-text-field>
            </v-col>
            <!-- Botón Crear -->
            <v-col cols="12" md="4">
                <v-tooltip location="left" v-if="permissions.includes('menu.crear')" text="Crear">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="primary" density="comfortable"
                            icon="mdi mdi-plus-box-multiple-outline" @click.prevent="mode = 'REGISTRAR MENÚ'">
                        </v-btn>
                    </template>
                </v-tooltip>
            </v-col>
        </v-row>

        <v-row justify="space-between" dense>
            <v-col cols="12" md="4">
                <v-card class="mx-auto my-3" hover flat v-if="menuService?.dataIndexMenus?.value?.data?.length">
                    <!-- TreeView -->
                    <v-treeview v-model:activated="active" v-model:opened="open" :items="treeItems" density="compact"
                        item-value="id" item-title="title" activatable fluid open-on-click>
                        <template v-slot:prepend="{ item }">
                            <v-icon :icon="item.icon || (item.children ? 'mdi-folder' : 'mdi-file-outline')"></v-icon>
                        </template>
                    </v-treeview>

                    <!-- Paginador -->
                    <Paginator v-model="page" :length="menuService?.numberOfPages.value"
                        :loading="menuService?.loadingIndexMenus.value" />
                </v-card>
                <div v-else>
                    <!-- Alerta -->
                    <Alert type="info" title="Sin resultados" text="No se encontraron registros de Menus."></Alert>
                </div>
            </v-col>

            <v-col class="d-flex text-center" cols="12" md="8" v-if="active.length || mode">
                <v-row>
                    <v-col cols="12">
                        <v-card class="mx-auto pb-3 w-100" rounded="xl" hover v-if="canSeeMenu">
                            <v-form validate-on="submit lazy" @submit.prevent="save">
                                <v-toolbar color="primary" flat>
                                    <v-icon start icon="mdi-account-plus-outline" class="ms-4"></v-icon>
                                    <v-toolbar-title class="font-weight-bold text-uppercase">
                                        {{ form.id ? form.menu : mode }}
                                    </v-toolbar-title>
                                    <v-spacer></v-spacer>
                                </v-toolbar>

                                <v-container
                                    v-if="menuService?.errorStoreMenu.value || menuService?.errorUpdateMenu.value"
                                    class="px-6 pt-4">
                                    <v-alert type="error" variant="tonal" border="start" class="rounded-lg" closable>
                                        {{ menuService.errorStoreMenu?.value.data?.message ||
                                            menuService.errorUpdateMenu?.value.data?.message }}
                                    </v-alert>
                                </v-container>

                                <v-card-text class="px-4">
                                    <v-row dense>
                                        <v-col cols="12" sm="6">
                                            <v-text-field v-model="form.menu" :error-messages="getError(v$, 'menu')"
                                                @blur="v$.menu.$touch" @input="v$.menu.$touch" label="Menú"
                                                variant="outlined" density="comfortable" rounded="lg" color="primary"
                                                :readonly="isMenuReadOnly"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field v-model="form.icon" :error-messages="getError(v$, 'icon')"
                                                @blur="v$.icon.$touch" @input="v$.icon.$touch" label="Ícono"
                                                variant="outlined" density="comfortable" rounded="lg"
                                                color="primary"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-select v-model="form.hierarchy" :items="hierarchyOptions"
                                                item-title="title" item-value="id" label="Seleccione una Jerarquía"
                                                persistent-hint chips single-line
                                                :error-messages="getError(v$, 'hierarchy')" @blur="v$.parent.$touch"
                                                @input="v$.parent.$touch" variant="outlined" density="comfortable"
                                                rounded="lg" color="primary" :readonly="isMenuReadOnly"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-select v-model="form.parent"
                                                :items="menuService?.dataAllMenus?.value.data" item-title="menu"
                                                item-value="id" label="Seleccione un Menu al que pertenece"
                                                persistent-hint chips single-line
                                                :error-messages="getError(v$, 'parent')" @blur="v$.parent.$touch"
                                                @input="v$.parent.$touch" variant="outlined" density="comfortable"
                                                rounded="lg" color="primary" :readonly="isMenuReadOnly"
                                                clearable></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-select v-model="form.permission_id"
                                                :items="permissionService?.dataPermissionsForMenu?.value.data"
                                                item-title="name" item-value="id" label="Seleccione un Permiso"
                                                persistent-hint chips single-line
                                                :error-messages="getError(v$, 'permission_id')"
                                                @blur="v$.permission_id.$touch" @input="v$.permission_id.$touch"
                                                variant="outlined" density="comfortable" rounded="lg" color="primary"
                                                :readonly="isMenuReadOnly" clearable></v-select>
                                        </v-col>
                                    </v-row>
                                </v-card-text>

                                <v-card-actions v-if="!isMenuReadOnly">
                                    <v-spacer />
                                    <v-btn color="primary" variant="elevated" class="px-8 rounded-pill" type="submit"
                                        :disabled="menuService.loadingUpdateMenu.value">
                                        GUARDAR CAMBIOS
                                    </v-btn>
                                </v-card-actions>
                            </v-form>
                        </v-card>
                    </v-col>
                    <v-col v-if="form.id">
                        <v-tooltip v-if="permissions.includes('menu.eliminar')" location="top"
                            :text="form.status == '1' ? 'Desactivar' : 'Activar'">
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" :color="form.status == '1' ? 'error' : 'success'" block
                                    @click.prevent="handleStatusChange(form)"
                                    :disabled="menuService.loadingToggleMenu.value">
                                    {{ form.status == '1' ? 'Desactivar' : 'Activar' }}
                                </v-btn>
                            </template>
                        </v-tooltip>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>