import { useMemo, useEffect, FC } from "react";
import { useImmer } from "use-immer";
import moment from "moment";
import "moment/locale/de";
import { MonthObject, RangeMonthPickerProps } from "./types";
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
} from "./picker-helper";
import { useMonthPicker } from "./use-month-picker";
import { HiMiniChevronLeft, HiMiniChevronRight } from "react-icons/hi2";

export const RangeMonthPicker: FC<RangeMonthPickerProps> = (props) => {
  const {
    locale = "de",
    placeholder = "Pick month range",
    selectableMonths,
    minDate,
    maxDate,
    onChange,
    defaultValue,
  } = props;

  // Get shared picker functionality
  const picker = useMonthPicker({ isRange: true });

  // Initialize state
  const currentYear = moment().year();

  // Parse default values from strings if provided
  // Get the first and last values from the array if it has at least 2 elements
  let defaultFrom = null;
  let defaultTo = null;

  if (defaultValue && defaultValue.length > 0) {
    defaultFrom = parseMonth(defaultValue[0]);

    if (defaultValue.length > 1) {
      // Get the last item in the array
      defaultTo = parseMonth(defaultValue[defaultValue.length - 1]);
    }
  }

  // Get view years from selection or use previous year for left, current year for right
  const firstViewYear = defaultFrom?.year || currentYear - 1;
  const secondViewYear = defaultTo?.year || currentYear;

  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    viewYears: [number, number];
    selection: [MonthObject | null, MonthObject | null];
    hoveredMonth: MonthObject | null;
    step: "from" | "to";
  }>({
    viewYears: [firstViewYear, secondViewYear],
    selection: [defaultFrom, defaultTo],
    hoveredMonth: null,
    step: "from",
  });

  // We no longer need to react to defaultValue changes
  // The component should maintain its own state once mounted
  // defaultValue should only influence the initial state

  // Extend the closeWithAnimation to reset partial selection
  const handleClose = () => {
    updatePickerState((draft) => {
      // Reset selection if it's partial (only "from" is selected)
      if (draft.selection[0] && !draft.selection[1]) {
        draft.selection = [null, null];
        draft.step = "from";
      }
    });
    picker.actions.closeWithAnimation();
  };

  // Memoized values
  // moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);
  console.log(moment().locale("de").localeData().monthsShort());

  // Calculate input label
  const inputLabel = useMemo(() => {
    const [from, to] = pickerState.selection;
    const fmt = (v: MonthObject | null) => (v ? `${months[v.month]} ${v.year}` : "?");
    if (!from && !to) return placeholder;
    return `${fmt(from)} – ${fmt(to)}`;
  }, [pickerState.selection, placeholder, months]);

  // Clear selection
  const clearSelection = () => {
    updatePickerState((draft) => {
      draft.selection = [null, null];
      draft.step = "from";
      // Reset view years to previous and current year on clear
      draft.viewYears = [currentYear - 1, currentYear];
    });
  };

  // Handle month selection
  const handleSelectMonth = (year: number, month: number, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }

    const [from, to] = pickerState.selection;

    if (pickerState.step === "from" || (from && to)) {
      // Start new selection
      updatePickerState((draft) => {
        draft.selection = [{ year, month }, null];
        draft.step = "to";
      });
    } else {
      // Complete selection
      const newTo = { year, month };

      // Determine chronological order
      const [first, second] =
        from && newTo
          ? ymIndex(from.year, from.month) <= ymIndex(newTo.year, newTo.month)
            ? [from, newTo]
            : [newTo, from]
          : [null, null];

      updatePickerState((draft) => {
        // Store in chronological order
        draft.selection = [first, second];
        draft.hoveredMonth = null;
      });

      if (first && second) {
        // Generate array of all months in the range
        const monthsInRange = generateMonthRange(first, second);
        onChange(monthsInRange);
        handleClose();
      }
    }
  };

  // Handle hover for visualization
  const handleMonthHover = (year: number, month: number, isDisabled: boolean) => {
    if (isDisabled) {
      return;
    }

    updatePickerState((draft) => {
      draft.hoveredMonth = { year, month };
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
    <InputContainer ref={picker.refs.containerRef}>
      <StyledInput
        ref={picker.refs.inputRef}
        readOnly
        placeholder={placeholder}
        value={inputLabel === placeholder ? "" : inputLabel}
        onClick={picker.actions.toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={picker.state.open}
      />

      {(pickerState.selection[0] || pickerState.selection[1]) && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          ✕
        </ClearButton>
      )}

      {picker.state.animationState !== "closed" && (
        <Popup
          ref={picker.refs.popupRef}
          $animationState={picker.state.animationState}
          $range={true}
        >
          <div style={{ display: "flex", gap: "7.5px", boxSizing: "border-box" }}>
            {Array.from({ length: 2 }).map((_, index) => {
              const viewYear = pickerState.viewYears[index];
              const [from, to] = pickerState.selection;

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
                    {months.map((label, month) => {
                      const isDisabled = isMonthDisabled({
                        year: viewYear,
                        month,
                        selectableMonths,
                        minDate,
                        maxDate,
                      });

                      const isActive =
                        (from && from.year === viewYear && from.month === month) ||
                        (to && to.year === viewYear && to.month === month);

                      const isRangeMonth = isInRange({
                        y: viewYear,
                        m: month,
                        from,
                        to,
                        hoveredMonth: pickerState.hoveredMonth,
                        step: pickerState.step,
                      });

                      const isHovered =
                        pickerState.hoveredMonth?.year === viewYear &&
                        pickerState.hoveredMonth?.month === month;

                      return (
                        <MonthTile
                          key={`range-${index}-${label}-${viewYear}`}
                          onClick={() => handleSelectMonth(viewYear, month, isDisabled)}
                          onMouseEnter={() => handleMonthHover(viewYear, month, isDisabled)}
                          onMouseLeave={() => {
                            updatePickerState((draft) => {
                              draft.hoveredMonth = null;
                            });
                          }}
                          $active={!!isActive}
                          $inRange={!!isRangeMonth}
                          $disabled={!!isDisabled}
                          $hovered={!!isHovered}
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
      )}
    </InputContainer>
  );
};
