import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore('modal', () => {
    // TopBar
    const isModalRolesVisible = ref(false);

    // Role
    const isModalRoleViewVisible = ref(false);
    const isModalRoleStoreVisible = ref(false);
    const isModalRoleUpdateVisible = ref(false);
    // Id del rol seleccionado
    const roleId = ref(null)

    // Permission
    const isModalPermissionStoreVisible = ref(false);
    const isModalPermissionUpdateVisible = ref(false);
    // Id del rol seleccionado
    const permissionId = ref(null)

    // User
    const isModalUserViewVisible = ref(false);
    const isModalUserAssignPermissionsVisible = ref(false)
    // Id del user seleccionado
    const userId = ref(null)

    const changeModal = (name, value) => {
        switch (name) {
            case 'role.select':
                isModalRolesVisible.value = value;
                break;
            case 'role.view':
                isModalRoleViewVisible.value = value;
                break;
            case 'role.store':
                isModalRoleStoreVisible.value = value;
                break;
            case 'role.update':
                isModalRoleUpdateVisible.value = value;
                break;
            case 'permission.store':
                isModalPermissionStoreVisible.value = value;
                break;
            case 'permission.update':
                isModalPermissionUpdateVisible.value = value;
                break;
            case 'user.view':
                isModalUserViewVisible.value = value;
                break;
            case 'user.assign':
                isModalUserAssignPermissionsVisible.value = value;
                break;
        }
    }

    return {
        changeModal, // Método para cambiar el estado del modal
        isModalRolesVisible, // Estado del modal de roles
        // Role
        isModalRoleViewVisible, // Estado del modal de ver rol
        isModalRoleStoreVisible, // Estado del modal de crear rol
        isModalRoleUpdateVisible, // Estado del modal de actualizar rol
        roleId, // ID del rol seleccionado
        // Permission
        isModalPermissionStoreVisible, // Estado del modal para crear permiso
        isModalPermissionUpdateVisible,
        permissionId,
        // User
        isModalUserViewVisible,
        isModalUserAssignPermissionsVisible,
        userId,
    }
});