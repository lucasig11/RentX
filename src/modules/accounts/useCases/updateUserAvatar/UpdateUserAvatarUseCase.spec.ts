import FakeUsersRepository from '@modules/accounts/repositories/fakes/FakeUsersRepository';
import * as deleteFile from '@utils/file';

import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';

let updateUserAvatar: UpdateUserAvatarUseCase;
let fakeUsersRepository: FakeUsersRepository;

jest.mock('@utils/file', () => ({
    deleteFile: jest.fn(),
}));

describe('Update avatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        updateUserAvatar = new UpdateUserAvatarUseCase(fakeUsersRepository);
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
        const deleteFileSpy = jest.spyOn(deleteFile, 'deleteFile');

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

        expect(deleteFileSpy).toHaveBeenCalledWith('./tmp/avatar/avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
