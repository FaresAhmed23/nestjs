const { NestFactory } = require('@nestjs/core');
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      // Fix the import path - it's in dist/src/ not dist/
      const { AppModule } = require('../dist/src/app.module');

      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
        cors: true,
      });

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
      );

      await app.init();
    }

    // Get the internal Express instance
    const server = app.getHttpAdapter().getInstance();

    // Handle Swagger UI
    if (req.url === '/api' || req.url === '/api/') {
      const config = new DocumentBuilder()
        .setTitle('Expanders360 API')
        .setDescription('Global Expansion Management API')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          'JWT-auth',
        )
        .build();

      const document = SwaggerModule.createDocument(app, config);

      // Serve Swagger UI
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Expanders360 API Documentation</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
          <script>
            window.onload = function() {
              window.ui = SwaggerUIBundle({
                spec: ${JSON.stringify(document)},
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                  SwaggerUIBundle.presets.apis,
                  SwaggerUIStandalonePreset
                ],
                layout: "StandaloneLayout",
                persistAuthorization: true,
              });
            };
          </script>
        </body>
        </html>
      `);
      return;
    }

    // Handle regular API requests
    server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
