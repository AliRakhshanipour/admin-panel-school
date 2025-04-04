import { check } from 'express-validator';

export const attendanceValidationRules = [
  check('entityId')
    .isInt({ min: 1 })
    .withMessage('Entity ID must be a positive integer'),
  check('entityType')
    .isIn(['student', 'teacher'])
    .withMessage('Entity type must be "student" or "teacher"'),
  check('date')
    .isISO8601()
    .toDate()
    .withMessage('Date must be in ISO8601 format (e.g., YYYY-MM-DD)'),
  check('status')
    .isIn(['present', 'absent', 'late'])
    .withMessage('Status must be "present", "absent", or "late"'),
];

export const attendancePatchValidationRules = [
  check('date')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date must be in ISO8601 format (e.g., YYYY-MM-DD)'),
  check('status')
    .optional()
    .isIn(['present', 'absent', 'late'])
    .withMessage('Status must be "present", "absent", or "late"'),
];
