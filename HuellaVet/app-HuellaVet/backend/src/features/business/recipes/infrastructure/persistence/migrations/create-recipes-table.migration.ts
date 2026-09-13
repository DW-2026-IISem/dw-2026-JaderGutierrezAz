export const createRecipesTableMigration = {
  name: 'create-recipes-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE recipes (id, consultationId FK, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE recipes
  },
};
