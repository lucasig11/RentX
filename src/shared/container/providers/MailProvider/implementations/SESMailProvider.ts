import aws from 'aws-sdk';
import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import awsConfig from '@config/aws';
import mailConfig from '@config/mail';

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({
                apiVersion: '2010-12-01',
                region: awsConfig.ses.region,
            }),
        });
    }

    public async sendMail({
        to,
        from,
        subject,
        templatePath,
        variables,
    }: ISendMailDTO): Promise<void> {
        const { name, email } = mailConfig.defaults.from;

        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.address || email,
            },

            to: {
                name: to.name,
                address: to.address,
            },

            subject,

            html: await this.mailTemplateProvider.parse({
                file: templatePath,
                variables,
            }),
        });
    }
}
