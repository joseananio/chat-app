import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
} from 'date-fns';

export const getDateDiff = (_date: string) => {
  const mnths = differenceInMonths(new Date(), new Date(_date));
  const days = differenceInDays(new Date(), new Date(_date));
  const hours = differenceInHours(new Date(), new Date(_date));
  const mins = differenceInMinutes(new Date(), new Date(_date));
  const secs = differenceInSeconds(new Date(), new Date(_date));

  return days === NaN
    ? { val: 0, unit: 'secs' }
    : days > 30
    ? { val: mnths, unit: 'mnths' }
    : days > 0
    ? { val: days, unit: 'days' }
    : hours > 0
    ? { val: hours, unit: 'hours' }
    : mins > 0
    ? { val: mins, unit: 'mins' }
    : { val: secs, unit: 'secs' };
};
