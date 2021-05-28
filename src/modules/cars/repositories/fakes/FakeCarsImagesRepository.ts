import { v4 } from 'uuid';

import ICreateCarImageDTO from '@modules/cars/dtos/ICreateCarImageDTO';
import CarImage from '@modules/cars/infra/typeorm/entities/CarImage';

import ICarsImagesRepository from '../ICarsImagesRepository';

export default class FakeCarsImagesRepository implements ICarsImagesRepository {
    private repository: CarImage[] = [];

    public async create(data: ICreateCarImageDTO): Promise<CarImage> {
        const car_image = new CarImage();

        Object.assign(car_image, {
            id: v4(),
            data,
        });

        this.repository.push(car_image);

        return car_image;
    }

    public async findById(id: string): Promise<CarImage> {
        return this.repository.find((image) => image.id === id);
    }

    public async findByCarId(car_id: string): Promise<CarImage[]> {
        return this.repository.filter((image) => image.car_id === car_id);
    }
}
