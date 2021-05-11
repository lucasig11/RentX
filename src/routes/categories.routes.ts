import { Router } from 'express';

import CategoriesRepository from '../repositories/CategoriesRepository';

const categoriesRouter = Router();
const categoriesRepository = new CategoriesRepository();

categoriesRouter.post('/', (request, response) => {
    const { name, description } = request.body;

    categoriesRepository.create({
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
