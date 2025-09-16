import styled, { css } from "styled-components";
import { AnimationState } from "./types";

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
    color: #4c4c4c;
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
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
});

export const Popup = styled.div<{
  $animationState: AnimationState;
  $range?: boolean;
  $position?: { top: number; left: number };
}>(({ $animationState, $range, $position }) => {
  return css`
    position: absolute;
    z-index: 1000;
    opacity: ${$animationState === "entering"
      ? "0"
      : $animationState === "visible"
      ? "1"
      : $animationState === "exiting"
      ? "0"
      : "0"};
    transform: ${$animationState === "entering"
      ? "translateY(10px)"
      : $animationState === "visible"
      ? "translateY(0)"
      : $animationState === "exiting"
      ? "translateY(10px)"
      : "translateY(10px)"};
    transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
    display: ${$animationState === "closed" ? "none" : "block"};
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
    &:hover {
      & > svg {
        color: red;
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
  $active: boolean;
  $inRange: boolean;
  $disabled: boolean;
  $hovered: boolean;
}>(({ $active, $inRange, $disabled, $hovered }) => {
  return css`
    border: 1px solid transparent;
    background: ${$active ? "#4f5dff" : $inRange ? "#4f5dff" : $hovered ? "#e0e7ff" : "#ffffff"};
    color: ${$disabled ? "#9ca3af" : $active || $inRange ? "#ffffff" : "#4c4c4c"};
    border-radius: 6px;
    width: 100%;
    cursor: ${$disabled ? "not-allowed" : "pointer"};
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: ${$disabled ? 0.5 : 1};
    transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: scale(1);

    &:hover {
      background: ${$disabled ? "#ffffff" : $active ? "#4f5dff" : "#e0e7ff"};
      transform: ${$disabled ? "scale(1)" : "scale(1.05)"};
    }
  `;
});
