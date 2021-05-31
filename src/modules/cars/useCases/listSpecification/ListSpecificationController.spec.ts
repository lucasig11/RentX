import request from 'supertest';
import { Connection } from 'typeorm';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('List specifications controller', () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be list all specifications', async () => {
        const response = await request(app).get('/specifications').send({
            name: 'specification test',
            description: 'specification test',
        });

        expect(response.status).toBe(200);
    });
});
