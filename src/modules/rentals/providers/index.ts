import { container } from 'tsyringe';

import RentalsRepository from '../infra/typeorm/repositories/RentalsRepository';
import IRentalsRepository from '../repositories/IRentalsRepository';

container.registerSingleton<IRentalsRepository>(
    'RentalsRepository',
    RentalsRepository
);
