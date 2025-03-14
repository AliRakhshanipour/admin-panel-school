import { sequelize } from '../../configs/db.config.js';
import { DataTypes } from 'sequelize';

export const Field = sequelize.define(
  'Field',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Field name cannot be empty' },
      },
      unique: { msg: 'Field name must be unique' },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fields', // points to the same table for the relationship
        key: 'id',
      },
      onDelete: 'SET NULL', // When the parent field is deleted, set parentId to null
    },
  },
  {
    tableName: 'fields',
    timestamps: false,
    underscored: true,
  }
);
