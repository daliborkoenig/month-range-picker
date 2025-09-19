export type TNonEmptyArray<T> = [T, ...T[]];

export type TMonthObject = { year: number; month: number };

export type TMonth =
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
export type TDateFormat = `${TMonth}/${number}`; // Template literal type for MM/YYYY

// Props definition for range month picker
export type TMonthRangePickerProps = {
  locale?: "en" | "de";
  selectableMonths?: TDateFormat[];
  minDate?: TDateFormat;
  maxDate?: TDateFormat;
  onChange: (value: TNonEmptyArray<TDateFormat> | undefined) => void;
  defaultDates?: TNonEmptyArray<TDateFormat>;
};

// Props definition for single month picker
export type TMonthPickerProps = {
  locale?: "en" | "de";
  selectableMonths?: TDateFormat[];
  minDate?: TDateFormat;
  maxDate?: TDateFormat;
  onChange: (value: TDateFormat | undefined) => void;
  defaultDate?: TDateFormat;
  disabledMonths?: TDateFormat[];
};

export type TDropDownPickerProps = {
  items: TDropdownItem[];
  onChange: (value: number | string | undefined) => void;
  defaultValue?: number | string;
  placeholder?: string;
};

export type TDropdownItem = {
  text: string;
  value: number | string;
};
