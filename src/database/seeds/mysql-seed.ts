import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Project, ProjectStatus } from '../../projects/entities/project.entity';

export async function seedMySQL(dataSource: DataSource) {
  console.log('Starting MySQL seed...');

  const userRepo = dataSource.getRepository(User);
  const clientRepo = dataSource.getRepository(Client);
  const vendorRepo = dataSource.getRepository(Vendor);
  const projectRepo = dataSource.getRepository(Project);

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await userRepo.save({
    email: 'admin@expanders360.com',
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  const clients = [];
  for (let i = 1; i <= 3; i++) {
    const clientPassword = await bcrypt.hash(`client${i}123`, 10);
    const user = await userRepo.save({
      email: `client${i}@example.com`,
      password: clientPassword,
      role: UserRole.CLIENT,
      companyName: `Company ${i}`,
    });

    const client = await clientRepo.save({
      companyName: `Company ${i}`,
      contactEmail: `client${i}@example.com`,
    });
    clients.push(client);
  }

  const vendorData = [
    {
      name: 'Global Expansion Partners',
      countriesSupported: ['USA', 'Canada', 'UK'],
      servicesOffered: ['Legal', 'HR', 'Accounting'],
      rating: 4.8,
      responseSlaHours: 24,
    },
    {
      name: 'International Business Solutions',
      countriesSupported: ['Germany', 'France', 'Spain'],
      servicesOffered: ['Market Research', 'Legal', 'Marketing'],
      rating: 4.5,
      responseSlaHours: 48,
    },
    {
      name: 'Asia Pacific Consultants',
      countriesSupported: ['Japan', 'Singapore', 'Australia'],
      servicesOffered: ['Accounting', 'Compliance', 'HR'],
      rating: 4.7,
      responseSlaHours: 36,
    },
    {
      name: 'Nordic Expansion Services',
      countriesSupported: ['Sweden', 'Norway', 'Denmark'],
      servicesOffered: ['Legal', 'Marketing', 'IT Setup'],
      rating: 4.6,
      responseSlaHours: 24,
    },
    {
      name: 'LATAM Business Hub',
      countriesSupported: ['Brazil', 'Mexico', 'Argentina'],
      servicesOffered: ['HR', 'Legal', 'Market Research'],
      rating: 4.4,
      responseSlaHours: 72,
    },
  ];

  const vendors = [];
  for (const data of vendorData) {
    const vendor = await vendorRepo.save(data);
    vendors.push(vendor);
  }

  const projectData = [
    {
      client: clients[0],
      country: 'USA',
      servicesNeeded: ['Legal', 'HR'],
      budget: 50000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client: clients[0],
      country: 'Germany',
      servicesNeeded: ['Market Research', 'Legal'],
      budget: 35000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client: clients[1],
      country: 'Japan',
      servicesNeeded: ['Accounting', 'HR'],
      budget: 60000,
      status: ProjectStatus.ACTIVE,
    },
    {
      client: clients[2],
      country: 'Brazil',
      servicesNeeded: ['Legal', 'Market Research'],
      budget: 40000,
      status: ProjectStatus.ACTIVE,
    },
  ];

  for (const data of projectData) {
    await projectRepo.save({
      ...data,
      clientId: data.client.id,
    });
  }

  console.log('MySQL seed completed!');
}
