import CategoriesRepository from 'repositories/CategoriesRepository';

interface IRequest {
    name: string;
    description: string;
}

export default class CreateCategoryService {
    constructor(private categoriesRepository: CategoriesRepository) {}

    public async execute({ name, description }: IRequest): Promise<void> {
        const categoryExists = this.categoriesRepository.findByName(name);

        if (categoryExists) {
            throw new Error('This category already exists');
        }

        this.categoriesRepository.create({
            name,
            description,
        });
    }
}
