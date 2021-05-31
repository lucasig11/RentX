import { inject, injectable } from 'tsyringe';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import Rental from '@modules/rentals/infra/typeorm/entities/Rental';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';
import IDateProvider from '@shared/container/providers/DateProvider/models/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
    id: string;
    user_id: string;
}

interface ICalcTotal {
    car: Car;
    rental: Rental;
}

@injectable()
export default class DischargeRentalUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository,
        @inject('CarsRepository')
        private carsRepository: ICarsRepository,
        @inject('DateProvider')
        private dateProvider: IDateProvider
    ) {}

    private calc_total({ car, rental }: ICalcTotal): number {
        const { fine_amount, daily_rate } = car;
        const { start_date, expected_return_date } = rental;
        const now = this.dateProvider.now();

        const totalDays = this.dateProvider.differenceInDays(start_date, now);

        const delay = this.dateProvider.differenceInDays(
            now,
            expected_return_date
        );

        const total = daily_rate * Math.max(totalDays, 1);
        const fine = fine_amount * Math.max(delay, 0);

        return total + fine;
    }

    public async execute({ id, user_id }: IRequest): Promise<Rental> {
        const rental = await this.rentalsRepository.findById(id);

        if (!rental) {
            throw new AppError('Rental not found', 404);
        }

        if (rental.user_id !== user_id) {
            throw new AppError('Unknown rental', 403);
        }

        const total = this.calc_total({
            rental,
            car: rental.car,
        });

        rental.total = total;
        rental.return_date = this.dateProvider.now();

        await this.carsRepository.setCarAvailability({
            car_id: rental.car_id,
            availability: true,
        });

        await this.rentalsRepository.save(rental);

        return rental;
    }
}
