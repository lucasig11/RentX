import { inject, injectable } from 'tsyringe';

import ICSVParserProvider from '@modules/cars/providers/CSVParserProvider/models/ICSVParserProvider';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import AppError from '@shared/errors/AppError';

@injectable()
export default class ImportCategoryUseCase {
    constructor(
        @inject('CategoriesRepository')
        private categoriesRepository: ICategoriesRepository,
        @inject('CSVParserProvider')
        private csvParserProvider: ICSVParserProvider
    ) {}

    async execute(file: Express.Multer.File): Promise<void> {
        try {
            const categories = await this.csvParserProvider.parse(file.path);

            categories.map(async ({ name, description }) => {
                const categoryExists =
                    await this.categoriesRepository.findByName(name);

                if (!categoryExists) {
                    await this.categoriesRepository.create({
                        name,
                        description,
                    });
                }
            });
        } catch (err) {
            throw new AppError(`Error parsing categories file - ${err}`);
        }
    }
}
