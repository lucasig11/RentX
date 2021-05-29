import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCarUseCase from './CreateCarUseCase';

export default class CreateCarController {
    async handle(request: Request, response: Response): Promise<Response> {
        const {
            name,
            brand,
            category_id,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            specification_ids,
        } = request.body;

        const createCar = container.resolve(CreateCarUseCase);

        const car = await createCar.execute({
            name,
            brand,
            category_id,
            daily_rate,
            description,
            fine_amount,
            license_plate,
            specification_ids,
        });

        return response.status(201).json(car);
    }
}
