import { StatusCodes } from 'http-status-codes';
import { Class } from './class.model.js';
import { Sequelize, Op } from 'sequelize';
import { Student } from '../students/student.model.js';
import createHttpError from 'http-errors';

// Helper method to validate and parse ID
const validateClassId = (id) => {
  const classId = parseInt(id, 10);
  if (isNaN(classId) || classId < 1) {
    throw createHttpError.BadRequest('Invalid class ID');
  }
  return classId;
};

// Helper method to check if class exists
const checkClassExists = async (classId) => {
  const classData = await Class.findByPk(classId, { attributes: ['id'] });
  if (!classData) {
    throw createHttpError.NotFound('Class not found');
  }
  return classData;
};

// Helper method to parse pagination params
const getPaginationParams = (query) => {
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const offset = (page - 1) * limit;
  return { limit, offset };
};

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
    const { limit, offset } = getPaginationParams(req.query);
    const { number, name } = req.query;
    const whereClause = {};
    if (number) whereClause.number = number;
    if (name) whereClause.name = { [Op.iLike]: `%${name}%` };

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
    const classId = validateClassId(req.params.id);
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
    const classId = validateClassId(req.params.id);
    await checkClassExists(classId);

    const { limit, offset } = getPaginationParams(req.query);
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
        'student_code',
      ],
      raw: true,
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

export async function updateClassHandler(req, res, next) {
  try {
    const classId = validateClassId(req.params.id);
    const classData = await checkClassExists(classId);

    // If capacity is being updated, check against enrolled students
    if (req.body.capacity !== undefined) {
      const enrolledStudents = await Student.count({ where: { classId } });
      const newCapacity = parseInt(req.body.capacity, 10);
      if (newCapacity < enrolledStudents) {
        throw createHttpError.BadRequest(
          `New capacity (${newCapacity}) cannot be less than the number of enrolled students (${enrolledStudents})`
        );
      }
    }

    // Update only provided fields
    await classData.update(req.body);

    // Fetch updated class
    const updatedClass = await Class.findByPk(classId, {
      attributes: ['id', 'number', 'name', 'capacity'],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class updated successfully',
      class: updatedClass,
    });
  } catch (error) {
    next(error);
  }
}
export async function deleteClassHandler(req, res, next) {
  try {
    const classId = validateClassId(req.params.id);
    const classData = await checkClassExists(classId);

    // Check if class has students (optional: depends on your business logic)
    const studentCount = await Student.count({ where: { classId } });
    if (studentCount > 0) {
      throw createHttpError.BadRequest(
        'Cannot delete class with enrolled students'
      );
    }

    await classData.destroy();

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
