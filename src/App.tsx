import { useState } from "react";
import { MonthPicker, MonthRangePicker } from "./components/month-picker";
import moment from "moment";
import {
  AppWrapper,
  PickerCard,
  PickerCardContent,
  PickerCardSeparator,
  PickerCardTitle,
} from "./globalStyles";
import { DateFormat, NonEmptyArray } from "./components/month-picker/shared/types";
import "moment/locale/de";

const styleText = {
  fontSize: "10px",
  paddingLeft: "10px",
};

const styleFlex = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
};

function App() {
  const [selectedMonth, setSelectedMonth] = useState<DateFormat>(
    moment().format("MM/YYYY") as DateFormat
  );
  const [selectedRange, setSelectedRange] = useState<NonEmptyArray<DateFormat>>([
    moment().format("MM/YYYY") as DateFormat,
    moment().add(14, "month").format("MM/YYYY") as DateFormat,
  ]);

  return (
    <AppWrapper>
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
}

export default App;
