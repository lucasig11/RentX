import crypto from 'crypto';

import ITokenProvider from '../models/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
    async verify(token: string): Promise<string> {
        const [user_id] = token.split('.');
        return user_id;
    }

    generate(user_id: string): string {
        return `${user_id}.${crypto.randomBytes(8).toString('hex')}`;
    }
}
