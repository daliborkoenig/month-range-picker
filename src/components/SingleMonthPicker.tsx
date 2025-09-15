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
  Container,
  PickerColumn,
  YearCard,
  YearRow,
  ArrowButton,
  YearText,
  MonthsCard,
  MonthsGrid,
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

  // React to changes in defaultValue prop
  useEffect(() => {
    if (defaultValue) {
      const parsedMonth = parseMonth(defaultValue);
      if (parsedMonth) {
        updatePickerState((draft) => {
          draft.selection = parsedMonth;
          // If not open, also update the viewYear
          if (!picker.state.open) {
            draft.viewYear = parsedMonth.year;
          }
        });
      }
    } else {
      // If defaultValue is cleared, reset selection
      updatePickerState((draft) => {
        draft.selection = null;
      });
    }
  }, [defaultValue, updatePickerState, picker.state.open]);

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
        <Popup ref={picker.refs.popupRef} $animationState={picker.state.animationState}>
          <Container>
            <PickerColumn>
              <YearCard>
                <YearRow>
                  <ArrowButton
                    onClick={() => handleYearChange(pickerState.viewYear - 1)}
                    aria-label="Previous year"
                  >
                    ‹
                  </ArrowButton>
                  <YearText>{pickerState.viewYear}</YearText>
                  <ArrowButton
                    onClick={() => handleYearChange(pickerState.viewYear + 1)}
                    aria-label="Next year"
                  >
                    ›
                  </ArrowButton>
                </YearRow>
              </YearCard>
              <MonthsCard>
                <MonthsGrid>
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
                </MonthsGrid>
              </MonthsCard>
            </PickerColumn>
          </Container>
        </Popup>
      )}
    </InputContainer>
  );
};
