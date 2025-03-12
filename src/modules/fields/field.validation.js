import { body } from 'express-validator';

export const fieldValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),

  body('description')
    .optional()
    .trim()
    .isString()
    .withMessage('Description must be a string'),

  body('parentId')
    .optional()
    .isInt()
    .withMessage('Parent ID must be a valid integer')
    .custom((value, { req }) => {
      if (value && value === req.body.id) {
        throw new Error("Parent ID can't be the same as the field's own ID");
      }
      return true;
    }),
];
