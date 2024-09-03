import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrations1725342808488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'weathers',
        schema: 'weathers',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'city_id',
            type: 'int',
          },
          {
            name: 'date',
            type: 'date',
          },
          {
            name: 'temperature',
            type: 'int',
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(
      new Table({
        name: 'weathers',
        schema: 'weathers',
      }),
    );
  }
}
