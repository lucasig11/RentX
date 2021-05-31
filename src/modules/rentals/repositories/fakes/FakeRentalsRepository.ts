import { v4 } from 'uuid';

import ICreateRentalDTO from '@modules/rentals/dtos/ICreateRentalDTO';
import IRentalResponseDTO from '@modules/rentals/dtos/IRentalResponseDTO';
import Rental from '@modules/rentals/infra/typeorm/entities/Rental';

import IRentalsRepository from '../IRentalsRepository';

export default class FakeRentalsRepository implements IRentalsRepository {
    private repository: Rental[] = [];

    public async create({
        car_id,
        user_id,
        start_date,
        expected_return_date,
    }: ICreateRentalDTO): Promise<Rental> {
        const rental = new Rental();

        Object.assign(rental, {
            id: v4(),
            car_id,
            user_id,
            start_date,
            expected_return_date,
            created_at: new Date(),
            updated_at: new Date(),
        });

        this.repository.push(rental);

        return rental;
    }

    public async getCarRentals(car_id: string): Promise<IRentalResponseDTO> {
        const rentals = this.repository.filter(
            (rental) => rental.car_id === car_id
        );
        const hasOpenedRental = rentals.some((rental) => !rental.return_date);

        return {
            rentals,
            hasOpenedRental,
        };
    }

    public async getUserRentals(user_id: string): Promise<IRentalResponseDTO> {
        const rentals = this.repository.filter(
            (rental) => rental.user_id === user_id
        );
        const hasOpenedRental = rentals.some((rental) => !rental.return_date);

        return {
            rentals,
            hasOpenedRental,
        };
    }

    public async findById(id: string): Promise<Rental> {
        return this.repository.find((rental) => rental.id === id);
    }

    public async save(rental: Rental): Promise<Rental> {
        const index = this.repository.findIndex(
            (findUser) => findUser.id === rental.id
        );

        this.repository[index] = rental;

        return rental;
    }
}
