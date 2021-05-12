import Category from 'modules/cars/models/Category';

import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

export default class ListCategoriesUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    public execute(): Category[] {
        const categories = this.categoriesRepository.index();

        return categories;
    }
}
