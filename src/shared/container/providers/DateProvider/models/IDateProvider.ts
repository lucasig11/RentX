export default interface IDateProvider {
    differenceInHours(left_date: Date, right_date: Date): number;
    toLocalUTC(date: Date): string;
}
