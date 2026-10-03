/**
 * Coincidencia entre la ruta de una petición y un recurso almacenado.
 *
 * Un recurso se guarda como patrón (method + path con parámetros):
 *   GET /api/mascotas/:id
 * Y la petición llega con el valor concreto:
 *   GET /api/mascotas/42
 *
 * Reglas de la comparación (deliberadamente estrictas):
 *  - El verbo HTTP debe coincidir exactamente.
 *  - Un segmento :param del patrón casa con un segmento cualquiera.
 *  - El resto de segmentos deben ser iguales carácter a carácter.
 *  - El número de segmentos debe coincidir (no hay comodines tipo *).
 *
 * Así, /api/mascotas/42 no casa con /api/mascotas (evita que un permiso de
 * listado autorice una lectura concreta por error).
 */

/** Normaliza una ruta: sin query string, sin barra final, sin duplicar "/". */
export function normalizePath(path: string): string {
  const withoutQuery = path.split("?")[0].split("#")[0];
  const single = withoutQuery.replace(/\/{2,}/g, "/");
  const trimmed = single.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** `true` si `path` (concreto) casa con `pattern` (con :param). */
export function pathMatches(pattern: string, path: string): boolean {
  const patternParts = normalizePath(pattern).split("/");
  const pathParts = normalizePath(path).split("/");

  if (patternParts.length !== pathParts.length) return false;

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    if (p.startsWith(":")) continue;
    if (p !== pathParts[i]) return false;
  }
  return true;
}

/**
 * `true` si el conjunto de recursos concedidos cubre la operación solicitada.
 * Deny by default: si ninguno coincide, devuelve false.
 */
export function isOperationGranted(
  granted: ReadonlyArray<{ method: string; path: string }>,
  method: string,
  path: string
): boolean {
  const upper = method.toUpperCase();
  return granted.some(
    (resource) => resource.method.toUpperCase() === upper && pathMatches(resource.path, path)
  );
}
