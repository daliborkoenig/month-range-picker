import moment from "moment";
import { MonthObject, NonEmptyArray } from "./types";

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
export const generateMonthRange = (startMonth: string, endMonth: string): NonEmptyArray<string> => {
  const start = moment(startMonth, "MM/YYYY");
  const end = moment(endMonth, "MM/YYYY");
  const result: string[] = [];

  const current = start.clone();
  while (current.isSameOrBefore(end, "month")) {
    result.push(current.format("MM/YYYY"));
    current.add(1, "month");
  }

  return result as NonEmptyArray<string>;
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
export const formatDate = (month: number, year: number): string => {
  return `${String(month + 1).padStart(2, "0")}/${year}`;
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
type IsMonthDisabledProps = {
  year: number;
  month: number;
  disabledMonths?: string[];
  selectableMonths?: string[];
  minDate?: string;
  maxDate?: string;
};
export const isMonthDisabled = ({
  year,
  month,
  disabledMonths,
  selectableMonths,
  minDate,
  maxDate,
}: IsMonthDisabledProps): boolean => {
  const monthStr = formatDate(month, year);

  // Check if month is in disabledMonths
  if (disabledMonths?.includes(monthStr)) {
    return true;
  }

  // Check if selectableMonths is defined and month is not in it
  if (selectableMonths && !selectableMonths.includes(monthStr)) {
    return true;
  }

  // Check min and max dates
  if (minDate) {
    const min = parseMonth(minDate);
    if (min && (year < min.year || (year === min.year && month < min.month))) {
      return true;
    }
  }

  if (maxDate) {
    const max = parseMonth(maxDate);
    if (max && (year > max.year || (year === max.year && month > max.month))) {
      return true;
    }
  }

  return false;
};

/**
 * Converts year and month to a numeric index for comparison
 */
export const ymIndex = (y: number, m: number) => y * 12 + m;

/**
 * Checks if a month is in the selected range
 */
type IsInRangeProps = {
  y: number;
  m: number;
  from: MonthObject | null;
  to: MonthObject | null;
  hoveredMonth: MonthObject | null;
  step: "from" | "to";
};
export const isInRange = ({ y, m, from, to, hoveredMonth, step }: IsInRangeProps): boolean => {
  if (!from) return false;

  const current = ymIndex(y, m);

  // If we have a complete selection
  if (from && to) {
    const start = ymIndex(from.year, from.month);
    const end = ymIndex(to.year, to.month);
    const [min, max] = start <= end ? [start, end] : [end, start];
    return current >= min && current <= max;
  }

  // If we're in the "to" step and hovering
  if (step === "to" && hoveredMonth) {
    const start = ymIndex(from.year, from.month);
    const end = ymIndex(hoveredMonth.year, hoveredMonth.month);
    const [min, max] = start <= end ? [start, end] : [end, start];
    return current >= min && current <= max;
  }

  // Just the "from" selected
  return from.year === y && from.month === m;
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
  date: string;
  from?: string;
  to?: string;
  preselect?: boolean;
};
export const isDateInRange = ({ date, from, to, preselect }: IsDateInRangeProps): boolean => {
  if (!from || !to) return false;
  const range = generateMonthRange(from, to);
  return range.includes(date);
};

/**
 * Determines if a date should be shown in preselection state when hovering
 * Only shows preselection when "from" is selected but "to" is not yet selected
 */
type IsDatePreselectedProps = {
  date: string;
  from?: string;
  to?: string;
  hoveredMonth?: string;
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
