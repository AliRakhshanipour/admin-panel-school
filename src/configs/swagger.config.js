// src/swagger.js
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Load YAML files
const studentDocs = YAML.load(
  path.join(process.cwd(), '/src/docs/students.yaml')
);
const fieldsDocs = YAML.load(path.join(process.cwd(), '/src/docs/fields.yaml'));
const classesDocs = YAML.load(
  path.join(process.cwd(), '/src/docs/classes.yaml')
);
const teachersDocs = YAML.load(
  path.join(process.cwd(), '/src/docs/teachers.yaml')
);
const schedulesDocs = YAML.load(
  path.join(process.cwd(), '/src/docs/schedules.yaml')
);
const authDocs = YAML.load(path.join(process.cwd(), '/src/docs/auth.yaml'));
const usersDocs = YAML.load(path.join(process.cwd(), '/src/docs/users.yaml'));

// Base Swagger definition
const baseSwagger = {
  openapi: '3.0.0',
  info: {
    title: 'School Management API',
    version: '1.0.0',
    description: 'API documentation for School Management System',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  security: [
    {
      bearerAuth: [], // Global security requirement for JWT
    },
  ],
  paths: {
    ...studentDocs.paths,
    ...fieldsDocs.paths,
    ...classesDocs.paths,
    ...teachersDocs.paths,
    ...schedulesDocs.paths,
    ...authDocs.paths,
    ...usersDocs.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ...studentDocs.components.schemas,
      ...fieldsDocs.components.schemas,
      ...classesDocs.components.schemas,
      ...teachersDocs.components.schemas,
      ...schedulesDocs.components.schemas,
      ...authDocs.components.schemas,
      ...usersDocs.components.schemas,
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(baseSwagger));
};

export { setupSwagger };
