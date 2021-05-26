import { inject, injectable } from 'tsyringe';

import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({
        name,
        password,
        email,
        driver_license,
    }: ICreateUserDTO): Promise<User> {
        const findUser = await this.usersRepository.findByEmail(email);

        if (findUser) {
            throw new AppError('This e-mail is already in use.');
        }

        const passwordHash = await this.hashProvider.generateHash(password);

        const new_user = await this.usersRepository.create({
            name,
            password: passwordHash,
            email,
            driver_license,
        });

        return new_user;
    }
}
