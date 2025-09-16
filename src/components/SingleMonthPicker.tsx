import { useMemo, useEffect, FC } from "react";
import { useImmer } from "use-immer";
import moment from "moment";
import "moment/locale/de";
import { MonthObject, SingleMonthPickerProps } from "./types";
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
import { getMonthsShort, formatMonth, isMonthDisabled, parseMonth } from "./picker-helper";
import { useMonthPicker } from "./use-month-picker";

export const SingleMonthPicker: FC<SingleMonthPickerProps> = (props) => {
  const {
    locale = "de",
    placeholder = "Pick month",
    disabledMonths,
    selectableMonths,
    minDate,
    maxDate,
    onChange,
    defaultValue,
  } = props;

  // Get shared picker functionality
  const picker = useMonthPicker({ isRange: false });

  // Initialize picker-specific state
  const [pickerState, updatePickerState] = useImmer<{
    viewYear: number;
    selection: MonthObject | null;
    hoveredMonth: MonthObject | null;
  }>({
    viewYear: new Date().getFullYear(),
    selection: defaultValue ? parseMonth(defaultValue) : null,
    hoveredMonth: null,
  });

  // We no longer need to react to defaultValue changes
  // The component should maintain its own state once mounted
  // defaultValue should only influence the initial state

  // Memoized values
  moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputLabel = useMemo(() => {
    const selected = pickerState.selection;
    if (!selected) return placeholder;
    return `${months[selected.month]} ${selected.year}`;
  }, [pickerState.selection, placeholder, months]);

  // Handle selection clearing
  const clearSelection = () => {
    updatePickerState((draft) => {
      draft.selection = null;
      // Reset view year to current year on clear
      draft.viewYear = new Date().getFullYear();
    });
    onChange("");
  };

  // Handle month selection
  const handleSelectMonth = (year: number, month: number) => {
    if (isMonthDisabled({ year, month, disabledMonths, selectableMonths, minDate, maxDate })) {
      return;
    }

    updatePickerState((draft) => {
      draft.selection = { year, month };
    });

    onChange(formatMonth(month, year));
    picker.actions.closeWithAnimation();
  };

  // Handle hover for visualization
  const handleMonthHover = (year: number, month: number) => {
    if (isMonthDisabled({ year, month, disabledMonths, selectableMonths, minDate, maxDate })) {
      return;
    }

    updatePickerState((draft) => {
      draft.hoveredMonth = { year, month };
    });
  };

  // Handle year change
  const handleYearChange = (newYear: number) => {
    updatePickerState((draft) => {
      draft.viewYear = newYear;
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

      {pickerState.selection && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          ✕
        </ClearButton>
      )}

      {picker.state.animationState !== "closed" && (
        <Popup
          ref={picker.refs.popupRef}
          $animationState={picker.state.animationState}
          $range={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "7.5px",
            }}
          >
            {" "}
            <YearCard>
              <ArrowButton
                onClick={() => handleYearChange(pickerState.viewYear - 1)}
                aria-label="Previous year"
              >
                ‹
              </ArrowButton>
              <span>{pickerState.viewYear}</span>
              <ArrowButton
                onClick={() => handleYearChange(pickerState.viewYear + 1)}
                aria-label="Next year"
              >
                ›
              </ArrowButton>
            </YearCard>
            <MonthsCard>
              {months.map((label, month) => {
                const isDisabled = isMonthDisabled({
                  year: pickerState.viewYear,
                  month,
                  disabledMonths,
                  selectableMonths,
                  minDate,
                  maxDate,
                });

                const isActive =
                  pickerState.selection?.year === pickerState.viewYear &&
                  pickerState.selection?.month === month;

                const isHovered =
                  pickerState.hoveredMonth?.year === pickerState.viewYear &&
                  pickerState.hoveredMonth?.month === month;

                return (
                  <MonthTile
                    key={`${label}-${pickerState.viewYear}`}
                    onClick={() => handleSelectMonth(pickerState.viewYear, month)}
                    onMouseEnter={() => handleMonthHover(pickerState.viewYear, month)}
                    onMouseLeave={() => {
                      updatePickerState((draft) => {
                        draft.hoveredMonth = null;
                      });
                    }}
                    $active={!!isActive}
                    $inRange={false}
                    $disabled={!!isDisabled}
                    $hovered={!!isHovered}
                  >
                    {label}
                  </MonthTile>
                );
              })}
            </MonthsCard>
          </div>
        </Popup>
      )}
    </InputContainer>
  );
};
