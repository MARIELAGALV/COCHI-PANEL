# CO-CHI PANEL v0.6.0 — API Android

## Activación y acceso
`POST /api/client-device/register` registra el dispositivo y entrega código de activación.

El nombre del modelo es solo una etiqueta: varios televisores pueden llamarse igual. Si otro equipo presenta el mismo `deviceUid` sin una credencial válida, se crea un registro y código independientes, incluso si el anterior está pendiente. El alta no reemplaza secretos ni vincula automáticamente al cliente anterior. Para reintentar el registro del mismo equipo, se puede enviar también su `deviceSecret`; si es válido, se conservan el código y la credencial existentes. Las APK actuales pueden seguir enviando el UID original porque `/status` y `/session` reconocen la credencial de cada registro.

`POST /api/client-device/status` devuelve `allowed`, `accessMode` (`paid` o `demo`) y `accessExpiresAt`.
`POST /api/client-device/session` crea una sesión cuyo vencimiento nunca supera el vencimiento del demo/servicio reportado.
`GET /api/client-device/config` devuelve fuentes, acceso y estado de control parental.

## Demo
El backend registra un único demo de 60 minutos por `device_id`. Para impedir un nuevo demo después de reinstalar, el cliente Android debe enviar un `deviceUid` estable del mismo dispositivo.

Durante un demo, Android debe volver a validar el acceso al vencer `accessExpiresAt`; no debe asumir acceso indefinido por haber obtenido previamente las URLs.

## Adultos
`POST /api/client-device/adult/verify` requiere Bearer token y cuerpo `{ "pin": "1234" }`.
El servidor valida el PIN sin exponer su hash. Después del número máximo de intentos configurado por ADMINISTRACIÓN, el PIN del cliente queda bloqueado hasta que ADMINISTRACIÓN lo desbloquee.

`GET /api/client-device/config` incluye:
```json
{
  "adultControl": {
    "enabled": true,
    "locked": false,
    "pinConfigured": true,
    "maxAttempts": 5
  }
}
```

## Nota de integración
Estas rutas dejan listo el backend. El APK CO-CHI debe consumirlas para que demos y PIN remoto tengan efecto en el cliente Android.


## Banner de inicio
`GET /api/client-device/config` incluye el objeto `homeBanner`. El mismo carrusel puede utilizarse en TV y en la pantalla de inicio del celular.

Campos de visibilidad:
```json
{
  "homeBanner": {
    "enabled": true,
    "showOnTv": true,
    "showOnMobileHome": true
  }
}
```

En Android móvil, cuando `enabled` y `showOnMobileHome` sean verdaderos, el banner debe mostrarse debajo de `CUENTA ACTIVA`. Las imágenes adicionales de `extraMediaUrls` respetan `rotationSeconds`. Si `showOnMobileHome` es falso, el inicio móvil no debe renderizar el banner. Los clientes antiguos que no conocen estos campos continúan funcionando porque ambos valores se normalizan a `true` por defecto.
