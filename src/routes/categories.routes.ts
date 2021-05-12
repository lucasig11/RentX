import { Router } from 'express';

import createCategoryController from '../modules/cars/useCases/createCategory';
import listCategoriesController from '../modules/cars/useCases/listCategory';

const categoriesRouter = Router();

categoriesRouter.post('/', async (request, response) => {
    return createCategoryController.handle(request, response);
});

categoriesRouter.get('/', (request, response) => {
    return listCategoriesController.handle(request, response);
});

export default categoriesRouter;
