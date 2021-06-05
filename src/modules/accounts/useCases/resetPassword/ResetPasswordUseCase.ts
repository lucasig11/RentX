import { inject, injectable } from 'tsyringe';

import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    token: string;
    new_password: string;
}

@injectable()
export default class ResetPasswordUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}
    public async execute({ token, new_password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Invalid auth token', 401);
        }

        const now = this.dateProvider.now();

        if (this.dateProvider.isBefore(userToken.expiration_date, now)) {
            await this.userTokensRepository.delete(userToken.id);
            throw new AppError('This token has expired.');
        }

        const user = await this.usersRepository.findByID(userToken.user_id);

        const hashedPassword = await this.hashProvider.generateHash(
            new_password
        );

        user.password = hashedPassword;

        await this.usersRepository.save(user);

        await this.userTokensRepository.delete(userToken.id);
    }
}
