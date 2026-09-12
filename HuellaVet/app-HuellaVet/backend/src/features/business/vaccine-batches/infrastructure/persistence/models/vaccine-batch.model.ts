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
import { VaccineModel } from '../../../../vaccines/infrastructure/persistence/models/vaccine.model.js';

@Table({ tableName: 'vaccine_batches', timestamps: true })
export class VaccineBatchModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => VaccineModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare vaccineId: number;

  @BelongsTo(() => VaccineModel)
  declare vaccine: unknown;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
