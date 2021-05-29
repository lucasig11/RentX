import IDateProvider from '../models/IDateProvider';

export default class FakeDateProvider implements IDateProvider {
    public toLocalUTC(date: Date): string {
        return new Date(date).toISOString();
    }

    public differenceInHours(left_date: Date, right_date: Date): number {
        return (left_date.getDate() - right_date.getDate()) * 24;
    }
}
