import { useRef, useEffect, useLayoutEffect } from "react";
import { useImmer } from "use-immer";
import _ from "lodash";
import { ANIMATION_DURATION, CLOSE_DELAY } from "./types";

export interface UseMonthPickerOptions {
  isRange: boolean;
}

export interface UseMonthPickerResult {
  state: {
    open: boolean;
    animationState: "entering" | "visible" | "exiting" | "closed";
  };
  refs: {
    inputRef: React.RefObject<HTMLInputElement | null>;
    popupRef: React.RefObject<HTMLDivElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
  };
  actions: {
    toggleOpen: () => void;
    closeWithAnimation: () => void;
  };
}

export const useMonthPicker = ({ isRange }: UseMonthPickerOptions): UseMonthPickerResult => {
  // Create state for open/close and animation
  const [state, updateState] = useImmer({
    open: false,
    animationState: "closed" as "entering" | "visible" | "exiting" | "closed",
  });

  // Set up references
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const container = containerRef.current;

    if (!input || !popup || !container) return;

    const rect = container.getBoundingClientRect();
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    // Make the popup wider only in range mode
    const width = isRange ? "428px" : "210px";

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

  return {
    state,
    refs: {
      inputRef,
      popupRef,
      containerRef,
    },
    actions: {
      toggleOpen,
      closeWithAnimation,
    },
  };
};
