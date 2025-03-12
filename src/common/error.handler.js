import { config } from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize'; // Import Sequelize for error handling

config();

class ErrorHandler {
  #app;

  constructor(app) {
    this.#app = app;
    this.errorHandler();
    this.notFoundRoute();
  }

  notFoundRoute() {
    this.#app.all('*', (req, res) => {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  errorHandler() {
    this.#app.use((err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }

      let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      let message = err.message || 'Internal Server Error';

      // ✅ Handle Sequelize Unique Constraint Error
      if (err instanceof Sequelize.UniqueConstraintError) {
        const field = err.errors?.[0]?.path || 'Field';
        message = `${field} must be unique`;

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          error: message,
        });
      }

      // ✅ Handle Sequelize Foreign Key Constraint Error
      if (err instanceof Sequelize.ForeignKeyConstraintError) {
        message = `Invalid foreign key: The referenced field does not exist or has been deleted`;

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Foreign key constraint violation',
          error: message,
        });
      }

      // ✅ Handle Sequelize Validation Errors
      if (err instanceof Sequelize.ValidationError) {
        message = err.errors.map((e) => e.message).join(', ');

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          error: message,
        });
      }

      // ✅ Log errors in development mode
      if (process.env.NODE_ENV !== 'production') {
        console.error(err);
      }

      // ✅ General Error Handling
      res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        error: err.name || 'Error',
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
      });
    });
  }
}

export { ErrorHandler };
