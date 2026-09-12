import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  HasMany,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { OwnerModel } from '../../../../owners/infrastructure/persistence/models/owner.model.js';
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';

@Table({ tableName: 'pets', timestamps: true })
export class PetModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => OwnerModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare ownerId: number;

  @BelongsTo(() => OwnerModel)
  declare owner: unknown;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => AppointmentModel)
  declare appointments: unknown[];

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
