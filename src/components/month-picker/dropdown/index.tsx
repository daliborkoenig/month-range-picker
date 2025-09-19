import { useMemo, FC, useRef, useCallback } from "react";
import { useOutsideClick } from "../shared/useOutsideClick";
import { useImmer } from "use-immer";
import { TDropDownPickerProps } from "../shared/types";
import { InputContainer, StyledInput, ClearButton, Popup } from "../shared/styled-picker";
import { DropdownList, DropdownItem } from "../shared/styled-picker";
import { IoCloseCircleOutline } from "react-icons/io5";
import { usePopupPosition } from "../shared/usePopupPosition";

export const DropDownPicker: FC<TDropDownPickerProps> = (props) => {
  const { items, onChange, defaultValue, placeholder = "Select item" } = props;

  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    selectedValue?: number | string;
    open: boolean;
  }>({
    selectedValue: defaultValue,
    open: false,
  });

  const handleOpenClose = useCallback(() => {
    updatePickerState((draft) => {
      draft.open = !draft.open;
    });
  }, [updatePickerState]);

  // Calculate input label
  const inputValue = useMemo(() => {
    if (pickerState.selectedValue === undefined) return "";

    const selectedItem = items.find((item) => item.value === pickerState.selectedValue);
    return selectedItem ? selectedItem.text : "";
  }, [pickerState.selectedValue, items]);

  // Handle selection clearing
  const handleClear = useCallback(() => {
    updatePickerState((draft) => {
      draft.selectedValue = undefined;
    });
    onChange(undefined);
  }, [updatePickerState, onChange]);

  // Handle item selection
  const handleSelectItem = useCallback(
    (value: number | string) => {
      updatePickerState((draft) => {
        draft.selectedValue = value;
        draft.open = false;
      });
      onChange(value);
    },
    [updatePickerState, onChange]
  );

  // Close popup handler
  const handleClose = useCallback(() => {
    updatePickerState((draft) => {
      draft.open = false;
    });
  }, [updatePickerState]);

  // Use the outside click hook
  useOutsideClick({
    refs: [inputRef, popupRef],
    isOpen: pickerState.open,
    onClose: handleClose,
  });

  const popupPosition = usePopupPosition(pickerState.open, inputRef, popupRef);

  return (
    <InputContainer ref={inputRef}>
      <StyledInput
        readOnly
        placeholder={placeholder}
        value={inputValue}
        onClick={handleOpenClose}
        aria-haspopup="listbox"
        aria-expanded={pickerState.open}
      />

      {pickerState.selectedValue !== undefined && (
        <ClearButton onClick={handleClear} aria-label="Clear selection">
          <IoCloseCircleOutline size={20} />
        </ClearButton>
      )}

      <Popup
        ref={popupRef}
        $open={pickerState.open}
        $top={popupPosition.top}
        $left={popupPosition.left}
        $right={popupPosition.right}
        $position={popupPosition.position}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7.5px",
          }}
        >
          <DropdownList>
            {useMemo(
              () =>
                items.map((item) => {
                  const isSelected = pickerState.selectedValue === item.value;

                  return (
                    <DropdownItem
                      key={`item-${item.value}`}
                      onClick={() => handleSelectItem(item.value)}
                      $selected={isSelected}
                      role="option"
                      tabIndex={0}
                      aria-selected={isSelected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectItem(item.value);
                        }
                      }}
                    >
                      {item.text}
                    </DropdownItem>
                  );
                }),
              [items, pickerState.selectedValue, handleSelectItem]
            )}
          </DropdownList>
        </div>
      </Popup>
    </InputContainer>
  );
};
