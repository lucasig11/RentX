import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import '@shared/container';

let connection: Connection;
let token: string;
let category_id: string;

describe('Create car controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const hashProvider: IHashProvider = container.resolve('HashProvider');

        const password = await hashProvider.generateHash('admin');

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'xxxxxxx');
            INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'regular_user', 'user@email.com', '${password}', false, 'now()', 'xxxxxxx');
            `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    beforeEach(async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        token = authResponse.body.token;

        const categoryResponse = await request(app)
            .post('/categories')
            .send({
                name: 'Category',
                description: 'category',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        category_id = categoryResponse.body.id;
    });

    it('should be able to create a new car', async () => {
        const response = await request(app)
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

        expect(response.status).toBe(201);
    });

    it('should not be able to create two cars with the same license plate', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
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

        expect(response.status).toBe(400);
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app).post('/cars').send({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id,
        });

        expect(response.status).toBe(401);
    });

    it('should throw an error if the user is not an admin', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
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

        expect(response.status).toBe(501);
    });
});
