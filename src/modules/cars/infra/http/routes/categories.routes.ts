import { Router } from 'express';
import multer from 'multer';

import CreateCategoryController from '../../../useCases/createCategory/CreateCategoryController';
import ImportCategoryController from '../../../useCases/importCategory/ImportCategoryController';
import ListCategoriesController from '../../../useCases/listCategory/ListCategoriesController';

const categoriesRouter = Router();

const upload = multer({
    dest: './tmp',
});

const createCategoryController = new CreateCategoryController();
const listCategoriesController = new ListCategoriesController();
const importCategoryController = new ImportCategoryController();

categoriesRouter.post('/', createCategoryController.handle);

categoriesRouter.get('/', listCategoriesController.handle);

categoriesRouter.post(
    '/import',
    upload.single('file'),
    importCategoryController.handle
);

export default categoriesRouter;
