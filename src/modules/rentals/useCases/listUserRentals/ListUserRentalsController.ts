import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserRentalsUseCase from './ListUserRentalsUseCase';

export default class ListUserRentalsController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { id } = request.user;

        const listUserRentals = container.resolve(ListUserRentalsUseCase);

        const rentals = await listUserRentals.execute(id);

        return response.json(rentals);
    }
}
