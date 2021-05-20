import { User } from '@modules/accounts/entities/User';
import { getRepository, Repository } from 'typeorm';

import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import IUsersRepository from '../IUsersRepository';

export default class UsersRepository implements IUsersRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getRepository(User);
    }

    public async create({
        name,
        email,
        password,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            name,
            email,
            password,
            driver_license,
        });
        await this.repository.save(user);
    }

    public async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { email },
        });

        return user;
    }

    public async findByID(id: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { id },
        });

        return user;
    }
}
