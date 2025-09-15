import { useRef, useMemo, useEffect, useLayoutEffect, FC } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import moment from "moment";
import "moment/locale/de";
import { MonthObject, SharedMonthPickerProps, ANIMATION_DURATION, CLOSE_DELAY } from "./types";
import {
  InputContainer,
  StyledInput,
  ClearButton,
  Popup,
  Container,
  FlexRow,
  PickerColumn,
  YearCard,
  YearRow,
  ArrowButton,
  YearText,
  MonthsCard,
  MonthsGrid,
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

// Props definition for range month picker
export interface RangeMonthPickerProps extends SharedMonthPickerProps {
  onChange: (value: string[]) => void; // Array of all months in range, format: ["MM/YYYY", "MM/YYYY", ...]
  defaultValue?: [string, string]; // format: ["MM/YYYY", "MM/YYYY"]
}

// State definition for range month picker
interface RangeMonthPickerState {
  open: boolean;
  animationState: "entering" | "visible" | "exiting" | "closed";
  viewYears: [number, number];
  selection: [MonthObject | null, MonthObject | null];
  hoveredMonth: MonthObject | null;
  step: "from" | "to";
}

export const RangeMonthPicker: FC<RangeMonthPickerProps> = (props) => {
  const {
    locale = "de",
    placeholder = "Pick month range",
    disabledMonths,
    selectableMonths,
    minDate,
    maxDate,
    onChange,
    defaultValue,
  } = props;

  // Initialize state
  const currentYear = new Date().getFullYear();

  // Parse default values from strings if provided
  const defaultFrom = defaultValue?.[0] ? parseMonth(defaultValue[0]) : null;
  const defaultTo = defaultValue?.[1] ? parseMonth(defaultValue[1]) : null;

  // Get view years from selection or default to current year
  const firstViewYear = defaultFrom?.year || currentYear;
  const secondViewYear = defaultTo?.year || currentYear;

  const [state, updateState] = useImmer<RangeMonthPickerState>({
    open: false,
    animationState: "closed",
    viewYears: [firstViewYear, secondViewYear],
    selection: [defaultFrom, defaultTo],
    hoveredMonth: null,
    step: "from",
  });

  // React to changes in defaultValue prop
  useEffect(() => {
    if (defaultValue) {
      const parsedFrom = defaultValue[0] ? parseMonth(defaultValue[0]) : null;
      const parsedTo = defaultValue[1] ? parseMonth(defaultValue[1]) : null;

      updateState((draft) => {
        draft.selection = [parsedFrom, parsedTo];

        // If not open, also update the viewYears
        if (!draft.open) {
          // If both values are provided, use their years
          if (parsedFrom && parsedTo) {
            draft.viewYears = [parsedFrom.year, parsedTo.year];
          }
          // If only first value is provided
          else if (parsedFrom) {
            draft.viewYears = [parsedFrom.year, parsedFrom.year];
          }
          // If no values are provided, reset to current year
          else {
            draft.viewYears = [currentYear, currentYear];
          }
        }

        // Reset step to "from" if selection is incomplete
        if (!parsedTo) {
          draft.step = "from";
        }
      });
    } else {
      // If defaultValue is cleared, reset selection
      updateState((draft) => {
        draft.selection = [null, null];
        if (!draft.open) {
          draft.viewYears = [currentYear, currentYear];
        }
        draft.step = "from";
      });
    }
  }, [defaultValue, updateState, currentYear]);

  // Set up references
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Memoized values
  moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputLabel = useMemo(() => {
    const [from, to] = state.selection;
    const fmt = (v: MonthObject | null) => (v ? `${months[v.month]} ${v.year}` : "?");
    if (!from && !to) return placeholder;
    return `${fmt(from)} – ${fmt(to)}`;
  }, [state.selection, placeholder, months]);

  // Animation timing
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    if (state.animationState === "entering") {
      timeout = setTimeout(() => {
        updateState((draft) => {
          draft.animationState = "visible";
        });
      }, 10);
    } else if (state.animationState === "exiting") {
      timeout = setTimeout(() => {
        updateState((draft) => {
          draft.animationState = "closed";
          draft.open = false;
        });
      }, ANIMATION_DURATION);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [state.animationState, updateState]);

  // Position calculation
  const updatePosition = () => {
    const input = inputRef.current;
    const popup = popupRef.current;
    const container = inputContainerRef.current;

    if (!input || !popup || !container) return;

    const rect = container.getBoundingClientRect();
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    popup.style.width = "428px";
    popup.style.top = `${rect.bottom + 8 + scrollTop}px`;
    popup.style.left = `${rect.left + scrollLeft}px`;
  };

  useLayoutEffect(() => {
    if (!state.open) return;
    updatePosition();
  }, [state.open]);

  // Event handlers for positioning
  useEffect(() => {
    if (!state.open) return;

    const handleResize = _.debounce(updatePosition, 100);
    const handleScroll = _.debounce(updatePosition, 100);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      handleResize.cancel();
      handleScroll.cancel();
    };
  }, [state.open]);

  // Handle outside clicks
  useEffect(() => {
    if (!state.open) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        popupRef.current &&
        !popupRef.current.contains(target)
      ) {
        closeWithAnimation();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [state.open]);

  // Handle ESC key press
  useEffect(() => {
    if (!state.open) return;

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWithAnimation();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [state.open]);

  // Close with animation
  const closeWithAnimation = () => {
    updateState((draft) => {
      draft.animationState = "exiting";

      // Reset selection if it's partial (only "from" is selected)
      if (draft.selection[0] && !draft.selection[1]) {
        draft.selection = [null, null];
        draft.step = "from";
      }
    });

    // Optional delay before actually closing
    setTimeout(() => {
      updateState((draft) => {
        draft.open = false;
        draft.animationState = "closed";
      });
    }, CLOSE_DELAY);
  };

  // Toggle open/close
  const toggleOpen = () => {
    if (state.open) {
      closeWithAnimation();
    } else {
      updateState((draft) => {
        draft.open = true;
        draft.animationState = "entering";
      });
    }
  };

  // Clear selection
  const clearSelection = () => {
    const currentYear = new Date().getFullYear();

    updateState((draft) => {
      draft.selection = [null, null];
      draft.step = "from";
      // Reset view years to current year on clear
      draft.viewYears = [currentYear, currentYear];
    });
  };

  // Handle month selection
  const handleSelectMonth = (year: number, month: number) => {
    if (isMonthDisabled(year, month, disabledMonths, selectableMonths, minDate, maxDate)) {
      return;
    }

    const [from, to] = state.selection;

    if (state.step === "from" || (from && to)) {
      // Start new selection
      updateState((draft) => {
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

      updateState((draft) => {
        // Store in chronological order
        draft.selection = [first, second];
        draft.hoveredMonth = null;
      });

      if (first && second) {
        // Generate array of all months in the range
        const monthsInRange = generateMonthRange(first, second);
        onChange(monthsInRange);
        closeWithAnimation();
      }
    }
  };

  // Handle hover for visualization
  const handleMonthHover = (year: number, month: number) => {
    if (isMonthDisabled(year, month, disabledMonths, selectableMonths, minDate, maxDate)) {
      return;
    }

    updateState((draft) => {
      draft.hoveredMonth = { year, month };
    });
  };

  // Handle year changes
  const handleYearChange = (columnIndex: 0 | 1, newYear: number) => {
    updateState((draft) => {
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

  // Render a column with months
  const renderMonthColumn = (columnIndex: 0 | 1) => {
    const viewYear = state.viewYears[columnIndex];
    const [from, to] = state.selection;

    return (
      <PickerColumn>
        <YearCard>
          <YearRow>
            <ArrowButton
              onClick={() => {
                if (columnIndex === 0) {
                  handleYearChange(0, viewYear - 1);
                } else {
                  const minYear = state.viewYears[0] + 1;
                  handleYearChange(1, Math.max(viewYear - 1, minYear));
                }
              }}
              aria-label="Previous year"
            >
              ‹
            </ArrowButton>
            <YearText>{viewYear}</YearText>
            <ArrowButton
              onClick={() => handleYearChange(columnIndex, viewYear + 1)}
              aria-label="Next year"
            >
              ›
            </ArrowButton>
          </YearRow>
        </YearCard>
        <MonthsCard>
          <MonthsGrid>
            {months.map((label, month) => {
              const isDisabled = isMonthDisabled(
                viewYear,
                month,
                disabledMonths,
                selectableMonths,
                minDate,
                maxDate
              );

              const isActive =
                (from && from.year === viewYear && from.month === month) ||
                (to && to.year === viewYear && to.month === month);

              const isRangeMonth = isInRange(
                viewYear,
                month,
                from,
                to,
                state.hoveredMonth,
                state.step
              );

              const isHovered =
                state.hoveredMonth?.year === viewYear && state.hoveredMonth?.month === month;

              return (
                <MonthTile
                  key={`range-${columnIndex}-${label}-${viewYear}`}
                  onClick={() => handleSelectMonth(viewYear, month)}
                  onMouseEnter={() => handleMonthHover(viewYear, month)}
                  onMouseLeave={() => {
                    updateState((draft) => {
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
          </MonthsGrid>
        </MonthsCard>
      </PickerColumn>
    );
  };

  return (
    <InputContainer ref={inputContainerRef}>
      <StyledInput
        ref={inputRef}
        readOnly
        placeholder={placeholder}
        value={inputLabel === placeholder ? "" : inputLabel}
        onClick={toggleOpen}
        aria-haspopup="dialog"
        aria-expanded={state.open}
      />

      {(state.selection[0] || state.selection[1]) && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          ✕
        </ClearButton>
      )}

      {state.animationState !== "closed" && (
        <Popup ref={popupRef} $animationState={state.animationState}>
          <Container>
            <FlexRow>
              {renderMonthColumn(0)}
              {renderMonthColumn(1)}
            </FlexRow>
          </Container>
        </Popup>
      )}
    </InputContainer>
  );
};
