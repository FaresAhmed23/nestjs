import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` varchar(36) NOT NULL,
        \`email\` varchar(255) NOT NULL UNIQUE,
        \`password\` varchar(255) NOT NULL,
        \`role\` enum('client', 'admin') NOT NULL DEFAULT 'client',
        \`companyName\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create clients table
    await queryRunner.query(`
      CREATE TABLE \`clients\` (
        \`id\` varchar(36) NOT NULL,
        \`companyName\` varchar(255) NOT NULL,
        \`contactEmail\` varchar(255) NOT NULL UNIQUE,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create projects table
    await queryRunner.query(`
      CREATE TABLE \`projects\` (
        \`id\` varchar(36) NOT NULL,
        \`clientId\` varchar(36) NOT NULL,
        \`country\` varchar(255) NOT NULL,
        \`servicesNeeded\` text NOT NULL,
        \`budget\` decimal(10,2) NOT NULL,
        \`status\` enum('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        KEY \`FK_client_project\` (\`clientId\`),
        CONSTRAINT \`FK_client_project\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    // Create vendors table
    await queryRunner.query(`
      CREATE TABLE \`vendors\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`countriesSupported\` text NOT NULL,
        \`servicesOffered\` text NOT NULL,
        \`rating\` decimal(3,2) NOT NULL,
        \`responseSlaHours\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Create matches table
    await queryRunner.query(`
      CREATE TABLE \`matches\` (
        \`id\` varchar(36) NOT NULL,
        \`projectId\` varchar(36) NOT NULL,
        \`vendorId\` varchar(36) NOT NULL,
        \`score\` decimal(5,2) NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_project_vendor\` (\`projectId\`, \`vendorId\`),
        KEY \`FK_project_match\` (\`projectId\`),
        KEY \`FK_vendor_match\` (\`vendorId\`),
        CONSTRAINT \`FK_project_match\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_vendor_match\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`matches\``);
    await queryRunner.query(`DROP TABLE \`vendors\``);
    await queryRunner.query(`DROP TABLE \`projects\``);
    await queryRunner.query(`DROP TABLE \`clients\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
