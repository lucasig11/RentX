import { Router } from 'express';

import CategoriesRouter from './categories.routes';
import SpecificationsRouter from './specifications.routes';
import UsersRouter from './users.routes';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', SpecificationsRouter);
routes.use('/users', UsersRouter);

export default routes;
