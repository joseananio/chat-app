"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateDiff = void 0;
const date_fns_1 = require("date-fns");
const getDateDiff = (_date) => {
    const mnths = date_fns_1.differenceInMonths(new Date(), new Date(_date));
    const days = date_fns_1.differenceInDays(new Date(), new Date(_date));
    const hours = date_fns_1.differenceInHours(new Date(), new Date(_date));
    const mins = date_fns_1.differenceInMinutes(new Date(), new Date(_date));
    const secs = date_fns_1.differenceInSeconds(new Date(), new Date(_date));
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
exports.getDateDiff = getDateDiff;
