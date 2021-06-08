import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';

import express from 'express';
import path from 'path';
import swaggerUI from 'swagger-ui-express';

import uploadConfig from '@config/upload';
import swaggerFile from '@docs/swagger.json';

import '@shared/container';

import createConnection from '../typeorm';
import { errorFallback } from './middlewares/errorFallback';
import routes from './routes';

createConnection();

const app = express();

app.use(express.json());

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(
    '/files/avatar',
    express.static(path.join(uploadConfig.tmpFolder, 'avatar'))
);
app.use(
    '/files/cars',
    express.static(path.join(uploadConfig.tmpFolder, 'cars'))
);

app.use(routes);

app.use(errorFallback);

export { app };
