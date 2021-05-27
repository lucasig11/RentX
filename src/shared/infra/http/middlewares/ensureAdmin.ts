import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

export async function ensureAdmin(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const { id } = request.user;

    const usersRepository: IUsersRepository =
        container.resolve('UsersRepository');

    const user = await usersRepository.findByID(id);

    if (!user.is_admin) {
        throw new AppError("You don't have permission to do this.", 501);
    }

    next();
}
