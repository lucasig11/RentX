import ICreateCategoryDTO from '../dtos/ICreateCategoryDTO';
import Category from '../infra/typeorm/entities/Category';

export default interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    create(data: ICreateCategoryDTO): Promise<Category>;
    index(): Promise<Category[]>;
}
