import IDateProvider from '../models/IDateProvider';

export default class FakeDateProvider implements IDateProvider {
    public differenceInHours(left_date: Date, right_date: Date): number {
        return (left_date.getDate() - right_date.getDate()) * 24;
    }
}
