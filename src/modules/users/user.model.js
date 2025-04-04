// modules/users/user.model.js
import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.config.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Username is required' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Password is required' },
      },
    },
    role: {
      type: DataTypes.ENUM('super-user', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (!user.password.match(/^\$2[aby]\$/)) {
          // Check if it's not a bcrypt hash
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && !user.password.match(/^\$2[aby]\$/)) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export { User };
