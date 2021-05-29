import { inject, injectable } from 'tsyringe';

import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import Rental from '@modules/rentals/infra/typeorm/entities/Rental';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    car_id: string;
    user_id: string;
    expected_return_date: Date;
    start_date: Date;
}

@injectable()
export default class CreateRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository,
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}
    public async execute({
        car_id,
        user_id,
        expected_return_date,
        start_date,
    }: IRequest): Promise<Rental> {
        const carExists = await this.carsRepository.findById(car_id);

        if (!carExists) {
            throw new AppError('Car not found');
        }

        const { hasOpenedRental } = await this.rentalsRepository.getUserRentals(
            user_id
        );

        if (hasOpenedRental) {
            throw new AppError("You can't rent two cars at the same time!");
        }

        const { hasOpenedRental: carIsRented } =
            await this.rentalsRepository.getCarRentals(car_id);

        if (carIsRented) {
            throw new AppError('This car has already been rented!');
        }

        const difference = this.dateProvider.differenceInHours(
            expected_return_date,
            start_date
        );

        if (difference < 24) {
            throw new AppError('The minimum rental duration is 24 hours.');
        }

        const rental = await this.rentalsRepository.create({
            car_id,
            user_id,
            expected_return_date,
            start_date,
        });

        await this.carsRepository.setCarAvailability({
            car_id,
            availability: false,
        });

        return rental;
    }
}
