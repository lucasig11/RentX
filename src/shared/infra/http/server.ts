import 'reflect-metadata';
import 'express-async-errors';

import express, { Request, Response, NextFunction } from 'express';
import swaggerUI from 'swagger-ui-express';

import AppError from '@shared/errors/AppError';

import '../../../database';
import '@shared/container';

import routes from '../../../routes';
import swaggerFile from '../../../swagger.json';

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
        // console.log(err);
        return response.status(500).json({
            status: 'error',
            message: 'Internal server error.',
        });
    }
);
app.listen(3333, () => console.log('Server started succesfully'));
