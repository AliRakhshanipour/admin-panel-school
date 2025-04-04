import createHttpError from 'http-errors';
import { Student } from '../students/student.model.js';
import { Teacher } from '../teacher/teacher.model.js';
import { Attendance } from './attendance.model.js';

// Create attendance record
export const createAttendanceHandler = async (req, res, next) => {
  try {
    const { entityId, entityType, date, status } = req.body;

    // Validate entity exists
    const Model = entityType === 'student' ? Student : Teacher;
    const entity = await Model.findByPk(entityId);
    if (!entity) {
      return next(createHttpError.NotFound(`${entityType} not found`));
    }

    const attendance = await Attendance.create({
      entityId,
      entityType,
      date,
      status,
    });
    res.status(201).json(attendance);
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

// Get attendance by entity ID and type
export const getAttendanceByEntityHandler = async (req, res, next) => {
  try {
    const { entityId, entityType } = req.params;

    const attendance = await Attendance.findAll({
      where: { entityId, entityType },
      order: [['date', 'DESC']],
    });
    res.status(200).json(attendance);
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

// Get class attendance (students only)
export const getClassAttendanceHandler = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const attendance = await Attendance.findAll({
      include: [
        {
          model: Student,
          where: { classId },
          attributes: ['id', 'firstName', 'lastName', 'studentCode'],
        },
      ],
      where: {
        entityType: 'student',
        ...(date && { date }),
      },
      order: [['date', 'DESC']],
    });
    res.status(200).json(attendance);
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

// Update attendance record
export const updateAttendanceHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return next(createHttpError.NotFound('Attendance record not found'));
    }

    await attendance.update({ date, status });
    res.status(200).json(attendance);
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};

// Delete attendance record
export const deleteAttendanceHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return next(createHttpError.NotFound('Attendance record not found'));
    }

    await attendance.destroy();
    res.status(204).send();
  } catch (error) {
    next(createHttpError(500, error.message));
  }
};
