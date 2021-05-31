import dayjs from 'dayjs';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import FakeCarsRepository from '@modules/cars/repositories/fakes/FakeCarsRepository';
import FakeRentalsRepository from '@modules/rentals/repositories/fakes/FakeRentalsRepository';
import DayJsDateProvider from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

import DischargeRentalUseCase from './DischargeRentalUseCase';

let fakeRentalsRepository: FakeRentalsRepository;
let fakeCarsRepository: FakeCarsRepository;
let dayjsDateProvider: IDateProvider;
let dischargeRental: DischargeRentalUseCase;
let car: Car;

describe('Discharge rental', () => {
    beforeEach(async () => {
        fakeRentalsRepository = new FakeRentalsRepository();
        fakeCarsRepository = new FakeCarsRepository();
        dayjsDateProvider = new DayJsDateProvider();

        dischargeRental = new DischargeRentalUseCase(
            fakeRentalsRepository,
            fakeCarsRepository,
            dayjsDateProvider
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

    it('should be able to discharge a rental', async () => {
        const rental = await fakeRentalsRepository.create({
            car_id: car.id,
            user_id: 'user_id',
            start_date: dayjsDateProvider.now(),
            expected_return_date: dayjs().add(1, 'day').toDate(),
        });

        await fakeRentalsRepository.save(Object.assign(rental, { car }));

        const discharged = await dischargeRental.execute({
            id: rental.id,
            user_id: 'user_id',
        });

        expect(discharged.total).toBe(100);
    });

    it('should charge fines if the devolution delays', async () => {
        const rental = await fakeRentalsRepository.create({
            car_id: car.id,
            user_id: 'user_id',
            start_date: dayjsDateProvider.now(),
            expected_return_date: dayjs().add(1, 'day').toDate(),
        });

        await fakeRentalsRepository.save(Object.assign(rental, { car }));

        jest.spyOn(dayjsDateProvider, 'now').mockImplementation(() => {
            return dayjs().add(3, 'day').toDate();
        });

        const discharged = await dischargeRental.execute({
            id: rental.id,
            user_id: 'user_id',
        });

        expect(discharged.total).toBe(220);
    });

    it('should throw an error on invalid rental id', async () => {
        await expect(
            dischargeRental.execute({
                id: 'invalid_rental',
                user_id: 'user_id',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
    it('should throw an error if the rent does not belong to the user', async () => {
        const rental = await fakeRentalsRepository.create({
            car_id: car.id,
            user_id: 'user_id',
            start_date: dayjsDateProvider.now(),
            expected_return_date: dayjs().add(1, 'day').toDate(),
        });

        await fakeRentalsRepository.save(Object.assign(rental, { car }));

        await expect(
            dischargeRental.execute({
                id: rental.id,
                user_id: 'other_user',
            })
        ).rejects.toBeInstanceOf(AppError);
    });
});
