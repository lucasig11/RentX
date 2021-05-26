import ICreateCategoryDTO from '@modules/cars/dtos/ICreateCategoryDTO';
import Category from '@modules/cars/infra/typeorm/entities/Category';

export default interface ICategoriesRepository {
    findByName(name: string): Promise<Category>;
    create(data: ICreateCategoryDTO): Promise<Category>;
    index(): Promise<Category[]>;
}
