export type NonEmptyArray<T> = [T, ...T[]];

export type MonthObject = { year: number; month: number };

// Props definition for range month picker
export type MonthRangePickerProps = {
  locale?: "en" | "de";
  selectableMonths?: string[]; // format: "MM/YYYY"
  minDate?: string; // format: "MM/YYYY"
  maxDate?: string; // format: "MM/YYYY"
  onChange: (value: NonEmptyArray<string>) => void; // Array of all months in range, format: ["MM/YYYY", "MM/YYYY", ...]
  defaultDates?: NonEmptyArray<string>; // format: ["MM/YYYY", "MM/YYYY"]
}

// Props definition for single month picker
export type MonthPickerProps = {  
  locale?: "en" | "de";
  selectableMonths?: string[]; // format: "MM/YYYY"
  minDate?: string; // format: "MM/YYYY"
  maxDate?: string; // format: "MM/YYYY"
  onChange: (value: string) => void; // format: "MM/YYYY"
  defaultDate?: string; // format: "MM/YYYY"
  disabledMonths?: string[]; // format: "MM/YYYY"
}
