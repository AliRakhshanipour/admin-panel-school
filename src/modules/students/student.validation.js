// modules/students/student.validation.js
import { body } from 'express-validator';
import { Student } from './student.model.js';
import { Field } from '../fields/field.model.js';
import { Class } from '../class/class.model.js';

// For POST /students (required fields for creation)
export const studentValidationRules = [
  body('studentCode')
    .trim()
    .notEmpty()
    .withMessage('Student code is required')
    .isString()
    .withMessage('Student code must be a string')
    .custom(async (value) => {
      const existingStudent = await Student.findOne({
        where: { studentCode: value },
      });
      if (existingStudent) {
        throw new Error('Student code must be unique');
      }
      return true;
    }),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isString()
    .withMessage('First name must be a string'),

  body('lastName')
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

  body('staticPhone')
    .trim()
    .notEmpty() // Changed to required to match model
    .withMessage('Static phone number is required')
    .matches(/^(\d{2,3})?\d{7,8}$/)
    .withMessage('Static phone must be a valid Iranian landline number'),

  body('nationalCode')
    .trim()
    .notEmpty()
    .withMessage('National code is required')
    .matches(/^\d{10}$/)
    .withMessage('National code must be a 10-digit number')
    .custom(async (value) => {
      const existingStudent = await Student.findOne({
        where: { nationalCode: value },
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

  body('dropOutSchool')
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

  body('fatherName')
    .trim()
    .notEmpty()
    .withMessage('Father name is required')
    .isString()
    .withMessage('Father name must be a string'),

  body('fatherPhone')
    .trim()
    .notEmpty()
    .withMessage('Father phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Father phone number must be a valid Iranian mobile number'),

  body('motherPhone')
    .trim()
    .notEmpty()
    .withMessage('Mother phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Mother phone number must be a valid Iranian mobile number'),

  body('siblingsNumber')
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

  body('lastSchool')
    .trim()
    .notEmpty()
    .withMessage('Last school is required')
    .isString()
    .withMessage('Last school must be a string'),

  body('lastYearAverage')
    .notEmpty()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Last year average must be between 0 and 20'),

  body('subFieldId')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Sub Field ID must be a positive integer')
    .custom(async (value) => {
      const field = await Field.findByPk(value);
      if (!field) throw new Error('Invalid subField ID');
      return true;
    }),

  // Removed fields not in the final model: graduated_year, math_mark, discipline_mark
];

// For PATCH /students/:studentId (all fields optional)
export const studentPatchValidationRules = [
  body('studentCode')
    .optional()
    .trim()
    .isString()
    .withMessage('Student code must be a string')
    .custom(async (value, { req }) => {
      const existingStudent = await Student.findOne({
        where: { studentCode: value },
      });
      if (
        existingStudent &&
        existingStudent.id !== parseInt(req.params.studentId, 10)
      ) {
        throw new Error('Student code must be unique');
      }
      return true;
    }),

  body('firstName')
    .optional()
    .trim()
    .isString()
    .withMessage('First name must be a string'),

  body('lastName')
    .optional()
    .trim()
    .isString()
    .withMessage('Last name must be a string'),

  body('phone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian mobile number'),

  body('staticPhone')
    .optional()
    .trim()
    .matches(/^(\d{2,3})?\d{7,8}$/)
    .withMessage('Static phone must be a valid Iranian landline number'),

  body('nationalCode')
    .optional()
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('National code must be a 10-digit number')
    .custom(async (value, { req }) => {
      const existingStudent = await Student.findOne({
        where: { nationalCode: value },
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

  body('dropOutSchool')
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

  body('fatherName')
    .optional()
    .trim()
    .isString()
    .withMessage('Father name must be a string'),

  body('fatherPhone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Father phone number must be a valid Iranian mobile number'),

  body('motherPhone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Mother phone number must be a valid Iranian mobile number'),

  body('siblingsNumber')
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

  body('lastSchool')
    .optional()
    .trim()
    .isString()
    .withMessage('Last school must be a string'),

  body('lastYearAverage')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Last year average must be between 0 and 20'),

  body('subFieldId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Sub Field ID must be a positive integer')
    .custom(async (value) => {
      const field = await Field.findByPk(value);
      if (!field) throw new Error('Invalid subField ID');
      return true;
    }),

  // Removed fields not in the final model: graduated_year, math_mark, discipline_mark
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
  body('subFieldId')
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
  body('classId')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Class ID must be a positive integer')
    .custom(async (value) => {
      const classData = await Class.findByPk(value);
      if (!classData) throw new Error('Invalid class ID');
      return true;
    }),
];
