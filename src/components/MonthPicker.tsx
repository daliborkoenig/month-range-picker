import { FC } from "react";
import { MonthPickerProps } from "./types";
import { SingleMonthPicker } from "./SingleMonthPicker";
import { RangeMonthPicker } from "./RangeMonthPicker";

/**
 * MonthRangePicker is a versatile date picker component that allows selecting either
 * a single month or a range of months.
 *
 * It renders either a SingleMonthPicker or RangeMonthPicker based on the `range` prop.
 */
export const MonthPicker: FC<MonthPickerProps> = (props) => {
  // Cast props to the appropriate type based on the range flag
  if (props.range) {
    return <RangeMonthPicker {...props} />;
  } else {
    return <SingleMonthPicker {...props} />;
  }
};
