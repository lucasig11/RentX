import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import authConfig from '@config/auth';
import ITokenProvider from '@modules/accounts/providers/TokenProvider/models/ITokenProvider';
import IUserTokensRepository from '@modules/accounts/repositories/IUserTokensRepository';
import AppError from '@shared/errors/AppError';

export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = request.headers.authorization;
    const { refresh_token } = authConfig;

    if (!authHeader) {
        throw new AppError('Missing JWT token', 401);
    }

    const tokenProvider = container.resolve<ITokenProvider>('TokenProvider');

    const [, token] = authHeader.split(' ');

    const user_id = await tokenProvider.verify(token, refresh_token);

    const userTokensRepository = container.resolve<IUserTokensRepository>(
        'UserTokensRepository'
    );

    const findToken = await userTokensRepository.findByToken(token);

    if (!findToken || findToken.user_id !== user_id) {
        throw new AppError('Invalid JWT token', 401);
    }

    request.user = { id: user_id };
    next();
}
