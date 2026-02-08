🚀 LaraBase-Panel | Modern Vue Dashboard Architecture
Este es el frontend oficial para el ecosistema LaraBase-Starter. Está construido con Vue 3 (Composition API), Vuetify 3 y Vite, siguiendo una arquitectura de separación de responsabilidades (SoC) para facilitar el escalamiento y mantenimiento.

🏗️ Estructura del Proyecto

src/
├── assets/             # Recursos estáticos (Imágenes, SCSS global)
├── components/         # Componentes reutilizables
│   ├── auth/           # Login, Registro, Recuperación
│   ├── common/         # Inputs, Tablas, Modales genéricos
│   ├── dashboard/      # Widgets y elementos del panel
│   └── modules/        # Componentes específicos de cada módulo
├── composables/        # Lógica de negocio extraída
│   ├── logic/          # Lógica pura (Validaciones, cálculos, estados)
│   └── services/       # Comunicación directa con la API (Axios)
├── layouts/            # Estructuras visuales (MainLayout, AuthLayout)
├── router/             # Configuración de rutas y Middlewares (Guards)
├── stores/             # Gestión de estado global (Pinia)
├── utils/              # Funciones puras de ayuda (Toast, Formatters, Files)
└── views/              # Páginas de error y contenedores principales

🛠️ Arquitectura de Lógica (Composables)
Hemos dividido los composables en dos capas para desacoplar la interfaz de la comunicación:

📡 1. Services Layer (composables/services)
Contiene la comunicación cruda con el backend.

Responsabilidad: Peticiones HTTP (GET, POST, PUT, DELETE).

Ejemplo: useUserService.js solo sabe cómo pedir o enviar datos a /api/users.

🧠 2. Logic Layer (composables/logic)
Orquesta la experiencia de usuario.

Responsabilidad: Manejo de estados de carga (loading), gestión de errores de validación, disparar Toasts y controlar el flujo del formulario.

Ejemplo: useValidationUtils.js contiene todas las validaciones de formulario para ser servidas en los componentes.

🧩 Patrones de Diseño Utilizados
Helper Utils: Funciones puras como validateFileExtension o prepareFormData están centralizadas para evitar duplicidad de código.

Scoped Roles/Permissions: Sistema de protección de UI mediante propiedades computadas que reaccionan a los permisos del usuario (ej. canSeeMenu, isMenuReadOnly).

File Handling: Gestión avanzada de archivos con pre-validación de tamaño y extensión en el lado del cliente antes de subir al servidor.

🚦 Guía de Inicio Rápido

1. Instalación:
npm install

2. Configuración: Copia el archivo .env.example a .env y configura tu VITE_API_BASE_URL apuntando a tu instancia de LaraBase-Starter.

3. Desarrollo:
npm run dev

✨ Estilo y UI
Vuetify 3.11: Implementación de componentes modernos con variantes outlined y rounded-lg.

Responsive Design: Optimizado para pantallas móviles y escritorio usando el sistema de rejilla de Vuetify.