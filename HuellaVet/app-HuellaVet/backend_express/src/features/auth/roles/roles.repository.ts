import { CreationAttributes } from "sequelize";
import { Role } from "./role.model";

export class RolesRepository {
  public async findAllActive(): Promise<Role[]> {
    return Role.findAll({ where: { status: "active" } });
  }

  public async findById(id: number): Promise<Role | null> {
    return Role.findByPk(id);
  }

  public async findByName(name: string): Promise<Role | null> {
    return Role.findOne({ where: { name: name.trim().toUpperCase() } });
  }

  public async create(data: CreationAttributes<Role>): Promise<Role> {
    return Role.create(data);
  }

  public async update(role: Role, data: Partial<Role>): Promise<Role> {
    return role.update(data);
  }

  public async delete(role: Role): Promise<void> {
    await role.destroy();
  }
}
