import 'reflect-metadata';
import { container } from 'tsyringe';
import { v4 } from 'uuid';

import '@shared/container';
import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';

import createConnection from '../index';

async function create() {
    const hashProvider: IHashProvider = container.resolve('HashProvider');
    const connection = await createConnection('localhost');

    const id = v4();

    const password = await hashProvider.generateHash('admin');

    await connection.query(
        `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license)
            VALUES('${id}', 'admin', 'admin@rentx.com', '${password}', true, 'now()', 'xxxxxxx')
        `
    );

    await connection.close();
}

create().then(() => console.log('Admin user created.'));
