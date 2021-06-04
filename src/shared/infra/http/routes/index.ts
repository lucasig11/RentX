import { Router } from 'express';

import PasswordRouter from '@modules/accounts/infra/http/routes/password.routes';
import SessionsRouter from '@modules/accounts/infra/http/routes/sessions.routes';
import UsersRouter from '@modules/accounts/infra/http/routes/users.routes';
import CarsRouter from '@modules/cars/infra/http/routes/cars.routes';
import CategoriesRouter from '@modules/cars/infra/http/routes/categories.routes';
import SpecificationsRouter from '@modules/cars/infra/http/routes/specifications.routes';
import RentalsRouter from '@modules/rentals/infra/http/routes/rentals.routes';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', SpecificationsRouter);
routes.use('/users', UsersRouter);
routes.use('/password', PasswordRouter);
routes.use('/sessions', SessionsRouter);
routes.use('/cars', CarsRouter);
routes.use('/rental', RentalsRouter);

export default routes;
