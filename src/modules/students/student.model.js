import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.config.js';

const Student = sequelize.define(
  'Student',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure studentCode is unique for each student
      validate: {
        notEmpty: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValidPhoneNumber(value) {
          try {
            normalizePhoneNumber(value);
          } catch (error) {
            throw new Error('Phone number must be a valid Iranian number');
          }
        },
      },
    },
    staticPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValidPhoneNumber(value) {
          try {
            normalizePhoneNumber(value);
          } catch (error) {
            throw new Error(
              'Static phone number must be a valid Iranian number'
            );
          }
        },
      },
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure nationalCode is unique for each student
      validate: {
        notEmpty: true,
        len: [10, 10], // Iranian national code is exactly 10 digits
        isNumeric: true,
      },
    },
    nationality: {
      type: DataTypes.ENUM('ایران', 'توابع'),
      allowNull: false,
    },
    dropOutSchool: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['male', 'female', 'other']],
      },
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    fatherPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValidPhoneNumber(value) {
          try {
            normalizePhoneNumber(value);
          } catch (error) {
            throw new Error(
              'Father phone number must be a valid Iranian number'
            );
          }
        },
      },
    },
    motherPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isValidPhoneNumber(value) {
          try {
            normalizePhoneNumber(value);
          } catch (error) {
            throw new Error(
              'Mother phone number must be a valid Iranian number'
            );
          }
        },
      },
    },
    siblingsNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
    },
    graduated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    lastSchool: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    lastYearAverage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
        max: 20,
      },
    },
    mathMark: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
        max: 20,
      },
    },
    disciplineMark: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: true,
        min: 0,
        max: 20,
      },
    },
  },
  {
    tableName: 'students',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeCreate: (student) => {
        student.phone = normalizePhoneNumber(student.phone);
        student.fatherPhone = normalizePhoneNumber(student.fatherPhone);
        student.motherPhone = normalizePhoneNumber(student.motherPhone);
        student.staticPhone = normalizePhoneNumber(student.staticPhone); // Normalize static phone
      },
      beforeUpdate: (student) => {
        student.phone = normalizePhoneNumber(student.phone);
        student.fatherPhone = normalizePhoneNumber(student.fatherPhone);
        student.motherPhone = normalizePhoneNumber(student.motherPhone);
        student.staticPhone = normalizePhoneNumber(student.staticPhone); // Normalize static phone
      },
    },
  }
);

// Function to normalize Iranian phone numbers
function normalizePhoneNumber(phone) {
  phone = phone.replace(/\D/g, '');
  if (phone.startsWith('98')) {
    phone = '0' + phone.slice(2);
  } else if (phone.startsWith('9')) {
    phone = '0' + phone;
  }
  if (/^0\d{10}$/.test(phone)) {
    return phone;
  } else {
    throw new Error('Invalid phone number format');
  }
}

export { Student };
