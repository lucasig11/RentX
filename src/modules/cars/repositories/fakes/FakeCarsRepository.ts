import { v4 } from 'uuid';

import ICreateCarDTO from '@modules/cars/dtos/ICreateCarDTO';
import ISetAvailabilityDTO from '@modules/cars/dtos/ISetAvailabilityDTO';
import Car from '@modules/cars/infra/typeorm/entities/Car';

import ICarsRepository from '../ICarsRepository';

export default class FakeCarsRepository implements ICarsRepository {
    private repository: Car[] = [];

    public async create(data: ICreateCarDTO): Promise<Car> {
        const car = new Car();

        Object.assign(car, {
            id: v4(),
            available: true,
            created_at: new Date(),
            ...data,
        });

        this.repository.push(car);

        return car;
    }

    public async findById(id: string): Promise<Car> {
        return this.repository.find((car) => car.id === id);
    }

    public async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.repository.find(
            (car) => car.license_plate === license_plate
        );
    }

    public async listAvailable(): Promise<Car[]> {
        return this.repository.filter((car) => car.available);
    }

    public async setCarAvailability({
        car_id,
        availability,
    }: ISetAvailabilityDTO): Promise<void> {
        const carIndex = this.repository.findIndex((car) => car.id === car_id);

        this.repository[carIndex].available = availability;
    }
}
