import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAvailableCarsUseCase from './ListAvailableCarsUseCase';

export default class ListCarController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { name, brand, category_id } = request.body;
        const listCars = container.resolve(ListAvailableCarsUseCase);

        const cars = await listCars.execute({
            name,
            brand,
            category_id,
        });

        return response.json(cars);
    }
}
