require('dotenv').config();
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module').AppModule;
const { ValidationPipe } = require('@nestjs/common');
const { SwaggerModule, DocumentBuilder } = require('@nestjs/swagger');

let app;

async function createApp() {
  const app = await NestFactory.create(AppModule, { 
    cors: true,
    logger: ['error', 'warn']
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.setGlobalPrefix('api');
  
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Expanders360 API')
    .setDescription('Global Expansion Management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  await app.init();
  return app;
}

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = await createApp();
    }
    const server = app.getHttpAdapter().getInstance();
    server(req, res);
  } catch (error) {
    console.error('Error in API handler:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
