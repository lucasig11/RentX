import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

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
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new category', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
            .post('/categories/import')
            .attach('file', './categories.csv')
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(201);
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app)
            .post('/categories/import')
            .attach('file', './categories.csv');
        expect(response.status).toBe(401);
    });

    it('should throw an error if the user is not an admin', async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'admin',
        });

        const { token } = authResponse.body;

        const response = await request(app)
            .post('/categories/import')
            .attach('file', './categories.csv')
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(501);
    });
});
