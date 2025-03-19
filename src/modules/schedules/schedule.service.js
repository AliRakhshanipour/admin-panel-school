// modules/schedules/schedule.service.js
import { StatusCodes } from 'http-status-codes';
import { Schedule } from './schedule.model.js';
import createHttpError from 'http-errors';
import { Sequelize, Op } from 'sequelize';
import { Class } from '../class/class.model.js';
import { Teacher } from '../teacher/teacher.model.js';

// Session times (Saturday to Wednesday, 4 sessions, 1.5 hours each, 15-min breaks)
const SESSION_TIMES = [
  { start: '07:30:00', end: '09:00:00' }, // Session 1
  { start: '09:10:00', end: '10:40:00' }, // Session 2
  { start: '10:50:00', end: '12:10:00' }, // Session 3
  { start: '12:20:00', end: '14:10:00' }, // Session 4
];

// Helper: Validate ID
const validateId = (id, type) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId) || parsedId < 1) {
    throw createHttpError.BadRequest(`Invalid ${type} ID`);
  }
  return parsedId;
};

// Helper: Check existence
const checkExists = async (Model, id, type) => {
  const entity = await Model.findByPk(id, { attributes: ['id'] });
  if (!entity) {
    throw createHttpError.NotFound(`${type} not found`);
  }
  return entity;
};

// Create a schedule
export async function createScheduleHandler(req, res, next) {
  try {
    const {
      class_id,
      teacher_id_1,
      teacher_id_2,
      day_of_week,
      session_number,
      lesson_name,
      room,
    } = req.body;

    // Validate IDs
    const classId = validateId(class_id, 'class');
    const teacherId1 = validateId(teacher_id_1, 'teacher');
    const teacherId2 = teacher_id_2
      ? validateId(teacher_id_2, 'teacher')
      : null;

    // Check existence
    await checkExists(Class, classId, 'Class');
    await checkExists(Teacher, teacherId1, 'Teacher');
    if (teacherId2) await checkExists(Teacher, teacherId2, 'Teacher');

    // Validate session number and set times
    if (session_number < 1 || session_number > 4) {
      throw createHttpError.BadRequest(
        'Session number must be between 1 and 4'
      );
    }
    const { start, end } = SESSION_TIMES[session_number - 1];

    // Check teacher conflicts
    const teacherConflict = await Schedule.findOne({
      where: {
        day_of_week,
        session_number,
        [Op.or]: [
          { teacher_id_1: teacherId1 },
          { teacher_id_2: teacherId1 },
          ...(teacherId2
            ? [{ teacher_id_1: teacherId2 }, { teacher_id_2: teacherId2 }]
            : []),
        ],
      },
    });
    if (teacherConflict) {
      throw createHttpError.BadRequest(
        'Teacher(s) already assigned to another class at this time'
      );
    }

    // Check class conflict
    const classConflict = await Schedule.findOne({
      where: { class_id: classId, day_of_week, session_number },
    });
    if (classConflict) {
      throw createHttpError.BadRequest(
        'Class already has a session at this time'
      );
    }

    // Create schedule
    const schedule = await Schedule.create({
      class_id: classId,
      teacher_id_1: teacherId1,
      teacher_id_2: teacherId2,
      day_of_week,
      session_number,
      start_time: start,
      end_time: end,
      lesson_name,
      room,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Schedule created successfully',
      schedule,
    });
  } catch (error) {
    next(error);
  }
}

// Get all schedules (for admin or overview)
export async function getAllSchedulesHandler(req, res, next) {
  try {
    const { limit, offset } = getPaginationParams(req.query);
    const { class_id, day_of_week } = req.query;

    const whereClause = {};
    if (class_id) whereClause.class_id = validateId(class_id, 'class');
    if (day_of_week !== undefined)
      whereClause.day_of_week = validateId(day_of_week, 'day_of_week');

    const { count, rows: schedules } = await Schedule.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        { model: Class, as: 'class', attributes: ['name', 'number'] },
        {
          model: Teacher,
          as: 'teacher1',
          attributes: ['first_name', 'last_name'],
        },
        {
          model: Teacher,
          as: 'teacher2',
          attributes: ['first_name', 'last_name'],
        },
      ],
      order: [
        ['day_of_week', 'ASC'],
        ['session_number', 'ASC'],
      ],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: schedules.length
        ? 'Schedules fetched successfully'
        : 'No schedules found',
      total: count,
      schedules,
    });
  } catch (error) {
    next(error);
  }
}

// Helper: Pagination params (reused from previous modules)
const getPaginationParams = (query) => {
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const offset = (page - 1) * limit;
  return { limit, offset };
};
