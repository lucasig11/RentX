import Category from '../models/Category';

interface ICreateCategoryDTO {
    name: string;
    description: string;
}

export default class CategoriesRepository {
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
