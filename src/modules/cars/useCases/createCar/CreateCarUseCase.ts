import { inject, injectable } from 'tsyringe';

import Car from '@modules/cars/infra/typeorm/entities/Car';
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
        private specificationsRepository: ISpecificationsRepository
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

        return new_car;
    }
}
