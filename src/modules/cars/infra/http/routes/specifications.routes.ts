import CreateSpecificationController from '@modules/cars/useCases/createSpecification/CreateSpecificationController';
import { Router } from 'express';

const specificationsRouter = Router();

const createSpecificationController = new CreateSpecificationController();

specificationsRouter.post('/', createSpecificationController.handle);

export default specificationsRouter;
