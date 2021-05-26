import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

export default class CreateUserController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { name, password, email, driver_license } = request.body;

        const createUserUseCase = container.resolve(CreateUserUseCase);

        const user = await createUserUseCase.execute({
            name,
            password,
            email,
            driver_license,
        });

        return response.status(201).json(classToClass(user));
    }
}
