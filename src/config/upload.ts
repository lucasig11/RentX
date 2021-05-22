import crypto from 'crypto';
import multer from 'multer';
import { resolve } from 'path';

interface IUploadObject {
    storage: multer.StorageEngine;
}

export default {
    upload(directory: string): IUploadObject {
        return {
            storage: multer.diskStorage({
                destination: resolve(__dirname, '..', '..', directory),
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString('hex');
                    const fileName = `${fileHash}-${file.originalname.replace(
                        ' ',
                        '-'
                    )}`;
                    return callback(null, fileName);
                },
            }),
        };
    },
};
