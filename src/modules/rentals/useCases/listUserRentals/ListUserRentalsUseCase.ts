import { inject, injectable } from 'tsyringe';

import Rental from '@modules/rentals/infra/typeorm/entities/Rental';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';

@injectable()
export default class ListUserRentalsUseCase {
    constructor(
        @inject('RentalsRepository')
        private rentalsRepository: IRentalsRepository
    ) {}

    public async execute(user_id: string): Promise<Rental[]> {
        const { rentals } = await this.rentalsRepository.getUserRentals(
            user_id
        );
        return rentals;
    }
}
