import { StatusCodes } from 'http-status-codes';
import { Student } from './student.model.js';
import createHttpError from 'http-errors';
import { checkFieldExists } from '../fields/field.service.js';
import { Field } from '../fields/field.model.js';
import { Sequelize, Op } from 'sequelize';
import { Class } from '../class/class.model.js';

// Helper: Validate and parse ID
const validateStudentId = (id) => {
  const studentId = parseInt(id, 10);
  if (isNaN(studentId) || studentId < 1) {
    throw createHttpError.BadRequest('Invalid student ID');
  }
  return studentId;
};

// Helper: Check if student exists
const checkStudentExists = async (id) => {
  const student = await Student.findByPk(id, { attributes: ['id', 'classId'] });
  if (!student) {
    throw createHttpError.NotFound('Student not found');
  }
  return student;
};

// Helper: Validate and check class existence
const validateClassId = (id) => {
  const classId = parseInt(id, 10);
  if (isNaN(classId) || classId < 1) {
    throw createHttpError.BadRequest('Invalid class ID');
  }
  return classId;
};

const checkClassExists = async (classId) => {
  const classData = await Class.findByPk(classId, {
    attributes: ['id', 'capacity'],
  });
  if (!classData) {
    throw createHttpError.NotFound('Class not found');
  }
  return classData;
};

// Helper: Parse pagination parameters
const getPaginationParams = (query) => {
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const offset = (page - 1) * limit;
  return { limit, offset };
};

// Helper: Build where clause for filtering
const buildStudentWhereClause = ({
  first_name,
  last_name,
  student_code,
  national_code,
  gender,
  status,
  min_age,
  max_age,
  graduated,
}) => {
  const whereClause = {};

  if (first_name) whereClause.first_name = { [Op.iLike]: `%${first_name}%` };
  if (last_name) whereClause.last_name = { [Op.iLike]: `%${last_name}%` };
  if (student_code) whereClause.student_code = student_code;
  if (national_code) whereClause.national_code = national_code;
  if (gender) whereClause.gender = gender;
  if (status) whereClause.status = status;

  const graduatedBool =
    graduated === 'true' ? true : graduated === 'false' ? false : undefined;
  if (graduatedBool !== undefined) whereClause.graduated = graduatedBool;

  const minAgeNum = min_age !== undefined ? Number(min_age) : undefined;
  const maxAgeNum = max_age !== undefined ? Number(max_age) : undefined;
  if (minAgeNum !== undefined || maxAgeNum !== undefined) {
    whereClause.age = {};
    if (minAgeNum !== undefined) whereClause.age[Op.gte] = minAgeNum;
    if (maxAgeNum !== undefined) whereClause.age[Op.lte] = maxAgeNum;
    if (Object.keys(whereClause.age).length === 0) delete whereClause.age;
  }

  return whereClause;
};

// Handler: Create a student
export async function createStudentHandler(req, res, next) {
  try {
    const { subFieldId } = req.body;
    console.log(req.body);

    if (subFieldId) await checkFieldExists(subFieldId);

    const student = await Student.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Student created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
}

// Handler: Get all students with filters
export async function getAllStudentsHandler(req, res, next) {
  try {
    const { limit, offset } = getPaginationParams(req.query);
    const whereClause = buildStudentWhereClause(req.query);

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
      raw: true,
    });

    res.status(StatusCodes.OK).json({
      success: true,
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

// Handler: Get student by ID
export async function getStudentByIdHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    const student = await Student.findByPk(studentId, {
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

// Handler: Delete student by ID
export async function deleteStudentByIdHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    await checkStudentExists(studentId);

    await Student.destroy({ where: { id: studentId } });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Handler: Update student by ID
export async function updateStudentByIdHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    await checkStudentExists(studentId);

    const [updatedRows] = await Student.update(req.body, {
      where: { id: studentId },
    });
    if (!updatedRows) throw createHttpError.NotFound('Student not found');

    const updatedStudent = await Student.findByPk(studentId, {
      attributes: [
        'id',
        'first_name',
        'last_name',
        'student_code',
        'national_code',
      ],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Student updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
}

// Handler: Graduate student
export async function graduateStudentHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    await checkStudentExists(studentId);

    const { graduated } = req.body;
    if (typeof graduated !== 'boolean') {
      throw createHttpError.BadRequest('Graduated status must be a boolean');
    }

    const [updatedRows] = await Student.update(
      { graduated },
      { where: { id: studentId } }
    );
    if (!updatedRows) throw createHttpError.NotFound('Student not found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Graduated status changed to ${graduated}`,
    });
  } catch (error) {
    next(error);
  }
}

// Handler: Change student field
export async function changeStudentFieldHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    await checkStudentExists(studentId);

    const { subFieldId } = req.body;
    if (subFieldId === undefined) {
      throw createHttpError.BadRequest('subFieldId is required');
    }
    await checkFieldExists(subFieldId);

    const [updatedRows] = await Student.update(
      { subFieldId },
      { where: { id: studentId } }
    );
    if (!updatedRows) throw createHttpError.NotFound('Student not found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Student's field changed to ${subFieldId}`,
    });
  } catch (error) {
    next(error);
  }
}

// New Handler: Add student to a class
export async function addStudentToClassHandler(req, res, next) {
  try {
    const studentId = validateStudentId(req.params.id);
    const { classId } = req.body;

    // Validate classId
    if (!classId) {
      throw createHttpError.BadRequest('classId is required');
    }
    const validatedClassId = validateClassId(classId);

    // Check student and class existence
    const student = await checkStudentExists(studentId);
    const classData = await checkClassExists(validatedClassId);

    // Check if student is already in a class
    if (student.classId) {
      throw createHttpError.BadRequest(
        `Student is already assigned to class with ID ${student.classId}`
      );
    }

    // Check class capacity
    const enrolledStudents = await Student.count({
      where: { classId: validatedClassId },
    });
    if (enrolledStudents >= classData.capacity) {
      throw createHttpError.BadRequest(
        `Class with ID ${validatedClassId} has reached its capacity of ${classData.capacity}`
      );
    }

    // Assign student to class
    await Student.update(
      { classId: validatedClassId },
      { where: { id: studentId } }
    );

    const updatedStudent = await Student.findByPk(studentId, {
      attributes: ['id', 'first_name', 'last_name', 'student_code', 'classId'],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Student assigned to class with ID ${validatedClassId} successfully`,
      student: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
}
