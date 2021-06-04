export default interface ISendMailDTO {
    to: string;
    subject: string;
    variables: {
        [key: string]: string;
    };
    templatePath: string;
}
