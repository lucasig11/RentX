import 'reflect-metadata';
import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

import '@shared/container';

let connection: Connection;

describe('List categories controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be list all categories', async () => {
        const response = await request(app).get('/categories').send({
            name: 'Category',
            description: 'category',
        });

        expect(response.status).toBe(200);
    });
});
