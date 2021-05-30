import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateRentalUseCase from './CreateRentalUseCase';

export default class CreateRentalController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.user;
        const { car_id, start_date, expected_return_date } = request.body;

        const createRental = container.resolve(CreateRentalUseCase);

        const rental = await createRental.execute({
            car_id,
            user_id: id,
            start_date,
            expected_return_date,
        });

        return response.status(201).json(rental);
    }
}
