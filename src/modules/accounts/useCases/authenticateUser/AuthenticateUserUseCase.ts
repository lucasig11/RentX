import IHashProvider from '@modules/accounts/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@modules/accounts/providers/TokenProvider/models/ITokenProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        id: string;
        name: string;
        email: string;
        isAdmin?: boolean;
    };
    token: string;
}

@injectable()
export default class AuthenticateUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('TokenProvider')
        private tokenProvider: ITokenProvider
    ) {}
    public async execute({ email, password }: IRequest): Promise<IResponse> {
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

        const token = this.tokenProvider.generate(user.id);

        return {
            user,
            token,
        } as IResponse;
    }
}
