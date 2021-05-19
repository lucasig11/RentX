import { getRepository, Repository } from 'typeorm';

import Category from '../../entities/Category';
import ICreateCategoryDTO from '../../useCases/createCategory/ICreateCategoryDTO';
import ICategoriesRepository from '../ICategoriesRepository';

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
    }: ICreateCategoryDTO): Promise<void> {
        const category = this.repository.create({
            name,
            description,
        });

        await this.repository.save(category);
    }

    public async index(): Promise<Category[]> {
        const categories = await this.repository.find();
        return categories;
    }
}
