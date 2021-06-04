import { container } from 'tsyringe';

import DayJsDateProvider from './DateProvider/implementations/DayJsDateProvider';
import IDateProvider from './DateProvider/models/IDateProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import IMailProvider from './MailProvider/models/IMailProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayJsDateProvider);

container.registerInstance<IMailProvider>(
    'MailProvider',
    new EtherealMailProvider()
);
