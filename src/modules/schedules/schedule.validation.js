// modules/schedules/schedule.validation.js
import { body } from 'express-validator';
import { Class } from '../class/class.model.js';
import { Teacher } from '../teacher/teacher.model.js';

export const scheduleValidationRules = [
  body('class_id')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Class ID must be a positive integer')
    .custom(async (value) => {
      const classData = await Class.findByPk(value);
      if (!classData) throw new Error('Invalid class ID');
      return true;
    }),

  body('teacher_id_1')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('Teacher ID 1 must be a positive integer')
    .custom(async (value) => {
      const teacher = await Teacher.findByPk(value);
      if (!teacher) throw new Error('Invalid teacher ID for teacher_id_1');
      return true;
    }),

  body('teacher_id_2')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Teacher ID 2 must be a positive integer')
    .custom(async (value) => {
      const teacher = await Teacher.findByPk(value);
      if (!teacher) throw new Error('Invalid teacher ID for teacher_id_2');
      return true;
    }),

  body('day_of_week')
    .notEmpty()
    .isInt({ min: 0, max: 3 })
    .withMessage('Day of week must be between 0 (Saturday) and 3 (Tuesday)'),

  body('session_number')
    .notEmpty()
    .isInt({ min: 1, max: 4 })
    .withMessage('Session number must be between 1 and 4'),

  body('lesson_name')
    .trim()
    .notEmpty()
    .withMessage('Lesson name is required')
    .isString()
    .withMessage('Lesson name must be a string'),

  body('room')
    .trim()
    .notEmpty()
    .withMessage('Room is required')
    .isString()
    .withMessage('Room must be a string'),
];
