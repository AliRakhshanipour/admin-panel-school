// modules/users/user.service.js
import { StatusCodes } from 'http-status-codes';
import { User } from './user.model.js';
import createHttpError from 'http-errors';

// Helper: Validate and parse ID
const validateUserId = (id) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId) || userId < 1) {
    throw createHttpError.BadRequest('Invalid user ID');
  }
  return userId;
};

// Helper: Check if user exists
const checkUserExists = async (id) => {
  const user = await User.findByPk(id, { attributes: ['id'] });
  if (!user) {
    throw createHttpError.NotFound('User not found');
  }
  return user;
};

// Create a new user (super-user only)
export async function createUserHandler(req, res, next) {
  try {
    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully',
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    next(error);
  }
}

// Get all users (reporting for both roles)
export async function getAllUsersHandler(req, res, next) {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'created_at'],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: users.length ? 'Users fetched successfully' : 'No users found',
      users,
    });
  } catch (error) {
    next(error);
  }
}

// Get user by ID
export async function getUserByIdHandler(req, res, next) {
  try {
    const userId = validateUserId(req.params.id);
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'role', 'created_at'],
    });

    if (!user) throw createHttpError.NotFound('User not found');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
}

// Update user by ID (super-user only)
export async function updateUserHandler(req, res, next) {
  try {
    const userId = validateUserId(req.params.id);
    await checkUserExists(userId);

    const [updatedRows] = await User.update(req.body, {
      where: { id: userId },
    });
    if (!updatedRows) throw createHttpError.NotFound('User not found');

    const updatedUser = await User.findByPk(userId, {
      attributes: ['id', 'username', 'role', 'created_at'],
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
}

// Delete user by ID (super-user only)
export async function deleteUserHandler(req, res, next) {
  try {
    const userId = validateUserId(req.params.id);
    await checkUserExists(userId);

    await User.destroy({ where: { id: userId } });

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
