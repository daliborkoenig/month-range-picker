# Month Range Picker

A flexible, customizable React component for selecting either a single month or a range of months.

![Month Range Picker](https://via.placeholder.com/800x400.png?text=Month+Range+Picker)

## Features

- **Two Modes**: Single month selection or month range selection
- **Localization**: English and German language support
- **Customizable**: Style with your own theme
- **Responsive**: Works on all screen sizes
- **Accessible**: Keyboard navigation and ARIA attributes
- **Restrictions**: Set min/max dates, disabled dates, or selectable dates
- **Format**: Uses easy-to-understand MM/YYYY format

## Installation

```bash
npm install month-range-picker
```

## Basic Usage

### Single Month Picker

```jsx
import { MonthPicker } from "./components/MonthPicker";

function App() {
  return <MonthPicker onChange={(value) => console.log("Selected month:", value)} />;
}
```

### Month Range Picker

```jsx
import { MonthPicker } from "./components/MonthPicker";

function App() {
  return <MonthPicker range onChange={(values) => console.log("Selected range:", values)} />;
}
```

## Props

### Shared Props

Both the single month picker and range picker share these common props:

| Prop               | Type           | Default                                | Description                                              |
| ------------------ | -------------- | -------------------------------------- | -------------------------------------------------------- |
| `locale`           | `"en" \| "de"` | `"de"`                                 | The locale for month names                               |
| `placeholder`      | `string`       | `"Pick month"` or `"Pick month range"` | Placeholder text for the input                           |
| `disabledMonths`   | `string[]`     | `undefined`                            | Array of months to disable in format "MM/YYYY"           |
| `selectableMonths` | `string[]`     | `undefined`                            | Only these months will be selectable in format "MM/YYYY" |
| `minDate`          | `string`       | `undefined`                            | Minimum selectable date in format "MM/YYYY"              |
| `maxDate`          | `string`       | `undefined`                            | Maximum selectable date in format "MM/YYYY"              |

### Single Month Picker Props

| Prop           | Type                      | Default     | Description                                                           |
| -------------- | ------------------------- | ----------- | --------------------------------------------------------------------- |
| `range`        | `false` or omitted        | `false`     | Set to false or omit for single month selection                       |
| `onChange`     | `(value: string) => void` | required    | Callback when a month is selected, returns string in format "MM/YYYY" |
| `defaultValue` | `string`                  | `undefined` | Default selected month in format "MM/YYYY"                            |

### Range Picker Props

| Prop           | Type                        | Default     | Description                                                                                     |
| -------------- | --------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `range`        | `true`                      | required    | Set to true for range selection                                                                 |
| `onChange`     | `(value: string[]) => void` | required    | Callback when a range is selected, returns array of all months in the range in format "MM/YYYY" |
| `defaultValue` | `[string, string]`          | `undefined` | Default selected range in format ["MM/YYYY", "MM/YYYY"]                                         |

## Examples

### With Default Value

```jsx
// Single month with default value
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
```

### With Disabled Dates

```jsx
// Disable specific months
<MonthPicker
  disabledMonths={["01/2025", "02/2025", "03/2025"]}
  onChange={(value) => console.log(value)}
/>

// Only allow specific months
<MonthPicker
  selectableMonths={["04/2025", "05/2025", "06/2025"]}
  onChange={(value) => console.log(value)}
/>

// Set min and max dates
<MonthPicker
  range
  minDate="01/2025"
  maxDate="12/2025"
  onChange={(values) => console.log(values)}
/>
```

## Features

### Single Month Mode

- Allows selecting a single month
- Returns a string in format "MM/YYYY"
- Views reset to current year when cleared

### Range Mode

- Allows selecting a range of months
- Returns an array of all months in the range in format "MM/YYYY"
- Both views default to the current year
- Handles reverse selection (selecting end date first)
- Resets partial selections when closing

### Keyboard Navigation

- Escape key closes the picker
- Tab key navigates between elements

### Automatic Updates

- Responds to changes in `defaultValue` prop
- Updates view years appropriately

## Styling

The component uses styled-components with fixed styling optimized for most use cases.

## Accessibility

The component includes ARIA attributes and supports keyboard navigation for better accessibility.

## License

MIT
