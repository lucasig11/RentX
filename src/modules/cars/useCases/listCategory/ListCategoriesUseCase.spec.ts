import FakeCategoriesRepository from '@modules/cars/repositories/fakes/FakeCategoriesRepository';

import ListCategoriesUseCase from './ListCategoriesUseCase';

let listCategoriesUseCase: ListCategoriesUseCase;
let fakeCategoriesRepository: FakeCategoriesRepository;

describe('List categories', () => {
    beforeEach(() => {
        fakeCategoriesRepository = new FakeCategoriesRepository();
        listCategoriesUseCase = new ListCategoriesUseCase(
            fakeCategoriesRepository
        );
    });
    it('should be able to list all categories', async () => {
        const category1 = await fakeCategoriesRepository.create({
            name: 'Fake Category 1',
            description: 'Fake Description',
        });
        const category2 = await fakeCategoriesRepository.create({
            name: 'Fake Category 2',
            description: 'Fake Description',
        });
        const category3 = await fakeCategoriesRepository.create({
            name: 'Fake Category 3',
            description: 'Fake Description',
        });

        const categories = await listCategoriesUseCase.execute();

        expect(categories).toEqual([category1, category2, category3]);
    });
});
