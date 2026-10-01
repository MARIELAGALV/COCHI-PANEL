# CO-CHI AceStream Test

Aplicación de prueba separada de CO-CHI.

## Objetivo
Comprobar en un Android real si el esquema `acestream://` se resuelve correctamente mediante una aplicación/motor Ace Stream instalado.

## Prueba incluida
`acestream://f16d68fa5ff64f3894a45062ca28e4e66f142c6a`

## Importante
- No modifica CO-CHI.
- No modifica Media3/ExoPlayer.
- No incluye ni redistribuye el motor Ace Stream.
- Si el dispositivo no tiene un handler de `acestream://`, muestra un mensaje claro.
- Si funciona, el siguiente paso es integrar la detección previa en CO-CHI.
