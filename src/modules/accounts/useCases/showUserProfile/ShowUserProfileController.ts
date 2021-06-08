import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowUserProfileUseCase from './ShowUserProfileUseCase';

export default class ShowUserProfileController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { id } = request.user;

        const showProfileUseCase = container.resolve(ShowUserProfileUseCase);

        const user = await showProfileUseCase.execute(id);

        return response.json(classToClass(user));
    }
}
