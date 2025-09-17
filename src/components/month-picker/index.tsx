import { FC } from "react";
import { SingleMonthPicker } from "./single";
import { RangeMonthPicker } from "./range";
import { MonthPickerProps, MonthRangePickerProps } from "./shared/types";

export const MonthPicker: FC<MonthPickerProps> = (props) => {
  return <SingleMonthPicker key={props.defaultDate} {...props} />;
};

export const MonthRangePicker: FC<MonthRangePickerProps> = (props) => {
  return <RangeMonthPicker key={props.defaultDates?.join(",")} {...props} />;
};
