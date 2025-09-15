import { useState } from "react";
import { MonthPicker } from "./components/MonthPicker";
import moment from "moment";

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
  const [selectedRange, setSelectedRange] = useState<string[]>([
    moment().format("MM/YYYY"),
    moment().add(1, "month").format("MM/YYYY"),
  ]);
  console.log("selectedMonth", selectedMonth);
  console.log("selectedRange", selectedRange);
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        backgroundColor: "#ffffff",
        width: "100%",
      }}
    >
      <div style={styleFlex}>
        <div>
          <span style={styleText}>Single Month Picker - no default value</span>
          <MonthPicker
            onChange={(value) => {
              console.log("MonthPicker no default value", value);
              setSelectedMonth(value);
            }}
          />
        </div>
        <div>
          <span style={styleText}>Single Month Picker - default value</span>
          <MonthPicker
            defaultValue={selectedMonth}
            onChange={(value) => console.log("MonthPicker default value", value)}
          />
        </div>
      </div>
      <hr style={{ width: "50%" }} />
      <div style={styleFlex}>
        <div>
          <span style={styleText}>Range Month Picker - no default value</span>
          <MonthPicker
            range
            onChange={(value) => {
              console.log("MonthRangePicker no default value", value);
              setSelectedRange(value);
            }}
          />
        </div>
        <div>
          <span style={styleText}>Range Month Picker - default value</span>
          <MonthPicker
            range
            defaultValue={selectedRange}
            onChange={(value) => console.log("MonthRangePicker default value", value)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
