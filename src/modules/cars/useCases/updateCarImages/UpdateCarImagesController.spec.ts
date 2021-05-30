import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let car_id: string;

describe('Create category controller', () => {
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

        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const categoryResponse = await request(app)
            .post('/categories')
            .send({
                name: 'Category',
                description: 'category',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        await request(app)
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

        await request(app)
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

        car_id = carResponse.body.id;
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to update a car's image", async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
            .post('/cars/upload')
            .query({
                id: car_id,
            })
            .attach('images', './src/mock-data/car.png')
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(200);
    });

    it('should throw an error with invalid car id', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
            .post('/cars/upload')
            .query({
                id: v4(),
            })
            .attach('images', './src/mock-data/car.png')
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(404);
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app)
            .post('/cars/upload')
            .query({
                id: car_id,
            })
            .attach('images', './src/mock-data/car.png');
        expect(response.status).toBe(401);
    });

    it('should throw an error if the user is not an admin', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
            .post('/cars/upload')
            .query({
                id: car_id,
            })
            .attach('images', './src/mock-data/car.png')
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(501);
    });
});
