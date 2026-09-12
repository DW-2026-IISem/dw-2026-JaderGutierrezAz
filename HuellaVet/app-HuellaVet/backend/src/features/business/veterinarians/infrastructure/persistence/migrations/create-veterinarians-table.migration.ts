export const createVeterinariansTableMigration = {
  name: 'create-veterinarians-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE veterinarians (id, name, description, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE veterinarians
  },
};
