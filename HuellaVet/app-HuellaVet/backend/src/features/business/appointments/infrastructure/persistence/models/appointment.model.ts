import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { PetModel } from '../../../../pets/infrastructure/persistence/models/pet.model.js';
import { VeterinarianModel } from '../../../../veterinarians/infrastructure/persistence/models/veterinarian.model.js';

@Table({ tableName: 'appointments', timestamps: true })
export class AppointmentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => PetModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare petId: number;

  @BelongsTo(() => PetModel)
  declare pet: unknown;

  @ForeignKey(() => VeterinarianModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare veterinarianId: number;

  @BelongsTo(() => VeterinarianModel)
  declare veterinarian: unknown;

  @Column({ type: DataType.DATE, allowNull: false })
  declare startDate: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  declare endDate: Date;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare reason: string | null;

  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: 'PENDIENTE' })
  declare state: string;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
