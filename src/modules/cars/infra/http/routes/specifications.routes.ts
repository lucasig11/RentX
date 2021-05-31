import { Router } from 'express';

import CreateSpecificationController from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import ListSpecificationController from '@modules/cars/useCases/listSpecification/ListSpecificationController';
import { ensureAdmin } from '@shared/infra/http/middlewares/ensureAdmin';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const specificationsRouter = Router();

const createSpecificationController = new CreateSpecificationController();
const listSpecificationController = new ListSpecificationController();

specificationsRouter.get('/', listSpecificationController.handle);
specificationsRouter.use(ensureAuthenticated, ensureAdmin);
specificationsRouter.post('/', createSpecificationController.handle);

export default specificationsRouter;
