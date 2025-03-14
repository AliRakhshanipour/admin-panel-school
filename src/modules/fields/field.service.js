import { StatusCodes } from 'http-status-codes';
import { Field } from './field.model.js';
import createHttpError from 'http-errors';

export async function createFieldHandler(req, res, next) {
  try {
    const { parentId } = req.body;
    if (parentId) {
      const field = await checkFieldExists(parentId);
      if (!field) {
        throw createHttpError.NotFound('parent field not found');
      }
    }

    const field = await Field.create(req.body);

    res.status(StatusCodes.CREATED).json({
      message: 'field created successfully',
      field,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAllFieldsHandler(req, res, next) {
  try {
    const fields = await Field.findAll();

    if (fields.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'no fields found',
      });
    }

    res.status(StatusCodes.OK).json({
      message: 'fields fetched successfully',
      fields,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFieldByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const field = await Field.findByPk(id);

    if (!field) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'field not found',
      });
    }

    res.status(StatusCodes.OK).json({
      message: 'field fetched successfully',
      field,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateFieldHandler(req, res, next) {
  try {
    const { id } = req.params;
    const [updatedRows] = await Field.update(req.body, { where: { id } });

    if (!updatedRows) {
      throw createHttpError.NotFound('no field found with this id');
    }

    res.status(StatusCodes.OK).json({
      message: 'field updated successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFieldHandler(req, res, next) {
  try {
    const { id } = req.params;
    const deleteRows = await Field.destroy({ where: { id } });

    if (!deleteRows) {
      throw createHttpError.NotFound('no field found with this id');
    }

    res.status(StatusCodes.NO_CONTENT).json({
      message: 'field deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function checkFieldExists(id) {
  const field = await Field.findByPk(id);
  if (!field) {
    throw createHttpError.NotFound(`Field with id ${id} does not exist`);
  }
  return field;
}
