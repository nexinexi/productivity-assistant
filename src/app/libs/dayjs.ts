import _dayjs, { Dayjs as _Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

_dayjs.extend(isBetween);
_dayjs.extend(utc);
_dayjs.extend(timezone);

export const DEFAULT_TIMEZONE = 'Asia/Bangkok';

export const setTimeZone = (timezone = DEFAULT_TIMEZONE) =>
  _dayjs.tz.setDefault(timezone);

// @ts-ignore
export const getTimeZone = (): string => dayjs()['$x']['$timezone'];

export const dayjs = (...args: Parameters<typeof _dayjs>) =>
  _dayjs(...args).tz();

export const formatToISO = (date: string) =>
  date.includes('T') ? dayjs(date) : dayjs(date + 'T00:00:00+0000');

export type Dayjs = _Dayjs;
