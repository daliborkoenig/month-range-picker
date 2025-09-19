import { FC } from "react";
import { SingleMonthPicker } from "./single";
import { RangeMonthPicker } from "./range";
import { DropDownPicker } from "./dropdown";
import { TMonthPickerProps, TMonthRangePickerProps, TDropDownPickerProps } from "./shared/types";

export const MonthPicker: FC<TMonthPickerProps> = (props) => {
  return <SingleMonthPicker key={props.defaultDate} {...props} />;
};

export const MonthRangePicker: FC<TMonthRangePickerProps> = (props) => {
  return <RangeMonthPicker key={props.defaultDates?.join(",")} {...props} />;
};

export const DropdownPicker: FC<TDropDownPickerProps> = (props) => {
  return <DropDownPicker key={props.defaultValue} {...props} />;
};
