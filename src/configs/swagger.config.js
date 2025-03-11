import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Load multiple YAML files and merge them
const studentDocs = YAML.load(
  path.join(process.cwd(), '/src/docs/students.yaml')
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
  },
  components: {
    schemas: {
      ...studentDocs.components.schemas,
    },
  },
};

// Function to set up Swagger in Express app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(baseSwagger));
};

export { setupSwagger };
