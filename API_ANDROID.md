# CO-CHI PANEL v0.6.0 — API Android

## Activación y acceso
`POST /api/client-device/register` registra el dispositivo y entrega código de activación.
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
