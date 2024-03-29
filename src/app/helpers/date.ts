import { dayjs } from '@/app';
import { pluralize } from '@/app/helpers/pluralize';

export interface DateRange {
  start: string;
  end: string;
}

export class DateHelper {
  static getCurrentMonthRange(
    format?: string,
  ): DateRange & { currentMonthStart: string; currentMonthEnd: string } {
    const currentDate = dayjs();
    const start = currentDate.startOf('month').format(format);
    const end = currentDate.format(format);

    return {
      start,
      end,
      currentMonthStart: start,
      currentMonthEnd: end,
    };
  }

  static getLastMonthRange(format = 'YYYY-MM-DD'): DateRange {
    const lastMonth = dayjs().subtract(1, 'month');

    return {
      start: lastMonth.startOf('month').format(format),
      end: lastMonth.endOf('month').format(format),
    };
  }

  static getLastMonthStartToSameDayRange(): DateRange {
    const lastMonth = dayjs().subtract(1, 'month');
    const currentMonth = dayjs();
    const daysToAdd =
      currentMonth.date() > lastMonth.daysInMonth()
        ? lastMonth.daysInMonth()
        : currentMonth.date();
    const start = lastMonth.startOf('month').format();
    const end = dayjs(start)
      .add(daysToAdd - 1, 'day') // start of month is 1st, so we have to subtract one day
      .endOf('day')
      .format();

    return {
      start,
      end,
    };
  }

  static formatMsToHM(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const hoursStr = hours + ' ' + pluralize('hour', hours);
    const minutesStr = minutes + ' ' + pluralize('minute', minutes);
    const secondsStr = seconds + ' ' + pluralize('second', seconds);

    if (hours) {
      return `${hoursStr}, ${minutesStr}, ${secondsStr}`;
    }

    if (minutes) {
      return `${minutesStr}, ${secondsStr}`;
    }

    return secondsStr;
  }
}
