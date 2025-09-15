import { useRef, useMemo, useEffect, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import moment from "moment";
import "moment/locale/de";
import { MonthObject, MonthRangePickerProps, MonthRangePickerState, AnimationState } from "./types";
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

// Utility functions
const getMonthsShort = (loc: "en" | "de") => {
  const m = moment().locale(loc);
  return m
    .localeData()
    .monthsShort()
    .map((s: string) => s.replace(".", ""));
};

const formatMonth = (month: number, year: number): string => {
  return `${String(month + 1).padStart(2, "0")}/${year}`;
};

const parseMonth = (monthStr: string): MonthObject | null => {
  const parts = monthStr.split("/");
  if (parts.length !== 2) return null;

  const month = parseInt(parts[0], 10) - 1;
  const year = parseInt(parts[1], 10);

  if (isNaN(month) || isNaN(year)) return null;
  return { year, month };
};

const isMonthDisabled = (
  year: number,
  month: number,
  disabledMonths?: string[],
  selectableMonths?: string[],
  minDate?: string,
  maxDate?: string
): boolean => {
  const monthStr = formatMonth(month, year);

  // Check if month is in disabledMonths
  if (disabledMonths?.includes(monthStr)) {
    return true;
  }

  // Check if selectableMonths is defined and month is not in it
  if (selectableMonths && !selectableMonths.includes(monthStr)) {
    return true;
  }

  // Check min and max dates
  if (minDate) {
    const min = parseMonth(minDate);
    if (min && (year < min.year || (year === min.year && month < min.month))) {
      return true;
    }
  }

  if (maxDate) {
    const max = parseMonth(maxDate);
    if (max && (year > max.year || (year === max.year && month > max.month))) {
      return true;
    }
  }

  return false;
};

const ymIndex = (y: number, m: number) => y * 12 + m;

const isInRange = (
  y: number,
  m: number,
  from: MonthObject | null,
  to: MonthObject | null,
  hoveredMonth: MonthObject | null,
  step: "from" | "to"
): boolean => {
  if (!from) return false;

  const current = ymIndex(y, m);

  // If we have a complete selection
  if (from && to) {
    const start = ymIndex(from.year, from.month);
    const end = ymIndex(to.year, to.month);
    const [min, max] = start <= end ? [start, end] : [end, start];
    return current >= min && current <= max;
  }

  // If we're in the "to" step and hovering
  if (step === "to" && hoveredMonth) {
    const start = ymIndex(from.year, from.month);
    const end = ymIndex(hoveredMonth.year, hoveredMonth.month);
    const [min, max] = start <= end ? [start, end] : [end, start];
    return current >= min && current <= max;
  }

  // Just the "from" selected
  return from.year === y && from.month === m;
};

// Main component
export function MonthRangePicker(props: MonthRangePickerProps) {
  const {
    locale = "de",
    placeholder = props.range ? "Pick month range" : "Pick month",
    animationDuration = 200,
    closeDelay = 300,
    disabledMonths,
    selectableMonths,
    minDate,
    maxDate,
  } = props;

  // Initialize state based on whether this is range mode or not
  const [state, updateState] = useImmer<MonthRangePickerState>({
    open: false,
    animationState: "closed",
    viewYears: props.range
      ? [
          (props.range && props.defaultValue?.[0]?.year) ||
            props.initialFromYear ||
            new Date().getFullYear(),
          (props.range && props.defaultValue?.[1]?.year) ||
            props.initialToYear ||
            new Date().getFullYear() + 1,
        ]
      : [props.defaultValue?.year || props.initialYear || new Date().getFullYear()],
    selection: props.range
      ? [props.defaultValue?.[0] || null, props.defaultValue?.[1] || null]
      : [props.defaultValue || null],
    hoveredMonth: null,
    step: "from",
  });

  // Set up references
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Memoized values
  moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputLabel = useMemo(() => {
    if (props.range) {
      const [from, to] = state.selection as [MonthObject | null, MonthObject | null];
      const fmt = (v: MonthObject | null) => (v ? `${months[v.month]} ${v.year}` : "?");
      if (!from && !to) return placeholder;
      return `${fmt(from)} – ${fmt(to)}`;
    } else {
      const selected = state.selection[0];
      if (!selected) return placeholder;
      return `${months[selected.month]} ${selected.year}`;
    }
  }, [state.selection, placeholder, months, props.range]);

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
      }, animationDuration);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [state.animationState, animationDuration, updateState]);

  // Position calculation
  const updatePosition = () => {
    const input = inputRef.current;
    const popup = popupRef.current;
    const container = inputContainerRef.current;

    if (!input || !popup || !container) return;

    const rect = container.getBoundingClientRect();
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    // Make the popup wider only in range mode
    const width = props.range ? "428px" : "210px";

    popup.style.width = width;
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

  // Close with animation
  const closeWithAnimation = () => {
    updateState((draft) => {
      draft.animationState = "exiting";
    });

    // Optional delay before actually closing
    setTimeout(() => {
      updateState((draft) => {
        draft.open = false;
        draft.animationState = "closed";
      });
    }, closeDelay);
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
    updateState((draft) => {
      draft.selection = props.range ? [null, null] : [null];
      draft.step = "from";
    });
    if (!props.range) {
      props.onChange("");
    }
  };

  // Handle month selection for single mode
  const handleSelectMonth = (year: number, month: number) => {
    if (isMonthDisabled(year, month, disabledMonths, selectableMonths, minDate, maxDate)) {
      return;
    }

    if (props.range) {
      const [from, to] = state.selection as [MonthObject | null, MonthObject | null];

      if (state.step === "from" || (from && to)) {
        // Start new selection
        updateState((draft) => {
          draft.selection = [{ year, month }, null];
          draft.step = "to";
        });
      } else {
        // Complete selection
        const newTo = { year, month };
        updateState((draft) => {
          draft.selection = [from, newTo];
          draft.hoveredMonth = null;
        });

        // Process and return the selected range
        const [first, second] =
          from && newTo
            ? ymIndex(from.year, from.month) <= ymIndex(newTo.year, newTo.month)
              ? [from, newTo]
              : [newTo, from]
            : [null, null];

        if (first && second) {
          const f = formatMonth(first.month, first.year);
          const s = formatMonth(second.month, second.year);
          props.onChange([f, s]);
          closeWithAnimation();
        }
      }
    } else {
      // Single mode selection
      updateState((draft) => {
        draft.selection = [{ year, month }];
      });
      props.onChange(formatMonth(month, year));
      closeWithAnimation();
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

  // Render a column with months
  const renderMonthColumn = (viewYear: number, columnType: "left" | "right") => {
    const isLeft = columnType === "left";
    const [from, to] = props.range
      ? (state.selection as [MonthObject | null, MonthObject | null])
      : [state.selection[0], null];

    return (
      <PickerColumn>
        <YearCard>
          <YearRow>
            <ArrowButton
              onClick={() => {
                updateState((draft) => {
                  const idx = isLeft ? 0 : 1;
                  if (isLeft) {
                    draft.viewYears[idx] = draft.viewYears[idx] - 1;
                  } else {
                    const minYear = props.range ? draft.viewYears[0] + 1 : 0;
                    draft.viewYears[idx] = Math.max(draft.viewYears[idx] - 1, minYear);
                  }
                });
              }}
              aria-label="Previous year"
            >
              ‹
            </ArrowButton>
            <YearText>{viewYear}</YearText>
            <ArrowButton
              onClick={() => {
                updateState((draft) => {
                  const idx = isLeft ? 0 : 1;
                  draft.viewYears[idx] = draft.viewYears[idx] + 1;
                });
              }}
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

              const isRangeMonth =
                props.range && isInRange(viewYear, month, from, to, state.hoveredMonth, state.step);

              const isHovered =
                state.hoveredMonth?.year === viewYear && state.hoveredMonth?.month === month;

              return (
                <MonthTile
                  key={`${columnType}-${label}-${viewYear}`}
                  onClick={() => handleSelectMonth(viewYear, month)}
                  onMouseEnter={() => handleMonthHover(viewYear, month)}
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

      {state.selection.some(Boolean) && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          ✕
        </ClearButton>
      )}

      {state.animationState !== "closed" && (
        <Popup ref={popupRef} $animationState={state.animationState}>
          <Container>
            {props.range ? (
              <FlexRow>
                {renderMonthColumn(state.viewYears[0], "left")}
                {renderMonthColumn(state.viewYears[1], "right")}
              </FlexRow>
            ) : (
              renderMonthColumn(state.viewYears[0], "left")
            )}
          </Container>
        </Popup>
      )}
    </InputContainer>
  );
}
