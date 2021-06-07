import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';

let updateUserAvatar: UpdateUserAvatarUseCase;
let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;

describe('Update avatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarUseCase(
            fakeUsersRepository,
            fakeStorageProvider
        );
    });

    it("should be able to update the user's avatar", async () => {
        const new_user = await fakeUsersRepository.create({
            name: 'TestUser',
            email: 'test@test.com',
            password: '1234',
            driver_license: '12345',
        });

        await updateUserAvatar.execute({
            user_id: new_user.id,
            avatar_file: 'new_avatar',
        });

        const updatedUser = await fakeUsersRepository.findByID(new_user.id);

        expect(updatedUser).toHaveProperty('avatar', 'new_avatar');
    });

    it('should delete previous avatar if user had one', async () => {
        const deleteFileSpy = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'TestUser',
            password: '1234',
            email: 'test@test.com',
            driver_license: '12345',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatar_file: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatar_file: 'avatar2.jpg',
        });

        expect(deleteFileSpy).toHaveBeenCalledWith('avatar.jpg', 'avatar');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
