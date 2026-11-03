/**
 * Dobles de prueba compartidos por las listas de administración:
 * registran los avisos y responden a la confirmación sin abrir el diálogo real.
 */
export const fakes = {
  avisos: [] as string[],
  respuesta: 'accept' as 'accept' | 'reject',
};

export function reiniciarFakes(): void {
  fakes.avisos.length = 0;
  fakes.respuesta = 'accept';
}

export const notificacionFalsa = {
  success: (resumen: string) => void fakes.avisos.push(`success:${resumen}`),
  info: (resumen: string) => void fakes.avisos.push(`info:${resumen}`),
  warn: (resumen: string) => void fakes.avisos.push(`warn:${resumen}`),
  error: (resumen: string) => void fakes.avisos.push(`error:${resumen}`),
};

/** Ejecuta `accept` o `reject` al instante, como si la persona hubiera pulsado. */
export const confirmacionFalsa = {
  confirm(opciones: { accept?: () => void; reject?: () => void }) {
    if (fakes.respuesta === 'accept') {
      opciones.accept?.();
    } else {
      opciones.reject?.();
    }
    return this;
  },
};
