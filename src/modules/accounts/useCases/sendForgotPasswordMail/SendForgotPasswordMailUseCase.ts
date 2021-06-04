import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
}

@injectable()
export default class SendForgotPasswordMailUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not found');
        }

        const token = v4();

        const expiration_date = this.dateProvider.addHours(3);

        await this.userTokensRepository.create({
            refresh_token: token,
            expiration_date,
            user_id: user.id,
        });
    }
}
