import { ReactNode, RefObject } from "react";

export type MonthObject = { year: number; month: number };

export type AnimationState = "entering" | "visible" | "exiting" | "closed";

export type SharedMonthPickerProps = {
  placeholder?: string;
  locale?: "en" | "de";
  className?: string;
  animationDuration?: number; // in ms
  closeDelay?: number; // in ms
  disabledMonths?: string[]; // format: "MM/YYYY"
  selectableMonths?: string[]; // format: "MM/YYYY"
  minDate?: string; // format: "MM/YYYY"
  maxDate?: string; // format: "MM/YYYY"
};

export type MonthRangePickerProps = SharedMonthPickerProps &
  (
    | {
        range: true;
        onChange: (value: [string, string]) => void;
        defaultValue?: [MonthObject, MonthObject];
        initialFromYear?: number;
        initialToYear?: number;
      }
    | {
        range?: false;
        onChange: (value: string) => void;
        defaultValue?: MonthObject;
        initialYear?: number;
      }
  );

export type MonthRangePickerState = {
  open: boolean;
  animationState: AnimationState;
  viewYears: number[];
  selection: Array<MonthObject | null>;
  hoveredMonth: MonthObject | null;
  step: "from" | "to";
};
