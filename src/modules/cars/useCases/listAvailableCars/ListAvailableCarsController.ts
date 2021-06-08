import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListAvailableCarsUseCase from './ListAvailableCarsUseCase';

export default class ListCarController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { name, brand, category_id } = request.query;
        const listCars = container.resolve(ListAvailableCarsUseCase);

        const cars = await listCars.execute({
            name: name as string,
            brand: brand as string,
            category_id: category_id as string,
        });

        return response.json(classToClass(cars));
    }
}
