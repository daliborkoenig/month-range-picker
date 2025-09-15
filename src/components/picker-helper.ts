import moment from "moment";
import { MonthObject } from "./types";

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
export const formatMonth = (month: number, year: number): string => {
  return `${String(month + 1).padStart(2, "0")}/${year}`;
};

/**
 * Parses MM/YYYY string into a MonthObject
 */
export const parseMonth = (monthStr: string): MonthObject | null => {
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
export const isMonthDisabled = (
  year: number,
  month: number,
  disabledMonths?: string[],
  selectableMonths?: string[],
  minDate?: string,
  maxDate?: string
): boolean => {
  const monthStr = formatMonth(month, year);

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
export const isInRange = (
  y: number,
  m: number,
  from: MonthObject | null,
  to: MonthObject | null,
  hoveredMonth: MonthObject | null,
  step: "from" | "to"
): boolean => {
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
