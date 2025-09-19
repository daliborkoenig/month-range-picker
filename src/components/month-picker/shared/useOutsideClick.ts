import { RefObject, useEffect } from "react";

type UseOutsideClickProps = {
  refs: Array<RefObject<HTMLElement | null> | null>;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Hook to detect clicks outside specified elements and escape key presses
 * @param refs - Array of refs to elements that should not trigger the onClose
 * @param isOpen - Whether the dropdown/modal/etc is currently open
 * @param onClose - Function to call when outside click or escape key is detected
 */
export const useOutsideClick = ({ refs, isOpen, onClose }: UseOutsideClickProps): void => {
  useEffect(() => {
    // Only add listeners if the component is open
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent): void => {
      // Filter out null refs and check if any valid refs contain the click target
      const validRefs = refs.filter((ref) => ref?.current != null);

      // If no valid refs, do nothing
      if (validRefs.length === 0) return;

      // Check if the click was outside all of the valid refs
      const clickedOutside = validRefs.every(
        (ref) => ref?.current && !ref.current.contains(event.target as Node)
      );

      if (clickedOutside) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    // Clean up event listeners on unmount or when dependencies change
    return (): void => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, refs, onClose]);
};
