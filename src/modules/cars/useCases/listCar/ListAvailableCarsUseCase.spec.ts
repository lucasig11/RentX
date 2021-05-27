import FakeCarsRepository from '@modules/cars/repositories/fakes/FakeCarsRepository';

import CreateCarUseCase from '../createCar/CreateCarUseCase';
import ListAvailableCarsUseCase from './ListAvailableCarsUseCase';

let listAvailableCars: ListAvailableCarsUseCase;
let createCar: CreateCarUseCase;
let fakeCarsRepository: FakeCarsRepository;

describe('List cars', () => {
    beforeEach(() => {
        fakeCarsRepository = new FakeCarsRepository();
        createCar = new CreateCarUseCase(fakeCarsRepository);
        listAvailableCars = new ListAvailableCarsUseCase(fakeCarsRepository);
    });

    it('should be able to list all available vehicles', async () => {
        const car1 = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        const car2 = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1235',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        const car_list = await listAvailableCars.execute();

        expect(car_list).toEqual([car1, car2]);
    });

    it('should be able to list all available vehicles with a given name', async () => {
        const car = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        await createCar.execute({
            name: 'Other name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1235',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        const car_list = await listAvailableCars.execute({
            name: 'Car name',
        });

        expect(car_list).toEqual([car]);
    });

    it('should be able to list all available vehicles with a given category ID', async () => {
        const car = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        await createCar.execute({
            name: 'Other name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1235',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'other_category',
        });

        const car_list = await listAvailableCars.execute({
            category_id: 'category',
        });

        expect(car_list).toEqual([car]);
    });

    it('should be able to list all available vehicles with a given brand', async () => {
        const car = await createCar.execute({
            name: 'Car name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1234',
            fine_amount: 60,
            brand: 'Brand',
            category_id: 'category',
        });

        await createCar.execute({
            name: 'Other name',
            description: 'Description',
            daily_rate: 100,
            license_plate: 'ABC-1235',
            fine_amount: 60,
            brand: 'Other brand',
            category_id: 'other_category',
        });

        const car_list = await listAvailableCars.execute({
            brand: 'Brand',
        });

        expect(car_list).toEqual([car]);
    });
});
