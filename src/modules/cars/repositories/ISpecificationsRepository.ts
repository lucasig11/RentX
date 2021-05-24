import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import Specification from '../entities/Specification';

export default interface ISpecificationsRepository {
    create(data: ICreateSpecificationDTO): Promise<void>;
    findByName(name: string): Promise<Specification>;
}
