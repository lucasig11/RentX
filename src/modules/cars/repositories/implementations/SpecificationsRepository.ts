import { getRepository, Repository } from 'typeorm';

import { ICreateSpecificationDTO } from '../../dtos/ICreateSpecificationDTO';
import Specification from '../../entities/Specification';
import ISpecificationsRepository from '../ISpecificationsRepository';

export default class SpecificationsRepository
    implements ISpecificationsRepository
{
    private repository: Repository<Specification>;

    constructor() {
        this.repository = getRepository(Specification);
    }

    public async findByName(name: string): Promise<Specification> {
        const specification = this.repository.findOne({
            where: { name },
        });

        return specification;
    }

    public async create({
        name,
        description,
    }: ICreateSpecificationDTO): Promise<void> {
        const specification = this.repository.create({
            name,
            description,
        });

        await this.repository.save(specification);
    }
}
