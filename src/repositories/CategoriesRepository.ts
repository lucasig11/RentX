import Category from '../models/Category';
import ICreateCategoryDTO from './dtos/ICreateCategoryDTO';
import { ICategoriesRepository } from './ICategoriesRepository';

export default class CategoriesRepository implements ICategoriesRepository {
    private repository: Category[];

    constructor() {
        this.repository = [];
    }

    public findByName(name: string): Category {
        const find = this.repository.find((category) => category.name === name);

        return find;
    }

    public create({ name, description }: ICreateCategoryDTO): void {
        const category = new Category();

        Object.assign(category, {
            name,
            description,
            created_at: new Date(),
        });

        this.repository.push(category);
    }

    public index(): Category[] {
        return this.repository;
    }
}
