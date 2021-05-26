import FakeHashProvider from '@modules/accounts/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let createUser: CreateUserUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

describe('Create user', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserUseCase(
            fakeUsersRepository,
            fakeHashProvider
        );
    });

    it('should be able to create a new user', async () => {
        const user = await createUser.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '1234',
            driver_license: '123543245',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to register two users with the same email', async () => {
        await createUser.execute({
            name: 'Teste',
            email: 'teste@teste.com',
            password: '1234',
            driver_license: '123543245',
        });

        await expect(
            createUser.execute({
                name: 'Teste',
                email: 'teste@teste.com',
                password: '1234',
                driver_license: '123543245',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
