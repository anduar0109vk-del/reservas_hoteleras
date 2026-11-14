# MANUAL TÉCNICO DE DESPLIEGUE, PRUEBAS Y DEVOPS
## Sistema de Gestión de Reservas Hoteleras – Casa Andina Chiclayo

**Curso:** Herramientas de Desarrollo – Sección 26333  
**Evaluación:** Avance de Proyecto Final 3 (Semana 15)  
**Autores:** Salas Bances Ángel Eduardo & Niño Falla Luis Gianfranco  

---

## 1. INTRODUCCIÓN Y ARQUITECTURA GENERAL

Este documento detalla los procedimientos técnicos para la instalación, compilación, ejecución de suites de pruebas automatizadas y despliegue del sistema tanto en entornos de desarrollo local como en infraestructura de producción contenerizada.

### Pila Tecnológica (Tech Stack)
- **Backend:** Java 25 (Temurin JDK), Spring Boot 3.5.16, Spring Security, JWT (jjwt 0.12.6), Spring Data JPA, Hibernate, iText7, Apache POI, Stripe SDK.
- **Frontend:** React 18, Vite 5, React Router DOM v6, TailwindCSS, Axios, Oxlint.
- **Base de Datos:** MySQL 8.4 LTS (Motor transaccional InnoDB, charset `utf8mb4`).
- **Proxy Inverso & Seguridad Web:** Caddy v2 (Gestión automática de certificados TLS/HTTPS, balanceo y compresión zstd/gzip).
- **Contenedores & Orquestación:** Docker Engine 26+, Docker Compose v2, Kubernetes (K8s) v1.30+.
- **Automatización CI/CD:** GitHub Actions, GitLab CI, Azure Pipelines, Jenkins.
- **Testing & QA:** JUnit 5, Mockito, Spring Test MockMvc, Selenium WebDriver Chrome Headless.

---

## 2. REQUISITOS PREVIOS DEL SISTEMA

| Herramienta | Versión Mínima | Propósito |
|---|---|---|
| **Git** | 2.40+ | Control de versiones y clonación |
| **Java JDK** | 21 o 25 (Eclipse Temurin recomendado) | Entorno de desarrollo backend |
| **Node.js y npm** | Node v20 LTS / npm 10+ | Entorno de desarrollo frontend |
| **Docker & Docker Compose** | Docker 24.0+ / Compose 2.20+ | Ejecución en contenedores |
| **Google Chrome / Chromium** | Última versión estable | Requerido para pruebas Selenium locales |

---

## 3. CONFIGURACIÓN DE VARIABLES DE ENTORNO

Antes de iniciar cualquier servicio, configure los archivos `.env` basándose en las plantillas provistas:

```bash
# 1. Copiar la plantilla de entorno de desarrollo
cp .env.example .env
```

### Contenido de `.env` para Entorno Local:
```properties
MYSQL_ROOT_PASSWORD=root_secure_password_2026
MYSQL_PASSWORD=reservas_db_pass_2026
JWT_SECRET=super_secret_jwt_key_with_at_least_256_bits_for_hmac_sha256_casa_andina_2026!
STRIPE_SECRET_KEY=sk_test_demo_key_hotel_casa_andina
FRONTEND_URL=http://localhost:5171
PORT=39000
PAYMENTS_DEMO_MODE=true
```

---

## 4. DESPLIEGUE CON DOCKER Y DOCKER COMPOSE

### 4.1. Entorno de Desarrollo (`docker-compose.yml`)
El archivo `docker-compose.yml` orquesta en una red puente (*bridge*) tres contenedores:
1. `mysql`: Base de datos MySQL 8.4 inicializada automáticamente con `database/reservas_hoteleras.sql`.
2. `backend`: API Spring Boot en puerto `39000`.
3. `frontend`: Aplicación web React en puerto `5171`.

#### Comandos de Ejecución:
```bash
# Construir imágenes y levantar en segundo plano
docker compose up -d --build

# Verificar estado de los contenedores
docker compose ps

# Visualizar logs en tiempo real
docker compose logs -f backend

# Detener los servicios
docker compose down
```

---

### 4.2. Entorno de Producción (`docker-compose.prod.yml`)
En producción se activa el reverse proxy **Caddy** para forzar HTTPS automático con TLS y servir la aplicación en los puertos estándar de Internet (`80` y `443`):

```bash
# Despliegue en producción con Caddy y persistencia segura
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

---

## 5. DESPLIEGUE EN CLÚSTER DE KUBERNETES (K8s)

Los manifiestos YAML se ubican en la carpeta `k8s/` y están organizados para un despliegue idempotente:

```bash
# 1. Crear el namespace
kubectl apply -f k8s/namespace.yaml

# 2. Desplegar los secretos y configuración
kubectl apply -k .

# 3. Verificar pods y servicios en ejecución
kubectl get pods -n reservas-hoteleras
kubectl get svc -n reservas-hoteleras
```

---

## 6. EJECUCIÓN DE PRUEBAS DE VERIFICACIÓN Y QA

### 6.1. Pruebas Unitarias y de Servicios (JUnit 5 + Mockito)
Ejecute la suite completa de pruebas unitarias mediante el Maven Wrapper:

```bash
# En sistemas Windows PowerShell:
.\mvnw.cmd test

# En Linux / macOS:
./mvnw test
```

#### Pruebas destacadas implementadas:
- `ServicioHabitacionServiceTests`: Verifica la regla de negocio que descuenta stock al solicitar un servicio a la habitación y asegura mediante `Mockito.verify` que no se persistan cambios si el stock es cero.
- `ReservaAccessControlTests`: Simula las llamadas a la API con identidades de `CLIENTE`, `RECEPCIONISTA`, `GERENTE` y `ADMIN`, validando que Spring Security bloquee con `HTTP 403 Forbidden` cualquier intento de violación de privilegios.
- `PagoDemoTests`: Valida que los pagos de prueba (Yape/Plin) generen comprobantes consistentes y asocien correctamente el ID de reserva.

---

### 6.2. Pruebas de Integración E2E en Navegador (Selenium WebDriver)
Para ejecutar la prueba funcional de inicio de sesión real en navegador:

```bash
# 1. Iniciar frontend y backend previamente, o usar el perfil maven 'selenium':
.\mvnw.cmd -B -Pselenium verify
```

El test `SeleniumLoginIT.java` realiza las siguientes comprobaciones automáticas:
1. Conecta con el WebDriver en modo Headless (`--headless=new`).
2. Abre la URL del aplicativo (`http://127.0.0.1:5171/login`).
3. Ingresa credenciales de prueba válidas.
4. Presiona el botón de envío y aguarda con `WebDriverWait` la redirección.
5. Verifica que la sesión almacena el token JWT y el perfil en el cliente.

---

## 7. MATRIZ DE INTEGRACIÓN CONTINUA (CI/CD)

El proyecto incluye 4 configuraciones de pipeline listas para producción:

| Plataforma | Archivo de Pipeline | Etapas (Stages) Automatizadas |
|---|---|---|
| **GitHub Actions** | `.github/workflows/ci.yml` | Backend Verify, Frontend Build/Lint, Docker Compose Build |
| **GitLab CI** | `.gitlab-ci.yml` | `test` (Maven), `build` (React), `browser-test` (Selenium + Chrome service), `containers` (Docker-in-Docker) |
| **Azure Pipelines**| `azure-pipelines.yml` | `Backend` (Temurin 25), `Frontend` (Node 20), `Selenium`, `Containers` |
| **Jenkins** | `Jenkinsfile` | Declarative Pipeline con publicación de reportes JUnit XML |

---

## 8. RESOLUCIÓN DE INCIDENCIAS FRECUENTES (TROUBLESHOOTING)

### A. Fallo de conexión a MySQL durante el inicio del Backend
- **Causa:** El contenedor de MySQL aún está inicializando el esquema `01-schema.sql`.
- **Solución:** Docker Compose cuenta con un `healthcheck` configurado. Si se ejecuta fuera de Docker, verifique que MySQL en XAMPP o local esté corriendo en el puerto 3306 y que la base de datos `reservas_hoteleras` exista.

### B. Error en build de Docker con Java 25
- **Causa:** Uso de etiquetas Maven inexistentes con JDK 25.
- **Solución:** El `Dockerfile` utiliza oficialmente `FROM eclipse-temurin:25-jdk` como etapa de compilación y ejecuta el Maven Wrapper incluido (`mvnw`), garantizando total compatibilidad y reproducibilidad.
