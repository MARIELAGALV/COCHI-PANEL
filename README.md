# CO-CHI PANEL v0.6.1 — control administrativo de demos

Esta versión agrega controles exclusivos de **ADMINISTRACIÓN**:

- **10 MIN**: reduce un demo activo para que termine como máximo dentro de 10 minutos; nunca extiende uno que ya tenga menos tiempo.
- **CORTAR**: finaliza un demo individual inmediatamente.
- **CORTAR TODOS LOS DEMOS ACTIVOS**: finaliza de una vez todos los demos activos, sin afectar clientes con servicio pago.
- Cortar o reducir un demo **no borra el historial**: el dispositivo continúa marcado como que ya utilizó su único demo.
- Al cortar o reducir, se revocan las sesiones de cliente asociadas para acelerar el bloqueo.

Para que el corte global llegue a una reproducción que ya está abierta, usar CO-CHI Android **v0.23.2 o posterior**, que revalida el acceso con el backend durante la reproducción.

---

# Base funcional heredada de v0.6.0 — Backend central + PANEL web/PWA

Esta versión reúne el PANEL y la API que usa CO-CHI Android.

## Funciones centrales
- Fichas PANEL separadas de clientes finales.
- Créditos, promociones y vencimientos. Límite de dispositivos por cliente definido exclusivamente por ADMINISTRACIÓN (1 a 99; valor inicial 2).
- Registro real de códigos de dispositivos Android.
- Demos de 1 hora por dispositivo con control global de Administración.
- PIN Adultos administrado desde PANEL.
- Fuentes TV1, TV2, Películas y Series configurables desde Administración.
- PANEL responsive para PC, celular y tablet.
- Manifest/PWA para agregar CO-CHI PANEL a la pantalla de inicio del celular.

## Modo local
Ejecutar `INICIAR_PANEL.bat` y abrir `http://localhost:8787`.

## Modo online
Ver `DEPLOY_ONLINE.md`. El servidor debe quedar detrás de HTTPS y con una carpeta persistente para la base de datos.

## Base de datos
Por defecto: `data/cochi-panel.db`.
En servidor online se puede cambiar con `COCHI_DATA_DIR`.

## Android
CO-CHI Android v0.23.2 se conecta a este backend usando la URL definida en `COCHI_BACKEND_URL`.

## v0.9.10 - Guardado real en GitHub
Para que `GUARDAR EN JSON ORIGINAL` pueda reemplazar el JSON remoto, configurá en Railway la variable `COCHI_GITHUB_TOKEN` con un token que tenga permiso de escritura sobre el repositorio donde viven TV1/TV2/Películas/Series. El token nunca se envía al navegador.
