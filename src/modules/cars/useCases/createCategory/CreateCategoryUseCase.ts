import { inject, injectable } from 'tsyringe';

import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
    name: string;
    description: string;
}

@injectable()
export default class CreateCategoryUseCase {
    constructor(
        @inject('CategoriesRepository')
        private categoriesRepository: ICategoriesRepository
    ) {}

    public async execute({ name, description }: IRequest): Promise<void> {
        const categoryExists = await this.categoriesRepository.findByName(name);

        if (categoryExists) {
            throw new Error('This category already exists');
        }

        this.categoriesRepository.create({
            name,
            description,
        });
    }
}
