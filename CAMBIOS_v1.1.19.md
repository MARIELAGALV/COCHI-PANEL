# CO-CHI PANEL v1.1.19 — Mover dispositivos entre clientes

Administración General (la ficha principal) puede corregir el cliente de un dispositivo desde **Dispositivos → Mover a otro cliente** o **Clientes → Editar → Códigos y dispositivos**. El formulario permite buscar por cliente o propietario y revisar capacidad y vencimiento antes de confirmar.

El traslado conserva el registro del equipo: ID, UID, código de activación, secreto, nombre, plataforma, estado de bloqueo, sesiones y fechas del demo. No requiere reinstalar ni activar nuevamente CO-CHI. No consume créditos, no reinicia demos y no cuenta como eliminación o reemplazo mensual. El cliente origen conserva su servicio, capacidad e historial comercial.

Si el destino es una cuenta habilitada, vacía, sin vencimiento ni historial comercial, conserva el vencimiento pago vigente del origen. Esta corrección administrativa queda registrada en auditoría y no vuelve a cobrar una activación. Si el destino ya tiene servicio, se usa su vencimiento y configuración, que se muestran antes de confirmar. No se cambia el servicio de otros clientes ni se activa una cuenta destino que ya tenga dispositivos o historial. Se rechazan los traslados que cortarían el servicio de un equipo activo o superarían la capacidad disponible. Un equipo bloqueado continúa bloqueado.

Los demos se reportan bajo el nuevo cliente sin cambiar su duración ni su historial de uso. Las sesiones existentes resuelven el cliente destino mediante el mismo dispositivo. Toda la modificación, incluida la auditoría, se realiza en una transacción SQLite; se revalidan permisos, cliente de origen, capacidad y vencimiento en el servidor. Los otros roles, incluidas las administraciones secundarias, reciben 403 aunque llamen a la API directamente. Los endpoints de vinculación originales siguen rechazando dispositivos de otro cliente.

API: `GET /api/admin/client-devices/:id/transfer` consulta destinos y condiciones. `POST` en la misma ruta recibe `sourceClientId`, `clientId` y, desde el panel, `serviceExpiresAt` para rechazar una confirmación con un vencimiento desactualizado.

Validación: `npm test` ejecuta las pruebas de registro y traslado contra el backend real, HTTP local y bases SQLite temporales. `npm run test:transfer` ejecuta solo los traslados.
