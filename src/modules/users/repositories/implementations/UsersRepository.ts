import { User } from '@modules/users/entities/User';
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
        username,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<void> {
        const user = this.repository.create({
            name,
            username,
            password,
            email,
            driver_license,
        });
        await this.repository.save(user);
    }
}
