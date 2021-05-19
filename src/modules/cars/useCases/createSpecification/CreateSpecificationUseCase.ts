import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ISpecificationsRepository from '../../repositories/ISpecificationsRepository';

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

    public async execute({ name, description }: IRequest): Promise<void> {
        const specificationAlreadyExists =
            await this.specificationsRepository.findByName(name);

        if (specificationAlreadyExists) {
            throw new AppError('This specification already exists');
        }

        await this.specificationsRepository.create({
            name,
            description,
        });
    }
}
