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

// Props definition for single month picker
export interface SingleMonthPickerProps extends SharedMonthPickerProps {
  onChange: (value: string) => void;
  defaultValue?: string; // format: "MM/YYYY"
}

// State definition for single month picker
interface SingleMonthPickerState {
  open: boolean;
  animationState: "entering" | "visible" | "exiting" | "closed";
  viewYear: number;
  selection: MonthObject | null;
  hoveredMonth: MonthObject | null;
}

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

  // Initialize state
  const [state, updateState] = useImmer<SingleMonthPickerState>({
    open: false,
    animationState: "closed",
    viewYear: new Date().getFullYear(),
    selection: defaultValue ? parseMonth(defaultValue) : null,
    hoveredMonth: null,
  });

  // React to changes in defaultValue prop
  useEffect(() => {
    if (defaultValue) {
      const parsedMonth = parseMonth(defaultValue);
      if (parsedMonth) {
        updateState((draft) => {
          draft.selection = parsedMonth;
          // If not open, also update the viewYear
          if (!draft.open) {
            draft.viewYear = parsedMonth.year;
          }
        });
      }
    } else {
      // If defaultValue is cleared, reset selection
      updateState((draft) => {
        draft.selection = null;
      });
    }
  }, [defaultValue, updateState]);

  // Set up references
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Memoized values
  moment.locale(locale);
  const months = useMemo(() => getMonthsShort(locale), [locale]);

  // Calculate input label
  const inputLabel = useMemo(() => {
    const selected = state.selection;
    if (!selected) return placeholder;
    return `${months[selected.month]} ${selected.year}`;
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

    popup.style.width = "210px";
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
    updateState((draft) => {
      draft.selection = null;
      // Reset view year to current year on clear
      draft.viewYear = new Date().getFullYear();
    });
    onChange("");
  };

  // Handle month selection
  const handleSelectMonth = (year: number, month: number) => {
    if (isMonthDisabled(year, month, disabledMonths, selectableMonths, minDate, maxDate)) {
      return;
    }

    updateState((draft) => {
      draft.selection = { year, month };
    });

    onChange(formatMonth(month, year));
    closeWithAnimation();
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

  // Handle year change
  const handleYearChange = (newYear: number) => {
    updateState((draft) => {
      draft.viewYear = newYear;
    });
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

      {state.selection && (
        <ClearButton onClick={clearSelection} aria-label="Clear selection">
          ✕
        </ClearButton>
      )}

      {state.animationState !== "closed" && (
        <Popup ref={popupRef} $animationState={state.animationState}>
          <Container>
            <PickerColumn>
              <YearCard>
                <YearRow>
                  <ArrowButton
                    onClick={() => handleYearChange(state.viewYear - 1)}
                    aria-label="Previous year"
                  >
                    ‹
                  </ArrowButton>
                  <YearText>{state.viewYear}</YearText>
                  <ArrowButton
                    onClick={() => handleYearChange(state.viewYear + 1)}
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
                      state.viewYear,
                      month,
                      disabledMonths,
                      selectableMonths,
                      minDate,
                      maxDate
                    );

                    const isActive =
                      state.selection?.year === state.viewYear && state.selection?.month === month;

                    const isHovered =
                      state.hoveredMonth?.year === state.viewYear &&
                      state.hoveredMonth?.month === month;

                    return (
                      <MonthTile
                        key={`${label}-${state.viewYear}`}
                        onClick={() => handleSelectMonth(state.viewYear, month)}
                        onMouseEnter={() => handleMonthHover(state.viewYear, month)}
                        onMouseLeave={() => {
                          updateState((draft) => {
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
