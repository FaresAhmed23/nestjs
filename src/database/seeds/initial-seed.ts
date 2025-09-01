// src/database/seeds/initial-seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { AuthService } from '../../auth/auth.service';
import { UserRole } from '../../users/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const authService = app.get(AuthService);

    // Create admin user
    try {
      await authService.register(
        'admin@expanders360.com',
        'admin123',
        UserRole.ADMIN,
        'Expanders360',
      );
      console.log('Admin user created successfully');
    } catch (error) {
      if (error.message === 'User already exists') {
        console.log('Admin user already exists');
      } else {
        throw error;
      }
    }

    // Create client user
    try {
      await authService.register(
        'client1@example.com',
        'client123',
        UserRole.CLIENT,
        'Test Company',
      );
      console.log('Client user created successfully');
    } catch (error) {
      if (error.message === 'User already exists') {
        console.log('Client user already exists');
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await app.close();
  }
}

seed();
