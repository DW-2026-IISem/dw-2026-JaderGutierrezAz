# Kanban — Semana 04 · HuellaVet (proyecto12)

## 7. Issues de la semana — Momento 3 · Organización Kanban

| Issue | Descripción | REQ | DoR (entrada) | DoD (salida) |
|----|----|----|----|----|
| #01 | Documentar problema, actores (Propietario, Mascota, Veterinario, Recepción, Farmacia, Auditor Clínico) y requisitos del dominio HuellaVet | REQ-S04-01 | Proyecto asignado (S01) | docs/sdd.md con dominio |
| #02 | Modelar dominio: 10 entidades (Propietario, Mascota, Veterinario, Cita, Consulta, Vacuna, LoteVacuna, AplicacionVacuna, Receta, Pago), relaciones y agregado | REQ-S04-02 | Requisitos definidos (#01) | Diagrama de dominio |
| #03 | Definir arquitectura por capas (incluye ubicación del RBAC de 5 roles) | REQ-S04-03 | Modelo de dominio (#02) | Diagrama de arquitectura |
| #04 | Definir contratos (DTO/API) de citas, consultas, vacunaciones e historia clínica | REQ-S04-04 | Modelo de dominio (#02) | Contratos documentados |
| #05 | Crear base del backend NestJS | REQ-S04-05 | Node LTS + npm (S03) | Backend arranca + /health |
| #06 | Actualizar docs/sdd.md y docs/kanban.md | REQ-S04-06 | #01–#05 | SDD + Kanban trazables |

## 8. Dependencias entre Issues — Momento 3 · Organización Kanban

**Ruta crítica / secuencia mínima:** #01 (dominio/requisitos) → #02 (modelo) → #03 (arquitectura) y #04 (contratos) en paralelo; #05 (backend base) requiere Node de S03; #06 (docs) depende de #01–#05. Todo converge en GATE-S04.

**Bloqueos / riesgos principales y plan alterno:**

| Bloqueo / riesgo | Plan alterno |
|----|----|
| No se comprende bien el dominio clínico veterinario (historia cronológica, inalterabilidad de datos sensibles, RBAC de 5 roles) | Releer la narrativa del proyecto y resolver dudas con el docente/IA al inicio |
| Base de código previa inexistente | Definir primero arquitectura y contratos antes de implementar |
| NestJS no arranca por configuraciones | Verificar Node/npm, dependencias y documentar en bitácora (docs/proceso.md) |
| Conexión remota a BD pendiente | Se aborda en semana 5; esta semana solo se deja config/database listos |

## 9. Kanban semanal — Momento 3 · Organización Kanban

**Política del tablero:** WIP = 1 por estudiante: solo una Issue en «En desarrollo». «Bloqueado» es un indicador visible sobre una tarjeta, no una columna.

| Columna | Significado | Política de entrada / salida |
|----|----|----|
| Por especificar | Necesidad vinculada a un resultado de aprendizaje | Sale al completar la especificación SDD |
| Especificada | OBJ/SPEC/REQ/AC y fuentes definidos | Sale con aprobación docente (DoR) para iniciar |
| En desarrollo | Unidad de trabajo dentro del WIP acordado | Sale con cambio versionado, prueba y evidencia |
| En revisión humana | Entrega presentada con evidencia | Sale sin hallazgos bloqueantes |
| En ajustes | Hallazgos registrados en la revisión | Sale con correcciones trazables y verificación superada |
| Aceptada/Evidenciada | Criterios de finalización (DoD) cumplidos | Evidencia vinculada y decisión de cierre |

**Estado inicial del tablero (antes de clase):**

| Issue | Columna inicial | Responsable | Bloqueado | Motivo / acción |
|----|----|----|----|----|
| #01 | Especificada | estudiante-proyecto12 (JaderGutierrezAz) | No | Proyecto asignado (S01) |
| #02 | Especificada | estudiante-proyecto12 (JaderGutierrezAz) | No | Depende de #01 |
| #03 | Por especificar | estudiante-proyecto12 (JaderGutierrezAz) | No | Depende de #02 |
| #04 | Por especificar | estudiante-proyecto12 (JaderGutierrezAz) | No | Depende de #02 |
| #05 | Especificada | estudiante-proyecto12 (JaderGutierrezAz) | No | Node LTS verificado (S03) |
| #06 | Por especificar | estudiante-proyecto12 (JaderGutierrezAz) | No | Depende de #01–#05 |
