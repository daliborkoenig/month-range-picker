# Month Range Picker

A lightweight, flexible React component for selecting single months or month ranges with a clean interface.

![Month Range Picker](https://via.placeholder.com/800x400.png?text=Month+Range+Picker)

## Features

- **Dual Mode**: Choose between single month or month range selection
- **Localization**: English and German language support
- **Date Restrictions**: Min/max dates and selectable/disabled months
- **Accessibility**: Keyboard navigation (ESC, Tab) and ARIA attributes
- **Clean API**: Simple props interface with MM/YYYY format
- **Range Selection**: Returns all months in selected range

## Installation

```bash
npm install month-range-picker
```

## Basic Usage

```jsx
import { MonthPicker } from "./components/MonthPicker";

// Single month picker
function SingleExample() {
  return <MonthPicker onChange={(value) => console.log("Selected:", value)} />;
}

// Month range picker
function RangeExample() {
  return <MonthPicker range onChange={(values) => console.log("Range:", values)} />;
}
```

## Props

### Shared Props

| Prop               | Type           | Default                                | Description                                              |
| ------------------ | -------------- | -------------------------------------- | -------------------------------------------------------- |
| `locale`           | `"en" \| "de"` | `"de"`                                 | The locale for month names                               |
| `placeholder`      | `string`       | `"Pick month"` or `"Pick month range"` | Placeholder text                                         |
| `selectableMonths` | `string[]`     | `undefined`                            | Only these months will be selectable (format: "MM/YYYY") |
| `minDate`          | `string`       | `undefined`                            | Minimum selectable date (format: "MM/YYYY")              |
| `maxDate`          | `string`       | `undefined`                            | Maximum selectable date (format: "MM/YYYY")              |

### Single Month Picker Props

| Prop             | Type                      | Default     | Description                                     |
| ---------------- | ------------------------- | ----------- | ----------------------------------------------- |
| `range`          | `false` or omitted        | `false`     | Set to false or omit for single month selection |
| `onChange`       | `(value: string) => void` | required    | Callback when a month is selected               |
| `defaultValue`   | `string`                  | `undefined` | Default selected month (format: "MM/YYYY")      |
| `disabledMonths` | `string[]`                | `undefined` | Array of months to disable (format: "MM/YYYY")  |

### Range Picker Props

| Prop           | Type                        | Default     | Description                                       |
| -------------- | --------------------------- | ----------- | ------------------------------------------------- |
| `range`        | `true`                      | required    | Set to true for range selection                   |
| `onChange`     | `(value: string[]) => void` | required    | Callback with array of all months in range        |
| `defaultValue` | `string[]`                  | `undefined` | Default selected range (format: ["MM/YYYY", ...]) |

## Examples

```jsx
// With default value
<MonthPicker
  defaultValue="04/2025"
  onChange={(value) => console.log(value)}
/>

// Range with default value
<MonthPicker
  range
  defaultValue={["03/2025", "05/2027"]}
  onChange={(values) => console.log(values)}
/>

// With restrictions
<MonthPicker
  minDate="01/2025"
  maxDate="12/2025"
  onChange={(value) => console.log(value)}
/>
```

## Behavior Details

### Single Month Mode

- Returns selected month as string in "MM/YYYY" format
- View resets to current year when cleared

### Range Mode

- Returns array of all months in the selected range as "MM/YYYY" strings
- Left panel shows previous year, right panel shows current year by default
- Allows selection in either direction (start→end or end→start)
- Automatically resets partial selections when closed

### Accessibility

- Escape key closes the picker
- Click outside to close
- ARIA attributes for screen readers

### Default Value Handling

- Component uses key prop internally to properly handle defaultValue changes
- Clearing resets to sensible defaults

## License

MIT
