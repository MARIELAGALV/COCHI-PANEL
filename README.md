# CO-CHI PANEL v0.6.0 — Backend central + PANEL web/PWA

Esta versión reúne el PANEL y la API que usa CO-CHI Android.

## Funciones centrales
- Fichas PANEL separadas de clientes finales.
- Créditos, promociones, vencimientos y 2 dispositivos por cliente.
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
CO-CHI Android v0.23.0 se conecta a este backend usando la URL definida en `COCHI_BACKEND_URL`.
