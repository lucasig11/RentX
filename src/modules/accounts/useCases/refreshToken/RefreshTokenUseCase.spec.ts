import FakeHashProvider from '@modules/accounts/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@modules/accounts/providers/TokenProvider/fakes/FakeTokenProvider';
import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/accounts/repositories/fakes/FakeUserTokensRepository';
import DayJsDateProvider from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import AppError from '@shared/errors/AppError';

import AuthenticateUserUseCase from '../authenticateUser/AuthenticateUserUseCase';
import RefreshTokenUseCase from './RefreshTokenUseCase';

let refreshTokenUseCase: RefreshTokenUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUsersRepository: FakeUsersRepository;

let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;
let dateProvider: DayJsDateProvider;

describe('Refresh token', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();

        fakeHashProvider = new FakeHashProvider();
        fakeTokenProvider = new FakeTokenProvider();
        dateProvider = new DayJsDateProvider();

        refreshTokenUseCase = new RefreshTokenUseCase(
            fakeUserTokensRepository,
            fakeTokenProvider,
            dateProvider
        );

        authenticateUserUseCase = new AuthenticateUserUseCase(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
            dateProvider,
            fakeTokenProvider
        );
    });

    it('should be able to refresh a valid token', async () => {
        await fakeUsersRepository.create({
            email: 'user@test.com',
            name: 'testUser',
            driver_license: '1234',
            password: '1234',
        });

        const { refresh_token } = await authenticateUserUseCase.execute({
            email: 'user@test.com',
            password: '1234',
        });

        const userToken = await refreshTokenUseCase.execute(refresh_token);

        expect(userToken.refresh_token).not.toEqual(refresh_token);
    });

    it('should throw an error on invalid token', async () => {
        await expect(
            refreshTokenUseCase.execute('invalidtoken')
        ).rejects.toBeInstanceOf(AppError);
    });
});
