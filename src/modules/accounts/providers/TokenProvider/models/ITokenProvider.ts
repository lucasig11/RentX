export default interface ITokenProvider {
    generate(user_id: string): string;
}
