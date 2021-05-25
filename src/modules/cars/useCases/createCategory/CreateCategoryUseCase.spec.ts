import FakeCategoriesRepository from '@modules/cars/repositories/fakes/FakeCategoriesRepository';

import AppError from '@shared/errors/AppError';

import CreateCategoryUseCase from './CreateCategoryUseCase';

let fakeCategoriesRepository: FakeCategoriesRepository;
let createCategoryUseCase: CreateCategoryUseCase;

describe('Create new category', () => {
    beforeEach(() => {
        fakeCategoriesRepository = new FakeCategoriesRepository();
        createCategoryUseCase = new CreateCategoryUseCase(
            fakeCategoriesRepository
        );
    });

    it('should be able to create a new category', async () => {
        const newCategory = await createCategoryUseCase.execute({
            name: 'TestCategory',
            description: 'TestCategory',
        });

        expect(newCategory).toHaveProperty('id');
    });

    it('should not be able to create two categories with the same name', async () => {
        await createCategoryUseCase.execute({
            name: 'TestCategory',
            description: 'TestCategory',
        });

        await expect(
            createCategoryUseCase.execute({
                name: 'TestCategory',
                description: 'TestCategory',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
