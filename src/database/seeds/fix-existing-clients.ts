import { AppDataSource } from '../../data-source';
import { User, UserRole } from '../../users/entities/user.entity';
import { Client } from '../../clients/entities/client.entity';

async function fixExistingClients() {
  await AppDataSource.initialize();

  try {
    const userRepo = AppDataSource.getRepository(User);
    const clientRepo = AppDataSource.getRepository(Client);

    const clientUsers = await userRepo.find({
      where: { role: UserRole.CLIENT },
    });

    console.log(`Found ${clientUsers.length} client users`);

    for (const user of clientUsers) {
      try {
        const existingClient = await clientRepo.findOne({
          where: { contactEmail: user.email },
        });

        if (!existingClient) {
          const client = clientRepo.create({
            companyName: user.companyName || user.email,
            contactEmail: user.email,
          });
          await clientRepo.save(client);
          console.log(`Created client record for user: ${user.email}`);
        } else {
          console.log(`Client record already exists for user: ${user.email}`);
        }
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err.message);
      }
    }

    console.log('Fixed existing client records successfully!');
  } catch (error) {
    console.error('Error fixing client records:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixExistingClients();
