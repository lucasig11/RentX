import ICreateCarImageDTO from '../dtos/ICreateCarImageDTO';
import CarImage from '../infra/typeorm/entities/CarImage';

export default interface ICarsImagesRepository {
    create(data: ICreateCarImageDTO): Promise<CarImage>;
    findById(id: string): Promise<CarImage>;
    findByCarId(car_id: string): Promise<CarImage[]>;
}
