import { FC } from "react";
import { SingleMonthPicker } from "./single";
import { RangeMonthPicker } from "./range";
import { DropDownPicker } from "./dropdown";
import { MonthPickerProps, MonthRangePickerProps } from "./shared/types";
import { DropDownPickerProps } from "./shared/dropdown-types";

export const MonthPicker: FC<MonthPickerProps> = (props) => {
  return <SingleMonthPicker key={props.defaultDate} {...props} />;
};

export const MonthRangePicker: FC<MonthRangePickerProps> = (props) => {
  return <RangeMonthPicker key={props.defaultDates?.join(",")} {...props} />;
};

export const DropdownPicker: FC<DropDownPickerProps> = (props) => {
  return <DropDownPicker key={props.defaultValue} {...props} />;
};
