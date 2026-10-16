# CO-CHI: empaquetador de series externas cifradas

**EXPERIMENTAL: no cambia el PANEL productivo ni la APK estable 0.26.04.**

Se inspecciono el cifrado vigente en server.js: AES-256-ECB con campos samples[].code y temp[].code. Este formato historico NO SE CAMBIA. El nuevo catalogo se empaqueta con AES-256-GCM por archivo y gzip, para Github Releases independientes, con clave privada diferente. El servidor adaptador (aun pendiente) debe autenticar sesiones, descifrar el bloque solicitado y devolver a la app su formato compatible; no hace falta guardar los 456 MB en Railway. El APK actual no entiende aun este manifest.

Generar desde la raiz del repositorio con Node.js 20 o mas, sin paquetes npm:

    node tools/external-series-pack.mjs keygen --key-file ../clave-privada/series.key
    node tools/external-series-pack.mjs pack --input series_backup.json --out ../release-series --key-file ../clave-privada/series.key --shard-series 200
    node tools/external-series-pack.mjs verify --out ../release-series --key-file ../clave-privada/series.key

Publicar SOLO los archivos de ../release-series en un GitHub Release NUEVO. Ejemplo con GitHub CLI ya instalado:

    gh release create cochi-series-external-v1 ../release-series/* --repo OWNER/REPO --title "CO-CHI Series externas v1"

NO PUBLICAR series.key; se mantiene fuera de la carpeta publica y fuera de Git. El archivo original tampoco debe subirse en claro por error. El manifest publica el numero de series y hashes; los titulos, imagenes, enlaces y subtitulos estan en el indice/bloques cifrados.

Funcionamiento: lector incremental de series_backup.json, conversion a series CO-CHI name/icon/temp/uri/subtitles, indices por titulo y archivos de 200 series, comprimir y cifrar cada bloque, comprobar checksum y autenticacion GCM.

Pendiente: prueba con los 456 MB reales, endpoint autenticado del PANEL para lectura incremental y cliente Android v0.26.05 de prueba. Ningun fichero de produccion es modificado. Cifrar enlaces no les agrega DRM ni garantiza que sigan online.
