// modules/classes/class.validation.js
import { body } from 'express-validator';
import { Class } from './class.model.js';

// Base validation rules for POST (all required except description)
export const classValidationRules = [
  body('number')
    .notEmpty()
    .withMessage('Class number is required')
    .isInt()
    .withMessage('Class number must be an integer')
    .custom(async (value, { req }) => {
      const existingClass = await Class.findOne({ where: { number: value } });
      if (existingClass && existingClass.id !== req.body.id) {
        throw new Error('A class with this number already exists');
      }
      return true;
    }),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Class name is required')
    .isString()
    .withMessage('Class name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Class name must be between 3 and 255 characters')
    .custom(async (value, { req }) => {
      const existingClass = await Class.findOne({ where: { name: value } });
      if (existingClass && existingClass.id !== req.body.id) {
        throw new Error('A class with this name already exists');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer greater than or equal to 1'),
];

// Validation rules for PATCH (all fields optional)
export const classPatchValidationRules = [
  body('number')
    .optional()
    .isInt()
    .withMessage('Class number must be an integer')
    .custom(async (value, { req }) => {
      const existingClass = await Class.findOne({ where: { number: value } });
      if (existingClass && existingClass.id !== parseInt(req.params.id, 10)) {
        throw new Error('A class with this number already exists');
      }
      return true;
    }),

  body('name')
    .optional()
    .trim()
    .isString()
    .withMessage('Class name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Class name must be between 3 and 255 characters')
    .custom(async (value, { req }) => {
      const existingClass = await Class.findOne({ where: { name: value } });
      if (existingClass && existingClass.id !== parseInt(req.params.id, 10)) {
        throw new Error('A class with this name already exists');
      }
      return true;
    }),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),

  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer greater than or equal to 1'),
];
