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
import { ConsultationModel } from '../../../../consultations/infrastructure/persistence/models/consultation.model.js';

@Table({ tableName: 'recipes', timestamps: true })
export class RecipeModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => ConsultationModel)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare consultationId: number;

  @BelongsTo(() => ConsultationModel)
  declare consultation: unknown;

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
