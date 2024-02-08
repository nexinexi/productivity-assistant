import _dayjs, { Dayjs as _Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

_dayjs.extend(isBetween);
_dayjs.extend(utc);
_dayjs.extend(timezone);

_dayjs.tz.setDefault('Asia/Bangkok');

const timeZonedDayjs = (...args: any[]) => _dayjs(...args).tz();

export const dayjs = timeZonedDayjs;

export const setTimeZone = (timezone = 'Asia/Bangkok') =>
  _dayjs.tz.setDefault(timezone);

// @ts-ignore
export const getTimeZone = () => dayjs()['$x']['$timezone'];

export type Dayjs = _Dayjs;
