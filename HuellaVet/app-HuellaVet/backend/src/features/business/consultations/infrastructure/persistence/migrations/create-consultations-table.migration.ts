export const createConsultationsTableMigration = {
  name: 'create-consultations-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE consultations (id, appointmentId FK UNIQUE, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE consultations
  },
};
