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
            user: {
                email: 'fake@mail.com',
            },
        });

        this.repository.push(user_token);

        return user_token;
    }

    public async findUserTokens(user_id: string): Promise<UserToken[]> {
        return this.repository.filter((token) => token.user_id === user_id);
    }

    public async findByToken(refresh_token: string): Promise<UserToken> {
        return this.repository.find(
            (userToken) => userToken.refresh_token === refresh_token
        );
    }

    public async delete(token_id: string): Promise<void> {
        this.repository = this.repository.filter(
            (token) => token.id !== token_id
        );
    }
}
