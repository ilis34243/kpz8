import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBio1791734234932 implements MigrationInterface {
  name = 'AddUserBio1791734234932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "bio" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "bio"
        `);
  }
}
