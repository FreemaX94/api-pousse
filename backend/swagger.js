const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Pousse', version: '1.0.0' }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);
const swaggerUIOptions = { explorer: true };

module.exports = { swaggerSpec, swaggerUIOptions };
