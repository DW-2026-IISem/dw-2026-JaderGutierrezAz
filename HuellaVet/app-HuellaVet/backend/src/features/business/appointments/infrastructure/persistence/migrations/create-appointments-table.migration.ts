export const createAppointmentsTableMigration = {
  name: 'create-appointments-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE appointments (id, petId FK, veterinarianId FK, startDate, endDate, reason, state, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE appointments
  },
};
