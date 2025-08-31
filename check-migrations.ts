import { AppDataSource } from './src/data-source';

async function checkMigrations() {
  await AppDataSource.initialize();
  
  const migrations = await AppDataSource.query('SELECT * FROM migrations');
  console.log('Executed migrations:', migrations);
  
  const tables = await AppDataSource.query("SHOW TABLES");
  console.log('Existing tables:', tables);
  
  await AppDataSource.destroy();
}

checkMigrations().catch(console.error);
