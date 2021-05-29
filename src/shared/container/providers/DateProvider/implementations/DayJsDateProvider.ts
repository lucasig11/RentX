import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import IDateProvider from '../models/IDateProvider';

dayjs.extend(utc);

export default class DayJsDateProvider implements IDateProvider {
    private utc_format(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    public differenceInHours(left_date: Date, right_date: Date): number {
        return dayjs(this.utc_format(left_date)).diff(
            this.utc_format(right_date),
            'hours'
        );
    }
}
