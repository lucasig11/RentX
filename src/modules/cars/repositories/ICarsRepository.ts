import ICreateCarDTO from '../dtos/ICreateCarDTO';
import ISetAvailabilityDTO from '../dtos/ISetAvailabilityDTO';
import Car from '../infra/typeorm/entities/Car';

export default interface ICarsRepository {
    create(data: ICreateCarDTO): Promise<Car>;
    findById(id: string): Promise<Car>;
    findByLicensePlate(license_plate: string): Promise<Car>;
    listAvailable(): Promise<Car[]>;
    setCarAvailability(data: ISetAvailabilityDTO): Promise<void>;
}
