# Casa Andina - Sistema de reservas hoteleras

Sistema web para administrar reservas hoteleras, huéspedes, habitaciones,
servicios, pagos, facturación y operaciones de recepción. La aplicación incluye
accesos por rol, seguimiento de reclamos, reportes descargables y un asistente
web para clientes con acceso directo a WhatsApp.

## Qué hace el proyecto

### Funcionalidades principales

- Autenticación mediante JWT.
- Acceso diferenciado para `ADMIN`, `GERENTE`, `RECEPCIONISTA` y `CLIENTE`.
- Consulta de habitaciones disponibles, tipos, precios y estados.
- Creación, consulta, confirmación y cancelación de reservas.
- Gestión del ciclo de recepción:
  - Check-in.
  - Check-out.
  - Liberación de la habitación al finalizar la estadía.
- Pagos asociados a reservas.
- Agregado de servicios a la habitación.
- Generación de comprobantes detallados en PDF:
  - Alojamiento.
  - Servicios.
  - Descuentos.
  - Importe neto.
  - IGV del 18 %.
  - Total con IGV.
- Paneles y dashboards para administración, gerencia y recepción.
- Reportes descargables en PDF, Excel y CSV.
- Libro de reclamaciones:
  - Registro y consulta para clientes.
  - Gestión de estados y respuestas para personal autorizado.
- Manual de usuario dentro del sistema.
- Tema claro/oscuro.
- Chatbot web exclusivo para clientes con respuestas sobre reservas,
  habitaciones, pagos, servicios, check-in, check-out y reclamos.
- Botón de contacto directo por WhatsApp al número configurado del hotel.

## Estructura del proyecto

```text
Proyectos/
├── .github/               # Workflows de GitHub Actions
├── database/              # Esquema y migraciones MySQL
├── frontend/              # Aplicación React + Vite
├── src/                   # API y pruebas Spring Boot
├── mvnw.cmd               # Maven Wrapper para Windows
└── README.md
```

## Requisitos del sistema

- Windows 10/11.
- Java JDK 25.
- Node.js 18 o superior y npm.
- Maven Wrapper incluido en el backend (`mvnw.cmd`).
- MySQL Server 8.0 o superior y MySQL Workbench.
- Base de datos MySQL llamada `reservas_hoteleras`.
- Navegador moderno: Chrome, Edge o Firefox.
- Puertos disponibles:
  - Frontend: `5171`.
  - Backend: `39000`.

## Instalación y configuración

### 1. Base de datos

1. Inicia el servicio de MySQL Server.
2. En MySQL Workbench, ejecuta `database/reservas_hoteleras.sql` para crear la
   base de datos `reservas_hoteleras`, sus tablas y los datos iniciales.
3. La conexión local predeterminada usa `localhost:3306` y el usuario `root`.
   Configura `DB_URL`, `DB_USERNAME` y `DB_PASSWORD` si tu instalación difiere.

La configuración de desarrollo espera:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reservas_hoteleras?useSSL=false&serverTimezone=America/Lima&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
```

Si tu instalación usa otra contraseña, configura el valor localmente. No
publiques contraseñas, claves JWT ni claves de Stripe en el repositorio.

### 2. Backend

Abre PowerShell en la raíz de este repositorio. Si MySQL requiere contraseña,
configúrala en la terminal sin guardarla en el repositorio:

```powershell
$env:DB_PASSWORD = "tu contraseña de MySQL"
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

La API quedará disponible en:

```text
http://localhost:39000
```

El backend utiliza `spring.jpa.hibernate.ddl-auto=validate`, por lo que las
tablas deben existir antes de iniciar la aplicación.

### 3. Frontend

En otra terminal:

```powershell
cd .\frontend
npm install
npm run dev
```

Abre:

```text
http://localhost:5171
```

El frontend usa el proxy de Vite para enviar las peticiones `/api` al backend
en `http://localhost:39000`.

## Uso por rol

### Cliente

Puede consultar habitaciones, crear y revisar sus reservas, pagar, agregar
servicios, descargar su comprobante, registrar reclamos y utilizar el chatbot
web. El chatbot aparece únicamente cuando el usuario tiene rol `CLIENTE`.

### Recepcionista

Puede consultar reservas, confirmar solicitudes, registrar check-in y
check-out, administrar operaciones de recepción y gestionar reclamos recibidos.

### Gerente

Puede supervisar reservas y recepción, consultar dashboards, revisar reportes,
gestionar promociones y dar seguimiento a reclamos.

### Administrador

Tiene acceso completo a usuarios, roles, habitaciones, promociones, servicios,
reservas, recepción, facturación, reclamos y reportes.

## Reportes y facturación

Desde el panel de administración se pueden descargar reportes de reservas en:

- PDF con diseño corporativo y logo Casa Andina.
- Excel con encabezados, filtros, bordes, filas alternadas y encabezado
  congelado.
- CSV compatible con Excel y codificación UTF-8.

Desde **Mis reservas**, el botón **Facturar** permite seleccionar boleta o
factura y descargar un PDF detallado. Para una factura se solicita RUC, razón
social y dirección.

## Chatbot y WhatsApp

El chatbot integrado en la web está disponible únicamente para clientes
autenticados. Sus respuestas son informativas y se basan en las funciones
actuales del sistema.

El botón **Hablar por WhatsApp** abre una conversación con el número del hotel
usando un mensaje inicial prellenado. Esta modalidad no utiliza la API oficial
de Meta ni automatiza mensajes entrantes; para eso sería necesario configurar
WhatsApp Cloud API y sus credenciales.

## Comandos de validación

Frontend:

```powershell
cd .\frontend
npm run build
```

Backend:

```powershell
.\mvnw.cmd test
```

## Estrategia de ramificación

El repositorio utiliza Git Flow simplificado:

| Rama | Propósito |
|---|---|
| `master` | Código estable listo para producción |
| `develop` | Integración de funcionalidades antes de publicar |
| `feature/nombre-funcionalidad` | Desarrollo de una funcionalidad específica |
| `hotfix/nombre-error` | Corrección urgente de errores en producción |

Las ramas `feature/` y `hotfix/` se crean solo cuando existe una tarea
concreta. No se mantienen ramas vacías en el repositorio.

## Flujo de trabajo

1. Crear una rama `feature/` desde `develop`:

   ```bash
   git switch develop
   git pull origin develop
   git switch -c feature/mejora-reservas
   ```

2. Realizar cambios pequeños y commits descriptivos, por ejemplo:

   ```text
   feat: mejorar el estilo del módulo de reservas
   ```

3. Ejecutar el build del frontend y las pruebas del backend.
4. Subir la rama al repositorio remoto:

   ```bash
   git push -u origin feature/mejora-reservas
   ```

5. Crear un Pull Request hacia `develop` y solicitar revisión de otro
   integrante.
6. Integrar el Pull Request en `develop` después de su aprobación.
7. Al finalizar la iteración, crear un Pull Request de `develop` hacia
   `master`.

No incluir credenciales, tokens, contraseñas, datos reales de huéspedes ni
claves de servicios externos en commits o Pull Requests.

## Licencia

No se ha definido una licencia open source para este proyecto. Antes de
redistribuirlo, agrega un archivo `LICENSE` con la licencia elegida.
