import ITokenProvider from '../models/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
    async verify(token: string): Promise<string> {
        return token;
    }

    generate(user_id: string): string {
        return user_id;
    }
}
