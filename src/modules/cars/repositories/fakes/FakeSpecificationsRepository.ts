import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import Specification from '@modules/cars/infra/typeorm/entities/Specification';
import { v4 } from 'uuid';

import ISpecificationsRepository from '../ISpecificationsRepository';

export default class FakeSpecificationsRepository
    implements ISpecificationsRepository
{
    private repository: Specification[] = [];

    public async findByName(name: string): Promise<Specification> {
        const find = this.repository.find(
            (specification) => specification.name === name
        );

        return find;
    }

    public async create(data: ICreateSpecificationDTO): Promise<Specification> {
        const specification = new Specification();
        Object.assign(specification, { id: v4() }, data);

        this.repository.push(specification);

        return specification;
    }
}