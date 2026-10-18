# Casa Andina - Sistema de reservas

Este proyecto es un sistema web para gestionar las reservas y algunas tareas
diarias de un hotel. Incluye una página para clientes y opciones de trabajo
para recepción, gerencia y administración.

## Funciones principales

- Registro e inicio de sesión según el tipo de usuario.
- Consulta de habitaciones y creación y seguimiento de reservas.
- Check-in, check-out y gestión de habitaciones.
- Pagos, servicios adicionales y comprobantes en PDF.
- Reportes en PDF, Excel y CSV.
- Registro y seguimiento de reclamos.
- Manual de usuario y chatbot para clientes.
- Cambio entre tema claro y oscuro.

## Tecnologías

- Backend: Java 25, Spring Boot y Maven.
- Frontend: React y Vite.
- Base de datos: MySQL 8.

MySQL Workbench sirve para conectarse y administrar la base de datos. El
servidor que debe estar instalado y en ejecución es MySQL Server; no se necesita
XAMPP.

## Requisitos

- Windows 10 u 11.
- JDK 25.
- Node.js 18 o una versión posterior.
- MySQL Server 8 y MySQL Workbench.

## Preparar la base de datos

1. Inicia el servicio de MySQL Server.
2. Para una instalación nueva, abre MySQL Workbench y ejecuta
   `database/reservas_hoteleras.sql`. El script crea la base
   `reservas_hoteleras` y carga datos de ejemplo.
3. La aplicación se conecta por defecto a `localhost:3306` con el usuario `root`.
   Si usas otros datos de conexión, configúralos mediante variables de entorno.

Si la base ya tiene información, no vuelvas a ejecutar el script completo:
podrías reemplazar o duplicar datos. Antes de hacer cambios, guarda una copia de
seguridad. La migración
`database/migrations/2026-10-01-add-service-stock.sql` es para bases antiguas
que todavía no tienen el campo de inventario de servicios. Revísala y ejecútala
una sola vez si corresponde. El stock inicial queda en cero y debe actualizarse
con las cantidades reales.

## Configuración local

En PowerShell, selecciona la instalación de Java que tengas. Cambia la ruta si
tu JDK está en otra carpeta:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-25.0.2"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
java -version
```

Configura la conexión a MySQL en la misma terminal. No guardes tu contraseña en
el repositorio:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "tu contraseña de MySQL"
```

Los pagos de prueba están desactivados inicialmente. Para probarlos en tu
computadora, puedes activarlos así:

```powershell
$env:PAYMENTS_DEMO_MODE = "true"
```

Este modo es solo para desarrollo; no procesa cobros reales y no debe activarse
en producción. No subas contraseñas, claves JWT ni claves de Stripe a GitHub.

## Ejecutar el sistema

Abre una terminal en la carpeta principal del repositorio y ejecuta el backend:

```powershell
.\mvnw.cmd spring-boot:run
```

La API quedará disponible en `http://localhost:39000`. El proyecto valida que
las tablas ya existan, así que prepara la base antes de iniciarlo.

En otra terminal, instala y ejecuta el frontend:

```powershell
cd .\frontend
npm ci
npm run dev
```

Abre `http://localhost:5171`. Las solicitudes a `/api` se envían al backend
local.

## Perfiles de usuario

- **Cliente:** consulta habitaciones, reserva, paga, solicita servicios y
  registra reclamos.
- **Recepcionista:** revisa reservas y registra el ingreso y salida de huéspedes.
- **Gerente:** consulta información de operación y reportes.
- **Administrador:** gestiona usuarios, habitaciones, servicios, promociones y
  otras opciones del sistema.

## Comprobaciones

Para construir el frontend:

```powershell
cd .\frontend
npm run lint
npm run build
```

Para ejecutar las pruebas del backend, desde la carpeta principal:

```powershell
.\mvnw.cmd test
```

## Organización del repositorio

```text
reservas-hoteleras/
├── database/       # Script inicial y migraciones de la base de datos
├── frontend/       # Aplicación React
├── src/            # API y pruebas con Spring Boot
├── mvnw.cmd        # Maven Wrapper para Windows
└── README.md
```

## Ramas

Se usan `develop` para integrar cambios y `master` para la versión estable. Las
ramas de trabajo pueden llamarse, por ejemplo,
`feature/mejora-reservas` o `hotfix/error-login`. Antes de integrar cambios,
conviene ejecutar las pruebas y revisar que no se hayan incluido datos privados.

## Licencia

El proyecto todavía no tiene una licencia open source definida.
