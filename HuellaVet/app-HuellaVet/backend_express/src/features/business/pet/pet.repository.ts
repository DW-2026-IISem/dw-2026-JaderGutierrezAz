import { CreationAttributes } from "sequelize";
import { Pet } from "./pet.model";

/**
 * Capa Repository del feature Pet.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class PetRepository {
  public async findAllActive(): Promise<Pet[]> {
    return Pet.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Pet | null> {
    return Pet.findByPk(id);
  }

  public async create(data: CreationAttributes<Pet>): Promise<Pet> {
    return Pet.create(data);
  }

  public async update(pet: Pet, data: Partial<Pet>): Promise<Pet> {
    return pet.update(data);
  }

  public async delete(pet: Pet): Promise<void> {
    await pet.destroy();
  }
}
