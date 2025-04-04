import { DataTypes, Sequelize } from 'sequelize';
import { sequelize } from '../../configs/db.config.js';

export const Attendance = sequelize.define(
  'Attendance',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.ENUM('student', 'teacher'),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late'),
      allowNull: false,
      defaultValue: 'present',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  {
    tableName: 'attendance',
    timestamps: true,
    underscored: true,
  }
);
