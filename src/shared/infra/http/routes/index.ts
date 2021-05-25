import { ensureAuthenticated } from '@modules/accounts/infra/http/middlewares/ensureAuthenticated';
import SessionsRouter from '@modules/accounts/infra/http/routes/sessions.routes';
import UsersRouter from '@modules/accounts/infra/http/routes/users.routes';
import CategoriesRouter from '@modules/cars/infra/http/routes/categories.routes';
import SpecificationsRouter from '@modules/cars/infra/http/routes/specifications.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', ensureAuthenticated, SpecificationsRouter);
routes.use('/users', UsersRouter);
routes.use('/sessions', SessionsRouter);

export default routes;
