import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AuthService } from '../../auth/auth.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const authService = app.get(AuthService);
    
    // Create admin user
    await authService.register(
      'admin@expanders360.com',
      'admin123',
      'admin',
      'Expanders360'
    );
    
    console.log('Admin user created successfully');
  } catch (error) {
    console.log('Seed error (might be duplicate):', error.message);
  }
  
  await app.close();
}

seed();
