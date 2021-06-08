export default interface ISendMailDTO {
    to: {
        name: string;
        address: string;
    };
    from: {
        name: string;
        address: string;
    };
    subject: string;
    variables: {
        [key: string]: string;
    };
    templatePath: string;
}
