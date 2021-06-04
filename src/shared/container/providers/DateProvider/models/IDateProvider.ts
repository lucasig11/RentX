export default interface IDateProvider {
    differenceInHours(left_date: Date, right_date: Date): number;
    differenceInDays(left_date: Date, right_date: Date): number;
    addDays(days: number): Date;
    addHours(hours: number): Date;
    now(): Date;
}
