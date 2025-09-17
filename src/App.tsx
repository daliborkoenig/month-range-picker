import { useState } from "react";
import { MonthPicker } from "./components/MonthPicker";
import moment from "moment";
import {
  AppWrapper,
  PickerCard,
  PickerCardContent,
  PickerCardSeparator,
  PickerCardTitle,
} from "./globalStyles";
import { NonEmptyArray } from "./components/types";

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
  const [selectedMonth, setSelectedMonth] = useState<string>(moment().format("MM/YYYY"));
  const [selectedRange, setSelectedRange] = useState<NonEmptyArray<string>>([
    moment().format("MM/YYYY"),
    moment().add(14, "month").format("MM/YYYY"),
  ]);
  console.log("selectedMonth", selectedMonth);
  console.log("selectedRange", selectedRange);
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
          <MonthPicker
            range
            onChange={(value) => {
              console.log("MonthRangePicker no default value", value);
              setSelectedRange(value);
            }}
          />
        </PickerCardContent>
        <PickerCardContent>
          <PickerCardTitle>default value</PickerCardTitle>
          <MonthPicker
            range
            defaultDates={selectedRange}
            onChange={(value) => console.log("MonthRangePicker default value", value)}
          />
        </PickerCardContent>
      </PickerCard>
    </AppWrapper>
  );
}

export default App;
