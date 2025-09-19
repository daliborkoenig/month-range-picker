import styled, { css } from "styled-components";
import { themeColors, manipulateColor } from "../../../theme/defaultColors";

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
