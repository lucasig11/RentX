import { v4 } from 'uuid';

import ICreateCarDTO from '@modules/cars/dtos/ICreateCarDTO';
import Car from '@modules/cars/infra/typeorm/entities/Car';

import ICarsRepository from '../ICarsRepository';

export default class FakeCarsRepository implements ICarsRepository {
    private repository: Car[] = [];

    async create(data: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            ...data,
            available: true,
            id: v4(),
            created_at: new Date(),
        });

        this.repository.push(car);

        return car;
    }

    async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.repository.find(
            (car) => car.license_plate === license_plate
        );
    }
}