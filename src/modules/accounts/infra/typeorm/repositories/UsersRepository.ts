import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

export default class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    public async create(data: ICreateUserDTO): Promise<User> {
        const user = this.repository.create(data);
        await this.repository.save(user);

        return user;
    }

    public async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { email },
        });

        return user;
    }

    public async findByID(id: string): Promise<User> {
        const user = await this.repository.findOne(id);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.repository.save(user);
    }
}
