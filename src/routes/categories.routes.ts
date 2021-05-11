import { Router } from 'express';

import CategoriesRepository from '../modules/cars/repositories/CategoriesRepository';
import createCategoryController from '../modules/cars/useCases/createCategory';

const categoriesRouter = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRouter.post('/', async (request, response) => {
    return createCategoryController.handle(request, response);
});

categoriesRouter.get('/', (request, response) => {
    const categories = categoriesRepository.index();

    return response.status(201).json(categories);
});

export default categoriesRouter;
