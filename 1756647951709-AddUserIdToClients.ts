import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToClients1756647951709 implements MigrationInterface {
    name = 'AddUserIdToClients1756647951709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_project_match\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_vendor_match\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_client_project\``);
        await queryRunner.query(`DROP INDEX \`IDX_project_vendor\` ON \`matches\``);
        await queryRunner.query(`DROP INDEX \`contactEmail\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`email\` ON \`users\``);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD UNIQUE INDEX \`IDX_59c1e5e51addd6ebebf76230b3\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD \`projectId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP COLUMN \`vendorId\``);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD \`vendorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`clientId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD UNIQUE INDEX \`IDX_5f9321f889ea6e1c5ed4f56790\` (\`contactEmail\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_73f8792166266849242dd0679e\` ON \`matches\` (\`projectId\`, \`vendorId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_59c1e5e51addd6ebebf76230b3\` ON \`clients\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_cb10dba388ea0729a9786c05ebb\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_04315d832210f53fab4b4179394\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_091f9433895a53408cb8ae3864f\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`clients\` ADD CONSTRAINT \`FK_59c1e5e51addd6ebebf76230b37\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`clients\` DROP FOREIGN KEY \`FK_59c1e5e51addd6ebebf76230b37\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_091f9433895a53408cb8ae3864f\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_04315d832210f53fab4b4179394\``);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP FOREIGN KEY \`FK_cb10dba388ea0729a9786c05ebb\``);
        await queryRunner.query(`DROP INDEX \`REL_59c1e5e51addd6ebebf76230b3\` ON \`clients\``);
        await queryRunner.query(`DROP INDEX \`IDX_73f8792166266849242dd0679e\` ON \`matches\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP INDEX \`IDX_5f9321f889ea6e1c5ed4f56790\``);
        await queryRunner.query(`ALTER TABLE \`projects\` DROP COLUMN \`clientId\``);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD \`clientId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP COLUMN \`vendorId\``);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD \`vendorId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`matches\` DROP COLUMN \`projectId\``);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD \`projectId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP INDEX \`IDX_59c1e5e51addd6ebebf76230b3\``);
        await queryRunner.query(`ALTER TABLE \`clients\` DROP COLUMN \`userId\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`email\` ON \`users\` (\`email\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`contactEmail\` ON \`clients\` (\`contactEmail\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_project_vendor\` ON \`matches\` (\`projectId\`, \`vendorId\`)`);
        await queryRunner.query(`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_client_project\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_vendor_match\` FOREIGN KEY (\`vendorId\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`matches\` ADD CONSTRAINT \`FK_project_match\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
