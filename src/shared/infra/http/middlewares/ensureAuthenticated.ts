import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import ITokenProvider from '@modules/accounts/providers/TokenProvider/models/ITokenProvider';
import IUsersRepository from '@modules/accounts/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Missing JWT token', 401);
    }

    const tokenProvider: ITokenProvider = container.resolve('TokenProvider');

    const [, token] = authHeader.split(' ');

    const user_id = await tokenProvider.verify(token);

    const usersRepository: IUsersRepository =
        container.resolve('UsersRepository');

    const findUser = usersRepository.findByID(user_id);

    if (!findUser) {
        throw new AppError('Invalid JWT token', 401);
    }

    request.user = { id: user_id };
    next();
}
