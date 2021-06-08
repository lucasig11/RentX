/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

export async function errorFallback(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction
): Promise<Response> {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    console.error(err);
    return response.status(500).json({
        status: 'error',
        message: `Internal server error - ${err.message}`,
    });
}
