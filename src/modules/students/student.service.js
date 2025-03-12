import { StatusCodes } from 'http-status-codes';
import { Student } from './student.model.js';
import createHttpError from 'http-errors';
import { checkFieldExists } from '../fields/field.service.js';
import { Field } from '../fields/field.model.js';
import { Sequelize } from 'sequelize';

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
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.page)
      ? (parseInt(req.query.page) - 1) * limit
      : 0;

    const students = await Student.findAll({
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
          'fullName',
        ],
        'studentCode',
        'nationalCode',
      ],
    });

    if (students.length === 0) {
      return res.status(StatusCodes.OK).json({
        message: 'No students found',
        students,
      });
    }

    res.status(StatusCodes.OK).json({
      message: 'Students fetched successfully',
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
