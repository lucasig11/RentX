import { inject, injectable } from 'tsyringe';

import Specification from '@modules/cars/infra/typeorm/entities/Specification';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    name: string;
    description: string;
}

@injectable()
export default class CreateSpecificationUseCase {
    constructor(
        @inject('SpecificationsRepository')
        private specificationsRepository: ISpecificationsRepository
    ) {}

    public async execute({
        name,
        description,
    }: IRequest): Promise<Specification> {
        const specificationAlreadyExists =
            await this.specificationsRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new AppError('This specification already exists');
        }

        const specification = await this.specificationsRepository.create({
            name,
            description,
        });

        return specification;
    }
}
