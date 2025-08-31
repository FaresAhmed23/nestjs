const { NestFactory } = require('@nestjs/core');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');
const { AppModule } = require('../dist/app.module');

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn'],
        cors: true
      });

      app.useGlobalPipes({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      });

      // Swagger configuration for Vercel
      const config = new DocumentBuilder()
        .setTitle('Expanders360 API')
        .setDescription('Global Expansion Management API')
        .setVersion('1.0')
        .addBearerAuth({
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }, 'JWT-auth')
        .build();
        
      const document = SwaggerModule.createDocument(app, config);
      
      // Use CDN for Swagger assets
      SwaggerModule.setup('api', app, document, {
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJs: [
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
        ],
      });

      await app.init();
    }

    const server = app.getHttpAdapter().getInstance();
    server(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
