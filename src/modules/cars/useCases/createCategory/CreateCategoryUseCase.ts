import { inject, injectable } from 'tsyringe';

import Category from '@modules/cars/infra/typeorm/entities/Category';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';

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

    public async execute({ name, description }: IRequest): Promise<Category> {
        const categoryExists = await this.categoriesRepository.findByName(name);

        if (categoryExists) {
            throw new AppError('This category already exists');
        }

        const newCategory = await this.categoriesRepository.create({
            name,
            description,
        });

        return newCategory;
    }
}
