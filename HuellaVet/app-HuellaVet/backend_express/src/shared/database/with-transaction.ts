import { Transaction } from "sequelize";
import { sequelize } from "../../database/db";

/**
 * Ejecuta `work` dentro de una transacción Sequelize.
 * Si `work` lanza, la transacción hace rollback automáticamente; si resuelve,
 * hace commit. Centraliza el patrón para no repetirlo en cada service que
 * necesite atomicidad entre varias escrituras.
 */
export async function withTransaction<T>(work: (t: Transaction) => Promise<T>): Promise<T> {
  return sequelize.transaction(work);
}
