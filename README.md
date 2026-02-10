# 🚀 LaraBase-Panel | Modern Vue Dashboard Architecture

Este es el frontend oficial para el ecosistema **LaraBase-Starter**. Está construido con **Vue 3 (Composition API)**, **Vuetify 3** y **Vite**, siguiendo una arquitectura de separación de responsabilidades (SoC) para facilitar el escalamiento y mantenimiento.

---

## 🏗️ Estructura del Proyecto

```text
src/
├── assets/         # Recursos estáticos (Imágenes, SCSS global)
├── components/     # Componentes reutilizables
│   ├── Auth/       # Login, Registro, Recuperación
│   ├── Common/     # Inputs, Tablas, Modales genéricos
│   ├── Dashboard/  # Widgets y elementos del panel
│   └── Modules/    # Componentes específicos de cada módulo
├── composables/    # Lógica de negocio extraída
│   ├── logic/      # Lógica pura (Validaciones, flujos de UI, estados)
│   └── services/   # Comunicación directa con la API (Axios)
├── layouts/        # Estructuras visuales (MainLayout, AuthLayout)
├── router/         # Configuración de rutas y Middlewares (Guards)
├── stores/         # Gestión de estado global (Pinia)
├── utils/          # Funciones puras de ayuda (Toast, Formatters, Files)
└── views/          # Páginas de error y contenedores principales

🛠️ Arquitectura de Lógica (Composables)
Hemos dividido los composables en dos capas para desacoplar la interfaz de la comunicación con el servidor:

📡 1. Services Layer (composables/services)
Contiene la comunicación cruda con el backend.

Responsabilidad: Peticiones HTTP (GET, POST, PUT, DELETE) y manejo de estados de respuesta reactivos.

Ejemplo: useUserService.js solo sabe cómo pedir o enviar datos al endpoint /api/users.

🧠 2. Logic Layer (composables/logic)
Orquesta la experiencia de usuario y las reglas de negocio en el cliente.

Responsabilidad: Manejo de estados de carga (loading), gestión de errores de validación, disparar notificaciones (Toasts) y controlar el flujo de los formularios.

Ejemplo: useUserForm.js consume el servicio de usuario y gestiona el estado de los diálogos y validaciones.

🧩 Patrones de Diseño Utilizados
Helper Utils: Funciones puras como validateFileExtension o prepareFormData están centralizadas para evitar duplicidad de código.

Scoped Roles/Permissions: Sistema de protección de UI mediante propiedades computadas que reaccionan a los permisos del usuario (ej. canSeeMenu, isMenuReadOnly).

File Handling: Gestión avanzada de archivos con pre-validación de tamaño y extensión en el lado del cliente antes de subir al servidor.

🚦 Guía de Inicio Rápido
1. Clonar el repositorio
git clone [https://github.com/Jantonbernal/LaraBase-Panel.git](https://github.com/Jantonbernal/LaraBase-Panel.git)
cd LaraBase-Panel

2. Instalación de dependencias
npm install

3. Configuración de entorno
Copia el archivo de ejemplo y configura tu URL de API:
cp .env.example .env

Nota: Configura VITE_API_BASE_URL apuntando a tu instancia de LaraBase-Starter.

4. Modo desarrollo
npm run dev