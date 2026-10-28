/**
 * Entorno de producción (`ng build`).
 *
 * `apiUrl` termina en `/api` SIN barra final: con una, las llamadas saldrían
 * como `//propietarios` y Express las trataría como otra ruta.
 *
 * `requireAuth`: lo leerán los guards y la directiva de permisos desde ISS-08.
 * Tu backend siempre exige token, así que se queda en `true`.
 *
 * `primeUiLicense`: clave Community de PrimeUI (PrimeNG 22). Solicítala en
 * https://primeui.dev. Déjala en '' si aún no la tienes (aviso en consola; la
 * aplicación funciona). No subas claves comerciales al repositorio.
 */
export const environment = {
  production: true,
  appName: 'HuellaVet',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: 'eyJpZCI6Ijc4Nzk1ZTI0LWVjNTAtNDJkMC05M2E0LTU2MDU5NjM1MDRlNyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTMxNDI4ODcsImV4cCI6MTgyNDY3ODg4N30.4bW6DGZP8qNcaXx8d_cj4i0UZzU5Ojr1kuT7O_LEnlRYoW7_n4w9F1NPSYiiQUa_VDCBkqbI_8MzIXhruG2LAA',
};
