# CO-CHI PANEL v0.9.97 — CLAVES CLEARKEY VISIBLES EN EL EDITOR

- Base: v0.9.96 corregida.
- Corrige el editor de TV1/TV2 cuando un canal ya reproducía con ClearKey pero el campo `Claves ClearKey / MultiKey` aparecía vacío.
- Recupera y muestra las claves tanto del formato moderno `keys` como del formato histórico que podía guardarlas en `drm_license_url`.
- Mantiene compatibilidad con `playbackSources`: si la fuente activa no trae la copia de las keys pero el canal principal sí, el editor las muestra sin modificar la reproducción existente.
- Al actualizar el canal, las claves visibles se guardan en el formato moderno `keys`, quedando editables para futuras correcciones.
- No modifica la APK ni la lógica de reproducción de CO-CHI.
