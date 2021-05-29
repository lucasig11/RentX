import fs from 'fs';

import FakeCSVParserProvider from '@modules/cars/providers/CSVParserProvider/fakes/FakeCSVParserProvider';
import FakeCategoriesRepository from '@modules/cars/repositories/fakes/FakeCategoriesRepository';

import ImportCategoryUseCase from './ImportCategoryUseCase';

let importCategories: ImportCategoryUseCase;
let fakeCsvParserProvider: FakeCSVParserProvider;
let fakeCategoriesRepository: FakeCategoriesRepository;

describe('Import categories', () => {
    beforeEach(async () => {
        fakeCategoriesRepository = new FakeCategoriesRepository();
        fakeCsvParserProvider = new FakeCSVParserProvider();
        importCategories = new ImportCategoryUseCase(
            fakeCategoriesRepository,
            fakeCsvParserProvider
        );

        jest.spyOn(fs.promises, 'unlink').mockImplementation(
            // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
            async (filepath: string) => {}
        );

        await importCategories.execute({
            path: './categories.csv',
        } as Express.Multer.File);
    });

    it('should be able to upload new categories', async () => {
        const categories = await fakeCategoriesRepository.index();

        expect(categories.length).toBe(3);
    });

    it('should ignore repeated categories', async () => {
        await importCategories.execute({
            path: './categories.csv',
        } as Express.Multer.File);

        const categories = await fakeCategoriesRepository.index();

        expect(categories.length).toBe(3);
    });
});
