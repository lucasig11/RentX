import Category from '../entities/Category';
import ICreateCategoryDTO from '../useCases/createCategory/ICreateCategoryDTO';

export interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    create(data: ICreateCategoryDTO): Promise<void>;
    index(): Promise<Category[]>;
}
