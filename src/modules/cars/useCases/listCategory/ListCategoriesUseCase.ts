import Category from '../../entities/Category';
import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

export default class ListCategoriesUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    public async execute(): Promise<Category[]> {
        const categories = await this.categoriesRepository.index();

        return categories;
    }
}
