import fs from 'fs';
import handlebars from 'handlebars';
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

    public async sendMail({
        to,
        subject,
        templatePath,
        variables,
    }: ISendMailDTO): Promise<void> {
        const templateFileContent = fs
            .readFileSync(templatePath)
            .toString('utf-8');

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        const message = await this.client.sendMail({
            to,
            from: 'Rentx <noreply@rentx.com.br>',
            subject,
            html: templateHTML,
        });

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}
