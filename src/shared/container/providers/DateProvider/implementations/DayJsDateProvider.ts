import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import IDateProvider from '../models/IDateProvider';

dayjs.extend(utc);

export default class DayJsDateProvider implements IDateProvider {
    public toLocalUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    public differenceInHours(left_date: Date, right_date: Date): number {
        return dayjs(left_date).diff(right_date, 'hours');
    }
}
