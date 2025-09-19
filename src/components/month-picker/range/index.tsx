import { useMemo, FC, useRef, useCallback } from "react";
import { useOutsideClick } from "../shared/useOutsideClick";
import { useImmer } from "use-immer";
import moment from "moment";
import "moment/locale/de";
import { TDateFormat, TMonthRangePickerProps } from "../shared/types";
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
import {
  getMonthsShort,
  parseMonth,
  extractViewYearsFromDefaultDates,
  formatDate,
  isDateDisabled,
  isDateSelected,
  generateMonthRange,
  isDateInRange,
  isDatePreselected,
} from "../shared/utils";
import { HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";
import { IoCloseCircleOutline } from "react-icons/io5";
import { usePopupPosition } from "../shared/usePopupPosition";

const currentYear = moment().year();

export const RangeMonthPicker: FC<TMonthRangePickerProps> = (props) => {
  const { locale = "de", selectableMonths, minDate, maxDate, onChange, defaultDates } = props;
  const inputRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    viewYears: [number, number];
    from?: TDateFormat;
    to?: TDateFormat;
    open: boolean;
    hoveredMonth?: TDateFormat;
  }>({
    viewYears: extractViewYearsFromDefaultDates(defaultDates),
    from: defaultDates ? defaultDates[0] : undefined,
    to: defaultDates ? defaultDates[defaultDates.length - 1] : undefined,
    open: false,
    hoveredMonth: undefined,
  });

  const handleOpenClose = useCallback(() => {
    updatePickerState((draft) => {
      // Reset selection if it's partial (only "from" is selected)
      if (draft.from && !draft.to) {
        draft.from = undefined;
        draft.to = undefined;
      }
      draft.open = !draft.open;
    });
  }, [updatePickerState]);

  // Memoized values
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

  // Clear selection - memoized
  const handleClear = useCallback(() => {
    updatePickerState((draft) => {
      draft.from = undefined;
      draft.to = undefined;
      // Reset view years to previous and current year on clear
      draft.viewYears = [currentYear - 1, currentYear];
    });
    onChange(undefined);
  }, [updatePickerState, onChange]);

  // Handle month selection - memoized
  const handleSelectDate = useCallback(
    (date: TDateFormat) => {
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
        onChange(generateMonthRange(newFrom, newTo));
      }
    },
    [pickerState, updatePickerState, onChange]
  );

  // Handle hover for visualization - memoized
  const handleDateHover = useCallback(
    (month?: TDateFormat) => {
      updatePickerState((draft) => {
        draft.hoveredMonth = month;
      });
    },
    [updatePickerState]
  );

  // Handle year changes - memoized
  const handleYearChange = useCallback(
    (columnIndex: 0 | 1, newYear: number) => {
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
    <InputContainer ref={inputRef} key={defaultDates?.join(",")}>
      <StyledInput
        readOnly
        placeholder={"Pick month range"}
        value={inputValue}
        onClick={handleOpenClose}
        aria-haspopup="dialog"
        aria-expanded={pickerState.open}
      />

      {pickerState.from && pickerState.to && (
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
        <div style={{ display: "flex", gap: "7.5px" }}>
          {pickerState.viewYears.map((viewYear, index) => {
            const { hoveredMonth, from, to } = pickerState;

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
                  {useMemo(
                    () =>
                      months.map((label, mIndex) => {
                        const date = formatDate(mIndex, viewYear);

                        const isDisabled = isDateDisabled({
                          date,
                          selectableMonths,
                          minDate,
                          maxDate,
                        });

                        const isSelected = isDateSelected({
                          date,
                          from,
                          to,
                        });

                        const isInRange = isDateInRange({
                          date,
                          from,
                          to,
                        });

                        const isPreselected = isDatePreselected({
                          date,
                          from,
                          to,
                          hoveredMonth,
                        });

                        return (
                          <MonthTile
                            key={`range-${index}-${label}-${viewYear}`}
                            onClick={() => !isDisabled && handleSelectDate(date)}
                            onMouseEnter={() => handleDateHover(date)}
                            onMouseLeave={() => {
                              handleDateHover(date);
                            }}
                            $selected={isSelected}
                            $inRange={isInRange}
                            $hovered={isPreselected}
                            $disabled={isDisabled}
                            role="button"
                            tabIndex={isDisabled ? -1 : 0}
                            aria-disabled={isDisabled}
                            aria-label={`${label} ${viewYear}`}
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
                    [viewYear, from, to, index, hoveredMonth]
                  )}
                </MonthsCard>
              </div>
            );
          })}
        </div>
      </Popup>
    </InputContainer>
  );
};
