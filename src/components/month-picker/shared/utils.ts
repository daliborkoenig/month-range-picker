import moment from "moment";
import { DateFormat, MonthObject, NonEmptyArray } from "./types";

/**
 * Extracts view years from default dates
 */
export const extractViewYearsFromDefaultDates = (
  defaultDates?: NonEmptyArray<string>
): [number, number] => {
  if (!defaultDates) return [moment().year() - 1, moment().year()];
  const firstYear = defaultDates[0].split("/")[1];
  const lastYear = defaultDates[defaultDates.length - 1].split("/")[1];
  return [parseInt(firstYear), parseInt(lastYear)];
};

/**
 * Generates an array of all months in a given range MM/YYYY
 */
export const generateMonthRange = (startMonth: DateFormat, endMonth: DateFormat): NonEmptyArray<DateFormat> => {
  const start = moment(startMonth, "MM/YYYY");
  const end = moment(endMonth, "MM/YYYY");
  const result: DateFormat[] = [];

  const current = start.clone();
  while (current.isSameOrBefore(end, "month")) {
    result.push(current.format("MM/YYYY") as DateFormat);
    current.add(1, "month");
  }

  return result as NonEmptyArray<DateFormat>;
};

/**
 * Gets short month names for the specified locale
 */
export const getMonthsShort = (loc: "en" | "de") => {
  const m = moment().locale(loc);
  return m
    .localeData()
    .monthsShort()
    .map((s: string) => s.replace(".", ""));
};

/**
 * Formats month and year as MM/YYYY
 */
export const formatDate = (month: number, year: number): DateFormat => {
  return `${String(month + 1).padStart(2, "0")}/${year}` as DateFormat;
};

/**
 * Parses MM/YYYY string into a MonthObject
 */
export const parseMonth = (monthStr?: string): MonthObject | null => {
  if (!monthStr) return null;
  const parts = monthStr.split("/");
  if (parts.length !== 2) return null;

  const month = parseInt(parts[0], 10) - 1;
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || isNaN(year)) return null;
  return { year, month };
};

/**
 * Checks if a month is disabled based on various criteria
 */
type IsDateDisabledProps = {
  date: string;
  disabledMonths?: string[];
  selectableMonths?: string[];
  minDate?: string;
  maxDate?: string;
};
export const isDateDisabled = ({
  date,
  disabledMonths,
  selectableMonths,
  minDate,
  maxDate,
}: IsDateDisabledProps): boolean => {
  // Check if month is in disabledMonths
  if (disabledMonths && disabledMonths.includes(date)) {
    return true;
  }

  // Check if selectableMonths is defined and month is not in it
  if (selectableMonths && !selectableMonths.includes(date)) {
    return true;
  }

  // Check min and max dates
  if (minDate && moment(date, "MM/YYYY").isBefore(moment(minDate, "MM/YYYY"))) {
    return true;
  }

  if (maxDate && moment(date, "MM/YYYY").isAfter(moment(maxDate, "MM/YYYY"))) {
    return true;
  }

  return false;
};

/**
 * Checks if a month is disabled based on various criteria
 */
type IsDateSelectedProps = {
  date: string;
  from?: string;
  to?: string;
};
export const isDateSelected = ({ date, from, to }: IsDateSelectedProps): boolean => {
  if (from && to) {
    return (
      moment(date, "MM/YYYY").isSameOrAfter(moment(from, "MM/YYYY")) &&
      moment(date, "MM/YYYY").isSameOrBefore(moment(to, "MM/YYYY"))
    );
  }
  return !!(from && date === from);
};

/**
 *  Checks if a month is in range based on various criteria
 */
type IsDateInRangeProps = {
  date: DateFormat;
  from?: DateFormat;
  to?: DateFormat;
};
export const isDateInRange = ({ date, from, to }: IsDateInRangeProps): boolean => {
  if (!from || !to) return false;
  const range = generateMonthRange(from, to);
  return range.includes(date);
};

/**
 * Determines if a date should be shown in preselection state when hovering
 * Only shows preselection when "from" is selected but "to" is not yet selected
 */
type IsDatePreselectedProps = {
  date: DateFormat;
  from?: DateFormat;
  to?: DateFormat;
  hoveredMonth?: DateFormat;
};

export const isDatePreselected = ({
  date,
  from,
  to,
  hoveredMonth,
}: IsDatePreselectedProps): boolean => {
  // Only show preselection when we have "from" but not "to", and we're hovering over a month
  if (!from || !hoveredMonth || to) return false;

  // Don't preselect anything if hovering over the "from" date itself
  if (hoveredMonth === from) return false;

  // Generate the range between from and hovered month
  const range = generateMonthRange(from, hoveredMonth);
  return range.includes(date);
};
