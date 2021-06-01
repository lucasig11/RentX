interface IOptions {
    secret: string;
    expiresIn: string;
    payload?: string;
}
export default interface ITokenProvider {
    generate(user_id: string, options: IOptions): string;
    verify(token: string, options: IOptions): Promise<string>;
}
