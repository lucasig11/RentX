import Category from '../models/Category';
import ICreateCategoryDTO from './dtos/ICreateCategoryDTO';

export interface ICategoriesRepository {
    findByName(name: string): Category;
    create(data: ICreateCategoryDTO): void;
    index(): Category[];
}
