import { inject, injectable } from 'tsyringe';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
    name: string;
    description: string;
    daily_rate: number;
    license_plate: string;
    fine_amount: number;
    brand: string;
    category_id: string;
    specification_ids?: string[];
    filenames?: string[];
}

@injectable()
export default class CreateCarUseCase {
    constructor(
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
        @inject('SpecificationsRepository')
        private specificationsRepository: ISpecificationsRepository,
        @inject('CarsImagesRepository')
        private carsImagesRepository: ICarsImagesRepository
    ) {}

    public async execute({
        name,
        description,
        daily_rate,
        license_plate,
        fine_amount,
        brand,
        category_id,
        specification_ids,
        filenames,
    }: IRequest): Promise<Car> {
        const isNameplateUsed = await this.carsRepository.findByLicensePlate(
            license_plate
        );

        if (isNameplateUsed) {
            throw new AppError(
                `The license plate ${license_plate} is already registered`
            );
        }

        const specifications = await this.specificationsRepository.findByIds(
            specification_ids
        );

        const new_car = await this.carsRepository.create({
            name,
            description,
            daily_rate,
            license_plate,
            fine_amount,
            brand,
            category_id,
            specifications,
        });

        filenames.map(async (filename) => {
            await this.carsImagesRepository.create({
                car_id: new_car.id,
                filename,
            });
        });

        return new_car;
    }
}
