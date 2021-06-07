import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
    user_id: string;
    avatar_file: string;
}

@injectable()
export default class UpdateUserAvatarUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) {}
    async execute({ user_id, avatar_file }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByID(user_id);

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar, 'avatar');
        }

        user.avatar = avatar_file;

        await this.storageProvider.saveFile(user.avatar, 'avatar');

        await this.usersRepository.save(user);
    }
}
