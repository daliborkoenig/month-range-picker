import styled, { css } from "styled-components";
import { ELEVATION, RADIUS } from "../globalStyles";
import { AnimationState } from "./types";

export const InputContainer = styled.div(() => {
  return css`
    position: relative;
    display: flex;
    width: 210px;
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
    box-shadow: ${ELEVATION};
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
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

export const Popup = styled.div<{ $animationState: AnimationState }>(({ $animationState }) => {
  return css`
    position: fixed;
    z-index: 1000;
    opacity: ${(props) =>
      $animationState === "entering"
        ? "0"
        : $animationState === "visible"
        ? "1"
        : $animationState === "exiting"
        ? "0"
        : "0"};
    transform: ${(props) =>
      $animationState === "entering"
        ? "translateY(10px)"
        : $animationState === "visible"
        ? "translateY(0)"
        : $animationState === "exiting"
        ? "translateY(10px)"
        : "translateY(10px)"};
    transition: all 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
    display: ${(props) => ($animationState === "closed" ? "none" : "block")};
    box-sizing: border-box;
  `;
});

export const Container = styled.div(() => {
  return css`
    padding: 0;
    background: transparent;
    width: 100%;
    box-sizing: border-box;
  `;
});

export const FlexRow = styled.div(() => {
  return css`
    display: flex;
    gap: 7.5px;
    width: 100%;
    box-sizing: border-box;
    justify-content: space-between;
  `;
});

export const PickerColumn = styled.div(() => {
  return css`
    display: flex;
    flex-direction: column;
    gap: 7.5px;
    width: 100%;
    box-sizing: border-box;
  `;
});

export const YearCard = styled.div(() => {
  return css`
    background: #ffffff;
    border-radius: ${RADIUS};
    box-shadow: ${ELEVATION};
    padding: 4px 8px;
    width: 100%;
    box-sizing: border-box;
  `;
});

export const YearRow = styled.div(() => {
  return css`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin: 0;
  `;
});

export const ArrowButton = styled.button(() => {
  return css`
    border: none;
    background: transparent;
    color: #111827;
    padding: 6px 10px;
    cursor: pointer;
  `;
});

export const YearText = styled.div(() => {
  return css`
    min-width: 80px;
    text-align: center;
    font-weight: 600;
    font-size: 12px;
  `;
});

export const MonthsCard = styled.div(() => {
  return css`
    background: #ffffff;
    border-radius: ${RADIUS};
    box-shadow: ${ELEVATION};
    aspect-ratio: 1 / 1;
    padding: 8px;
    width: 100%;
    box-sizing: border-box;
  `;
});

export const MonthsGrid = styled.div(() => {
  return css`
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 6px;
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
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    transform: scale(1);

    &:hover {
      background: ${$disabled ? "#ffffff" : $active ? "#4f5dff" : "#e0e7ff"};
      transform: ${$disabled ? "scale(1)" : "scale(1.05)"};
    }
  `;
});
