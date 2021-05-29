import dayjs from 'dayjs';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import FakeCarsRepository from '@modules/cars/repositories/fakes/FakeCarsRepository';
import FakeRentalsRepository from '@modules/rentals/repositories/fakes/FakeRentalsRepository';
import FakeDateProvider from '@shared/container/providers/DateProvider/fakes/FakeDateProvider';
import AppError from '@shared/errors/AppError';

import CreateRentalUseCase from './CreateRentalUseCase';

let fakeRentalsRepository: FakeRentalsRepository;
let fakeCarsRepository: FakeCarsRepository;
let fakeDateProvider: FakeDateProvider;
let createRental: CreateRentalUseCase;
let car: Car;

describe('Create rental', () => {
    const tomorrow = dayjs().add(1, 'day').toDate();

    beforeEach(async () => {
        fakeRentalsRepository = new FakeRentalsRepository();
        fakeCarsRepository = new FakeCarsRepository();
        fakeDateProvider = new FakeDateProvider();
        createRental = new CreateRentalUseCase(
            fakeRentalsRepository,
            fakeCarsRepository,
            fakeDateProvider
        );
        car = await fakeCarsRepository.create({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });
    });

    it('should be able to create a new rental', async () => {
        const rental = await createRental.execute({
            car_id: car.id,
            user_id: '13131313',
            expected_return_date: tomorrow,
            start_date: new Date(),
        });

        expect(rental).toHaveProperty('id');
    });

    it('should not be able to rent an unexisting car', async () => {
        await expect(
            createRental.execute({
                car_id: 'invalid_id',
                user_id: '13131313',
                expected_return_date: tomorrow,
                start_date: new Date(),
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw an error if the user is already renting a car', async () => {
        await createRental.execute({
            car_id: car.id,
            user_id: '13131313',
            expected_return_date: tomorrow,
            start_date: new Date(),
        });

        await expect(
            createRental.execute({
                car_id: car.id,
                user_id: '13131313',
                expected_return_date: tomorrow,
                start_date: new Date(),
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw an error if the car is already rented', async () => {
        await createRental.execute({
            car_id: car.id,
            user_id: '12345',
            expected_return_date: tomorrow,
            start_date: new Date(),
        });

        await expect(
            createRental.execute({
                car_id: car.id,
                user_id: '54321',
                expected_return_date: tomorrow,
                start_date: new Date(),
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should set the vehicle as unavailable when it gets rented', async () => {
        await createRental.execute({
            car_id: car.id,
            user_id: '13131313',
            expected_return_date: tomorrow,
            start_date: new Date(),
        });

        await expect(
            fakeCarsRepository.findById(car.id)
        ).resolves.toHaveProperty('available', false);
    });

    it('should throw an error if the return date is within the next 23h', async () => {
        await expect(
            createRental.execute({
                car_id: car.id,
                user_id: '13131313',
                expected_return_date: new Date(),
                start_date: new Date(),
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
