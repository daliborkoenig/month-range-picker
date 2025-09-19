import styled, { css } from "styled-components";
import { themeColors, manipulateColor } from "../../../theme/defaultColors";

const RADIUS = "7.5px";

const getShadow = (): string => {
  return `
    box-shadow: #e5e5e5 0 2px 5px -1px, #a6a6a6 0 1px 3px -1px;
  `;
};

export const InputContainer = styled.div(() => {
  return css`
    position: relative;
    display: flex;
  `;
});

export const StyledInput = styled.input(() => {
  return css`
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    border-radius: ${RADIUS};
    background: #fff;
    color: ${themeColors.text};
    text-align: left;
    cursor: pointer;
    width: 210px;
    ${getShadow()}
  `;
});

export const ClearButton = styled.button(() => {
  return css`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: ${themeColors.text};
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
});

export const Popup = styled.div<{
  $open: boolean;
  $top?: number;
  $left?: number;
  $right?: number;
  $position?: "top" | "bottom";
}>(({ $open, $top, $left, $right, $position = "bottom" }) => {
  // Apply different margin and transform based on position
  const margin = "7.5px";
  const transformOrigin = $position === "top" ? "bottom" : "top";

  return css`
    position: fixed;
    z-index: 1000;
    opacity: ${$open ? 1 : 0};
    transform: ${$open
      ? "translateY(0)"
      : $position === "top"
        ? "translateY(-10px)"
        : "translateY(10px)"};
    transform-origin: ${transformOrigin};
    visibility: ${$open ? "visible" : "hidden"};
    pointer-events: ${$open ? "auto" : "none"};
    transition:
      opacity 300ms,
      transform 300ms,
      visibility 0s ${$open ? "0s" : "300ms"};
    ${$position === "bottom" && $top !== undefined ? `top: calc(${$top}px + ${margin});` : ""}
    ${$position === "top" && $top !== undefined ? `top: calc(${$top}px - ${margin});` : ""}
    ${$top === undefined ? "top: auto;" : ""}
    ${$left !== undefined ? `left: ${$left}px;` : ""}
    ${$right !== undefined ? `right: ${$right}px;` : ""}
  `;
});

export const YearCard = styled.div(() => {
  return css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    border-radius: ${RADIUS};
    width: 210px;
    padding: 7.5px;
    ${getShadow()}
  `;
});

export const ArrowButton = styled.div(() => {
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    & > svg {
      color: ${themeColors.text};
    }

    &:hover {
      & > svg {
        color: ${manipulateColor(themeColors.text, 80)};
      }
    }
  `;
});

export const MonthsCard = styled.div(() => {
  return css`
    display: grid;
    height: 100%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 7.5px;
    background: #fff;
    border-radius: ${RADIUS};
    aspect-ratio: 1 / 1;
    padding: 8px;
    width: 210px;
    ${getShadow()}
  `;
});

export const MonthTile = styled.div<{
  $selected: boolean;
  $inRange?: boolean;
  $hovered?: boolean;
  $disabled?: boolean;
}>(({ $selected, $inRange, $hovered, $disabled }) => {
  // Calculate background color:
  // 1. Selected months get the secondary theme color
  // 2. Months in range or hovered get a lighter version of secondary
  // 3. Default is white background
  const background = $selected
    ? themeColors.secondary
    : $inRange || $hovered
      ? manipulateColor(themeColors.secondary, 80)
      : themeColors.text_inverted;

  // Calculate text color:
  // - If month has a colored background (selected/range/hovered) use white text
  // - Otherwise use standard text color
  const textColor =
    $selected || $inRange || $hovered ? themeColors.text_inverted : themeColors.text;
  return css`
    border: 1px solid transparent;
    background: ${background};
    color: ${textColor};
    font-size: 12px;
    border-radius: 6px;
    width: 100%;
    cursor: ${$disabled ? "not-allowed" : "pointer"};
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      background-color 0.4s ease,
      color 0.3s ease,
      transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: scale(1);
    opacity: ${$disabled ? 0.5 : 1};

    /* Apply hover effects only to non-disabled months */
    ${!$disabled &&
    `
      &:hover {
        background: ${manipulateColor(themeColors.secondary, 80)};
        color: ${themeColors.text_inverted};
      }
    `}
  `;
});

// ------------------------ DROPDOWN ------------------------ //

export const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 7.5px;
  width: 210px;
  max-height: 250px;
  overflow-y: auto;
  padding: 8px;
  box-shadow:
    #e5e5e5 0 2px 5px -1px,
    #a6a6a6 0 1px 3px -1px;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const DropdownItem = styled.div<{
  $selected: boolean;
}>(({ $selected }) => {
  const background = $selected ? themeColors.secondary : themeColors.text_inverted;

  const textColor = $selected ? themeColors.text_inverted : themeColors.text;

  return css`
    padding: 8px 12px;
    border-radius: 6px;
    margin-bottom: 4px;
    cursor: pointer;
    background: ${background};
    color: ${textColor};
    font-size: 12px;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: ${$selected ? themeColors.secondary : manipulateColor(themeColors.secondary, 80)};
      color: ${themeColors.text_inverted};
    }
  `;
});
