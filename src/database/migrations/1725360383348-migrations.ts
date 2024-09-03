import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Migrations1725360383348 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      new Table({
        name: 'weathers',
        schema: 'weathers',
      }),
      new TableForeignKey({
        name: 'FK_weathers_city',
        columnNames: ['city_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'weathers.cities',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('weathers.weathers', 'FK_weathers_city');
  }
}
