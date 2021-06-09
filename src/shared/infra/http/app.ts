import 'reflect-metadata';
import 'express-async-errors';
import 'dotenv/config';

import express from 'express';
import path from 'path';
import swaggerUI from 'swagger-ui-express';

import uploadConfig from '@config/upload';
import swaggerFile from '@docs/swagger.json';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import '@shared/container';

import createConnection from '../typeorm';
import { errorFallback } from './middlewares/errorFallback';
import { rateLimiter } from './middlewares/rateLimiter';
import routes from './routes';

createConnection();

const app = express();

app.use(express.json());

app.use(rateLimiter);

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(
    '/files/avatar',
    express.static(path.join(uploadConfig.tmpFolder, 'avatar'))
);

app.use(
    '/files/cars',
    express.static(path.join(uploadConfig.tmpFolder, 'cars'))
);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use(errorFallback);

export { app };
