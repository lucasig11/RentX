import csvParse from 'csv-parse';
import fs from 'fs';

import ICSVParserProvider from '../models/ICSVParserProvider';

interface IImportCategories {
    name: string;
    description: string;
}

export default class LibCSVParserProvider implements ICSVParserProvider {
    public async parse(filepath: string): Promise<IImportCategories[]> {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(filepath);
            const categories: IImportCategories[] = [];

            const fileParse = csvParse();
            stream.pipe(fileParse);

            fileParse
                .on('data', (line) => {
                    const [name, description] = line;
                    categories.push({
                        name,
                        description,
                    });
                })
                .on('end', () => {
                    fs.promises.unlink(filepath);
                    resolve(categories);
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
    }
}
