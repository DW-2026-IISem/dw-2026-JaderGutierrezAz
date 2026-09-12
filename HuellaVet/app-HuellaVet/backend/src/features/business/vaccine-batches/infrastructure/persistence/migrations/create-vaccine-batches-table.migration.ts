export const createVaccineBatchesTableMigration = {
  name: 'create-vaccine-batches-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE vaccine_batches (id, vaccineId FK, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE vaccine_batches
  },
};
