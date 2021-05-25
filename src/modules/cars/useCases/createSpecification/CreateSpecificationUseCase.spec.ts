import FakeSpecificationsRepository from '@modules/cars/repositories/fakes/FakeSpecificationsRepository';

import AppError from '@shared/errors/AppError';

import CreateSpecificationUseCase from './CreateSpecificationUseCase';

let createSpecificationUseCase: CreateSpecificationUseCase;
let fakeSpecificationsRepository: FakeSpecificationsRepository;

describe('Create specification', () => {
    beforeEach(() => {
        fakeSpecificationsRepository = new FakeSpecificationsRepository();
        createSpecificationUseCase = new CreateSpecificationUseCase(
            fakeSpecificationsRepository
        );
    });

    it('should be able to create a new specification', async () => {
        const specification = await createSpecificationUseCase.execute({
            name: 'TestSpecification',
            description: 'description',
        });

        expect(specification).toHaveProperty('id');
    });

    it('should not be able to create two categories with the same name', async () => {
        await createSpecificationUseCase.execute({
            name: 'TestCategory',
            description: 'TestCategory',
        });

        await expect(
            createSpecificationUseCase.execute({
                name: 'TestCategory',
                description: 'TestCategory',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
