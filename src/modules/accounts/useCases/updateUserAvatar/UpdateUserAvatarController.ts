import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';

export default class UpdataUserAvatarController {
    public async handle(
        request: Request,
        response: Response
    ): Promise<Response> {
        const { id } = request.user;
        const avatar_file = request.file.filename;

        const updateUserAvatar = container.resolve(UpdateUserAvatarUseCase);

        await updateUserAvatar.execute({
            user_id: id,
            avatar_file,
        });

        return response.status(204).send();
    }
}
