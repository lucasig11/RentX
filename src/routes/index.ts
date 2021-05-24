import { ensureAuthenticated } from '@modules/accounts/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';

import CategoriesRouter from './categories.routes';
import SessionsRouter from './sessions.routes';
import SpecificationsRouter from './specifications.routes';
import UsersRouter from './users.routes';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', ensureAuthenticated, SpecificationsRouter);
routes.use('/users', UsersRouter);
routes.use('/sessions', SessionsRouter);

export default routes;
