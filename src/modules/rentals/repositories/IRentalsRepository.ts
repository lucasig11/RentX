import ICreateRentalDTO from '../dtos/ICreateRentalDTO';
import IRentalResponseDTO from '../dtos/IRentalResponseDTO';
import Rental from '../infra/typeorm/entities/Rental';

export default interface IRentalsRepository {
    create(data: ICreateRentalDTO): Promise<Rental>;
    getCarRentals(car_id: string): Promise<IRentalResponseDTO>;
    getUserRentals(user_id: string): Promise<IRentalResponseDTO>;
}
