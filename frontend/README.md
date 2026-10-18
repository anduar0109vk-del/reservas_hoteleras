# Frontend de reservas hoteleras

Aplicación web desarrollada con React y Vite. Para instalar el sistema completo,
configurar MySQL Server y ejecutar el backend, sigue las instrucciones del
[README principal](../README.md).

Desde la raíz del repositorio:

```powershell
cd .\frontend
npm ci
npm run dev
```

Vite inicia en `http://localhost:5171` y envía las solicitudes `/api` al backend
local en `http://localhost:39000`.

Para verificar el frontend:

```powershell
npm run build
npx oxlint src
```
