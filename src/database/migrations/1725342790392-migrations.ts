import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1725342790392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('weathers', true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('weathers', true);
  }
}
