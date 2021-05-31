import FakeSpecificationsRepository from '@modules/cars/repositories/fakes/FakeSpecificationsRepository';

import ListSpecificationUseCase from './ListSpecificationUseCase';

let listSpecifications: ListSpecificationUseCase;
let fakeSpecificationsRepository: FakeSpecificationsRepository;

describe('List specifications', () => {
    beforeEach(() => {
        fakeSpecificationsRepository = new FakeSpecificationsRepository();
        listSpecifications = new ListSpecificationUseCase(
            fakeSpecificationsRepository
        );
    });

    it('should be able to list all specifications', async () => {
        const new_specification = await fakeSpecificationsRepository.create({
            name: 'test',
            description: 'test',
        });

        const specifications = await listSpecifications.execute();

        expect(specifications).toEqual([new_specification]);
    });
});
