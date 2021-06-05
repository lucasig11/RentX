import dayjs from 'dayjs';

import FakeHashProvider from '@modules/accounts/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/accounts/repositories/fakes/FakeUserTokensRepository';
import DayJsDateProvider from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import AppError from '@shared/errors/AppError';

import ResetPasswordUseCase from './ResetPasswordUseCase';

let resetPasswordUseCase: ResetPasswordUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let dayJsDateProvider: DayJsDateProvider;

describe('Reset user password', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();
        dayJsDateProvider = new DayJsDateProvider();
        resetPasswordUseCase = new ResetPasswordUseCase(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
            dayJsDateProvider
        );
    });

    it("should be able to reset a user's password", async () => {
        const user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'user@email.com',
            password: '1234',
            driver_license: '12345',
        });

        const { refresh_token } = await fakeUserTokensRepository.create({
            refresh_token: 'user_token',
            user_id: user.id,
            expiration_date: dayJsDateProvider.addHours(3),
        });

        await resetPasswordUseCase.execute({
            token: refresh_token,
            new_password: '4321',
        });

        const updatedUser = await fakeUsersRepository.findByEmail(
            'user@email.com'
        );

        expect(updatedUser.password).toEqual('4321');
    });

    it('should throw an error with invalid token', async () => {
        await expect(
            resetPasswordUseCase.execute({
                token: 'invalid_token',
                new_password: '4321',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw an error if the token has already expired', async () => {
        const user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'user@email.com',
            password: '1234',
            driver_license: '12345',
        });

        jest.spyOn(dayJsDateProvider, 'now').mockImplementation(() => {
            return dayjs().add(4, 'hour').toDate();
        });

        const { refresh_token } = await fakeUserTokensRepository.create({
            refresh_token: 'user_token',
            user_id: user.id,
            expiration_date: dayJsDateProvider.addHours(3),
        });

        await expect(
            resetPasswordUseCase.execute({
                token: refresh_token,
                new_password: '4321',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
