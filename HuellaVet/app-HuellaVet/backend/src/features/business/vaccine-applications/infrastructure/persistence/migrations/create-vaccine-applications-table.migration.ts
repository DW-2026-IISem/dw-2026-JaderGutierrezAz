export const createVaccineApplicationsTableMigration = {
  name: 'create-vaccine-applications-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE vaccine_applications (id, consultationId FK, vaccineBatchId FK, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE vaccine_applications
  },
};
