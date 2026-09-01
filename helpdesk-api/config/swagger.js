const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HelpDesk API',
      version: '1.0.0',
      description: 'API REST para gestao de chamados e suporte tecnico (recuperacao trimestral).'
    },
    servers: [{ url: '/', description: 'Servidor atual' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
