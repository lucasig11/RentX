interface IImportCategories {
    name: string;
    description: string;
}

export default interface ICSVParserProvider {
    parse(filepath: string): Promise<IImportCategories[]>;
}
