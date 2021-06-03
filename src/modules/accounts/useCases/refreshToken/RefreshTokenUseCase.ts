import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import UserToken from '@modules/accounts/infra/typeorm/entities/UserToken';
import ITokenProvider from '@modules/accounts/providers/TokenProvider/models/ITokenProvider';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

@injectable()
export default class RefreshTokenUseCase {
    constructor(
        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}
    public async execute(token: string): Promise<UserToken> {
        const { secret, expiresIn } = authConfig.refresh_token;

        const token_user_id = await this.tokenProvider.verify(token, {
            secret,
        });

        const find_token = await this.userTokensRepository.findByToken(token);

        if (!find_token) {
            throw new AppError('Invalid token');
        }

        const { user_id, user } = find_token;

        if (user_id !== token_user_id) {
            throw new AppError('Refresh token error! Invalid token.');
        }

        await this.userTokensRepository.delete(find_token.id);

        const refresh_token = this.tokenProvider.generate(user_id, {
            secret,
            expiresIn,
            payload: user.email,
        });

        const expiration_date = this.dateProvider.addDays(
            Number(expiresIn.match(/[0-9]*/))
        );

        const new_token = await this.userTokensRepository.create({
            user_id,
            refresh_token,
            expiration_date,
        });

        return new_token;
    }
}
