import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListSpecificationUseCase from './ListSpecificationUseCase';

export default class ListSpecificationController {
    async handle(request: Request, response: Response): Promise<Response> {
        const listSpecifications = container.resolve(ListSpecificationUseCase);

        const specifications = await listSpecifications.execute();

        return response.json(specifications);
    }
}
