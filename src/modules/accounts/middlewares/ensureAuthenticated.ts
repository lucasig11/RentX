import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITokenProvider from '../providers/TokenProvider/models/ITokenProvider';

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

    console.log(user_id);
    next();
}
