import { getRepository, Repository } from 'typeorm';

import ICreateRentalDTO from '@modules/rentals/dtos/ICreateRentalDTO';
import IRentalResponseDTO from '@modules/rentals/dtos/IRentalResponseDTO';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';

import Rental from '../entities/Rental';

export default class RentalsRepository implements IRentalsRepository {
    private repository: Repository<Rental>;

    constructor() {
        this.repository = getRepository(Rental);
    }

    public async create(data: ICreateRentalDTO): Promise<Rental> {
        const rental = this.repository.create(data);

        await this.repository.save(rental);

        return rental;
    }

    public async findById(id: string): Promise<Rental> {
        return this.repository.findOne(id, {
            relations: ['user', 'car'],
        });
    }

    public async getCarRentals(car_id: string): Promise<IRentalResponseDTO> {
        const rentals = await this.repository.find({
            where: { car_id },
        });

        const hasOpenedRental = rentals.some((rental) => !rental.return_date);

        return {
            rentals,
            hasOpenedRental,
        };
    }

    public async getUserRentals(user_id: string): Promise<IRentalResponseDTO> {
        const rentals = await this.repository.find({
            where: { user_id },
        });

        const hasOpenedRental = rentals.some((rental) => !rental.return_date);

        return {
            rentals,
            hasOpenedRental,
        };
    }

    public async save(rental: Rental): Promise<Rental> {
        return this.repository.save(rental);
    }
}
