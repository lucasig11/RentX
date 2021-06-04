import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 } from 'uuid';

import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
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
        private dateProvider: IDateProvider,
        @inject('MailProvider')
        private mailProvider: IMailProvider
    ) {}

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('User not found');
        }

        const token = v4();
        const expiration_date = this.dateProvider.addHours(3);

        const templatePath = path.resolve(
            __dirname,
            '..',
            '..',
            'templates',
            'forgotPasswordMail.hbs'
        );

        await this.userTokensRepository.create({
            refresh_token: token,
            expiration_date,
            user_id: user.id,
        });

        await this.mailProvider.sendMail({
            to: email,
            subject: 'Recuperação de senha',
            variables: {
                name: user.name,
                link: `${process.env.API_URL}/password/reset?token=${token}`,
            },
            templatePath,
        });
    }
}
