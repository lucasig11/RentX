import authConfig from '@config/auth';
import { sign, verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import ITokenProvider from '../models/ITokenProvider';

interface IJWTToken {
    iat: number;
    exp: number;
    sub: string;
}

export default class JWTTokenProvider implements ITokenProvider {
    private config: typeof authConfig.jwt;

    constructor() {
        this.config = authConfig.jwt;
    }

    async verify(token: string): Promise<string> {
        const { secret } = this.config;

        try {
            const { sub } = verify(token, secret) as IJWTToken;
            return sub;
        } catch {
            throw new AppError('Invalid JWT token.', 401);
        }
    }

    generate(user_id: string): string {
        const { secret, expiresIn } = this.config;
        const token = sign({}, secret, {
            subject: user_id,
            expiresIn,
        });

        return token;
    }
}
