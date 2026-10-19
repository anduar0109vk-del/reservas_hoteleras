# Frontend de reservas hoteleras

Interfaz web de Casa Andina construida con React y Vite. Para preparar MySQL y
ejecutar también la API, consulta el [README principal](../README.md).

## Requisitos

- Node.js 18 o posterior y npm.
- API backend disponible en `http://localhost:39000` para las funciones que
  requieren datos.

## Instalar y ejecutar

Desde esta carpeta, instala las dependencias y arranca el servidor de
desarrollo:

```powershell
npm ci
npm run dev
```

Vite sirve la aplicación en `http://localhost:5171`. Las peticiones bajo
`/api` se reenvían al backend local en `http://localhost:39000`.

## Comprobaciones

```powershell
npm run lint
npm run build
```

El lint es de solo lectura; las advertencias que informa no modifican archivos.
