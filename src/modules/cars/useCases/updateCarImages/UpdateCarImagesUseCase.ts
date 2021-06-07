import { inject, injectable } from 'tsyringe';

import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    car_id: string;
    filenames: string[];
}

@injectable()
export default class UpdateCarImagesUseCase {
    constructor(
        @inject('CarsImagesRepository')
        private carsImagesRepository: ICarsImagesRepository,
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider
    ) {}

    public async execute({ car_id, filenames }: IRequest): Promise<void> {
        const car = await this.carsRepository.findById(car_id);

        if (!car) {
            throw new AppError('Car not found!', 404);
        }

        const car_images = await this.carsImagesRepository.findByCarId(car_id);

        car_images.forEach(async (image) => {
            await this.storageProvider.deleteFile(image.filename, 'cars');
        });

        await this.carsImagesRepository.clearCarImages(car_id);

        filenames.forEach(async (filename) => {
            await this.carsImagesRepository.create({
                car_id,
                filename,
            });

            await this.storageProvider.saveFile(filename, 'cars');
        });
    }
}
