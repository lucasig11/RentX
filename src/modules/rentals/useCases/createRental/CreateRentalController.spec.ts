import 'reflect-metadata';
import dayjs from 'dayjs';
import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import '@shared/container';

let connection: Connection;

describe('Create rental controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const hashProvider: IHashProvider = container.resolve('HashProvider');

        const password = await hashProvider.generateHash('password');

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'xxxxxxx');
            `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new rental', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'password',
        });

        const { token, user } = authResponse.body;

        const categoryResponse = await request(app)
            .post('/categories')
            .send({
                name: 'Category',
                description: 'category',
            })
            .set({
                Authorization: `Bearer ${token}`,
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
                Authorization: `Bearer ${token}`,
            });

        const car_id = carResponse.body.id;

        const rentalResponse = await request(app)
            .post('/rental')
            .send({
                car_id,
                user_id: user.id,
                start_date: new Date(),
                expected_return_date: dayjs().add(1, 'day').toDate(),
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(rentalResponse.status).toBe(201);
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app)
            .post('/rental')
            .send({
                car_id: 'invalid id',
                user_id: 'invalid id',
                start_date: new Date(),
                expected_return_date: dayjs().add(1, 'day').toDate(),
            });

        expect(response.status).toBe(401);
    });
});
