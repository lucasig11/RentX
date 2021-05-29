import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRentalsTable1622293938806 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'rentals',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'car_id',
                        type: 'uuid',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'start_date',
                        type: 'timestamp',
                    },
                    {
                        name: 'expected_return_date',
                        type: 'timestamp',
                    },
                    {
                        name: 'return_date',
                        isNullable: true,
                        type: 'timestamp',
                    },
                    {
                        name: 'total',
                        isNullable: true,
                        type: 'numeric',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'FKRentalCar',
                        referencedTableName: 'cars',
                        referencedColumnNames: ['id'],
                        columnNames: ['car_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'SET NULL',
                    },
                    {
                        name: 'FKRentalUser',
                        referencedTableName: 'users',
                        referencedColumnNames: ['id'],
                        columnNames: ['user_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'SET NULL',
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('rentals');
    }
}
