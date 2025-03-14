// modules/classes/class.model.js
import { sequelize } from '../../configs/db.config.js';
import { DataTypes } from 'sequelize';

export const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: { msg: 'Class number must be unique' },
      validate: {
        notEmpty: { msg: 'Class number cannot be empty' },
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Class name must be unique' },
      validate: {
        notEmpty: { msg: 'Class name cannot be empty' },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description cannot exceed 1000 characters',
        },
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30, // Example default
      validate: {
        isInt: { msg: 'Capacity must be an integer' },
        min: { args: [1], msg: 'Capacity must be at least 1' },
      },
    },
  },
  {
    tableName: 'classes',
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  }
);
