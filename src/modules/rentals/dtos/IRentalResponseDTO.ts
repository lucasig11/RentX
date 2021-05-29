import Rental from '../infra/typeorm/entities/Rental';

export default interface IRentalResponseDTO {
    hasOpenedRental: boolean;
    rentals: Rental[];
}
