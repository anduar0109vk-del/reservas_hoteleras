# Seguimiento y Control: Indicadores y Medidas Correctivas

Proyecto: **Casa Andina – Sistema de Gestión de Reservas de un Hotel**

## 1. Objetivo

Supervisar el avance del desarrollo, la calidad de las entregas y la estabilidad de los procesos de Integración Continua (CI) y Entrega Continua (CD). Los indicadores de esta guía son metas propuestas; deben actualizarse con datos reales de GitHub Issues y GitHub Actions.

## 2. Indicadores de seguimiento (KPIs)

| Indicador | Cálculo o método | Meta propuesta | Frecuencia | Fuente |
|---|---|---:|---|---|
| Cumplimiento de tareas | (Tareas terminadas / tareas planificadas) × 100 | ≥ 90 % por etapa | Semanal | GitHub Issues / tablero |
| Issues resueltos | (Issues cerrados / total de Issues del periodo) × 100 | ≥ 80 % por etapa | Semanal | GitHub Issues |
| Éxito de CI | (Ejecuciones exitosas / ejecuciones completadas) × 100 | ≥ 90 % | Semanal | GitHub Actions |
| Compilación de release | Backend y frontend compilan correctamente | 100 % antes de publicar | Por release | GitHub Actions |
| Tiempo de resolución | Promedio de tiempo entre apertura y cierre de los Issues | ≤ 3 días hábiles para incidencias normales | Semanal | GitHub Issues |
| Verificación previa a release | (Comprobaciones críticas aprobadas / comprobaciones críticas ejecutadas) × 100 | 100 % | Por release | Lista de pruebas |

**Nota:** las metas son objetivos iniciales, no resultados medidos. No se deben presentar como resultados reales hasta consultar las ejecuciones y los Issues del repositorio.

## 3. Seguimiento operativo

1. Revisar semanalmente los Issues abiertos, cerrados, prioridades y responsables.
2. Consultar en GitHub Actions el resultado de los trabajos del backend y frontend después de los cambios.
3. Registrar fallos con el enlace a la ejecución, mensaje de error, commit y pasos para reproducirlos.
4. Antes de publicar una versión, verificar compilación, configuración, pruebas disponibles y artefactos generados.
5. Actualizar este seguimiento con los datos observados; no asumir que una configuración de workflow equivale a una ejecución exitosa.

## 4. Medidas correctivas

| Desviación detectada | Medida correctiva | Responsable sugerido | Criterio de cierre |
|---|---|---|---|
| Una ejecución de CI falla | Abrir o actualizar un Issue con el enlace a los logs; corregir el error y volver a ejecutar CI | Desarrollador asignado | La ejecución termina correctamente |
| Backend o frontend no compila | Revisar versión de Java/Node, dependencias, comandos Maven/npm y errores de compilación | Responsable técnico | Ambos trabajos de compilación pasan |
| Issue supera el plazo objetivo | Revisar bloqueo, dividir la tarea si es demasiado grande y reasignar prioridad o responsable | Líder del proyecto | Hay plan y fecha de resolución, y se cierra al verificar |
| Pago no confirmado correctamente | Validar el estado real del proveedor de pagos en el backend antes de confirmar la reserva | Desarrollador backend | Pruebas de pago aprobado, rechazado y pendiente superadas |
| Riesgo de exposición de contraseñas | Usar un algoritmo de hash adecuado, eliminar logs sensibles y revisar autenticación | Desarrollador backend | No se registran contraseñas en logs y las pruebas de autenticación pasan |
| Diferencias en el total o IGV | Definir una única regla de cálculo y contrastar backend, interfaz y comprobante | Desarrollador asignado | Los importes coinciden en los casos de prueba |
| Release no se publica | Revisar logs, permisos del token, etiqueta y existencia de un release previo; corregir y volver a ejecutar | Responsable de release | Release y artefactos se encuentran publicados y verificables |

## 5. Flujo de control

1. **Detectar:** identificar la desviación mediante GitHub Actions, pruebas o revisión de Issues.
2. **Registrar:** documentar el problema, evidencia, impacto y prioridad.
3. **Priorizar:** atender primero fallos de seguridad, pagos o bloqueos de publicación.
4. **Corregir:** implementar la solución en una rama de trabajo y revisarla antes de integrarla.
5. **Verificar:** volver a ejecutar las comprobaciones y probar el caso que falló.
6. **Cerrar:** cerrar el Issue solo cuando exista evidencia de que la corrección funciona.
7. **Prevenir:** documentar la causa y añadir una prueba o validación para reducir la recurrencia.

## 6. Fuentes para revisar el estado

- [Issues del proyecto](https://github.com/anduar0109vk-del/reservas_hoteleras/issues)
- [Ejecuciones de GitHub Actions](https://github.com/anduar0109vk-del/reservas_hoteleras/actions)
- [Releases del proyecto](https://github.com/anduar0109vk-del/reservas_hoteleras/releases)

## 7. Criterio de aceptación

El seguimiento se considera realizado cuando se han revisado los indicadores con datos reales, las desviaciones tienen un Issue o registro trazable, cada medida correctiva tiene responsable y criterio de cierre, y las correcciones se verifican antes de cerrar la incidencia o publicar una versión.
