// modules/auth/auth.validation.js
import { body } from 'express-validator';

export const loginValidationRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];
