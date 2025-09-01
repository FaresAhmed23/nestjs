// src/database/seeds/seed-vendors.ts
import { AppDataSource } from '../../data-source';
import { Vendor } from '../../vendors/entities/vendor.entity';

async function seedVendors() {
  await AppDataSource.initialize();

  try {
    const vendorRepo = AppDataSource.getRepository(Vendor);

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

    for (const data of vendorData) {
      const existing = await vendorRepo.findOne({ where: { name: data.name } });
      if (!existing) {
        await vendorRepo.save(data);
        console.log(`Created vendor: ${data.name}`);
      } else {
        console.log(`Vendor already exists: ${data.name}`);
      }
    }

    console.log('Vendor seeding completed!');
  } catch (error) {
    console.error('Error seeding vendors:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedVendors();
