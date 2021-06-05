import dayjs from 'dayjs';
import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import Rental from '@modules/rentals/infra/typeorm/entities/Rental';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let user_id: string;
let car_id: string;
let refresh_token: string;
let rental: Rental;

describe('Discharge rental controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const hashProvider: IHashProvider = container.resolve('HashProvider');

        const password = await hashProvider.generateHash('password');

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'xxxxxxx');
            INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'regular_user', 'user@email.com', '${password}', false, 'now()', 'xxxxxxx');
            `
        );

        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'password',
        });

        refresh_token = authResponse.body.refresh_token;
        user_id = authResponse.body.user.id;

        const categoryResponse = await request(app)
            .post('/categories')
            .send({
                name: 'Category',
                description: 'category',
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        const category_id = categoryResponse.body.id;

        const carResponse = await request(app)
            .post('/cars')
            .send({
                name: 'Car name',
                description: 'Description',
                daily_rate: 100,
                license_plate: 'ABC-1234',
                fine_amount: 60,
                brand: 'Brand',
                category_id,
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        car_id = carResponse.body.id;

        const rentalResponse = await request(app)
            .post('/rental')
            .send({
                car_id,
                user_id,
                start_date: new Date(),
                expected_return_date: dayjs().add(1, 'day').toDate(),
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        rental = rentalResponse.body;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app).post('/rental/discharge').send({
            id: rental.id,
        });

        expect(response.status).toBe(401);
    });

    it('should be able to discharge a rental', async () => {
        const rentalResponse = await request(app)
            .post('/rental/discharge')
            .send({
                id: rental.id,
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        expect(rentalResponse.status).toBe(200);
    });

    it('should throw an error on invalid rental id', async () => {
        const rentalResponse = await request(app)
            .post('/rental/discharge')
            .send({
                id: v4(),
            })
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        expect(rentalResponse.status).toBe(404);
    });

    it('should throw an error if the rent does not belong to the user', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'password',
        });

        const other_user_token = authResponse.body.refresh_token;

        const rentalResponse = await request(app)
            .post('/rental/discharge')
            .send({
                id: rental.id,
            })
            .set({
                Authorization: `Bearer ${other_user_token}`,
            });

        expect(rentalResponse.status).toBe(403);
    });
});
