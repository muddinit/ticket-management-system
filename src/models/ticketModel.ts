import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database';

class Ticket extends Model {
  declare id: string;
  declare subject: string;
  declare message: string;
  declare status: string;
  declare resolution: string;
  declare cancellationReason: string;
  declare readonly createdAt: Date
  declare readonly updatedAt: Date;
}

Ticket.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['Новое', 'В работе', 'Завершено', 'Отменено'],
    allowNull: false,
    defaultValue: 'Новое',
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'tickets',
  timestamps: true,
});

export default Ticket;