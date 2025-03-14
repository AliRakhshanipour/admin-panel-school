import { StatusCodes } from 'http-status-codes';
import { Student } from './student.model.js';
import createHttpError from 'http-errors';
import { checkFieldExists } from '../fields/field.service.js';
import { Field } from '../fields/field.model.js';
import { Sequelize, Op } from 'sequelize';

export async function createStudentHandler(req, res, next) {
  try {
    const { subFieldId } = req.body;
    if (subFieldId) {
      await checkFieldExists(subFieldId);
    }
    const student = await Student.create(req.body);
    res.status(StatusCodes.CREATED).json({
      message: 'Student created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllStudentsHandler(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = req.query.page
      ? (parseInt(req.query.page, 10) - 1) * limit
      : 0;

    const {
      first_name,
      last_name,
      student_code,
      national_code,
      gender,
      status,
      min_age,
      max_age,
      graduated,
    } = req.query;

    // Convert numeric filters
    const minAgeNum = min_age !== undefined ? Number(min_age) : undefined;
    const maxAgeNum = max_age !== undefined ? Number(max_age) : undefined;

    // Convert boolean filters
    const graduatedBool =
      graduated === 'true' ? true : graduated === 'false' ? false : undefined;

    const whereClause = {};

    if (first_name) whereClause.first_name = { [Op.like]: `%${first_name}%` };
    if (last_name) whereClause.last_name = { [Op.like]: `%${last_name}%` };
    if (student_code) whereClause.student_code = student_code;
    if (national_code) whereClause.national_code = national_code;
    if (gender) whereClause.gender = gender;
    if (status) whereClause.status = status;
    if (graduatedBool !== undefined) whereClause.graduated = graduatedBool; // Fixing boolean filter

    // Handle age range filtering properly
    if (minAgeNum !== undefined || maxAgeNum !== undefined) {
      whereClause.age = {};
      if (minAgeNum !== undefined) whereClause.age[Op.gte] = minAgeNum;
      if (maxAgeNum !== undefined) whereClause.age[Op.lte] = maxAgeNum;

      // Remove age filter if empty
      if (Object.keys(whereClause.age).length === 0) delete whereClause.age;
    }

    // Fetch students with filters and pagination
    const { count, rows: students } = await Student.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      attributes: [
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
        'national_code',
      ],
    });

    res.status(StatusCodes.OK).json({
      message: students.length
        ? 'Students fetched successfully'
        : 'No students found',
      total: count,
      students,
    });
  } catch (error) {
    next(error);
  }
}

export async function getStudentByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [{ model: Field, as: 'subField', attributes: ['name'] }],
      attributes: { exclude: ['updated_at'] },
    });
    if (!student) throw createHttpError.NotFound('Student not found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student fetched successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStudentByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const deletedRows = await Student.destroy({ where: { id } });

    if (!deletedRows) {
      throw createHttpError.NotFound('Student not found');
    }

    res.status(StatusCodes.NO_CONTENT).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStudentByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const [updatedRows] = await Student.update(req.body, { where: { id } });

    if (!updatedRows) {
      throw createHttpError.NotFound('Student not found');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function graduateStudentHandler(req, res, next) {
  try {
    const { id } = req.params;
    const [updatedRows] = await Student.update(req.body, { where: { id } });
    if (!updatedRows) {
      throw createHttpError.NotFound('Student not found');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'graduated status changed to ' + req.body.graduated,
    });
  } catch (error) {
    next(error);
  }
}
export async function changeStudentFieldHandler(req, res, next) {
  try {
    const { id } = req.params;
    const [updatedRows] = await Student.update(req.body, { where: { id } });
    if (!updatedRows) {
      throw createHttpError.NotFound('Student not found');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "student's field changed to " + req.body.subFieldId,
    });
  } catch (error) {
    next(error);
  }
}
