import { Router } from 'express';

import CreateCarController from '@modules/cars/useCases/createCar/CreateCarController';
import ListAvailableCarsController from '@modules/cars/useCases/listCar/ListAvailableCarsController';
import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const carsRouter = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();

carsRouter.post(
    '/',
    ensureAuthenticated,
    ensureAdmin,
    createCarController.handle
);

carsRouter.get('/', listAvailableCarsController.handle);

export default carsRouter;
