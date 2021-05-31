import { Router } from 'express';

import CreateRentalController from '@modules/rentals/useCases/createRental/CreateRentalController';
import DischargeRentalController from '@modules/rentals/useCases/dischargeRental/DischargeRentalController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const rentalsRouter = Router();

const createRentalController = new CreateRentalController();
const dischargeRentalController = new DischargeRentalController();

rentalsRouter.use(ensureAuthenticated);
rentalsRouter.post('/', createRentalController.handle);
rentalsRouter.post('/discharge', dischargeRentalController.handle);

export default rentalsRouter;
