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
import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';

@Table({ tableName: 'consultations', timestamps: true })
export class ConsultationModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => AppointmentModel)
  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  declare appointmentId: number;

  @BelongsTo(() => AppointmentModel)
  declare appointment: unknown;

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
