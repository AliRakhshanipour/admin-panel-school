// modules/schedules/schedule.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.config.js';

const Schedule = sequelize.define(
  'Schedule',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'classes', key: 'id' },
    },
    teacher_id_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'teachers', key: 'id' },
    },
    teacher_id_2: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional second teacher
      references: { model: 'teachers', key: 'id' },
    },
    day_of_week: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0, max: 3 }, // 0=Saturday, 1=Sunday, 2=Monday, 3=Tuesday, 4=Wednesday (but limited to 0-3 per your spec)
    },
    session_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 4 }, // 1 to 4 sessions per day
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    lesson_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'schedules',
    underscored: true,
    timestamps: false,
    indexes: [
      { unique: true, fields: ['class_id', 'day_of_week', 'session_number'] }, // Class uniqueness per day/session
      { fields: ['teacher_id_1', 'day_of_week', 'session_number'] }, // Teacher 1 constraint
      { fields: ['teacher_id_2', 'day_of_week', 'session_number'] }, // Teacher 2 constraint
    ],
  }
);

export { Schedule };
