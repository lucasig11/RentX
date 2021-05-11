import { Router } from 'express';

import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRouter.post('/', async (request, response) => {
    const { name, description } = request.body;

    const createCategory = new CreateCategoryService(categoriesRepository);

    await createCategory.execute({
        name,
        description,
    });

    return response.status(201).send();
});

categoriesRouter.get('/', (request, response) => {
    const categories = categoriesRepository.index();

    return response.status(201).json(categories);
});

export default categoriesRouter;
