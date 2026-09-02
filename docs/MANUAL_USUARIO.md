# Manual de usuario: reservas y libro de reclamaciones

## Acceso

1. Abra el frontend y seleccione **Iniciar sesión**.
2. Ingrese el correo y contraseña asignados. El menú se adapta automáticamente al rol.
3. Use **Cerrar sesión** al terminar, especialmente en equipos compartidos.

## Libro de reclamaciones (todos los roles)

Seleccione **📖 Reclamos** en la barra superior. Complete nombres, documento, correo,
tipo (RECLAMO o QUEJA), detalle y, opcionalmente, teléfono y pedido. El detalle debe
explicar hechos y fechas concretas; no incluya contraseñas ni datos de tarjetas.
Al registrar se genera un número `REC-...`; consérvelo para seguimiento. Los estados
son **PENDIENTE**, **EN_PROCESO** y **RESUELTO**.

## CLIENTE

Puede registrar reclamos y consultar únicamente sus propios registros en **Mis
reclamos**. Revise número, fecha, detalle, estado y la respuesta del hotel. No puede
ver reclamos de otros clientes ni modificar estados.

## RECEPCIONISTA

Además de registrar reclamos en nombre de un cliente (indicando su **Cliente ID**),
vea **Reclamos recibidos**. Para iniciar la atención, cambie el estado a
**EN_PROCESO**; para cerrar, seleccione **RESUELTO** y escriba una respuesta clara.
El cambio queda asociado a su usuario y fecha de respuesta.

## GERENTE

Tiene las mismas funciones operativas de recepción y puede revisar todos los
reclamos para supervisar tiempos de atención. Valide que la respuesta sea completa
antes de marcar un caso como resuelto y use los reportes de gerencia para detectar
problemas recurrentes.

## ADMIN

Puede registrar, consultar y actualizar cualquier reclamo, además de administrar
usuarios, habitaciones, servicios, promociones y reportes. Debe revisar que cada
usuario tenga el rol mínimo necesario y que el acceso al libro se mantenga
autenticado.

## Reglas de atención

- Todo reclamo debe conservar su número y trazabilidad; no se elimina desde la
  interfaz.
- Un reclamo resuelto puede volver a `EN_PROCESO` si el cliente responde por otro
  canal; agregue la nueva explicación en la respuesta.
- Si aparece un error de sesión, vuelva a iniciar sesión. Si persiste, contacte al
  administrador y proporcione el número del reclamo, nunca la contraseña.
