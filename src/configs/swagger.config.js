import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Load multiple YAML files and merge them
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
  paths: {
    ...studentDocs.paths,
    ...fieldsDocs.paths,
    ...classesDocs.paths,
    ...teachersDocs.paths,
  },
  components: {
    schemas: {
      ...studentDocs.components.schemas,
      ...fieldsDocs.components.schemas,
      ...classesDocs.components.schemas,
      ...teachersDocs.components.schemas,
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(baseSwagger));
};

export { setupSwagger };
