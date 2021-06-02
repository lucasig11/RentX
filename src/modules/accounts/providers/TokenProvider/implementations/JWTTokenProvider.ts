import { sign, verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import ITokenProvider from '../models/ITokenProvider';

interface IJWTToken {
    iat: number;
    exp: number;
    sub: string;
}

interface IOptions {
    secret: string;
    expiresIn?: string;
    payload?: string;
}

export default class JWTTokenProvider implements ITokenProvider {
    public async verify(token: string, { secret }: IOptions): Promise<string> {
        try {
            const { sub } = verify(token, secret) as IJWTToken;
            return sub;
        } catch {
            throw new AppError('Invalid JWT token.', 401);
        }
    }

    public generate(
        user_id: string,
        { secret, expiresIn, payload }: IOptions
    ): string {
        const token = sign({ payload }, secret, {
            subject: user_id,
            expiresIn,
        });

        return token;
    }
}
