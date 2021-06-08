import { container } from 'tsyringe';

import DayJsDateProvider from './implementations/DayJsDateProvider';
import IDateProvider from './models/IDateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);
