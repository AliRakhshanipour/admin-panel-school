import { config } from 'dotenv';
import { StatusCodes } from 'http-status-codes';
import { Sequelize } from 'sequelize'; // Import Sequelize for error detection
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

      // Handle Sequelize Unique Constraint Error
      if (err instanceof Sequelize.UniqueConstraintError) {
        const field = err.errors[0].path; // Get the field that caused the violation
        const message = `${field} must be unique`;

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Validation error',
          error: message,
        });
      }

      // Handle other types of errors
      const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      const message = err.message || 'Internal Server Error';

      // Log errors in development
      if (process.env.NODE_ENV !== 'production') {
        console.error(err);
      }

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
