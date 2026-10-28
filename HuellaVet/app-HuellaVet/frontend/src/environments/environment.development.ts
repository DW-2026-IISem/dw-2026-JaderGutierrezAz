/**
 * Entorno de desarrollo (`ng serve` y `ng test`). Angular lo importa en lugar de
 * `environment.ts` mediante `fileReplacements`. Pega aquí la misma
 * `primeUiLicense` que en producción.
 */
export const environment = {
  production: false,
  appName: 'HuellaVet',
  apiUrl: 'http://localhost:4000/api',
  requireAuth: true,
  primeUiLicense: 'eyJpZCI6Ijc4Nzk1ZTI0LWVjNTAtNDJkMC05M2E0LTU2MDU5NjM1MDRlNyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTMxNDI4ODcsImV4cCI6MTgyNDY3ODg4N30.4bW6DGZP8qNcaXx8d_cj4i0UZzU5Ojr1kuT7O_LEnlRYoW7_n4w9F1NPSYiiQUa_VDCBkqbI_8MzIXhruG2LAA',
};
