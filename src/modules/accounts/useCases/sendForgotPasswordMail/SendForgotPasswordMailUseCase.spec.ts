import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/accounts/repositories/fakes/FakeUserTokensRepository';
import DayJsDateProvider from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import SendForgotPasswordMailUseCase from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMail: SendForgotPasswordMailUseCase;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let dayJsDateProvider: DayJsDateProvider;
let fakeMailProvider: FakeMailProvider;

describe('Send forgot password e-mail', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        dayJsDateProvider = new DayJsDateProvider();
        fakeMailProvider = new FakeMailProvider();
        sendForgotPasswordMail = new SendForgotPasswordMailUseCase(
            fakeUsersRepository,
            fakeUserTokensRepository,
            dayJsDateProvider,
            fakeMailProvider
        );
    });

    it('should be able to send a recovery email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Caleb Joseph',
            driver_license: '17587',
            email: 'user@email.com',
            password: 'K8LJHqvK',
        });

        await sendForgotPasswordMail.execute({
            email: 'user@email.com',
        });

        expect(sendMail).toBeCalled();
    });

    it('should throw an error with an invalid user', async () => {
        await expect(
            sendForgotPasswordMail.execute({
                email: 'user@email.com',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
