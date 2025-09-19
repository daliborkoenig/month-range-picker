import { useMemo, FC, useRef, useCallback } from "react";
import { useOutsideClick } from "../shared/useOutsideClick";
import { useImmer } from "use-immer";
import moment from "moment";
import "moment/locale/de";
import { TDateFormat, TMonthPickerProps } from "../shared/types";
import {
  InputContainer,
  StyledInput,
  ClearButton,
  Popup,
  YearCard,
  ArrowButton,
  MonthsCard,
  MonthTile,
} from "../shared/styled-picker";
import { getMonthsShort, formatDate, isDateDisabled, parseMonth } from "../shared/utils";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";
import { usePopupPosition } from "../shared/usePopupPosition";

const currentYear = moment().year();

export const SingleMonthPicker: FC<TMonthPickerProps> = (props) => {
  const {
    locale = "de",
    disabledMonths,
    selectableMonths,
    minDate,
    maxDate,
    onChange,
    defaultDate,
  } = props;
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    viewYear: number;
    date?: string;
    open: boolean;
  }>({
    viewYear: currentYear,
    date: defaultDate,
    open: false,
  });

  const handleOpenClose = useCallback(() => {
    updatePickerState((draft) => {
      draft.open = !draft.open;
    });
  }, [updatePickerState]);

  // Memoized values
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputValue = useMemo(() => {
    const selectedDate = pickerState.date;
    if (!selectedDate) return "";

    const parsed = parseMonth(selectedDate);
    if (!parsed) return "";

    return `${months[parsed.month]} ${parsed.year}`;
  }, [pickerState.date, months]);

  // Handle selection clearing - memoized
  const handleClear = useCallback(() => {
    updatePickerState((draft) => {
      draft.date = undefined;
      // Reset view year to current year on clear
      draft.viewYear = currentYear;
    });
    onChange(undefined);
  }, [updatePickerState, onChange]);

  // Handle month selection - memoized
  const handleSelectDate = useCallback(
    (date: TDateFormat) => {
      updatePickerState((draft) => {
        draft.date = date;
        draft.open = false;
      });
      onChange(date);
    },
    [updatePickerState, onChange]
  );

  // Handle year change - memoized
  const handleYearChange = useCallback(
    (newYear: number) => {
      updatePickerState((draft) => {
        draft.viewYear = newYear;
      });
    },
    [updatePickerState]
  );

  // Close popup handler - memoized
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
    <InputContainer ref={inputRef} key={defaultDate}>
      <StyledInput
        readOnly
        placeholder={"Pick month"}
        value={inputValue}
        onClick={handleOpenClose}
        aria-haspopup="dialog"
        aria-expanded={pickerState.open}
      />

      {pickerState.date && (
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
          <YearCard>
            <ArrowButton
              onClick={() => handleYearChange(pickerState.viewYear - 1)}
              aria-label="Previous year"
            >
              <HiMiniChevronLeft size={20} />
            </ArrowButton>
            <span>{pickerState.viewYear}</span>
            <ArrowButton
              onClick={() => handleYearChange(pickerState.viewYear + 1)}
              aria-label="Next year"
            >
              <HiMiniChevronRight size={20} />
            </ArrowButton>
          </YearCard>
          <MonthsCard>
            {useMemo(
              () =>
                months.map((label, mIndex) => {
                  const date = formatDate(mIndex, pickerState.viewYear);

                  const isDisabled = isDateDisabled({
                    date,
                    disabledMonths,
                    selectableMonths,
                    minDate,
                    maxDate,
                  });

                  const isSelected = pickerState.date === date;

                  return (
                    <MonthTile
                      key={`${label}-${pickerState.viewYear}`}
                      onClick={() => !isDisabled && handleSelectDate(date)}
                      $selected={isSelected}
                      $disabled={isDisabled}
                      role="button"
                      tabIndex={isDisabled ? -1 : 0}
                      aria-disabled={isDisabled}
                      aria-label={`${label} ${pickerState.viewYear}`}
                      aria-pressed={isSelected}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                          e.preventDefault();
                          handleSelectDate(date);
                        }
                      }}
                    >
                      {label}
                    </MonthTile>
                  );
                }),
              [
                months,
                pickerState.viewYear,
                pickerState.date,
                disabledMonths,
                selectableMonths,
                minDate,
                maxDate,
                handleSelectDate,
              ]
            )}
          </MonthsCard>
        </div>
      </Popup>
    </InputContainer>
  );
};
