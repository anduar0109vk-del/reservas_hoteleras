# GUÍA DE DESPLIEGUE EN VERCEL, RENDER Y MYSQL
## Frontend en Vercel + Backend en Render + Base de Datos MySQL en la Nube
### Proyecto: Sistema de Gestión de Reservas Hoteleras – Casa Andina Chiclayo

Los niveles gratuitos tienen límites que pueden cambiar y no garantizan disponibilidad continua. Vercel Hobby es para proyectos personales/no comerciales; para uso real de un hotel, revisa los términos actuales antes de publicar.

Al finalizar, obtendrás:
1. **Frontend en vivo:** `https://tu-proyecto.vercel.app` (Certificado SSL/HTTPS automático).
2. **Backend en vivo:** `https://tu-backend.onrender.com` (Ejecutando Java 25 en contenedor Docker).
3. **Base de Datos en la Nube:** MySQL gestionado accesible por el backend.

---

## RESUMEN DE LA ARQUITECTURA CLOUD GRATUITA

```
  [ Huésped / Evaluador / Docente ]
                  │
                  ▼
         (HTTPS / CDN Global)
      ┌───────────────────────┐
      │     VERCEL (Free)     │
      │   React 18 + Vite     │
      └───────────┬───────────┘
                  │ (Peticiones REST /api)
                  ▼
      ┌───────────────────────┐
      │     RENDER (Free)     │
      │   Docker Container    │
      │  Spring Boot 3.5.16   │
      │     JDK Temurin 25    │
      └───────────┬───────────┘
                  │ (JDBC SSL)
                  ▼
      ┌───────────────────────┐
      │  TiDB CLOUD / AIVEN   │
      │  MySQL 8.4 Serverless │
      │      (Free Tier)      │
      └───────────────────────┘
```

---

## PASO 1: BASE DE DATOS MYSQL

Recomendamos **TiDB Cloud (Serverless)** o **Aiven**, que ofrecen MySQL gratuito para siempre sin solicitar tarjeta.

### Opción Recomendada: TiDB Cloud Serverless
1. Ingresa a [https://tidbcloud.com](https://tidbcloud.com) y crea tu cuenta gratuita (puedes iniciar sesión directo con tu cuenta de **GitHub**).
2. En el panel principal, haz clic en **"Create Cluster"** y selecciona el plan **Serverless (Free $0)**.
3. Elige la región más cercana (ej. `us-east-1` o `us-west-2`) y asigna el nombre: `reservas-hoteleras`.
4. Haz clic en **"Create"**.
5. En la ventana emergente verás tus credenciales de conexión:
   - **Host:** (Ejemplo: `gateway01.us-east-1.prod.aws.tidbcloud.com`)
   - **Port:** `4000`
   - **User:** (Ejemplo: `xxxxxx.root`)
   - **Password:** (Copia la contraseña generada)
6. En la pestaña **"SQL Editor"** de TiDB Cloud:
   - Abre el archivo `database/reservas_hoteleras.sql` de tu proyecto.
   - Copia y pega el contenido en el editor web de TiDB y presiona **"Run"**.
   - ¡Listo! Tus 17 tablas y datos iniciales de Casa Andina ya están en la nube.

---

## PASO 2: DESPLIEGUE DEL BACKEND EN RENDER (3 MINUTOS)

**Render** ofrece un plan gratuito que permite construir y ejecutar imágenes de **Docker** directamente desde tu repositorio de GitHub, permitiendo correr **Java 25** sin ninguna limitación.

1. Ingresa a [https://render.com](https://render.com) e inicia sesión con tu cuenta de **GitHub**.
2. En el panel de control, haz clic en **"New +"** y selecciona **"Web Service"**.
3. Selecciona tu repositorio: `anduar0109vk-del/reservas_hoteleras`.
4. Configura los siguientes campos:
   - **Name:** `reservas-hoteleras-backend`
   - **Region:** `Oregon (US West)` o `Ohio (US East)`
   - **Branch:** `master`
   - **Root Directory:** *(Déjalo en blanco)*
   - **Runtime:** Selecciona **Docker**
   - **Instance Type:** Selecciona **Free ($0/month)**
5. Desplázate hacia abajo hasta la sección **"Environment Variables"** y agrega:

| Key | Value |
|---|---|
| `PORT` | `10000` |
| `DB_URL` | `jdbc:mysql://<TU-HOST-TIDB>:<PUERTO>/reservas_hoteleras?useSSL=true` |
| `DB_USERNAME` | `<TU-USUARIO-TIDB>` |
| `DB_PASSWORD` | `<TU-CONTRASENA-TIDB>` |
| `JWT_SECRET` | `super_clave_secreta_jwt_para_produccion_casa_andina_2026_segura!` |
| `PAYMENTS_DEMO_MODE` | `true` |
| `SPRING_JPA_SHOW_SQL` | `false` |
| `FRONTEND_URL` | `*` |

6. Haz clic en **"Deploy Web Service"**.
7. Render comenzará a construir el contenedor con Maven y Temurin 25. En unos 3-4 minutos verás el mensaje `Tomcat started on port 10000` y el estado cambiará a **Live** (en verde).
8. Copia la URL que te asigna Render, por ejemplo:
   `https://reservas-hoteleras-backend.onrender.com`

---

## PASO 3: DESPLIEGUE DEL FRONTEND EN VERCEL (2 MINUTOS)

1. Ingresa a [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de **GitHub**.
2. En el Dashboard, haz clic en **"Add New..."** -> **"Project"**.
3. Busca tu repositorio `reservas_hoteleras` y haz clic en **"Import"**.
4. En la pantalla de configuración:
   - **Framework Preset:** Selecciona `Vite`.
   - **Root Directory:** Haz clic en **"Edit"** y selecciona la carpeta **`frontend`** (¡este paso es muy importante!).
5. Despliega la pestaña **"Environment Variables"** y añade:
   - **NAME:** `VITE_API_BASE_URL`
   - **VALUE:** `https://reservas-hoteleras-backend.onrender.com/api`  *(Usa la URL de Render del Paso 2)*
6. Haz clic en **"Deploy"**.
7. En aproximadamente 30 segundos, Vercel finalizará la compilación y te mostrará una pantalla de felicitación con confeti y el enlace público de tu aplicación:
   `https://reservas-hoteleras.vercel.app`

---

## PASO 4: VERIFICACIÓN FINAL

1. Abre el enlace de Vercel en tu navegador o teléfono celular.
2. Inicia sesión con cualquiera de las cuentas demo:
   - **Administrador:** `admin.demo@casaandina.test` (Contraseña: `admin123`)
   - **Recepcionista:** `recepcion.demo@casaandina.test` (Contraseña: `recepcion123`)
   - **Cliente:** `cliente.demo@casaandina.test` (Contraseña: `cliente123`)
3. Verifica las funcionalidades principales:
   - Explorar catálogo de habitaciones disponibles.
   - Crear una reserva y realizar pago demostrativo.
   - En recepción: realizar check-in con firma digital y check-out.
   - Descargar boleta/factura en PDF corporativo.
   - Consultar dashboard e informes en Excel/CSV.

---

## ENLACES PARA EL INFORME FINAL (APF3) Y SUSTENTACIÓN

Una vez realizado el despliegue, agrega los enlaces en la portada y conclusiones de tu informe:

- **Frontend en Producción:** `https://reservas-hoteleras.vercel.app`
- **API Backend en Producción:** `https://<tu-backend>.onrender.com/api`
- **Repositorio GitHub:** `https://github.com/anduar0109vk-del/reservas_hoteleras`

## Correcciones para el despliegue actual

- MySQL Workbench es el cliente; la captura indica que el servidor está en Railway (`viaduct.proxy.rlwy.net:37427`). Usa las credenciales que ya tienes en Workbench/Railway. Si el esquema ya está importado, no ejecutes otra vez el SQL completo.
- El proyecto Vercel existente ya está enlazado a `frontend/` del repositorio y al branch `master`. No es necesario crear otro proyecto.
- La variable Vercel `VITE_API_BASE_URL` ya está guardada en Production con `https://reservas-hoteleras-backend.onrender.com/api`. Si Render asignó otro hostname, actualiza la variable antes de desplegar.
- En Render, configura `DB_URL` como `jdbc:mysql://<HOST>:<PUERTO>/reservas_hoteleras?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true`, más `DB_USERNAME` y `DB_PASSWORD` con los valores existentes en Railway. Genera `JWT_SECRET` desde Render y configura `FRONTEND_URL=https://reservas-hoteleras.vercel.app`.
- Los planes gratuitos tienen límites, pueden suspender servicios inactivos y sus condiciones cambian. Vercel Hobby es para uso personal/no comercial; verifica los términos vigentes antes de usar este despliegue para operar un hotel.
