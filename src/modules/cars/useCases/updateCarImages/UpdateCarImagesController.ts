import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateCarImagesUseCase from './UpdateCarImagesUseCase';

interface IFiles {
    filename: string;
}

export default class UpdateCarImagesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.query;
        const images = request.files as IFiles[];

        const updateImages = container.resolve(UpdateCarImagesUseCase);

        const filenames = images.map((image) => image.filename);

        await updateImages.execute({
            car_id: id as string,
            filenames,
        });

        return response.send();
    }
}
