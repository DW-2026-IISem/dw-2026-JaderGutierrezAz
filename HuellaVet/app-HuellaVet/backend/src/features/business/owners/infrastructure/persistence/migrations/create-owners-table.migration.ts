export const createOwnersTableMigration = {
  name: 'create-owners-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE owners (id, documentType, documentNumber, name, phone, email, isActive)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE owners
  },
};
