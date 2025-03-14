import { body } from 'express-validator';
import { Student } from './student.model.js';
import { Class } from '../class/class.model.js';

// For POST /students (required fields for creation)
export const studentValidationRules = [
  body('student_code') // Changed to match Sequelize convention
    .trim()
    .notEmpty()
    .withMessage('Student code is required')
    .isString()
    .withMessage('Student code must be a string')
    .custom(async (value) => {
      const existingStudent = await Student.findOne({
        where: { student_code: value },
      });
      if (existingStudent) {
        throw new Error('Student code must be unique');
      }
      return true;
    }),

  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string'),

  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isString()
    .withMessage('Last name must be a string'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian mobile number'),

  body('static_phone')
    .optional()
    .trim()
    .matches(/^(\d{2,3})?\d{7,8}$/)
    .withMessage('Static phone must be a valid Iranian landline number'),

  body('national_code')
    .trim()
    .notEmpty()
    .withMessage('National code is required')
    .matches(/^\d{10}$/)
    .withMessage('National code must be a 10-digit number')
    .custom(async (value) => {
      const existingStudent = await Student.findOne({
        where: { national_code: value },
      });
      if (existingStudent) {
        throw new Error('National code must be unique');
      }
      return true;
    }),

  body('nationality')
    .notEmpty()
    .isIn(['ایران', 'توابع'])
    .withMessage('Nationality must be either ایران or توابع'),

  body('drop_out_school')
    .notEmpty()
    .isBoolean()
    .withMessage('Drop-out status must be a boolean'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isString()
    .withMessage('Address must be a string'),

  body('gender')
    .notEmpty()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('father_name')
    .trim()
    .notEmpty()
    .withMessage('Father name is required')
    .isString()
    .withMessage('Father name must be a string'),

  body('father_phone')
    .trim()
    .notEmpty()
    .withMessage('Father phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Father phone number must be a valid Iranian mobile number'),

  body('mother_phone')
    .trim()
    .notEmpty()
    .withMessage('Mother phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Mother phone number must be a valid Iranian mobile number'),

  body('siblings_number')
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage('Siblings number must be a non-negative integer'),

  body('age')
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage('Age must be a non-negative integer'),

  body('field')
    .trim()
    .notEmpty()
    .withMessage('Field is required')
    .isString()
    .withMessage('Field must be a string'),

  body('status')
    .notEmpty()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),

  body('graduated')
    .notEmpty()
    .isBoolean()
    .withMessage('Graduated must be a boolean'),

  body('graduated_year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      `Graduated year must be between 1900 and ${new Date().getFullYear()}`
    ),

  body('last_school')
    .trim()
    .notEmpty()
    .withMessage('Last school is required')
    .isString()
    .withMessage('Last school must be a string'),

  body('last_year_average')
    .notEmpty()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Last year average must be between 0 and 20'),

  body('math_mark')
    .notEmpty()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Math mark must be between 0 and 20'),

  body('discipline_mark')
    .notEmpty()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Discipline mark must be between 0 and 20'),

  body('sub_field_id')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Sub Field ID must be a positive integer')
    .custom(async (value) => {
      const field = await Field.findByPk(value);
      if (!field) throw new Error('Invalid subField ID');
      return true;
    }),
];

// For PATCH /students/:studentId (all fields optional)
export const studentPatchValidationRules = [
  body('student_code')
    .optional()
    .trim()
    .isString()
    .withMessage('Student code must be a string')
    .custom(async (value, { req }) => {
      const existingStudent = await Student.findOne({
        where: { student_code: value },
      });
      if (
        existingStudent &&
        existingStudent.id !== parseInt(req.params.studentId, 10)
      ) {
        throw new Error('Student code must be unique');
      }
      return true;
    }),

  body('first_name')
    .optional()
    .trim()
    .isString()
    .withMessage('First name must be a string'),

  body('last_name')
    .optional()
    .trim()
    .isString()
    .withMessage('Last name must be a string'),

  body('phone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian mobile number'),

  body('static_phone')
    .optional()
    .trim()
    .matches(/^(\d{2,3})?\d{7,8}$/)
    .withMessage('Static phone must be a valid Iranian landline number'),

  body('national_code')
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('National code must be a 10-digit number')
    .custom(async (value, { req }) => {
      const existingStudent = await Student.findOne({
        where: { national_code: value },
      });
      if (
        existingStudent &&
        existingStudent.id !== parseInt(req.params.studentId, 10)
      ) {
        throw new Error('National code must be unique');
      }
      return true;
    }),

  body('nationality')
    .optional()
    .isIn(['ایران', 'توابع'])
    .withMessage('Nationality must be either ایران or توابع'),

  body('drop_out_school')
    .optional()
    .isBoolean()
    .withMessage('Drop-out status must be a boolean'),

  body('address')
    .optional()
    .trim()
    .isString()
    .withMessage('Address must be a string'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('father_name')
    .optional()
    .trim()
    .isString()
    .withMessage('Father name must be a string'),

  body('father_phone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Father phone number must be a valid Iranian mobile number'),

  body('mother_phone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Mother phone number must be a valid Iranian mobile number'),

  body('siblings_number')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Siblings number must be a non-negative integer'),

  body('age')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Age must be a non-negative integer'),

  body('field')
    .optional()
    .trim()
    .isString()
    .withMessage('Field must be a string'),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),

  body('graduated')
    .optional()
    .isBoolean()
    .withMessage('Graduated must be a boolean'),

  body('graduated_year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      `Graduated year must be between 1900 and ${new Date().getFullYear()}`
    ),

  body('last_school')
    .optional()
    .trim()
    .isString()
    .withMessage('Last school must be a string'),

  body('last_year_average')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Last year average must be between 0 and 20'),

  body('math_mark')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Math mark must be between 0 and 20'),

  body('discipline_mark')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Discipline mark must be between 0 and 20'),

  body('sub_field_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sub Field ID must be a positive integer')
    .custom(async (value) => {
      const field = await Field.findByPk(value);
      if (!field) throw new Error('Invalid subField ID');
      return true;
    }),
];

// For PATCH /students/:studentId/graduate
export const studentGraduatedStatusRules = [
  body('graduated')
    .notEmpty()
    .isBoolean()
    .withMessage('Graduated must be a boolean'),
];

// For PATCH /students/:studentId/field
export const studentChangeFieldRules = [
  body('sub_field_id')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Sub Field ID must be a positive integer')
    .custom(async (value) => {
      const field = await Field.findByPk(value);
      if (!field) throw new Error('Invalid subField ID');
      return true;
    }),
];

// For PATCH /students/:studentId/class
export const studentClassAssignmentRules = [
  body('class_id')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Class ID must be a positive integer')
    .custom(async (value) => {
      const classData = await Class.findByPk(value);
      if (!classData) throw new Error('Invalid class ID');
      return true;
    }),
];
