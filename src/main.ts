import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
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

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Expanders360 API')
    .setDescription(
      `
      ## Global Expansion Management API
      
      This API helps founders run expansion projects in new countries by:
      - Managing projects and clients
      - Matching projects with vendors
      - Storing research documents
      - Providing analytics
      
      ### Authentication
      1. Register or login to get a JWT token
      2. Click the "Authorize" button and enter your token
      3. All subsequent requests will include the token
      
      ### Default Credentials
      - Admin: admin@expanders360.com / admin123
      - Client: client1@example.com / client123
    `,
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User registration and login')
    .addTag('Projects', 'Manage expansion projects')
    .addTag('Vendors', 'Manage service vendors')
    .addTag('Matches', 'Project-vendor matching')
    .addTag('Documents', 'Research documents (MongoDB)')
    .addTag('Analytics', 'Analytics and reporting')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger options with CDN assets
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Expanders360 API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin-bottom: 50px }
      .swagger-ui .scheme-container { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px }
    `,
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`
    ✅ Application is running on: ${await app.getUrl()}
    📚 Swagger documentation: ${await app.getUrl()}/api
    🔐 Default admin: admin@expanders360.com / admin123
  `);
}
bootstrap();
