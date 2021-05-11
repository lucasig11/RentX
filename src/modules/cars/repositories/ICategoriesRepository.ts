import Category from '../models/Category';
import ICreateCategoryDTO from '../useCases/createCategory/ICreateCategoryDTO';

export interface ICategoriesRepository {
    findByName(name: string): Category;
    create(data: ICreateCategoryDTO): void;
    index(): Category[];
}
