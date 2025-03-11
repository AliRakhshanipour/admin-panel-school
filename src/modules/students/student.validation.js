import { body } from 'express-validator';

export const studentValidationRules = [
  body('studentCode')
    .trim()
    .notEmpty()
    .withMessage('Student code is required')
    .isString()
    .withMessage('Student code must be a string'),

  body('firstName').trim().notEmpty().withMessage('First name is required'),

  body('lastName').trim().notEmpty().withMessage('Last name is required'),

  body('phone')
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Phone number must be a valid Iranian number'),

  body('staticPhone')
    .optional()
    .trim()
    .matches(/^(\d{2,3})?\d{7,8}$/)
    .withMessage('Static phone must be a valid Iranian landline number'),

  body('nationalCode')
    .trim()
    .notEmpty()
    .withMessage('National code is required')
    .matches(/^\d{10}$/)
    .withMessage('National code must be a 10-digit number'),

  body('nationality')
    .isIn(['ایران', 'توابع'])
    .withMessage('Nationality must be either ایران or توابع'),

  body('dropOutSchool')
    .isBoolean()
    .withMessage('Drop-out status must be a boolean'),

  body('address').trim().notEmpty().withMessage('Address is required'),

  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender'),

  body('fatherName').trim().notEmpty().withMessage('Father name is required'),

  body('fatherPhone')
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Father phone number must be a valid Iranian number'),

  body('motherPhone')
    .trim()
    .matches(/^(0|(\+98))?9\d{9}$/)
    .withMessage('Mother phone number must be a valid Iranian number'),

  body('siblingsNumber')
    .isInt({ min: 0 })
    .withMessage('Siblings number must be a non-negative integer'),

  body('age')
    .isInt({ min: 0 })
    .withMessage('Age must be a non-negative integer'),

  body('field').trim().notEmpty().withMessage('Field is required'),

  body('status').isIn(['active', 'inactive']).withMessage('Invalid status'),

  body('graduated').isBoolean().withMessage('Graduated must be a boolean'),

  body('graduatedYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage(
      `Graduation year must be between 1900 and ${new Date().getFullYear()}`
    ),

  body('lastSchool').trim().notEmpty().withMessage('Last school is required'),

  body('lastYearAverage')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Last year average must be between 0 and 20'),

  body('mathMark')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Math mark must be between 0 and 20'),

  body('disciplineMark')
    .isFloat({ min: 0, max: 20 })
    .withMessage('Discipline mark must be between 0 and 20'),
];
