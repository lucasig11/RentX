import nodemailer, { Transporter } from 'nodemailer';

import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;
    constructor() {
        nodemailer
            .createTestAccount()
            .then((account) => {
                const transporter = nodemailer.createTransport({
                    host: account.smtp.host,
                    port: account.smtp.port,
                    secure: account.smtp.secure,
                    auth: {
                        user: account.user,
                        pass: account.pass,
                    },
                });
                this.client = transporter;
            })
            .catch((err) => console.error(err));
    }

    public async sendMail({ to, subject, body }: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            to,
            from: 'Rentx <noreply@rentx.com.br>',
            subject,
            text: body,
            html: body,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
