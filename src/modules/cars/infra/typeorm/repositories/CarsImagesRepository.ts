import { getRepository, Repository } from 'typeorm';

import ICreateCarImageDTO from '@modules/cars/dtos/ICreateCarImageDTO';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';

import CarImage from '../entities/CarImage';

export default class CarsImagesRepository implements ICarsImagesRepository {
    private repository: Repository<CarImage>;

    constructor() {
        this.repository = getRepository(CarImage);
    }

    public async create({
        car_id,
        filename,
    }: ICreateCarImageDTO): Promise<CarImage> {
        const car_image = this.repository.create({ car_id, filename });

        await this.repository.save(car_image);

        return car_image;
    }

    public async findById(id: string): Promise<CarImage> {
        return this.repository.findOne(id);
    }

    public async findByCarId(car_id: string): Promise<CarImage[]> {
        return this.repository.find({
            where: { car_id },
        });
    }

    public async clearCarImages(car_id: string): Promise<void> {
        await this.repository.delete(car_id);
    }
}
