import { inject, injectable } from 'tsyringe';

import Specification from '@modules/cars/infra/typeorm/entities/Specification';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

@injectable()
export default class ListSpecificationUseCase {
    constructor(
        @inject('SpecificationsRepository')
        private specificationsRepository: ISpecificationsRepository
    ) {}
    public async execute(): Promise<Specification[]> {
        return this.specificationsRepository.list();
    }
}
