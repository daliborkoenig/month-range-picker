import styled, { createGlobalStyle, css } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
  html, body, #root {
    height: 100%;
  }
  body {
    font-family: 'Lato', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: #ffffff;
    color: #4c4c4c;
    line-height: 1.5;
  }
  * {    
    margin: 0;
    box-sizing: border-box;
  }
`;

export const RADIUS = "7.5px";
export const ELEVATION = "#e5e5e5 0 2px 5px -1px, #a6a6a6 0 1px 3px -1px";

export const AppWrapper = styled.div(() => {
  return css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    background-color: #ffffff;
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
  `;
});

export const PickerCard = styled.div(() => {
  return css`
    background: rgb(255, 255, 255);
    border-radius: ${RADIUS};
    box-shadow: ${ELEVATION};
    padding: 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `;
});

export const PickerCardContent = styled.div(() => {
  return css`
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;
});

export const PickerCardTitle = styled.span<{ size?: "small" | "medium" }>(({ size = "small" }) => {
  return css`
    font-size: ${size === "small" ? "10px" : "16px"};
    padding-left: 10px;
    word-break: break-word;
  `;
});

export const PickerCardSeparator = styled.hr(() => {
  return css`
    width: 30%;
    background-color: rgb(222, 222, 222);
    border: none;
    height: 1px;
  `;
});
