import aws, { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import awsConfig from '@config/aws';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

import IStorageProvider from '../models/IStorageProvider';

export default class S3StorageProvider implements IStorageProvider {
    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: awsConfig.s3.region,
        });
    }

    public async saveFile(file: string, folder: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const ContentType = mime.getType(originalPath);

        if (!ContentType) {
            throw new AppError('File not found!');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        console.log(awsConfig);
        await this.client
            .putObject({
                Bucket: `${awsConfig.s3.bucket}/${folder}`,
                Key: file,
                ACL: 'public-read',
                Body: fileContent,
                ContentType,
            })
            .promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string, folder: string): Promise<void> {
        await this.client
            .deleteObject({
                Bucket: `${awsConfig.s3.bucket}/${folder}`,
                Key: file,
            })
            .promise();
    }
}
