import authConfig from '@config/auth';
import { sign } from 'jsonwebtoken';

import ITokenProvider from '../models/ITokenProvider';

export default class JWTTokenProvider implements ITokenProvider {
    generate(user_id: string): string {
        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user_id,
            expiresIn,
        });

        return token;
    }
}
