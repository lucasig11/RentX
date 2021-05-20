import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITokenProvider from '../providers/TokenProvider/models/ITokenProvider';
import UsersRepository from '../repositories/implementations/UsersRepository';

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

    const usersRepository = new UsersRepository();

    const findUser = usersRepository.findByID(user_id);

    if (!findUser) {
        throw new AppError('Invalid JWT token', 401);
    }

    next();
}
