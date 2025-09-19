export interface DropdownItem {
  text: string;
  value: number | string;
}

export interface DropDownPickerProps {
  items: DropdownItem[];
  onChange: (value: number | string | undefined) => void;
  defaultValue?: number | string;
  placeholder?: string;
}
