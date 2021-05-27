import FakeCarsRepository from '@modules/cars/repositories/fakes/FakeCarsRepository';
import AppError from '@shared/errors/AppError';

import CreateCarUseCase from './CreateCarUseCase';

let createCar: CreateCarUseCase;
let fakeCarsRepository: FakeCarsRepository;

describe('Create car', () => {
    beforeEach(() => {
        fakeCarsRepository = new FakeCarsRepository();
        createCar = new CreateCarUseCase(fakeCarsRepository);
    });

    it('should be able to create a new car', async () => {
        const car = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car).toHaveProperty('id');
    });

    it('should throw an error on license plate collisions', async () => {
        await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        await expect(
            createCar.execute({
                name: 'OtherCar name',
                description: 'Description',
                daily_rate: 100,
                license_plate: 'ABC-1234',
                fine_amount: 60,
                brand: 'Brand',
                category_id: 'category',
            })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should set the car availability as true on creation', async () => {
        const car = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        expect(car.available).toBe(true);
    });
});
