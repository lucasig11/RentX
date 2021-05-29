import ICSVParserProvider from '../models/ICSVParserProvider';

interface IImportCategories {
    name: string;
    description: string;
}

export default class FakeCSVParserProvider implements ICSVParserProvider {
    public async parse(): Promise<IImportCategories[]> {
        return [
            { name: 'category 1', description: 'description' },
            { name: 'category 2', description: 'description' },
            { name: 'category 3', description: 'description' },
        ];
    }
}
