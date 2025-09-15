import { useRef, useEffect, useState, useCallback } from "react";
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
  // Combined state for open/close and animation
  const [state, setState] = useState<{
    open: boolean;
    animationState: "entering" | "visible" | "exiting" | "closed";
  }>({
    open: false,
    animationState: "closed",
  });

  // Set up references
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close with animation
  const closeWithAnimation = useCallback(() => {
    setState((prev) => ({ ...prev, animationState: "exiting" }));

    setTimeout(() => {
      setState({ open: false, animationState: "closed" });
    }, ANIMATION_DURATION);
  }, []);

  // Toggle open/close
  const toggleOpen = useCallback(() => {
    if (state.open) {
      closeWithAnimation();
    } else {
      setState({ open: true, animationState: "entering" });
      // Start entering animation
      setTimeout(() => {
        setState((prev) => ({ ...prev, animationState: "visible" }));
      }, 10);
    }
  }, [state.open, closeWithAnimation]);

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

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWithAnimation();
      }
    };

    // Add event listeners for both outside clicks and ESC key
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [state.open, closeWithAnimation]);

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
