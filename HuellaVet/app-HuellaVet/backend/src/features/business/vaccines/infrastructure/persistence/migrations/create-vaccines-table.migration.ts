export const createVaccinesTableMigration = {
  name: 'create-vaccines-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE vaccines (id, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE vaccines
  },
};
