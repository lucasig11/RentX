import Specification from '../entities/Specification';
import { ICreateSpecificationDTO } from './dtos/ICreateSpecificationDTO';

export default interface ISpecificationsRepository {
    create(data: ICreateSpecificationDTO): void;
    findByName(name: string): Specification;
}
