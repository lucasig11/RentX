import { v4 } from 'uuid';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';

import IUsersRepository from '../IUsersRepository';

export default class FakeUsersRepository implements IUsersRepository {
    private repository: User[] = [];

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = {
            ...data,
            id: v4(),
            created_at: new Date(),
            is_admin: false,
        };
        this.repository.push(user);
        return user;
    }

    public async findByEmail(email: string): Promise<User> {
        return this.repository.find((user) => user.email === email);
    }

    public async findByID(user_id: string): Promise<User> {
        return this.repository.find((user) => user.id === user_id);
    }

    public async save(user: User): Promise<User> {
        const index = this.repository.findIndex(
            (findUser) => findUser.id === user.id
        );

        this.repository[index] = user;

        return user;
    }
}
