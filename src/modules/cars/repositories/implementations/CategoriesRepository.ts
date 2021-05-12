import Category from '../../models/Category';
import ICreateCategoryDTO from '../../useCases/createCategory/ICreateCategoryDTO';
import { ICategoriesRepository } from '../ICategoriesRepository';

export default class CategoriesRepository implements ICategoriesRepository {
    private repository: Category[];

    private static INSTANCE: CategoriesRepository;

    private constructor() {
        this.repository = [];
    }

    public static getInstance(): CategoriesRepository {
        if (!CategoriesRepository.INSTANCE) {
            CategoriesRepository.INSTANCE = new CategoriesRepository();
        }
        return CategoriesRepository.INSTANCE;
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
