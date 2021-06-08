import { inject, injectable } from 'tsyringe';

import { User } from '@modules/accounts/infra/typeorm/entities/User';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';

@injectable()
export default class ShowUserProfileUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository
    ) {}

    public async execute(user_id: string): Promise<User> {
        return this.usersRepository.findByID(user_id);
    }
}
