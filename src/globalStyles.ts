import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap');
  html, body, #root {
    height: 100%;
  }
  body {
    margin: 0;
    font-family: 'Lato', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    background: #ffffff;
    color: #4c4c4c;
  }
`;

export const RADIUS = "7.5px";
export const ELEVATION = "#e5e5e5 0 2px 5px -1px, #a6a6a6 0 1px 3px -1px";
