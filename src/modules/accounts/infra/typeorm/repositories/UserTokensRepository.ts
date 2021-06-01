import { getRepository, Repository } from 'typeorm';

import ICreateUserTokenDTO from '@modules/accounts/dtos/ICreateUserTokenDTO';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

export default class UserTokensRepository implements IUserTokensRepository {
    private repository: Repository<UserToken>;

    constructor() {
        this.repository = getRepository(UserToken);
    }

    public async create({
        user_id,
        expiration_date,
        refresh_token,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const user_token = this.repository.create({
            user_id,
            expiration_date,
            refresh_token,
        });

        return this.repository.save(user_token);
    }
}
