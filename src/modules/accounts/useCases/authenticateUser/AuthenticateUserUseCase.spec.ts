import FakeHashProvider from '@modules/accounts/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@modules/accounts/providers/TokenProvider/fakes/FakeTokenProvider';
import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

import AuthenticateUserUseCase from './AuthenticateUserUseCase';

let authenticateUser: AuthenticateUserUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;

describe('Authenticate user', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeTokenProvider = new FakeTokenProvider();
        authenticateUser = new AuthenticateUserUseCase(
            fakeUsersRepository,
            fakeHashProvider,
            fakeTokenProvider
        );
    });

    it('should be able to authenticate an user', async () => {
        const new_user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'test@test.com',
            password: '1234',
            driver_license: '12345',
            avatar: 'filepath',
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
            avatar: 'filepath',
        });

        await expect(
            authenticateUser.execute({
                email: new_user.email,
                password: 'invalid',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
