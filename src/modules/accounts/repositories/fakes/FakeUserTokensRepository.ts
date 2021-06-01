import { v4 } from 'uuid';

import ICreateUserTokenDTO from '@modules/accounts/dtos/ICreateUserTokenDTO';
import UserToken from '@modules/accounts/infra/typeorm/entities/UserToken';

import IUserTokensRepository from '../IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
    private repository: UserToken[] = [];

    public async create({
        user_id,
        refresh_token,
        expiration_date,
    }: ICreateUserTokenDTO): Promise<UserToken> {
        const user_token = new UserToken();

        Object.assign(user_token, {
            id: v4(),
            user_id,
            refresh_token,
            expiration_date,
            created_at: new Date(),
        });

        this.repository.push(user_token);

        return user_token;
    }
}
