'use strict';
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title      : 'Manara-Nexus API',
      version    : '1.0.0',
      description: 'REST API documentation for Manara-Nexus NGO Management System',
      contact    : { name: 'Manara-Nexus', email: 'contact@manara-nexus.org' },
    },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type        : 'http',
          scheme      : 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

module.exports = swaggerJsdoc(options);
