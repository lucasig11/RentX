import { getRepository, Repository } from 'typeorm';

import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

import Specification from '../entities/Specification';

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
    }: ICreateSpecificationDTO): Promise<Specification> {
        const specification = this.repository.create({
            name,
            description,
        });

        await this.repository.save(specification);

        return specification;
    }

    public async findByIds(ids: string[]): Promise<Specification[]> {
        const specifications = this.repository.findByIds(ids);

        return specifications;
    }

    public async list(): Promise<Specification[]> {
        return this.repository.find();
    }
}
