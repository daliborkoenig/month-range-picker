import { MonthRangePicker } from "./components/MonthRangePicker";

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
        <MonthRangePicker onChange={(value) => console.log("MonthPicker value", value)} />
        <MonthRangePicker
          range
          onChange={(value) => console.log("MonthRangePicker value", value)}
        />
      </div>
    </div>
  );
}

export default App;
