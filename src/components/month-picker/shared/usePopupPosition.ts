// In a new file: src/components/month-picker/shared/usePopupPosition.ts
import { useState, useEffect, RefObject } from "react";

interface PopupPosition {
  top?: number;
  left?: number;
  right?: number;
  position?: "top" | "bottom"; // Add position property
}

export const usePopupPosition = (
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  popupRef: RefObject<HTMLElement | null>
): PopupPosition => {
  const [position, setPosition] = useState<PopupPosition>({});

  useEffect(() => {
    const calculatePosition = () => {
      if (!isOpen || !triggerRef.current || !popupRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popupWidth = popupRef.current.offsetWidth || 210; // Default width if not available

      // Check for sticky parent offset
      let stickyOffsetLeft = 0;
      let parent = triggerRef.current.parentElement;
      let depth = 0;

      while (parent && depth < 8) {
        const style = window.getComputedStyle(parent);
        if (style.position === "sticky") {
          stickyOffsetLeft = parent.getBoundingClientRect().left;
          break;
        }
        parent = parent.parentElement;
        depth++;
      }

      // Calculate available space
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      const spaceOnRight = window.innerWidth - triggerRect.left;

      // Determine vertical position
      let top: number;
      let position: "top" | "bottom" = "bottom";

      // Check if there's enough space below, otherwise position above
      if (spaceBelow >= 250 || spaceBelow > spaceAbove) {
        // Position below
        top = triggerRect.bottom;
        position = "bottom";
      } else {
        // Position above
        top = triggerRect.top - (popupRef.current.offsetHeight || 250);
        position = "top";
      }

      // Store the position info to allow components to apply appropriate styling

      // Determine horizontal position
      let horizontalPosition: { left?: number; right?: number };
      if (spaceOnRight >= popupWidth) {
        // Enough space on right, align to left edge
        horizontalPosition = { left: triggerRect.left - stickyOffsetLeft };
      } else {
        // Not enough space on right, align to right edge
        horizontalPosition = { right: window.innerWidth - triggerRect.right };
      }

      setPosition({
        top,
        ...horizontalPosition,
        position, // Include vertical position info ('top' or 'bottom')
      });
    };

    const handleScroll = () => {
      if (isOpen) {
        calculatePosition();
      }
    };

    if (isOpen) {
      calculatePosition();
      window.addEventListener("resize", calculatePosition);
      document.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      window.removeEventListener("resize", calculatePosition);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, triggerRef, popupRef]);

  return position;
};
