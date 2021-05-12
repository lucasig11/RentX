import csvParse from 'csv-parse';
import fs from 'fs';
import { ICategoriesRepository } from 'modules/cars/repositories/ICategoriesRepository';

interface IImportCategories {
    name: string;
    description: string;
}

export default class ImportCategoryUseCase {
    constructor(private categoriesRepository: ICategoriesRepository) {}

    parseCategories(file: Express.Multer.File): Promise<IImportCategories[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(file.path);
            const categories: IImportCategories[] = [];

            const fileParse = csvParse();
            stream.pipe(fileParse);

            fileParse
                .on('data', (line) => {
                    const [name, description] = line;
                    categories.push({
                        name,
                        description,
                    });
                })
                .on('end', () => {
                    resolve(categories);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }

    async execute(file: Express.Multer.File): Promise<void> {
        const categories = await this.parseCategories(file);

        categories.map(async ({ name, description }) => {
            const categoryExists = this.categoriesRepository.findByName(name);

            if (!categoryExists) {
                this.categoriesRepository.create({
                    name,
                    description,
                });
            }
        });
    }
}
