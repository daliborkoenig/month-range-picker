import { ReactNode, RefObject } from "react";

export type NonEmptyArray<T> = [T, ...T[]];

export type MonthObject = { year: number; month: number };

// Fixed component constants
export const ANIMATION_DURATION = 200; // in ms
export const CLOSE_DELAY = 300; // in ms

export type SharedMonthPickerProps = {
  locale?: "en" | "de";
  selectableMonths?: string[]; // format: "MM/YYYY"
  minDate?: string; // format: "MM/YYYY"
  maxDate?: string; // format: "MM/YYYY"
};

// Props definition for range month picker
export interface RangeMonthPickerProps extends SharedMonthPickerProps {
  onChange: (value: NonEmptyArray<string>) => void; // Array of all months in range, format: ["MM/YYYY", "MM/YYYY", ...]
  defaultDates?: NonEmptyArray<string>; // format: ["MM/YYYY", "MM/YYYY"]
  range: true;
}

// Props definition for single month picker
export interface SingleMonthPickerProps extends SharedMonthPickerProps {
  onChange: (value: string) => void;
  defaultDate?: string; // format: "MM/YYYY"
  disabledMonths?: string[]; // format: "MM/YYYY"
  range?: false;
}

export type MonthPickerProps =
  | SharedMonthPickerProps & (RangeMonthPickerProps | SingleMonthPickerProps);
