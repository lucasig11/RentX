import { container } from 'tsyringe';

import UsersRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';
import IHashProvider from './HashProvider/models/IHashProvider';
import JWTTokenProvider from './TokenProvider/implementations/JWTTokenProvider';
import ITokenProvider from './TokenProvider/models/ITokenProvider';

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
container.registerSingleton<ITokenProvider>('TokenProvider', JWTTokenProvider);

container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository
);

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository',
    UserTokensRepository
);
