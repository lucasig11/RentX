import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@modules/accounts/providers/TokenProvider/models/ITokenProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
    refresh_token: string;
}

@injectable()
export default class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('DateProvider')
        private dateProvider: IDateProvider,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider
    ) {}
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const { jwt, refresh_token } = authConfig;

        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Invalid user/password combination', 401);
        }

        const passwordsMatch = await this.hashProvider.compareHash(
            password,
            user.password
        );

        if (!passwordsMatch) {
            throw new AppError('Invalid user/password combination', 401);
        }

        const token = this.tokenProvider.generate(user.id, jwt);

        const refreshToken = this.tokenProvider.generate(
            user.id,
            Object.assign(refresh_token, { payload: email })
        );

        const expiration_date = this.dateProvider.addDays(
            Number(refresh_token.expiresIn.match(/[0-9]*/))
        );

        await this.userTokensRepository.create({
            user_id: user.id,
            refresh_token: refreshToken,
            expiration_date,
        });

        return {
            user,
            token,
            refresh_token: refreshToken,
        };
    }
}
