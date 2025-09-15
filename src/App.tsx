import { MonthPicker } from "./components/MonthPicker";

function App() {
  return (
    <div>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          backgroundColor: "#ffffff",
          width: "100%",
        }}
      >
        <MonthPicker
          disabledMonths={["01/2025", "02/2025"]}
          // selectableMonths={["03/2025", "04/2025"]}
          defaultValue={"03/2025"}
          onChange={(value) => console.log("MonthPicker value", value)}
        />
        <MonthPicker
          range
          // selectableMonths={["03/2025", "04/2025"]}
          defaultValue={["12/2024", "05/2025"]}
          onChange={(value) => console.log("MonthRangePicker value", value)}
        />
      </div>
    </div>
  );
}

export default App;
