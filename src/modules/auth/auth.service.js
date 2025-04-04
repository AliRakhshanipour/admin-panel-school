// modules/auth/auth.service.js
import createHttpError from 'http-errors';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Login user
export async function loginHandler(req, res, next) {
  try {
    const { username, password } = req.body;
    console.log('Login attempt - Username:', username, 'Password:', password);

    const user = await User.findOne({ where: { username } });
    if (!user) {
      console.log('User not found');
      throw createHttpError.Unauthorized('Invalid username or password');
    }
    console.log('Stored password:', user.password);

    const match = await user.comparePassword(password);
    console.log('Password match:', match);
    if (!match) {
      throw createHttpError.Unauthorized('Invalid username or password');
    }

    // const user = await User.findOne({ where: { username } });

    // if (!user || !(await user.comparePassword(password))) {
    //   throw createHttpError.Unauthorized('Invalid username or password');
    // }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
}
