import { Router } from 'express';

import CategoriesRouter from './categories.routes';
import SpecificationsRouter from './specifications.routes';

const routes = Router();

routes.use('/categories', CategoriesRouter);
routes.use('/specifications', SpecificationsRouter);

export default routes;
