// modules/teachers/teacher.validation.js
import { body } from 'express-validator';
import { Teacher } from './teacher.model.js';

// For POST /teachers (required fields)
export const teacherValidationRules = [
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

  body('teacher_code')
    .trim()
    .notEmpty()
    .withMessage('Teacher code is required')
    .isString()
    .withMessage('Teacher code must be a string')
    .custom(async (value) => {
      const existingTeacher = await Teacher.findOne({
        where: { teacher_code: value },
      });
      if (existingTeacher) {
        throw new Error('Teacher code must be unique');
      }
      return true;
    }),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian mobile number'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value) => {
      const existingTeacher = await Teacher.findOne({
        where: { email: value },
      });
      if (existingTeacher) {
        throw new Error('Email must be unique');
      }
      return true;
    }),

  body('status')
    .notEmpty()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];

// For PATCH /teachers/:teacherId (all optional)
export const teacherPatchValidationRules = [
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

  body('teacher_code')
    .optional()
    .trim()
    .isString()
    .withMessage('Teacher code must be a string')
    .custom(async (value, { req }) => {
      const existingTeacher = await Teacher.findOne({
        where: { teacher_code: value },
      });
      if (
        existingTeacher &&
        existingTeacher.id !== parseInt(req.params.teacherId, 10)
      ) {
        throw new Error('Teacher code must be unique');
      }
      return true;
    }),

  body('phone')
    .optional()
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian mobile number'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .custom(async (value, { req }) => {
      const existingTeacher = await Teacher.findOne({
        where: { email: value },
      });
      if (
        existingTeacher &&
        existingTeacher.id !== parseInt(req.params.teacherId, 10)
      ) {
        throw new Error('Email must be unique');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['active', 'inactive'])
    .withMessage('Status must be active or inactive'),
];
