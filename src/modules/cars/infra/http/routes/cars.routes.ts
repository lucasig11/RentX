import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import CreateCarController from '@modules/cars/useCases/createCar/CreateCarController';
import ListAvailableCarsController from '@modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import UpdateCarImagesController from '@modules/cars/useCases/updateCarImages/UpdateCarImagesController';
import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const carsRouter = Router();
const uploadImages = multer(uploadConfig.upload('./tmp/cars'));

const createCarController = new CreateCarController();
const updateCarImageController = new UpdateCarImagesController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRouter.post(
    '/',
    ensureAuthenticated,
    ensureAdmin,
    createCarController.handle
);

carsRouter.post(
    '/upload',
    ensureAuthenticated,
    ensureAdmin,
    uploadImages.array('images'),
    updateCarImageController.handle
);

carsRouter.get('/', listAvailableCarsController.handle);

export default carsRouter;
