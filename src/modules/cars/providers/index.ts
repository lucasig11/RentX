import { container } from 'tsyringe';

import LibCSVParserProvider from './CSVParserProvider/implementations/LibCSVParserProvider';
import ICSVParserProvider from './CSVParserProvider/models/ICSVParserProvider';

container.registerSingleton<ICSVParserProvider>(
    'CSVParserProvider',
    LibCSVParserProvider
);
