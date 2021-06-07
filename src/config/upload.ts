import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import path from 'path';

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    };
}

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

export default {
    driver: process.env.STORAGE_DRIVER,
    tmpFolder,
    uploadsFolder,

    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname.replace(
                    ' ',
                    '-'
                )}`;
                return callback(null, fileName);
            },
        }),
    },
} as IUploadConfig;
