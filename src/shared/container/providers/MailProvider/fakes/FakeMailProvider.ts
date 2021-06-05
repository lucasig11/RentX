import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
    private inbox: ISendMailDTO[] = [];

    public async sendMail(data: ISendMailDTO): Promise<void> {
        this.inbox.push(data);
    }
}
