/* eslint-disable no-console */
import { FC, useState } from "react";
import { DropdownPicker, MonthPicker, MonthRangePicker } from "./components/month-picker";
import moment from "moment";
import {
  AppWrapper,
  PickerCard,
  PickerCardContent,
  PickerCardSeparator,
  PickerCardTitle,
} from "./globalStyles";
import { TDateFormat, TNonEmptyArray, TDropdownItem } from "./components/month-picker/shared/types";
import "moment/locale/de";

const createDropdownItems = (count: number): TDropdownItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    text: `Option and some super long text${index + 1}`,
    value: index + 1,
  }));
};

const App: FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<TDateFormat | undefined>(
    moment().format("MM/YYYY") as TDateFormat
  );
  const [selectedRange, setSelectedRange] = useState<TNonEmptyArray<TDateFormat> | undefined>([
    moment().format("MM/YYYY") as TDateFormat,
    moment().add(14, "month").format("MM/YYYY") as TDateFormat,
  ]);
  const [selectedDropdown, setSelectedDropdown] = useState<number | string | undefined>(1);

  return (
    <AppWrapper>
      <PickerCardSeparator />
      <PickerCard>
        <PickerCardTitle size="medium">Dropdown Month Picker</PickerCardTitle>
        <PickerCardContent>
          <PickerCardTitle>no default value, controls default value</PickerCardTitle>
          <DropdownPicker
            items={createDropdownItems(10)}
            onChange={(value) => {
              console.log("Selected:", value);
              setSelectedDropdown(value);
            }}
            defaultValue={1}
            placeholder="Select an option"
          />
          <PickerCardTitle>default value</PickerCardTitle>
          <DropdownPicker
            items={[
              { text: "Option 1", value: 1 },
              { text: "Option 2", value: 2 },
              { text: "Option 3", value: "three" },
            ]}
            onChange={(value) => console.log("Selected:", value)}
            defaultValue={selectedDropdown}
            placeholder="Select an option"
          />
        </PickerCardContent>
      </PickerCard>
      <PickerCardSeparator />
      <PickerCard>
        <PickerCardTitle size="medium">Single Month Picker</PickerCardTitle>
        <PickerCardContent>
          <PickerCardTitle>no default value, controls default value</PickerCardTitle>
          <MonthPicker
            onChange={(value) => {
              console.log("MonthPicker no default value", value);
              setSelectedMonth(value);
            }}
          />
        </PickerCardContent>
        <PickerCardContent>
          <PickerCardTitle>default value</PickerCardTitle>
          <MonthPicker
            defaultDate={selectedMonth}
            onChange={(value) => console.log("MonthPicker default value", value)}
          />
        </PickerCardContent>
      </PickerCard>
      <PickerCardSeparator />
      <PickerCard>
        <PickerCardTitle size="medium">Range Month Picker</PickerCardTitle>
        <PickerCardContent>
          <PickerCardTitle>no default value, controls default value</PickerCardTitle>
          <MonthRangePicker
            onChange={(value) => {
              console.log("MonthRangePicker no default value", value);
              setSelectedRange(value);
            }}
          />
        </PickerCardContent>
        <PickerCardContent>
          <PickerCardTitle>default value</PickerCardTitle>
          <MonthRangePicker
            defaultDates={selectedRange}
            onChange={(value) => console.log("MonthRangePicker default value", value)}
          />
        </PickerCardContent>
      </PickerCard>
    </AppWrapper>
  );
};

export default App;
