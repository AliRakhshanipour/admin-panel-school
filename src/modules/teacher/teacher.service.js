// modules/teachers/teacher.service.js
import { StatusCodes } from 'http-status-codes';
import { Teacher } from './teacher.model.js';
import createHttpError from 'http-errors';
import { Sequelize } from 'sequelize';

// Helper: Validate and parse ID
const validateTeacherId = (id) => {
  const teacherId = parseInt(id, 10);
  if (isNaN(teacherId) || teacherId < 1) {
    throw createHttpError.BadRequest('Invalid teacher ID');
  }
  return teacherId;
};

// Helper: Check if teacher exists
const checkTeacherExists = async (id) => {
  const teacher = await Teacher.findByPk(id, { attributes: ['id'] });
  if (!teacher) {
    throw createHttpError.NotFound('Teacher not found');
  }
  return teacher;
};

// Helper: Pagination params
const getPaginationParams = (query) => {
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const offset = (page - 1) * limit;
  return { limit, offset };
};

// Create a teacher
export async function createTeacherHandler(req, res, next) {
  try {
    const teacher = await Teacher.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Teacher created successfully',
      teacher,
    });
  } catch (error) {
    next(error);
  }
}

// Get all teachers
export async function getAllTeachersHandler(req, res, next) {
  try {
    const { limit, offset } = getPaginationParams(req.query);
    const { first_name, last_name, teacher_code, status } = req.query;

    const whereClause = {};
    if (first_name)
      whereClause.first_name = { [Sequelize.Op.iLike]: `%${first_name}%` };
    if (last_name)
      whereClause.last_name = { [Sequelize.Op.iLike]: `%${last_name}%` };
    if (teacher_code) whereClause.teacher_code = teacher_code;
    if (status) whereClause.status = status;

    const { count, rows: teachers } = await Teacher.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      attributes: [
        'id',
        [
          Sequelize.fn(
            'CONCAT',
            Sequelize.col('first_name'),
            ' ',
            Sequelize.col('last_name')
          ),
          'full_name',
        ],
        'teacher_code',
        'phone',
        'status',
      ],
      raw: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: teachers.length
        ? 'Teachers fetched successfully'
        : 'No teachers found',
      total: count,
      teachers,
    });
  } catch (error) {
    next(error);
  }
}

// Get teacher by ID
export async function getTeacherByIdHandler(req, res, next) {
  try {
    const teacherId = validateTeacherId(req.params.id);
    const teacher = await Teacher.findByPk(teacherId, {
      attributes: { exclude: ['updated_at'] },
    });

    if (!teacher) throw createHttpError.NotFound('Teacher not found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Teacher fetched successfully',
      teacher,
    });
  } catch (error) {
    next(error);
  }
}

// Update teacher by ID
export async function updateTeacherHandler(req, res, next) {
  try {
    const teacherId = validateTeacherId(req.params.id);
    await checkTeacherExists(teacherId);

    const [updatedRows] = await Teacher.update(req.body, {
      where: { id: teacherId },
    });
    if (!updatedRows) throw createHttpError.NotFound('Teacher not found');

    const updatedTeacher = await Teacher.findByPk(teacherId, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'teacher_code',
        'phone',
        'status',
      ],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Teacher updated successfully',
      teacher: updatedTeacher,
    });
  } catch (error) {
    next(error);
  }
}

// Delete teacher by ID
export async function deleteTeacherHandler(req, res, next) {
  try {
    const teacherId = validateTeacherId(req.params.id);
    await checkTeacherExists(teacherId);

    await Teacher.destroy({ where: { id: teacherId } });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
