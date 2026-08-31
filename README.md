# AudiSoft - Sistema de Gestión Académica

AudiSoft es una plataforma web desarrollada en Angular diseñada como prueba tecnica para la administración académica. Permite la gestión centralizada de estudiantes, profesores y calificaciones, proporcionando una interfaz intuitiva y eficiente para el entorno educativo.

## Características Principales

*   **Panel de Control (Dashboard):** Visualización general del estado del sistema.
*   **Gestión de Estudiantes:** Registro, actualización y consulta de información de alumnos.
*   **Gestión de Profesores:** Administración del cuerpo docente.
*   **Control de Notas:** Registro y seguimiento de calificaciones académicas.
*   **Sistema de Autenticación:** Acceso seguro para los usuarios.
*   **Notificaciones:** Sistema de alertas (toast) para retroalimentación en tiempo real.

---

## Configuración del Entorno

Antes de iniciar la aplicación, es necesario configurar la conexión con el Backend. Esto se realiza en el archivo de entorno.

### Conexión al Backend

Dirígete a `src/environments/environment.ts` y ajusta las siguientes constantes según la configuración de tu servidor:

```typescript
export const environment = {
  production: false,
  apiProtocol: 'https', // Protocolo (http o https)
  apiHost: 'localhost', // Host del servidor backend
  apiPort: '7298',      // Puerto del servidor backend
  
  get apiUrl() {
    return `${this.apiProtocol}://${this.apiHost}:${this.apiPort}/api`;
  }
};
```

---

## Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

### 1. Requisitos Previos

Asegúrate de tener instalados:
*   [Node.js](https://nodejs.org/) (versión LTS recomendada)
*   [Angular CLI](https://angular.dev/tools/cli) (`npm install -g @angular/cli`)

### 2. Instalación de Dependencias

Clona el repositorio y ejecuta el siguiente comando en la raíz del proyecto para instalar todas las librerías necesarias:

```bash
npm install
```

### 3. Ejecución del Servidor de Desarrollo

Una vez instaladas las dependencias, inicia el servidor local con:

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si realizas cambios en los archivos fuente.

---

## Otros Comandos Útiles

*   **Compilación (Build):** Para generar los archivos de producción en la carpeta `dist/`:
    ```bash
    ng build
    ```
*   **Pruebas Unitarias:** Para ejecutar las pruebas mediante Karma:
    ```bash
    ng test
    ```
*   **Generación de Componentes:**
    ```bash
    ng generate component nombre-del-componente
    ```

---
*Este proyecto fue generado con Angular CLI version 18.2.21.*

