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
        notEmpty: { msg: 'First name is required' },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Last name is required' },
      },
    },
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'Student code is required' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Phone number is required' },
        isValidPhoneNumber(value) {
          if (!isValidIranianPhone(value)) {
            throw new Error('Invalid Iranian mobile phone number');
          }
        },
      },
    },
    staticPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Static phone number is required' },
        isValidStaticPhoneNumber(value) {
          if (!isValidIranianStaticPhone(value)) {
            throw new Error('Invalid Iranian landline number');
          }
        },
      },
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'National code is required' },
        len: { args: [10, 10], msg: 'National code must be exactly 10 digits' },
        isNumeric: { msg: 'National code must contain only numbers' },
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
        notEmpty: { msg: 'Address is required' },
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    fatherName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Father name is required' },
      },
    },
    fatherPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Father phone number is required' },
        isValidPhoneNumber(value) {
          if (!isValidIranianPhone(value)) {
            throw new Error('Invalid Iranian mobile phone number');
          }
        },
      },
    },
    motherPhone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Mother phone number is required' },
        isValidPhoneNumber(value) {
          if (!isValidIranianPhone(value)) {
            throw new Error('Invalid Iranian mobile phone number');
          }
        },
      },
    },
    siblingsNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Siblings number must be an integer' },
        min: { args: [0], msg: 'Siblings number cannot be negative' },
      },
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: { msg: 'Age must be an integer' },
        min: { args: [0], msg: 'Age cannot be negative' },
      },
    },
    field: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Field is required' },
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
        notEmpty: { msg: 'Last school is required' },
      },
    },
    lastYearAverage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: { msg: 'Last year average must be a number' },
        min: { args: [0], msg: 'Minimum value is 0' },
        max: { args: [20], msg: 'Maximum value is 20' },
      },
    },
    subFieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'fields',
        key: 'id',
      },
    },
    // ... (existing fields like id, firstName, etc.)
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Changed to true so class is optional at signup
      references: {
        model: 'classes',
        key: 'id',
      },
      onDelete: 'SET NULL', // If a class is deleted, set classId to null
    },
  },
  {
    tableName: 'students',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
    hooks: {
      beforeCreate: normalizePhones,
      beforeUpdate: normalizePhones,
    },
  }
);

// Iranian Phone Number Validation
function isValidIranianPhone(phone) {
  phone = phone.replace(/\D/g, '');
  return /^09\d{9}$/.test(phone);
}

// Iranian Static Phone Number Validation
const provinceCodes = [
  '021',
  '026',
  '025',
  '086',
  '031',
  '044',
  '011',
  '076',
  '077',
  '045',
  '034',
  '017',
  '041',
  '058',
  '056',
  '024',
  '066',
  '028',
  '038',
  '084',
  '071',
  '051',
  '061',
  '023',
  '035',
  '083',
  '074',
  '054',
  '087',
  '081',
  '048',
];

function isValidIranianStaticPhone(phone) {
  phone = phone.replace(/\D/g, '');
  if (phone.length !== 11) return false;
  return provinceCodes.includes(phone.slice(0, 3));
}

// Normalize Phone Numbers Before Saving
function normalizePhones(student) {
  student.phone = student.phone.replace(/\D/g, '');
  student.fatherPhone = student.fatherPhone.replace(/\D/g, '');
  student.motherPhone = student.motherPhone.replace(/\D/g, '');
  student.staticPhone = student.staticPhone.replace(/\D/g, '');
}

export { Student };
