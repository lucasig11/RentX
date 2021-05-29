import { getRepository, Repository } from 'typeorm';

import ICreateCarDTO from '@modules/cars/dtos/ICreateCarDTO';
import ISetAvailabilityDTO from '@modules/cars/dtos/ISetAvailabilityDTO';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';

import Car from '../entities/Car';

export default class CarsRepository implements ICarsRepository {
    private repository: Repository<Car>;

    constructor() {
        this.repository = getRepository(Car);
    }

    public async create({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specifications,
    }: ICreateCarDTO): Promise<Car> {
        const car = this.repository.create({
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
            specifications,
        });

        await this.repository.save(car);

        return car;
    }

    public async findByLicensePlate(license_plate: string): Promise<Car> {
        return this.repository.findOne({
            where: { license_plate },
            relations: ['category', 'specifications', 'images'],
        });
    }

    public async findById(id: string): Promise<Car> {
        return this.repository.findOne(id, {
            relations: ['category', 'specifications', 'images'],
        });
    }

    public async listAvailable(): Promise<Car[]> {
        return this.repository.find({
            where: { available: true },
            relations: ['category', 'specifications', 'images'],
        });
    }

    public async setCarAvailability({
        car_id,
        availability,
    }: ISetAvailabilityDTO): Promise<void> {
        await this.repository.save({
            id: car_id,
            available: availability,
        });
    }
}
