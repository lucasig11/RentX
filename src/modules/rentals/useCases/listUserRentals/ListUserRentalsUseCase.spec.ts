import FakeRentalsRepository from '@modules/rentals/repositories/fakes/FakeRentalsRepository';

import ListUserRentalsUseCase from './ListUserRentalsUseCase';

let fakeRentalsRepository: FakeRentalsRepository;
let listUserRentals: ListUserRentalsUseCase;

describe('List user rentals', () => {
    beforeEach(() => {
        fakeRentalsRepository = new FakeRentalsRepository();
        listUserRentals = new ListUserRentalsUseCase(fakeRentalsRepository);
    });

    it("should be able to list a user's rentals", async () => {
        const rental = await fakeRentalsRepository.create({
            car_id: 'car_id',
            expected_return_date: new Date(),
            start_date: new Date(),
            user_id: 'user_id',
        });

        const user_rentals = await listUserRentals.execute('user_id');

        expect(user_rentals).toEqual([rental]);
    });
});
