import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'payments', timestamps: false })
export class PaymentModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(30), allowNull: false })
  declare referenceType: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare referenceId: number;

  @Column({ type: DataType.STRING(50), allowNull: false })
  declare method: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare amount: number;

  @Column({ type: DataType.DATE, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.STRING(30), allowNull: false, defaultValue: 'PENDIENTE' })
  declare state: string;
}
