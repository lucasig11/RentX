import { getRepository, Repository } from 'typeorm';

import ICreateCarDTO from '@modules/cars/dtos/ICreateCarDTO';
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
        });
    }

    public async findById(id: string): Promise<Car> {
        return this.repository.findOne(id);
    }

    public async listAvailable(): Promise<Car[]> {
        return this.repository.find({
            where: { available: true },
            relations: ['category', 'specifications'],
        });
    }
}
