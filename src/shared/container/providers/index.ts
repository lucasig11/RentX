import { container } from 'tsyringe';

import DayJsDateProvider from './DateProvider/implementations/DayJsDateProvider';
import IDateProvider from './DateProvider/models/IDateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);
