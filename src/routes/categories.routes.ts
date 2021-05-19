import { Router } from 'express';
import multer from 'multer';

import CreateCategoryController from '../modules/cars/useCases/createCategory/CreateCategoryController';
import importCategoryController from '../modules/cars/useCases/importCategory';
import listCategoriesController from '../modules/cars/useCases/listCategory';

const categoriesRouter = Router();

const upload = multer({
    dest: './tmp',
});

const createCategoryController = new CreateCategoryController();

categoriesRouter.post('/', createCategoryController.handle);

categoriesRouter.get('/', (request, response) => {
    return listCategoriesController.handle(request, response);
});

categoriesRouter.post('/import', upload.single('file'), (request, response) => {
    return importCategoryController.handle(request, response);
});

export default categoriesRouter;
