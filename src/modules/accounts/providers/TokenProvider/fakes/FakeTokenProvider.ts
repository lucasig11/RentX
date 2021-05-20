import ITokenProvider from '../models/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
    generate(user_id: string): string {
        return user_id;
    }
}
