// modules/users/user.validation.js
import { body } from 'express-validator';
import { User } from './user.model.js';

export const userValidationRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Username must be a string')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) throw new Error('Username already exists');
      return true;
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .notEmpty()
    .isIn(['super-user', 'user'])
    .withMessage('Role must be either super-user or user'),
];

export const userPatchValidationRules = [
  body('username')
    .optional()
    .trim()
    .isString()
    .withMessage('Username must be a string')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ where: { username: value } });
      if (user && user.id !== parseInt(req.params.id, 10)) {
        throw new Error('Username already exists');
      }
      return true;
    }),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['super-user', 'user'])
    .withMessage('Role must be either super-user or user'),
];
