import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import Specification from '@modules/cars/infra/typeorm/entities/Specification';

export default interface ISpecificationsRepository {
    create(data: ICreateSpecificationDTO): Promise<Specification>;
    findByName(name: string): Promise<Specification>;
    findByIds(ids: string[]): Promise<Specification[]>;
}
