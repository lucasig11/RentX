import ICreateCategoryDTO from '@modules/cars/dtos/ICreateCategoryDTO';
import Category from '@modules/cars/infra/typeorm/entities/Category';
import { v4 } from 'uuid';

import ICategoriesRepository from '../ICategoriesRepository';

export default class FakeCategoriesRepository implements ICategoriesRepository {
    private repository: Category[] = [];

    public async findByName(name: string): Promise<Category> {
        const find = this.repository.find((category) => category.name === name);

        return find;
    }

    public async create(data: ICreateCategoryDTO): Promise<Category> {
        const category = new Category();
        Object.assign(category, { id: v4() }, data);

        this.repository.push(category);

        return category;
    }

    public async index(): Promise<Category[]> {
        return this.repository;
    }
}
