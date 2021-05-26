import { getRepository, Repository } from 'typeorm';

import ICreateCategoryDTO from '@modules/cars/dtos/ICreateCategoryDTO';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';

import Category from '../entities/Category';

export default class CategoriesRepository implements ICategoriesRepository {
    private repository: Repository<Category>;

    constructor() {
        this.repository = getRepository(Category);
    }

    public async findByName(name: string): Promise<Category> {
        const find = await this.repository.findOne({
            where: { name },
        });

        return find;
    }

    public async create({
        name,
        description,
    }: ICreateCategoryDTO): Promise<Category> {
        const category = this.repository.create({
            name,
            description,
        });

        await this.repository.save(category);

        return category;
    }

    public async index(): Promise<Category[]> {
        const categories = await this.repository.find();
        return categories;
    }
}
