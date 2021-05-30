import request from 'supertest';
import { container } from 'tsyringe';
import { Connection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Sessions controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const hashProvider: IHashProvider = container.resolve('HashProvider');

        const password = await hashProvider.generateHash('password');

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${v4()}', 'regular_user', 'user@email.com', '${password}', false, 'now()', 'xxxxxxx');
            `
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should not be able to authenticate with incorrect password', async () => {
        const response = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'incorrect_password',
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid user/password combination');
    });

    it('should not be able to authenticate with invalid e-mail', async () => {
        await request(app).post('/sessions').send({
            email: 'unexisting_user@email.com',
            password: 'password',
        });

        const response = await request(app).post('/sessions').send({
            email: 'unexisting_user@email.com',
            password: 'password',
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid user/password combination');
    });

    it('should be able to authenticate a user', async () => {
        const response = await request(app).post('/sessions').send({
            email: 'user@email.com',
            password: 'password',
        });

        expect(response.status).toBe(200);
        expect(response.body.user.name).toBe('regular_user');
    });
});
