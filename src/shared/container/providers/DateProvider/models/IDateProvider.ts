export default interface IDateProvider {
    differenceInHours(left_date: Date, right_date: Date): number;
    differenceInDays(left_date: Date, right_date: Date): number;
    now(): Date;
}
