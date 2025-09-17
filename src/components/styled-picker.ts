import styled, { css } from "styled-components";
import { themeColors, manipulateColor } from "../theme/defaultColors";

const RADIUS = "7.5px";

const getShadow = () => {
  return `
    box-shadow: #e5e5e5 0 2px 5px -1px, #a6a6a6 0 1px 3px -1px;
  `;
};

export const InputContainer = styled.div(() => {
  return css`
    position: relative;
    display: flex;
    box-sizing: border-box;
  `;
});

export const StyledInput = styled.input(() => {
  return css`
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    border-radius: ${RADIUS};
    background: #ffffff;
    color: ${themeColors.text};
    text-align: left;
    cursor: pointer;
    width: 210px;
    box-sizing: border-box;
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
}>(({ $open }) => {
  return css`
    position: absolute;
    z-index: 1000;
    opacity: ${$open ? 1 : 0};
    transform: ${$open ? "translateY(0)" : "translateY(10px)"};
    visibility: ${$open ? "visible" : "hidden"};
    pointer-events: ${$open ? "auto" : "none"};
    transition: opacity 300ms, transform 300ms, visibility 0s ${$open ? "0s" : "300ms"};
    box-sizing: border-box;
    top: calc(100% + 7.5px);
    left: 0;
  `;
});

export const YearCard = styled.div(() => {
  return css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border-radius: ${RADIUS};
    width: 210px;
    padding: 7.5px;
    ${getShadow()}
  `;
});

export const ArrowButton = styled.div(({ theme }) => {
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
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 7.5px;
    background: #ffffff;
    border-radius: ${RADIUS};
    aspect-ratio: 1 / 1;
    padding: 8px;
    width: 210px;
    ${getShadow()}
  `;
});

export const MonthTile = styled.button<{
  $selected: boolean;
  $inRange?: boolean;
  $hovered?: boolean;
}>(({ $selected, $inRange, $hovered }) => {
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
    border-radius: 6px;
    width: 100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: scale(1);

    /* Use native :disabled pseudo-class for accessibility and simplicity */
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Apply hover effects only to non-disabled months */
    &:not(:disabled):hover {
      background: ${manipulateColor(themeColors.secondary, 80)};
      color: ${themeColors.text_inverted};
    }
  `;
});
