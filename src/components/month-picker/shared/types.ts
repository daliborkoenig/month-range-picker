export type NonEmptyArray<T> = [T, ...T[]];

export type MonthObject = { year: number; month: number };

export type Month =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";
export type DateFormat = `${Month}/${number}`; // Template literal type for MM/YYYY

// Props definition for range month picker
export type MonthRangePickerProps = {
  locale?: "en" | "de";
  selectableMonths?: DateFormat[];
  minDate?: DateFormat;
  maxDate?: DateFormat;
  onChange: (value: NonEmptyArray<DateFormat> | undefined) => void;
  defaultDates?: NonEmptyArray<DateFormat>;
};

// Props definition for single month picker
export type MonthPickerProps = {
  locale?: "en" | "de";
  selectableMonths?: DateFormat[];
  minDate?: DateFormat;
  maxDate?: DateFormat;
  onChange: (value: DateFormat | undefined) => void;
  defaultDate?: DateFormat;
  disabledMonths?: DateFormat[];
};
