import { Router } from 'express';

import CreateRentalController from '@modules/rentals/useCases/createRental/CreateRentalController';
import DischargeRentalController from '@modules/rentals/useCases/dischargeRental/DischargeRentalController';
import ListUserRentalsController from '@modules/rentals/useCases/listUserRentals/ListUserRentalsController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const rentalsRouter = Router();

const createRentalController = new CreateRentalController();
const dischargeRentalController = new DischargeRentalController();
const listUserRentals = new ListUserRentalsController();

rentalsRouter.use(ensureAuthenticated);
rentalsRouter.get('/', listUserRentals.handle);
rentalsRouter.post('/', createRentalController.handle);
rentalsRouter.post('/discharge', dischargeRentalController.handle);

export default rentalsRouter;
