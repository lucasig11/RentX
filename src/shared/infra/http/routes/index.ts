import { Router } from 'express';

import SessionsRouter from '@modules/accounts/infra/http/routes/sessions.routes';
import UsersRouter from '@modules/accounts/infra/http/routes/users.routes';
import CarsRouter from '@modules/cars/infra/http/routes/cars.routes';
import CategoriesRouter from '@modules/cars/infra/http/routes/categories.routes';
import SpecificationsRouter from '@modules/cars/infra/http/routes/specifications.routes';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticated';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', ensureAuthenticated, SpecificationsRouter);
routes.use('/users', UsersRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/cars', CarsRouter);

export default routes;
