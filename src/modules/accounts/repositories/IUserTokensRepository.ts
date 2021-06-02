import ICreateUserTokenDTO from '../dtos/ICreateUserTokenDTO';
import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
    create(data: ICreateUserTokenDTO): Promise<UserToken>;
    findUserTokens(user_id: string): Promise<UserToken[]>;
    findByToken(refresh_token: string): Promise<UserToken>;
}
