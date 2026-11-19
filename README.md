# Casa Andina - Sistema de Gestión de Reservas de un Hotel

Sistema web integral para administrar reservas hoteleras, huéspedes, habitaciones, servicios, pagos, facturación y operaciones de recepción en el Hotel Casa Andina – Sede Chiclayo.

## Características Principales

- **Autenticación y Autorización:** Seguridad JWT con roles `ADMIN`, `GERENTE`, `RECEPCIONISTA` y `CLIENTE`.
- **Motor de Reservas:** Consulta de disponibilidad en tiempo real, catálogo de habitaciones y prevención de overbooking.
- **Ciclo de Recepción:** Check-in con captura de firma digital en pantalla, check-out y liquidación de consumos adicionales.
- **Pagos y Facturación:** Soporte de pasarela Stripe, billeteras móviles demostrativas (Yape/Plin) y generación de Boletas/Facturas en PDF con IGV (18%).
- **Reportería y Auditoría:** Descarga de reportes en PDF corporativo, Microsoft Excel y CSV.
- **Atención al Cliente:** Chatbot interactivo integrado y Libro de Reclamaciones digital normativo.
- **Diseño Moderno:** SPA en React 18 con Vite, TailwindCSS y soporte de tema claro/oscuro.

## Estructura del Proyecto

```text
reservas-hoteleras/
├── .github/workflows/     # Pipelines de GitHub Actions (CI/CD y Release)
├── database/              # Esquema SQL y migraciones
├── deploy/                # Configuraciones de proxy inverso Caddy
├── docs/                  # Informes académicos (APF3) y guías de despliegue
├── frontend/              # Aplicación web React 18 + Vite
├── k8s/                   # Manifiestos para despliegue en Kubernetes
├── src/                   # Backend Java 25 con Spring Boot 3.5.16
├── Dockerfile             # Dockerfile multi-stage (Temurin 25 JDK/JRE)
├── docker-compose.yml     # Orquestación de desarrollo (MySQL + Backend + Frontend)
├── docker-compose.prod.yml# Orquestación de producción (MySQL + Backend + Caddy TLS)
├── render.yaml            # Blueprint de despliegue gratuito en Render
└── pom.xml                # Configuración Maven y dependencias
```

## Requisitos de Entorno Local

- Windows 10/11, Linux o macOS.
- Java JDK 21 o 25 (Eclipse Temurin recomendado).
- Node.js 20 LTS o superior y npm.
- MySQL Server 8.0 / 8.4.
- Docker & Docker Compose (opcional para ejecución en contenedores).

## Despliegue Rápido con Docker Compose

```powershell
# Levantar el entorno completo (MySQL + Backend + Frontend):
docker compose up -d --build
```

- Frontend disponible en: `http://localhost:5171`
- Backend disponible en: `http://localhost:39000`

## Despliegue en la Nube (Gratis)

Consulta la guía detallada paso a paso en [docs/GUIA_DESPLIEGUE_GRATIS_VERCEL_RENDER.md](docs/GUIA_DESPLIEGUE_GRATIS_VERCEL_RENDER.md).
