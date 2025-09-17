import { useMemo, useEffect, FC, useRef } from "react";
import { useImmer } from "use-immer";
import moment from "moment";
import "moment/locale/de";
import { MonthObject, NonEmptyArray, RangeMonthPickerProps } from "./types";
import {
  InputContainer,
  StyledInput,
  ClearButton,
  Popup,
  YearCard,
  ArrowButton,
  MonthsCard,
  MonthTile,
} from "./styled-picker";
import {
  getMonthsShort,
  isMonthDisabled,
  ymIndex,
  isInRange,
  parseMonth,
  generateMonthRange,
  extractViewYearsFromDefaultDates,
  formatMonth,
  isDateDisabled,
  isDateSelected,
  generateMonthRangeTest,
  isDateInRange,
  isDatePreselected,
} from "./picker-helper";
import { useMonthPicker } from "./use-month-picker";
import { HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";

const currentYear = moment().year();

export const RangeMonthPicker: FC<RangeMonthPickerProps> = (props) => {
  const {
    locale = "de",
    placeholder = "Pick month range",
    selectableMonths,
    minDate,
    maxDate,
    onChange,
    defaultDates,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  // Initialize state

  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    viewYears: [number, number];
    from?: string;
    to?: string;
    open: boolean;
    hoveredMonth?: string;
  }>({
    viewYears: extractViewYearsFromDefaultDates(defaultDates),
    from: defaultDates ? defaultDates[0] : undefined,
    to: defaultDates ? defaultDates[defaultDates.length - 1] : undefined,
    open: false,
    hoveredMonth: undefined,
  });

  // We no longer need to react to defaultValue changes
  // The component should maintain its own state once mounted
  // defaultValue should only influence the initial state

  // Extend the closeWithAnimation to reset partial selection
  const handleOpenClose = () => {
    updatePickerState((draft) => {
      // Reset selection if it's partial (only "from" is selected)
      if (draft.from && !draft.to) {
        draft.from = undefined;
        draft.to = undefined;
      }
      draft.open = !draft.open;
    });
  };

  // Memoized values
  // moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputValue = useMemo(() => {
    const { from, to } = pickerState;
    const fromMonth = parseMonth(from);
    const toMonth = parseMonth(to);
    if (!fromMonth || !toMonth) return "";
    return `${months[fromMonth.month]} ${fromMonth.year} – ${months[toMonth.month]} ${
      toMonth.year
    }`;
  }, [pickerState, months]);

  // Clear selection
  const clearSelection = () => {
    updatePickerState((draft) => {
      draft.from = undefined;
      draft.to = undefined;
      // Reset view years to previous and current year on clear
      draft.viewYears = [currentYear - 1, currentYear];
    });
  };

  // Handle month selection
  const handleSelectMonth = (date: string, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }

    const { from, to } = pickerState;

    if (!from || (from && to)) {
      // First selection or resetting after a complete range
      updatePickerState((draft) => {
        draft.from = date;
        draft.to = undefined;
      });
    } else {
      // Second selection - we already have "from" but not "to"
      const isBefore = moment(date, "MM/YYYY").isBefore(moment(from, "MM/YYYY"));
      const newFrom = isBefore ? date : from;
      const newTo = isBefore ? from : date;
      updatePickerState((draft) => {
        draft.from = newFrom;
        draft.to = newTo;
        draft.open = false;
      });

      // Use the calculated values directly to ensure we have the updated values
      onChange(generateMonthRangeTest(newFrom, newTo));
    }
  };

  // Handle hover for visualization
  const handleMonthHover = (month?: string) => {
    updatePickerState((draft) => {
      draft.hoveredMonth = month;
    });
  };

  // Handle year changes
  const handleYearChange = (columnIndex: 0 | 1, newYear: number) => {
    updatePickerState((draft) => {
      // If changing right column, ensure it's greater than or equal to left column + 1
      if (columnIndex === 1) {
        draft.viewYears[1] = Math.max(newYear, draft.viewYears[0] + 1);
      }
      // If changing left column, ensure it's less than or equal to right column - 1
      else if (columnIndex === 0) {
        draft.viewYears[0] = Math.min(newYear, draft.viewYears[1] - 1);
      }
    });
  };

  return (
    <InputContainer>
      <StyledInput
        ref={inputRef}
        readOnly
        placeholder={placeholder}
        value={inputValue}
        onClick={handleOpenClose}
        aria-haspopup="dialog"
        aria-expanded={pickerState.open}
      />

      {pickerState.from && pickerState.to && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          <IoCloseCircleOutline size={20} />
        </ClearButton>
      )}

      <Popup ref={popupRef} $open={pickerState.open}>
        <div style={{ display: "flex", gap: "7.5px", boxSizing: "border-box" }}>
          {pickerState.viewYears.map((viewYear, index) => {
            const from = pickerState.from;
            const to = pickerState.to;

            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7.5px",
                }}
                key={`picker-column-${index}`}
              >
                <YearCard>
                  <ArrowButton
                    onClick={() => {
                      if (index === 0) {
                        handleYearChange(0, viewYear - 1);
                      } else {
                        const minYear = pickerState.viewYears[0] + 1;
                        handleYearChange(1, Math.max(viewYear - 1, minYear));
                      }
                    }}
                  >
                    <HiMiniChevronLeft size={20} />
                  </ArrowButton>
                  <span>{viewYear}</span>
                  <ArrowButton onClick={() => handleYearChange(index as 0 | 1, viewYear + 1)}>
                    <HiMiniChevronRight size={20} />
                  </ArrowButton>
                </YearCard>
                <MonthsCard>
                  {months.map((label, mIndex) => {
                    const month = formatMonth(mIndex, viewYear);

                    const isDisabled = isDateDisabled({
                      date: month,
                      selectableMonths,
                      minDate,
                      maxDate,
                    });

                    const isSelected = isDateSelected({
                      date: month,
                      from,
                      to,
                    });

                    const isInRange = isDateInRange({
                      date: month,
                      from,
                      to,
                    });

                    const isPreselected = isDatePreselected({
                      date: month,
                      from,
                      to,
                      hoveredMonth: pickerState.hoveredMonth,
                    });

                    return (
                      <MonthTile
                        key={`range-${index}-${label}-${viewYear}`}
                        onClick={() => handleSelectMonth(month, isDisabled)}
                        onMouseEnter={() => handleMonthHover(month)}
                        onMouseLeave={() => {
                          handleMonthHover();
                        }}
                        $selected={!!isSelected}
                        $inRange={!!isInRange}
                        $disabled={!!isDisabled}
                        $hovered={!!isPreselected}
                      >
                        {label}
                      </MonthTile>
                    );
                  })}
                </MonthsCard>
              </div>
            );
          })}
        </div>
      </Popup>
    </InputContainer>
  );
};
