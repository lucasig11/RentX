import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';

export default interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    findByID(user_id: string): Promise<User | undefined>;
}
