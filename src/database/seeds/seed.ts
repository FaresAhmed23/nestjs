import { AppDataSource } from '../../data-source';
import { User, UserRole } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  
  try {
    const userRepo = AppDataSource.getRepository(User);
    const clientRepo = AppDataSource.getRepository(Client);
    const vendorRepo = AppDataSource.getRepository(Vendor);
    const projectRepo = AppDataSource.getRepository(Project);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await userRepo.save({
      email: 'admin@expanders360.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      companyName: 'Expanders360'
    });
    console.log('Admin user created:', admin.email);

    // Create client user
    const clientPassword = await bcrypt.hash('client123', 10);
    const clientUser = await userRepo.save({
      email: 'client1@example.com',
      password: clientPassword,
      role: UserRole.CLIENT,
      companyName: 'Test Company'
    });
    console.log('Client user created:', clientUser.email);

    // Create client
    const client = await clientRepo.save({
      companyName: 'Test Company',
      contactEmail: 'client1@example.com'
    });
    console.log('Client created:', client.companyName);

    // Create vendors
    const vendors = await vendorRepo.save([
      {
        name: 'Global Expansion Partners',
        countriesSupported: ['USA', 'Canada', 'UK'],
        servicesOffered: ['Legal', 'HR', 'Accounting'],
        rating: 4.8,
        responseSlaHours: 24
      },
      {
        name: 'International Business Solutions',
        countriesSupported: ['Germany', 'France', 'Spain'],
        servicesOffered: ['Market Research', 'Legal', 'Marketing'],
        rating: 4.5,
        responseSlaHours: 48
      }
    ]);
    console.log('Vendors created:', vendors.length);

    // Create a project
    const project = await projectRepo.save({
      clientId: client.id,
      country: 'USA',
      servicesNeeded: ['Legal', 'HR'],
      budget: 50000,
      status: ProjectStatus.ACTIVE
    });
    console.log('Project created:', project.country);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
