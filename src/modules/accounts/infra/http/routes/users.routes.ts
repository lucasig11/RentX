import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateUserController from '@modules/accounts/useCases/createUser/CreateUserController';
import ShowUserProfileController from '@modules/accounts/useCases/showUserProfile/ShowUserProfileController';
import UpdateUserAvatarController from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();

const uploadAvatar = multer(uploadConfig.multer);

const createUserController = new CreateUserController();
const showProfileController = new ShowUserProfileController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRouter.post('/', createUserController.handle);

usersRouter.use(ensureAuthenticated);

usersRouter.get('/profile', showProfileController.handle);
usersRouter.patch(
    '/avatar',
    uploadAvatar.single('avatar'),
    updateUserAvatarController.handle
);
export default usersRouter;
