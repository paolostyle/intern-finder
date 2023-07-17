import dayjs from 'dayjs';
import plLocale from 'dayjs/locale/pl';
import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';
import weekdayPlugin from 'dayjs/plugin/weekday';

dayjs.extend(weekdayPlugin);
dayjs.extend(customParseFormatPlugin);
dayjs.locale(plLocale);

export const getTimestampForNextWeekday = (weekday: number, time: string) => {
  const parsedTime = dayjs(time, 'HH:mm');

  return dayjs()
    .weekday(6 + weekday)
    .set('hour', parsedTime.hour())
    .set('minute', parsedTime.minute())
    .set('second', 0)
    .set('millisecond', 0)
    .unix();
};
