import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import Category from '../entities/Category';

export default interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    create(data: ICreateCategoryDTO): Promise<void>;
    index(): Promise<Category[]>;
}
