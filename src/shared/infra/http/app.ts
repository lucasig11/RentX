import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';

import express from 'express';
import path from 'path';
import swaggerUI from 'swagger-ui-express';

import swaggerFile from '@docs/swagger.json';
import AppError from '@shared/errors/AppError';

import '@shared/container';

import createConnection from '../typeorm';
import { errorFallback } from './middlewares/errorFallback';
import routes from './routes';

createConnection();

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use(routes);
app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                status: 'error',
                message: err.message,
            });
        }
        console.log(err);
        return response.status(500).json({
            status: 'error',
            message: `Internal server error - ${err.message}`,
        });
    }
);

app.use(routes);

app.use(errorFallback);

export { app };
