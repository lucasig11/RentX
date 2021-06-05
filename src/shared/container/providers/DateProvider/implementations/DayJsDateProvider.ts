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

    public differenceInDays(left_date: Date, right_date: Date): number {
        return dayjs(this.utc_format(left_date)).diff(
            this.utc_format(right_date),
            'days'
        );
    }

    public now(): Date {
        return dayjs().toDate();
    }

    public addDays(days: number): Date {
        return dayjs().add(days, 'days').toDate();
    }

    public addHours(hours: number): Date {
        return dayjs().add(hours, 'hours').toDate();
    }

    public isBefore(left_date: Date, right_date: Date): boolean {
        return dayjs(left_date).isBefore(right_date);
    }
}
