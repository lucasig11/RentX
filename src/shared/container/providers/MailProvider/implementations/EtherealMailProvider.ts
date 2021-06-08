import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    private client: Transporter;
    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
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

    public async sendMail({
        to,
        from,
        subject,
        templatePath,
        variables,
    }: ISendMailDTO): Promise<void> {
        const templateHTML = await this.mailTemplateProvider.parse({
            file: templatePath,
            variables,
        });

        const message = await this.client.sendMail({
            to,
            from,
            subject,
            html: templateHTML,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
