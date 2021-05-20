import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

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
    }: ICreateUserDTO): Promise<void> {
        const findUser = await this.usersRepository.findByEmail(email);

        if (findUser) {
            throw new AppError('This e-mail is already in use.');
        }

        const passwordHash = await this.hashProvider.generateHash(password);

        await this.usersRepository.create({
            name,
            password: passwordHash,
            email,
            driver_license,
        });
    }
}
