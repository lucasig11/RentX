import { container } from 'tsyringe';
import { getConnection } from 'typeorm';
import { v4 } from 'uuid';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';

async function create() {
    const hashProvider: IHashProvider = container.resolve('HashProvider');
    const connection = getConnection();

    const id = v4();

    const password = hashProvider.generateHash('admin');

    await connection.query(
        `INSERT INTO USERS(id, name, email, password, is_admin, created_at)
            VALUES(${id}, 'admin', 'admin@rentx.com', ${password}, true, now())
        `
    );
}

create().then(() => console.log('Admin user created.'));
