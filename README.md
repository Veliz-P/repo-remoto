- **Versión actual: v0.3 APP**
  
- **Descripción del proyecto:**
El presente proyecto trata de una aplicación web para una tienda en línea donde sus usuarios pueden visualizar un catálogo de productos
y ver los detalles de cada uno, la información de los productos se obtiene a través de una api y para usuarios administradores se 
encuentra disponible la opción de cambiar las imágenes de los productos los cuales se almacenarán en el servicio Storage de firebase.

- **Tecnologías utilizadas:**
  - **Backend:**
    - LARAVEL (PHP)
  - **Frontend:**
    - HTML
    - TAILWIND CSS (CDN)
    - JAVASCRIPT
    - Firebase (CDN)

- **Requisitos y pasos para ejecutar el sistema**
  - **Requisitos:**
    - Instalar MYSQL.
    - Instalar PHP.
    - Instalar Composer para gestión de dependencias de php.
    
  - **Pasos:**
    1. Clonar el repositorio-> git clone https://github.com/Veliz-P/repo-remoto.git
    2. Crear una base de datos de mysql y en el fichero **backend_catalogo/.env** agregar las credenciales correpondientes
         **Ejemplo:**
           DB_CONNECTION=mysql 
           DB_HOST=127.0.0.1
           DB_PORT=3306
           DB_DATABASE=catalogo_db
           DB_USERNAME=root
           DB_PASSWORD=12345678**Ejemplo
    4. Ingresar al directorio backend_catalogo-> cd backend_catalogo/
    5. Refrescar la base de datos-> php artisan migrate:fresh
    6. Ejecutar los seeder para agregar datos de prueba-> php artisan db:seed
    7. Ejecutar el servidor -> php artisan serve
    8. Abrir el archivo index.html en el navegador
    9. Iniciar sesión con email y contraseña (La cuenta de usuario de cliente y administrador se encuentra en
                           **backend_catalogo/database/seeders/UsuarioDireccionSeeder.php**)
    10. Probar el sistema (La funcionalidad para cambiar imagen solo para la cuenta de administrador)
     
