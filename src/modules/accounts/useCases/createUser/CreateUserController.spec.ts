import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import '@shared/container';

let connection: Connection;

describe('Create user controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new user', async () => {
        const response = await request(app).post('/users').send({
            name: 'test',
            password: 'test',
            email: 'test@email.com',
            driver_license: '12345',
        });

        expect(response.status).toBe(201);
    });

    it('should not be able to create a user with an already used email', async () => {
        await request(app).post('/users').send({
            name: 'test',
            password: 'test',
            email: 'test@email.com',
            driver_license: '12345',
        });

        const response = await request(app).post('/users').send({
            name: 'test2',
            password: 'test2',
            email: 'test@email.com',
            driver_license: '123456',
        });

        expect(response.status).toBe(400);
    });
});
