import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Update car images controller', () => {
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

    it("should be able to update an user's profile picture", async () => {
        const authResponse = await request(app).post('/sessions').send({
            email: 'admin@rentx.com',
            password: 'admin',
        });

        const { refresh_token } = authResponse.body;

        await request(app)
            .patch('/users/avatar')
            .attach('avatar', './src/mock-data/car.png')
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        const response = await request(app)
            .patch('/users/avatar')
            .attach('avatar', './src/mock-data/car.png')
            .set({
                Authorization: `Bearer ${refresh_token}`,
            });

        expect(response.status).toBe(204);
    });

    it('should throw an error if the user is not authenticated', async () => {
        const response = await request(app)
            .patch('/users/avatar')
            .attach('avatar', './src/mock-data/car.png');
        expect(response.status).toBe(401);
    });
});
