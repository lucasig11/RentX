import FakeHashProvider from '@modules/accounts/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@modules/accounts/providers/TokenProvider/fakes/FakeTokenProvider';
import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/accounts/repositories/fakes/FakeUserTokensRepository';
import DayJsDateProvider from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import AppError from '@shared/errors/AppError';

import AuthenticateUserUseCase from './AuthenticateUserUseCase';

let authenticateUser: AuthenticateUserUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;
let dayjsDateProvider: DayJsDateProvider;

describe('Authenticate user', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeTokenProvider = new FakeTokenProvider();
        dayjsDateProvider = new DayJsDateProvider();
        authenticateUser = new AuthenticateUserUseCase(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
            dayjsDateProvider,
            fakeTokenProvider
        );
    });

    it('should be able to authenticate an user', async () => {
        const new_user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'test@test.com',
            password: '1234',
            driver_license: '12345',
        });

        const { user } = await authenticateUser.execute({
            email: new_user.email,
            password: new_user.password,
        });

        expect(user).toHaveProperty('name', 'TestUser');
    });

    it('should not be able to authenticate a non-existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'invalid',
                password: 'invalid',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with invalid password', async () => {
        const new_user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'test@test.com',
            password: '1234',
            driver_license: '12345',
        });

        await expect(
            authenticateUser.execute({
                email: new_user.email,
                password: 'invalid',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
