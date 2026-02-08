const NotFound = () => import('@/views/Error.vue')
const Login = () => import('@/components/Auth/Login.vue');
const VerifyEmail = () => import('@/components/Auth/VerifyEmail.vue');
const ConfirmationCode = () => import('@/components/Auth/ConfirmationCode.vue');
const ResetPassword = () => import('@/components/Auth/ResetPassword.vue');
const Dashboard = () => import('@/layouts/DefaultLayout.vue');
const LogIndex = () => import('@/components/Modules/log/pages/Index.vue');
const PermissionIndex = () => import('@/components/Modules/permission/pages/Index.vue');
const RoleIndex = () => import('@/components/Modules/role/pages/Index.vue');
const UserIndex = () => import('@/components/Modules/user/pages/Index.vue');
const UserCreate = () => import('@/components/Modules/user/pages/Create.vue');
const UserEdit = () => import('@/components/Modules/user/pages/Edit.vue');
const MenuIndex = () => import('@/components/Modules/menu/pages/Index.vue');
const CompanyCreateOrUpdate = () => import('@/components/Modules/company/createOrUpdate.vue');

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/forgot-password',
        name: 'forgot',
        component: VerifyEmail,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/confirmation-code',
        name: 'ConfirmationCode',
        component: ConfirmationCode,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: ResetPassword,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/dashboard',
        name: 'Home',
        component: Dashboard,
        meta: {
            title: 'Dashboard',
            requiresAuth: true
        },
        children: [
            {
                path: '/dashboard/log',
                name: 'log.listar',
                component: LogIndex,
                meta: {
                    title: 'Logs',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/permiso',
                name: 'permiso.listar',
                component: PermissionIndex,
                meta: {
                    title: 'Permisos',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/rol',
                name: 'rol.listar',
                component: RoleIndex,
                meta: {
                    title: 'Roles',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/usuario',
                name: 'usuario.listar',
                component: UserIndex,
                meta: {
                    title: 'Usuarios',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/usuario/crear',
                name: 'usuario.crear',
                component: UserCreate,
                meta: {
                    title: 'Crear Usuario',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/usuario/:id',
                name: 'usuario.editar',
                component: UserEdit,
                meta: {
                    title: 'Editar Usuario',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/compania',
                name: 'compania.listar',
                component: CompanyCreateOrUpdate,
                meta: {
                    title: 'Compañia',
                    requiresAuth: true,
                },
            },
            {
                path: '/dashboard/menu',
                name: 'menu.listar',
                component: MenuIndex,
                meta: {
                    title: 'Menus',
                    requiresAuth: true,
                },
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound,
        meta: {
            requiresAuth: false
        }
    },
]

export default routes