import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordUseCase from './ResetPasswordUseCase';

export default class ResetPasswordController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { new_password } = request.body;
        const { token } = request.query;

        const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

        await resetPasswordUseCase.execute({
            token: token as string,
            new_password,
        });

        return response.send();
    }
}
