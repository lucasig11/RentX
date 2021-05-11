import { ICategoriesRepository } from '../../repositories/ICategoriesRepository';

interface IRequest {
    name: string;
    description: string;
}

export default class CreateCategoryUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

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
