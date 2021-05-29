import { container } from 'tsyringe';

import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CarsRepository from '@modules/cars/infra/typeorm/repositories/CarsRepository';
import CategoriesRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import SpecificationsRepository from '@modules/cars/infra/typeorm/repositories/SpecificationsRepository';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICategoriesRepository from '@modules/cars/repositories/ICategoriesRepository';
import ISpecificationsRepository from '@modules/cars/repositories/ISpecificationsRepository';

import LibCSVParserProvider from './CSVParserProvider/implementations/LibCSVParserProvider';
import ICSVParserProvider from './CSVParserProvider/models/ICSVParserProvider';

container.registerSingleton<ICarsRepository>('CarsRepository', CarsRepository);

container.registerSingleton<ICategoriesRepository>(
    'CategoriesRepository',
    CategoriesRepository
);

container.registerSingleton<ISpecificationsRepository>(
    'SpecificationsRepository',
    SpecificationsRepository
);

container.registerSingleton<ICarsImagesRepository>(
    'CarsImagesRepository',
    CarsImagesRepository
);
container.registerSingleton<ICSVParserProvider>(
    'CSVParserProvider',
    LibCSVParserProvider
);
