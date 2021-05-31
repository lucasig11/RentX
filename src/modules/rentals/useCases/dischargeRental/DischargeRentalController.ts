import { Request, Response } from 'express';
import { container } from 'tsyringe';

import DischargeRentalUseCase from './DischargeRentalUseCase';

export default class DischargeRentalController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { id } = request.body;
        const user_id = request.user.id;

        const dischargeRental = container.resolve(DischargeRentalUseCase);

        const rental = await dischargeRental.execute({ id, user_id });

        return response.json(rental);
    }
}
