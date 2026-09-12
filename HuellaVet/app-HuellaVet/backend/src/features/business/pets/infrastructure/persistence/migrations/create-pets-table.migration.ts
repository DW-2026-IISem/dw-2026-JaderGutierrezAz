export const createPetsTableMigration = {
  name: 'create-pets-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE pets (id, ownerId FK, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE pets
  },
};
