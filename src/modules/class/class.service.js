import { StatusCodes } from 'http-status-codes';
import { Class } from './class.model.js';
import { Sequelize, Op } from 'sequelize';
import { Student } from '../students/student.model.js';
import createHttpError from 'http-errors';

export async function createClassHandler(req, res, next) {
  try {
    const newClass = await Class.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Class created successfully',
      class: newClass,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllClassesHandler(req, res, next) {
  try {
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * limit;

    const { number, name } = req.query;
    const whereClause = {};
    if (number) whereClause.number = number;
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` }; // Case-insensitive for PostgreSQL

    // Single query with count and data
    const { count, rows } = await Class.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      attributes: [
        'id',
        'number',
        'name',
        'capacity',
        [
          Sequelize.fn('COUNT', Sequelize.col('students.id')),
          'enrolledStudents',
        ],
      ],
      include: [
        {
          model: Student,
          as: 'students',
          attributes: [],
          required: false,
        },
      ],
      group: ['Class.id', 'Class.number', 'Class.name', 'Class.capacity'],
      raw: true,
      subQuery: false,
    });

    const classes = rows.map((cls) => ({
      ...cls,
      enrolledStudents: Number(cls.enrolledStudents) || 0,
    }));

    res.status(StatusCodes.OK).json({
      success: true,
      message: classes.length
        ? 'Classes fetched successfully'
        : 'No classes found',
      total: count.length,
      classes,
    });
  } catch (error) {
    next(error);
  }
}

export async function getClassByIdHandler(req, res, next) {
  try {
    const { id } = req.params;

    const classId = parseInt(id, 10);
    if (isNaN(classId) || classId < 1) {
      throw createHttpError.BadRequest('Invalid class ID');
    }

    const classData = await Class.findByPk(classId, {
      attributes: ['id', 'number', 'name', 'capacity'],
    });

    if (!classData) {
      throw createHttpError.NotFound('Class not found');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class retrieved successfully',
      class: classData,
    });
  } catch (error) {
    next(error);
  }
}

export async function getClassStudentsHandler(req, res, next) {
  try {
    const { id } = req.params;

    // Validate ID
    const classId = parseInt(id, 10);
    if (isNaN(classId) || classId < 1) {
      throw createHttpError.BadRequest('Invalid class ID');
    }

    const classExists = await Class.findByPk(classId, { attributes: ['id'] });
    if (!classExists) {
      throw createHttpError.NotFound('Class not found');
    }

    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const offset = (page - 1) * limit;

    const { count, rows: students } = await Student.findAndCountAll({
      where: { classId },
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
        'studentCode',
      ],
      raw: true, // Optional: remove if you need Sequelize instances
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: students.length
        ? 'Students retrieved successfully'
        : 'No students found for this class',
      total: count,
      students,
    });
  } catch (error) {
    next(error);
  }
}
