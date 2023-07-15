import dayjs, { Dayjs } from 'dayjs';
import weekdayPlugin from 'dayjs/plugin/weekday';
import plLocale from 'dayjs/locale/pl';

dayjs.extend(weekdayPlugin);
dayjs.locale(plLocale);

export enum DayOfTheWeek {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

interface Config {
  weekday: DayOfTheWeek;
  hour?: number;
  minute?: number;
  gapTimeInMinutes?: number;
}

export const getNextDayOfTheWeek = ({
  weekday,
  hour = 8,
  minute = 0,
  gapTimeInMinutes = 15,
}: Config) =>
  dayjs()
    .weekday(6 + weekday)
    .set('hour', hour)
    .set('minute', minute)
    .set('second', 0)
    .set('millisecond', 0)
    .subtract(gapTimeInMinutes, 'minute');
